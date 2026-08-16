/** Public leadership / ECI team profiles for the homepage. */

export type TeamMember = {
  id: string
  name: string
  title: string
  shortBio: string
  fullBio: string
  image: string | null
  linkedin: string
  initials: string
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'jon-shaw',
    name: 'Jon Shaw',
    title: 'Head, Ellesmere College',
    shortBio:
      'Steward of Ellesmere’s Life:Ready philosophy — guiding how British heritage education travels with integrity into international partnerships.',
    fullBio:
      'Jon Shaw leads Ellesmere College in Shropshire and champions the educational values that underpin Ellesmere College International. His focus is ensuring every partner campus reflects the College’s commitment to academic excellence, pastoral care and preparing young people to be Life:Ready.',
    image: '/images/people/jon-shaw.jpg',
    linkedin: 'https://www.linkedin.com/',
    initials: 'JS',
  },
  {
    id: 'network-director',
    name: 'Network Director',
    title: 'Ellesmere College International',
    shortBio:
      'Leads ECI’s international growth strategy — aligning investors, operators and school leaders around quality, brand and long-term partnership.',
    fullBio:
      'The Network Director oversees Ellesmere College International’s partnership pipeline across the Middle East and North Africa, coordinating market prioritisation, investor engagement and the delivery standards that protect the Ellesmere name in every new campus.',
    image: null,
    linkedin: 'https://www.linkedin.com/',
    initials: 'ND',
  },
  {
    id: 'partnerships-lead',
    name: 'Head of Partnerships',
    title: 'School & investor relations',
    shortBio:
      'Primary contact for partner schools and introduction agents — keeping strategy, quality assurance and day-to-day delivery coherent.',
    fullBio:
      'The Head of Partnerships is the named relationship lead for ECI partner schools and trusted introduction agents. The role bridges educational quality, commercial clarity and operational support so every partnership remains accountable and ambitious.',
    image: null,
    linkedin: 'https://www.linkedin.com/',
    initials: 'HP',
  },
  {
    id: 'expansion-lead',
    name: 'Expansion Lead',
    title: 'Markets & new campuses',
    shortBio:
      'Advances ECI’s ranked growth destinations — from New Cairo and Bahrain to Morocco, Abu Dhabi and beyond.',
    fullBio:
      'The Expansion Lead works across ECI’s Top 10 priority destinations, supporting site selection conversations, regulatory readiness and the early-stage partnership work that turns market intelligence into operating campuses.',
    image: null,
    linkedin: 'https://www.linkedin.com/',
    initials: 'EL',
  },
]
