const MAX_CHARS = 120_000

function extensionOf(fileName: string) {
  const i = fileName.lastIndexOf('.')
  return i >= 0 ? fileName.slice(i).toLowerCase() : ''
}

function clip(text: string) {
  const cleaned = text
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (cleaned.length <= MAX_CHARS) return cleaned
  return `${cleaned.slice(0, MAX_CHARS)}\n\n[… text truncated for processing …]`
}

async function loadMammoth() {
  const mod = await import('mammoth')
  return mod.default ?? mod
}

async function loadPdfParse() {
  return import('pdf-parse')
}

async function extractPdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await loadPdfParse()
  const parser = new PDFParse({ data: buffer })
  try {
    const result = await parser.getText()
    return result.text || ''
  } finally {
    await parser.destroy().catch(() => undefined)
  }
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = await loadMammoth()
  const result = await mammoth.extractRawText({ buffer })
  return result.value || ''
}

/**
 * Extract plain text from common office formats.
 * Heavy parsers (mammoth, pdf-parse) are lazy-loaded so routes that only
 * need docx do not pull pdfjs on serverless hosts.
 */
export async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType?: string | null
): Promise<{ text: string; method: string }> {
  const ext = extensionOf(fileName)
  const mime = (mimeType || '').toLowerCase()

  try {
    if (ext === '.pdf' || mime.includes('pdf')) {
      return { text: clip(await extractPdf(buffer)), method: 'pdf' }
    }

    if (ext === '.docx' || mime.includes('wordprocessingml')) {
      return { text: clip(await extractDocx(buffer)), method: 'docx' }
    }

    if (
      ['.txt', '.md', '.csv', '.rtf'].includes(ext) ||
      mime.startsWith('text/') ||
      mime === 'application/csv'
    ) {
      return { text: clip(buffer.toString('utf8')), method: 'text' }
    }

    if (ext === '.doc') {
      const asText = buffer
        .toString('utf8')
        .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, ' ')
      return { text: clip(asText), method: 'doc-fallback' }
    }

    return { text: '', method: 'unsupported' }
  } catch (err) {
    console.error('extractTextFromBuffer', fileName, err)
    return { text: '', method: 'error' }
  }
}
