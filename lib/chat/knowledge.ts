import {
  HERITAGE,
  INVESTOR_VALUE_PROPS,
  OPENING_SOON,
  OPERATING_SCHOOLS,
  PARTNERSHIP_MODELS,
} from '@/lib/content/network'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'

export type KnowledgeAudience = 'investor' | 'school' | 'public' | 'team'

export type KnowledgeChunk = {
  id: string
  audience: KnowledgeAudience[]
  title: string
  source: string
  text: string
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'heritage',
    audience: ['investor', 'school', 'public', 'team'],
    title: 'Ellesmere heritage',
    source: 'About ECI',
    text: `Ellesmere College in Shropshire was founded in ${HERITAGE.founded} and sits on approximately ${HERITAGE.campusAcres} acres. Ellesmere College International (ECI) extends the Ellesmere ethos — Life:Ready — to partner schools worldwide. Contact: ${HERITAGE.email}.`,
  },
  {
    id: 'riyadh',
    audience: ['investor', 'school', 'public', 'team'],
    title: 'Ellesmere College Riyadh',
    source: 'Network schools',
    text: OPERATING_SCHOOLS.find(s => s.id === 'riyadh')!.description + ' Website: https://ellesmerecollegeriyadh.com',
  },
  {
    id: 'muscat',
    audience: ['investor', 'school', 'public', 'team'],
    title: 'Ellesmere College Muscat',
    source: 'Network schools',
    text: OPERATING_SCHOOLS.find(s => s.id === 'muscat')!.description,
  },
  {
    id: 'doha',
    audience: ['investor', 'school', 'public', 'team'],
    title: 'Ellesmere College Doha',
    source: 'Opening soon',
    text: OPENING_SOON.find(s => s.id === 'doha')!.description,
  },
  {
    id: 'expansion',
    audience: ['investor', 'public', 'team'],
    title: 'Top 10 priority destinations',
    source: 'Investment partners',
    text: `ECI’s Top 10 open growth destinations for investment and operating partners are: ${TOP_DESTINATIONS.map(m => `#${m.rank} ${m.name} (${m.country})`).join('; ')}. Riyadh is an operating campus already allocated to a partner and is not listed among open growth markets. Rankings reflect demand, income fit, fee-band alignment, regulatory climate, competition, UK curriculum readiness and cultural fit with ECI.`,
  },
  {
    id: 'partnerships',
    audience: ['investor', 'public', 'team'],
    title: 'Partnership models',
    source: 'Partnership',
    text: PARTNERSHIP_MODELS.map(m => `${m.title}: ${m.summary} Ideal for: ${m.ideal}`).join(' '),
  },
  {
    id: 'investor-value',
    audience: ['investor', 'public', 'team'],
    title: 'Why partner with ECI',
    source: 'Investor briefing',
    text: INVESTOR_VALUE_PROPS.map(v => `${v.title}: ${v.body}`).join(' '),
  },
  {
    id: 'school-docs',
    audience: ['school', 'team'],
    title: 'School document archives',
    source: 'School portal',
    text: 'Partner schools have access to a shared network archive of policies, templates and guidance available to all schools, plus a school-specific archive for local documents, contracts and handbooks. Upload and download are available in the School Partner Portal under Documents.',
  },
  {
    id: 'collab',
    audience: ['school', 'team'],
    title: 'Calendar and messaging',
    source: 'Collaboration',
    text: 'The ECI calendar lets staff create time blocks with an explicit timezone (e.g. Asia/Riyadh), named attendees, and allocation to the Admin calendar, any individual school calendar, several schools, or all schools. Each school has a signature colour on the calendar grid (Riyadh teal, Muscat amber, Doha blue) so visits are easy to spot. Partner schools see network-wide events and anything allocated to their school; admin-only blocks stay on the team calendar.',
  },
  {
    id: 'hpl',
    audience: ['investor', 'school', 'public', 'team'],
    title: 'High Performance Learning',
    source: 'Educational philosophy',
    text: 'Ellesmere uses the High Performance Learning (HPL) philosophy and framework. We believe all students can be high performers and systematically build cognitive competencies that help young people thrive in school and later life. Ellesmere is among a small number of HPL World Class Schools globally.',
  },
]

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2)
}

export function retrieveKnowledge(query: string, audience: KnowledgeAudience, limit = 4) {
  const tokens = tokenize(query)
  const scored = KNOWLEDGE_BASE
    .filter(c => c.audience.includes(audience))
    .map(chunk => {
      const hay = tokenize(`${chunk.title} ${chunk.text}`)
      const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 2 : hay.some(h => h.includes(t)) ? 1 : 0), 0)
      return { chunk, score }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  if (scored.length === 0) {
    return KNOWLEDGE_BASE.filter(c => c.audience.includes(audience)).slice(0, 3)
  }
  return scored.map(s => s.chunk)
}

export function answerFromKnowledge(query: string, audience: KnowledgeAudience) {
  const chunks = retrieveKnowledge(query, audience)
  const answer = chunks.map(c => c.text).join('\n\n')
  const citations = chunks.map(c => ({ title: c.title, source: c.source }))
  return { answer, citations, chunks }
}
