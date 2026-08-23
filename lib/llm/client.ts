/** Shared OpenAI-compatible chat completion (LLM_BASE_URL / LLM_API_KEY / LLM_MODEL). */

export function isLlmConfigured() {
  return Boolean(process.env.LLM_BASE_URL?.trim())
}

export async function chatCompletion(opts: {
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

  const apiKey = process.env.LLM_API_KEY || ''
  const model = process.env.LLM_MODEL || 'gpt-4o-mini'

  try {
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 4000,
        messages: [
          { role: 'system', content: opts.system },
          { role: 'user', content: opts.user },
        ],
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('llm error', res.status, detail.slice(0, 500))
      return { ok: false, error: `AI service returned ${res.status}. Check LLM configuration.` }
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim()) {
      return { ok: false, error: 'AI returned an empty response.' }
    }

    return { ok: true, text: text.trim() }
  } catch (err) {
    console.error('llm fetch', err)
    return { ok: false, error: 'Could not reach the AI service.' }
  }
}
