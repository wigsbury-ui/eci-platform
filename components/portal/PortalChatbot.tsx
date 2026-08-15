'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, BookOpen } from 'lucide-react'
import type { ChatCitation, ChatMessage } from '@/lib/types'
import type { KnowledgeAudience } from '@/lib/chat/knowledge'

interface PortalChatbotProps {
  audience: KnowledgeAudience
}

type UiMessage = ChatMessage & { error?: boolean }

const GREETING: Record<KnowledgeAudience, string> = {
  investor:
    'Ask about partnership models, expansion markets, or why operators choose Ellesmere.',
  school: 'Ask about document archives, calendar collaboration, or HPL and network support.',
  public: 'Ask about Ellesmere heritage, network schools, or how to get in touch.',
  team: 'Ask about school portals, internal collaboration, or investor briefing points.',
}

export default function PortalChatbot({ audience }: PortalChatbotProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      role: 'assistant',
      content: GREETING[audience],
    },
  ])
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [messages, open])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (!message || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, audience }),
      })

      if (!res.ok) throw new Error('Chat request failed')

      const data = (await res.json()) as {
        answer?: string
        citations?: ChatCitation[]
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'I could not find a grounded answer for that yet.',
          citations: data.citations,
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry — the assistant is temporarily unavailable. Please try again shortly, or email international@ellesmere.com.',
          error: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #4C2585 0%, #2D1654 100%)' }}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        {open ? (
          <X size={22} className="text-white" />
        ) : (
          <MessageCircle size={22} className="text-eci-gold" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(100vw-2rem,380px)] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div
            className="px-4 py-3.5 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #2D1654 0%, #4C2585 100%)' }}
          >
            <div className="w-9 h-9 rounded-full bg-eci-gold flex items-center justify-center flex-shrink-0">
              <span className="font-cormorant font-bold text-eci-purple-dark text-sm">E</span>
            </div>
            <div>
              <p className="font-cormorant text-lg text-white leading-none">ECI Assistant</p>
              <p className="text-[10px] font-jost text-white/60 capitalize mt-0.5">
                {audience} guidance
              </p>
            </div>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm font-jost leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-eci-purple text-white rounded-br-md'
                      : msg.error
                        ? 'bg-red-50 text-red-700 border border-red-100 rounded-bl-md'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                      <p className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-1">
                        <BookOpen size={10} /> Sources
                      </p>
                      {msg.citations.map((c, ci) => (
                        <p key={`${c.title}-${ci}`} className="text-[11px] text-eci-purple font-jost">
                          {c.title}
                          <span className="text-gray-400"> · {c.source}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-xs text-gray-400 font-jost px-1">Thinking…</p>
            )}
          </div>

          <form onSubmit={send} className="p-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-purple"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-eci-purple text-white flex items-center justify-center hover:bg-eci-purple-dark disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
