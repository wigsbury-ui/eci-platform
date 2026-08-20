import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readFile } from 'fs/promises'
import path from 'path'
import { RESEARCH_MOROCCO_COOKIE } from '@/lib/research/cookies'
import { MOROCCO_RESEARCH } from '@/lib/content/morocco-research'

export async function GET() {
  const jar = await cookies()
  if (jar.get(RESEARCH_MOROCCO_COOKIE)?.value !== '1') {
    return NextResponse.json({ error: 'Unlock required' }, { status: 401 })
  }

  const filePath = path.join(
    process.cwd(),
    'public',
    'research',
    MOROCCO_RESEARCH.fileName
  )

  try {
    const data = await readFile(filePath)
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${MOROCCO_RESEARCH.fileName}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Report file not found' }, { status: 404 })
  }
}
