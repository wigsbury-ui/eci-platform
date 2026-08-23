/**
 * Shared LLM client for articulation and chat.
 * Prefers Anthropic Claude Sonnet 4 for document drafting.
 *
 * Env:
 *   LLM_PROVIDER=anthropic | openai   (default: anthropic if ANTHROPIC_API_KEY / claude model)
 *   LLM_API_KEY or ANTHROPIC_API_KEY
 *   LLM_MODEL                         (default: claude-sonnet-4-20250514)
 *   LLM_BASE_URL                      (OpenAI-compatible only; Anthropic uses api.anthropic.com)
 */

export const DEFAULT_ARTICULATION_MODEL = 'claude-sonnet-4-20250514'

function apiKey() {
  return (
    process.env.LLM_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ''
  )
}

function configuredModel() {
  return process.env.LLM_MODEL?.trim() || DEFAULT_ARTICULATION_MODEL
}

function provider(): 'anthropic' | 'openai' {
  const explicit = process.env.LLM_PROVIDER?.trim().toLowerCase()
  if (explicit === 'openai') return 'openai'
  if (explicit === 'anthropic') return 'anthropic'

  const model = configuredModel().toLowerCase()
  if (model.includes('claude')) return 'anthropic'
  if (process.env.ANTHROPIC_API_KEY?.trim() && !process.env.LLM_BASE_URL?.trim()) return 'anthropic'

  const base = process.env.LLM_BASE_URL?.toLowerCase() || ''
  if (base.includes('anthropic')) return 'anthropic'

  if (process.env.LLM_BASE_URL?.trim()) return 'openai'
  if (apiKey()) return 'anthropic'
  return 'anthropic'
}

export function isLlmConfigured() {
  if (provider() === 'anthropic') return Boolean(apiKey())
  return Boolean(process.env.LLM_BASE_URL?.trim())
}

async function anthropicCompletion(opts: {
  system: string
  user: string
  temperature?: number
  maxTokens?: number
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const key = apiKey()
  if (!key) {
    return {
      ok: false,
      error: 'AI drafting is not configured. Set ANTHROPIC_API_KEY (or LLM_API_KEY) on the server.',
    }
  }

  const model = configuredModel()
  const base = (process.env.LLM_BASE_URL || 'https://api.anthropic.com').replace(/\/$/, '')

  try {
    const res = await fetch(`${base}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens ?? 8000,
        temperature: opts.temperature ?? 0.3,
        system: opts.system,
        messages: [{ role: 'user', content: opts.user }],
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('anthropic error', res.status, detail.slice(0, 500))
      return { ok: false, error: `AI service returned ${res.status}. Check Anthropic configuration.` }
    }

    const data = await res.json()
    const parts = Array.isArray(data?.content) ? data.content : []
    const text = parts
      .filter((p: { type?: string; text?: string }) => p?.type === 'text' && typeof p.text === 'string')
      .map((p: { text: string }) => p.text)
      .join('\n')
      .trim()

    if (!text) {
      return { ok: false, error: 'AI returned an empty response.' }
    }

    return { ok: true, text }
  } catch (err) {
    console.error('anthropic fetch', err)
    return { ok: false, error: 'Could not reach the AI service.' }
  }
}

async function openAiCompatibleCompletion(opts: {
  system: string
  user: string
  temperature?: number
  maxTokens?: number
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const base = process.env.LLM_BASE_URL?.replace(/\/$/, '')
  if (!base) {
    return {
      ok: false,
      error: 'AI drafting is not configured. Set LLM_BASE_URL on the server.',
    }
  }

  const key = apiKey()
  const model = configuredModel()

  try {
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        model,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 8000,
        messages: [
          { role: 'system', content: opts.system },
          { role: 'user', content: opts.user },
        ],
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('openai-compatible error', res.status, detail.slice(0, 500))
      return { ok: false, error: `AI service returned ${res.status}. Check LLM configuration.` }
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim()) {
      return { ok: false, error: 'AI returned an empty response.' }
    }

    return { ok: true, text: text.trim() }
  } catch (err) {
    console.error('openai-compatible fetch', err)
    return { ok: false, error: 'Could not reach the AI service.' }
  }
}

export async function chatCompletion(opts: {
  system: string
  user: string
  temperature?: number
  maxTokens?: number
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (provider() === 'anthropic') {
    return anthropicCompletion(opts)
  }
  return openAiCompatibleCompletion(opts)
}
