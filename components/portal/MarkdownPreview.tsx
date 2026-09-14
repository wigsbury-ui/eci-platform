'use client'

type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'hr' }
  | { type: 'table'; headers: string[]; rows: string[][] }

function inlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'ul', items: [...listItems] })
      listItems = []
    }
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
      i += 1
      continue
    }

    if (/^---+$/.test(trimmed)) {
      flushList()
      blocks.push({ type: 'hr' })
      i += 1
      continue
    }

    if (trimmed.startsWith('## ')) {
      flushList()
      blocks.push({ type: 'h2', text: trimmed.slice(3).trim() })
      i += 1
      continue
    }

    if (trimmed.startsWith('### ')) {
      flushList()
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() })
      i += 1
      continue
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList()
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim())
        i += 1
      }
      const rows = tableLines
        .filter(row => !/^[\|\s:-]+$/.test(row.replace(/\|/g, '')))
        .map(row =>
          row
            .slice(1, row.endsWith('|') ? -1 : undefined)
            .split('|')
            .map(cell => cell.trim())
        )
      if (rows.length) {
        const [headers, ...body] = rows
        blocks.push({ type: 'table', headers, rows: body })
      }
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ''))
      i += 1
      continue
    }

    flushList()
    const paraLines = [trimmed]
    i += 1
    while (i < lines.length && lines[i].trim() && !/^#{1,3}\s/.test(lines[i].trim()) && !/^[-*]\s+/.test(lines[i].trim()) && !lines[i].trim().startsWith('|')) {
      paraLines.push(lines[i].trim())
      i += 1
    }
    blocks.push({ type: 'p', text: paraLines.join(' ') })
  }

  flushList()
  return blocks
}

export default function MarkdownPreview({ markdown, className = '' }: { markdown: string; className?: string }) {
  const blocks = parseBlocks(markdown)

  if (!markdown.trim()) {
    return (
      <p className="text-sm text-gray-500 font-jost py-6 text-center">
        Draft body will appear here after generation.
      </p>
    )
  }

  return (
    <div
      className={`font-jost text-sm leading-relaxed text-gray-700 space-y-4 ${className}`}
    >
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={index}
                className="font-cormorant text-xl text-eci-purple-dark mt-6 first:mt-0 border-b border-gray-100 pb-2"
              >
                {inlineMarkdown(block.text)}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={index} className="font-cormorant text-lg text-gray-900 mt-4">
                {inlineMarkdown(block.text)}
              </h3>
            )
          case 'p':
            return (
              <p key={index} className="text-[15px] leading-7 text-gray-700">
                {inlineMarkdown(block.text)}
              </p>
            )
          case 'ul':
            return (
              <ul key={index} className="list-disc pl-5 space-y-1.5 text-[15px] leading-7">
                {block.items.map((item, j) => (
                  <li key={j}>{inlineMarkdown(item)}</li>
                ))}
              </ul>
            )
          case 'hr':
            return <hr key={index} className="border-gray-200 my-6" />
          case 'table':
            return (
              <div key={index} className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#F8F4EF] text-gray-600">
                    <tr>
                      {block.headers.map((cell, j) => (
                        <th key={j} className="px-4 py-2.5 font-semibold">{inlineMarkdown(cell)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="border-t border-gray-100">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-2.5 align-top">{inlineMarkdown(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
