/** Strip characters Postgres text/json cannot store reliably. */
export function sanitizeDraftMarkdown(text: string | null | undefined): string | null {
  if (!text) return null
  const cleaned = text.replace(/\u0000/g, '').trim()
  return cleaned || null
}
