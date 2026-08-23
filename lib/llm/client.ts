/**
 * Shared LLM client for articulation and chat.
 * Prefers Anthropic Claude Sonnet for document drafting.
 *
 * Env:
 *   LLM_PROVIDER=anthropic | openai   (default: anthropic if ANTHROPIC_API_KEY / claude model)
 *   LLM_API_KEY or ANTHROPIC_API_KEY
 *   LLM_MODEL                         (default: claude-sonnet-4-6)
 *   LLM_BASE_URL                      (OpenAI-compatible only; Anthropic uses api.anthropic.com)
 *
 * Note: claude-sonnet-4-20250514 was retired (June 2026). Use claude-sonnet-4-6 or claude-sonnet-5.
 */

export const DEFAULT_ARTICULATION_MODEL = 'claude-sonnet-4-6'

/** Retired / common misconfigs we can remap once. */
const MODEL_FALLBACKS: Record<string, string> = {
  'claude-sonnet-4-20250514': 'claude-sonnet-4-6',
  'claude-sonnet-4': 'claude-sonnet-4-6',
  'claude-4-sonnet': 'claude-sonnet-4-6',
  'claude-4-sonnet-20250514': 'claude-sonnet-4-6',
}

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

async function anthropicMessagesOnce(opts: {
  key: string
  base: string
  model: string
  system: string
  user: string
  temperature: number
  maxTokens: number
}): Promise<
  | { ok: true; text: string }
  | { ok: false; status: number; error: string; detail: string }
> {
  const res = await fetch(`${opts.base}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': opts.key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
      system: opts.system,
      messages: [{ role: 'user', content: opts.user }],
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('anthropic error', res.status, opts.model, detail.slice(0, 800))
    let message = `AI service returned ${res.status}. Check Anthropic configuration.`
    try {
      const parsed = JSON.parse(detail)
      const apiMsg = parsed?.error?.message || parsed?.message
      if (typeof apiMsg === 'string' && apiMsg.trim()) {
        message = apiMsg.trim()
      }
    } catch {
      /* keep default */
    }
    if (res.status === 401 || res.status === 403) {
      message = 'Anthropic rejected the API key. Check ANTHROPIC_API_KEY in Vercel.'
    }
    if (res.status === 404 || res.status === 410) {
      message = `Model not available (${opts.model}). Set LLM_MODEL to claude-sonnet-4-6 (or claude-sonnet-5) in Vercel, then redeploy.`
    }
    return { ok: false, status: res.status, error: message, detail }
  }

  const data = await res.json()
  const parts = Array.isArray(data?.content) ? data.content : []
  const text = parts
    .filter((p: { type?: string; text?: string }) => p?.type === 'text' && typeof p.text === 'string')
    .map((p: { text: string }) => p.text)
    .join('\n')
    .trim()

  if (!text) {
    return { ok: false, status: 200, error: 'AI returned an empty response.', detail: '' }
  }

  return { ok: true, text }
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

  const requested = configuredModel()
  const base = (process.env.LLM_BASE_URL || 'https://api.anthropic.com').replace(/\/$/, '')
  const temperature = opts.temperature ?? 0.3
  const maxTokens = opts.maxTokens ?? 8000

  // Remap known-retired ids before the first call when env still has the old default.
  const primary = MODEL_FALLBACKS[requested] || requested

  try {
    const first = await anthropicMessagesOnce({
      key,
      base,
      model: primary,
      system: opts.system,
      user: opts.user,
      temperature,
      maxTokens,
    })
    if (first.ok) return first

    const fallback = MODEL_FALLBACKS[primary] || DEFAULT_ARTICULATION_MODEL
    const shouldRetry =
      (first.status === 404 || first.status === 410) &&
      fallback !== primary

    if (shouldRetry) {
      console.warn('[llm] retrying with fallback model', { from: primary, to: fallback })
      const second = await anthropicMessagesOnce({
        key,
        base,
        model: fallback,
        system: opts.system,
        user: opts.user,
        temperature,
        maxTokens,
      })
      if (second.ok) return second
      return { ok: false, error: second.error }
    }

    return { ok: false, error: first.error }
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
