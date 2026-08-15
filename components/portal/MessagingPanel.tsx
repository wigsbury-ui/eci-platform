'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, Users } from 'lucide-react'

export type PortalMessage = {
  id: string
  sender_id: string
  sender_name?: string
  body: string
  created_at: string
}

interface MessagingPanelProps {
  messages: PortalMessage[]
  currentUserId?: string
}

function formatStamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MessagingPanel({
  messages: initialMessages,
  currentUserId = 'current-user',
}: MessagingPanelProps) {
  const [messages, setMessages] = useState<PortalMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return

    const optimistic: PortalMessage = {
      id: `local-${Date.now()}`,
      sender_id: currentUserId,
      sender_name: 'You',
      body,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])
    setDraft('')
  }

  const lastPreview =
    messages.length > 0 ? messages[messages.length - 1].body : 'No messages yet'

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Messages</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          Direct channel between your school and the ECI team
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col md:flex-row h-[560px] md:h-[620px]">
        {/* Thread list */}
        <aside className="md:w-72 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-jost font-semibold uppercase tracking-wide text-gray-400">
              Threads
            </p>
          </div>
          <button
            type="button"
            className="w-full text-left px-4 py-4 flex gap-3 items-start bg-eci-purple-light/40 border-l-4 border-eci-purple"
          >
            <div className="w-10 h-10 rounded-full bg-eci-purple flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-jost font-semibold text-sm text-eci-purple-dark">
                School ↔ ECI
              </p>
              <p className="text-xs text-gray-500 font-jost truncate mt-0.5">{lastPreview}</p>
            </div>
          </button>
        </aside>

        {/* Message feed */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <MessageCircle size={18} className="text-eci-gold" />
            <div>
              <p className="font-jost font-semibold text-sm text-gray-800">School ↔ ECI</p>
              <p className="text-xs text-gray-400 font-jost">Secure partnership channel</p>
            </div>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-[#f7f5fb]">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm font-jost">
                Start the conversation with ECI.
              </div>
            ) : (
              messages.map(msg => {
                const mine = msg.sender_id === currentUserId
                return (
                  <div
                    key={msg.id}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                        mine
                          ? 'bg-eci-purple text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                      }`}
                    >
                      {!mine && (
                        <p className="text-[10px] font-jost font-semibold text-eci-gold mb-0.5">
                          {msg.sender_name || 'ECI'}
                        </p>
                      )}
                      <p className="text-sm font-jost leading-relaxed whitespace-pre-wrap">
                        {msg.body}
                      </p>
                      <p
                        className={`text-[10px] font-jost mt-1 ${
                          mine ? 'text-white/60' : 'text-gray-400'
                        }`}
                      >
                        {formatStamp(msg.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 border-t border-gray-100 flex gap-2 bg-white"
          >
            <input
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-purple"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="w-11 h-11 rounded-full bg-eci-purple text-white flex items-center justify-center hover:bg-eci-purple-dark transition-colors disabled:opacity-40 flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
