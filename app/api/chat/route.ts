import { NextResponse } from 'next/server'
import {
  answerFromKnowledge,
  KnowledgeAudience,
} from '@/lib/chat/knowledge'

const AUDIENCES: KnowledgeAudience[] = ['investor', 'school', 'public', 'team']

function isAudience(value: unknown): value is KnowledgeAudience {
  return typeof value === 'string' && AUDIENCES.includes(value as KnowledgeAudience)
}

async function tryLlmAnswer(
  message: string,
  context: string,
  citations: { title: string; source: string }[]
): Promise<{ answer: string; citations: { title: string; source: string }[] } | null> {
  const base = process.env.LLM_BASE_URL?.replace(/\/$/, '')
  if (!base) return null

  const apiKey = process.env.LLM_API_KEY
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
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `You are the Ellesmere College International (ECI) assistant. Answer only from the provided context. If the context is insufficient, say so briefly. Keep answers concise and professional.\n\nContext:\n${context}`,
          },
          { role: 'user', content: message },
        ],
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const answer = data?.choices?.[0]?.message?.content
    if (typeof answer !== 'string' || !answer.trim()) return null

    return { answer: answer.trim(), citations }
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = typeof body?.message === 'string' ? body.message.trim() : ''
    const audience = isAudience(body?.audience) ? body.audience : 'public'

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    const grounded = answerFromKnowledge(message, audience)
    const context = grounded.chunks.map(c => `## ${c.title}\n${c.text}`).join('\n\n')

    const llm = await tryLlmAnswer(message, context, grounded.citations)
    if (llm) {
      return NextResponse.json(llm)
    }

    return NextResponse.json({
      answer: grounded.answer,
      citations: grounded.citations,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to process chat request' },
      { status: 500 }
    )
  }
}
