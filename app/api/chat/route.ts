import { NextResponse } from 'next/server'
import {
  answerFromKnowledge,
  KnowledgeAudience,
} from '@/lib/chat/knowledge'
import { chatCompletion, isLlmConfigured } from '@/lib/llm/client'

const AUDIENCES: KnowledgeAudience[] = ['investor', 'school', 'public', 'team', 'agent']

function isAudience(value: unknown): value is KnowledgeAudience {
  return typeof value === 'string' && AUDIENCES.includes(value as KnowledgeAudience)
}

async function tryLlmAnswer(
  message: string,
  context: string,
  citations: { title: string; source: string }[]
): Promise<{ answer: string; citations: { title: string; source: string }[] } | null> {
  if (!isLlmConfigured()) return null

  const result = await chatCompletion({
    system: `You are the Ellesmere College International (ECI) assistant. Answer only from the provided context. If the context is insufficient, say so briefly. Keep answers concise and professional.\n\nContext:\n${context}`,
    user: message,
    temperature: 0.2,
    maxTokens: 1200,
  })

  if (!result.ok) return null
  return { answer: result.text, citations }
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
