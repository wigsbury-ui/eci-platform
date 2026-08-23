import { createAdminClient } from '@/lib/supabase/admin'
import { INTAKE_BUCKET } from '@/lib/intake/config'
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
    const { extractTextFromBuffer } = await import('@/lib/intake/extract')
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

Your job is to articulate source material into polished partner documentation that reads like intentional ECI editorial copy—not an expanded outline or template.

Writing standards:
- British English: professional, warm, confident. Write for school leaders, governors, and investors.
- Preserve every factual claim from the sources. Do not invent fees, IRRs, legal commitments, inspection outcomes, or commercial terms.
- Where the source is thin, note the gap briefly—never fabricate detail.
- Vary structure and rhythm. Do NOT use the same formula in every section (for example, avoid repeating "What this means for partners" under every heading).
- Prefer flowing prose paragraphs for narrative points. Use bullet lists only where scanning genuinely helps—not as default padding.
- Merge overlapping themes from the source rather than creating one thin subsection per bullet from the original.
- Headings should be specific and readable (name the topic; avoid generic filler headings unless the source uses them).
- Open with a short, substantive introduction (what this document is, who it is for, why it matters). No throat-clearing.
- Use ## for main sections and ### only when a section truly needs sub-parts.
- End with a brief "## Source notes" section listing source filenames only.
- Do not mention AI, prompts, or internal tooling.`

  const user = `Draft title: ${opts.title}
${pillarLine}
Brief from ECI staff:
${brief}

Source material:
${sourceBlock}

Write the full articulated document in markdown. Aim for a document a partner would be comfortable sharing with their board—not a raw text dump.`

  const result = await chatCompletion({
    system,
    user,
    temperature: 0.28,
    maxTokens: 8000,
  })

  if (!result.ok) return result
  return { ok: true, body: result.text }
}
