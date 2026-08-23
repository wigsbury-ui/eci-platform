import { createAdminClient } from '@/lib/supabase/admin'
import { INTAKE_BUCKET } from '@/lib/intake/config'
import { extractTextFromBuffer } from '@/lib/intake/extract'
import { chatCompletion } from '@/lib/llm/client'

const SOURCE_CHAR_BUDGET = 60_000

export async function ensureFileExtracted(fileId: string): Promise<{
  ok: boolean
  text: string
  fileName: string
  error?: string
}> {
  const admin = createAdminClient()
  if (!admin) return { ok: false, text: '', fileName: '', error: 'Storage not configured' }

  const { data: file, error } = await admin
    .from('document_intake_files')
    .select('id, file_name, storage_path, mime_type, extracted_text')
    .eq('id', fileId)
    .single()

  if (error || !file) {
    return { ok: false, text: '', fileName: '', error: 'File not found' }
  }

  if (file.extracted_text && String(file.extracted_text).trim()) {
    return { ok: true, text: file.extracted_text, fileName: file.file_name }
  }

  const { data: blob, error: downloadError } = await admin.storage
    .from(INTAKE_BUCKET)
    .download(file.storage_path)

  if (downloadError || !blob) {
    return { ok: false, text: '', fileName: file.file_name, error: 'Could not download source file' }
  }

  try {
    const buffer = Buffer.from(await blob.arrayBuffer())
    const { text, method } = await extractTextFromBuffer(buffer, file.file_name, file.mime_type)

    if (!text.trim()) {
      return {
        ok: false,
        text: '',
        fileName: file.file_name,
        error:
          method === 'unsupported'
            ? `Cannot extract text from ${file.file_name}. Prefer PDF or Word (.docx).`
            : `No readable text found in ${file.file_name}.`,
      }
    }

    await admin.from('document_intake_files').update({ extracted_text: text }).eq('id', file.id)

    return { ok: true, text, fileName: file.file_name }
  } catch (err) {
    console.error('ensureFileExtracted', file.file_name, err)
    return {
      ok: false,
      text: '',
      fileName: file.file_name,
      error: `Could not read ${file.file_name}. Try re-uploading as PDF or Word (.docx).`,
    }
  }
}

export async function gatherSourceText(fileIds: string[]): Promise<{
  ok: boolean
  sources: { fileName: string; text: string }[]
  error?: string
}> {
  const sources: { fileName: string; text: string }[] = []
  const errors: string[] = []

  for (const id of fileIds) {
    const result = await ensureFileExtracted(id)
    if (result.ok && result.text.trim()) {
      sources.push({ fileName: result.fileName, text: result.text })
    } else if (result.error) {
      errors.push(result.error)
    }
  }

  if (!sources.length) {
    return {
      ok: false,
      sources: [],
      error: errors[0] || 'No extractable text in the selected files.',
    }
  }

  return { ok: true, sources }
}

function packSources(sources: { fileName: string; text: string }[]) {
  let remaining = SOURCE_CHAR_BUDGET
  const parts: string[] = []
  for (const source of sources) {
    if (remaining <= 0) break
    const slice = source.text.slice(0, remaining)
    parts.push(`### Source: ${source.fileName}\n${slice}`)
    remaining -= slice.length
  }
  return parts.join('\n\n')
}

export async function generateArticulatedDraft(opts: {
  title: string
  pillar: string | null
  promptNotes: string
  sources: { fileName: string; text: string }[]
}): Promise<{ ok: true; body: string } | { ok: false; error: string }> {
  const sourceBlock = packSources(opts.sources)
  const pillarLine = opts.pillar ? `Document pillar: ${opts.pillar}.` : ''
  const brief =
    opts.promptNotes.trim() ||
    'Produce a clear partner-facing document that captures and improves the source material.'

  const system = `You are a documentation editor for Ellesmere College International (ECI), writing for licensed partner schools and investors.

Your job is to articulate source material into a polished, logical partner document.

Rules:
- Write in clear British English, professional and warm.
- Structure with markdown headings (## and ###). Start with a short purpose statement.
- Preserve factual claims from the sources; do not invent commercial terms, fees, IRRs, legal commitments, or inspection outcomes.
- Where sources conflict or are thin, note the gap briefly rather than fabricating detail.
- Improve clarity, hierarchy, and partner usefulness (what a partner school needs to know and do).
- Include a final "## Source notes" section listing which source files informed the draft.
- Do not mention AI, prompts, or internal tooling.`

  const user = `Draft title: ${opts.title}
${pillarLine}
Brief from ECI staff:
${brief}

Source material:
${sourceBlock}

Write the full articulated document in markdown.`

  const result = await chatCompletion({
    system,
    user,
    temperature: 0.35,
    maxTokens: 8000,
  })

  if (!result.ok) return result
  return { ok: true, body: result.text }
}
