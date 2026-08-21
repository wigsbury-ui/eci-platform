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
  /** Optional object-fit / crop classes for circular avatars */
  avatarClassName?: string
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'jon-shaw',
    name: 'Jon Shaw',
    title: 'Head, Ellesmere College',
    shortBio:
      'Steward of Ellesmere’s Life:Ready philosophy, guiding how British heritage education travels with integrity into international partnerships.',
    fullBio:
      'Jon Shaw leads Ellesmere College in Shropshire and champions the educational values that underpin Ellesmere College International. His focus is ensuring every partner campus reflects the College’s commitment to academic excellence, pastoral care and preparing young people to be Life:Ready.',
    image: '/images/people/jon-shaw.jpg',
    linkedin: 'https://www.linkedin.com/',
    initials: 'JS',
  },
  {
    id: 'vicky-pritt-roberts',
    name: 'Vicky Pritt-Roberts',
    title: 'Senior Deputy Head, Ellesmere College',
    shortBio:
      'Long-serving Ellesmere leader supporting academic standards, pastoral care and the Life:Ready culture that travels with partner schools.',
    fullBio:
      'Vicky Pritt-Roberts is Senior Deputy Head at Ellesmere College, with long experience in school leadership, teaching and educational development. She helps uphold the academic and pastoral standards of the Shropshire campus so that partner schools in the Ellesmere College International network inherit a coherent, lived culture, not only a brand name.',
    image: null,
    linkedin: 'https://www.linkedin.com/in/vicky-pritt-roberts-58484953',
    initials: 'VP',
  },
  {
    id: 'neil-tomalin',
    name: 'Neil Tomalin',
    title: 'Director of International Strategy & School Development, ECI',
    shortBio:
      'Leads ECI’s international growth, partner school development and strategic planning across the Middle East, building schools that families love to belong to.',
    fullBio:
      'As Director of International Strategy and School Development at Ellesmere College International, Neil leads international growth, strategic planning and partner school development. He brings senior school leadership experience, including as Principal of Ellesmere Muscat, to help partners open and run strong, future-facing campuses grounded in Ellesmere’s educational values.',
    image: '/images/people/neil-tomalin.jpg',
    linkedin: 'https://www.linkedin.com/in/neil-tomalin/',
    initials: 'NT',
    avatarClassName: 'object-cover object-[center_18%] scale-[1.55]',
  },
  {
    id: 'paul-shropshire',
    name: 'Paul Shropshire',
    title: 'Education Mentor',
    shortBio:
      'Former Principal of The British School of Kuwait, mentoring partner schools on leadership, standards and school improvement.',
    fullBio:
      'Paul Shropshire is an Education Mentor with Ellesmere College International. He previously served as Principal of The British School of Kuwait, bringing nearly three decades of senior international school leadership. He supports partner campuses with practical mentoring on school improvement, leadership and the day-to-day standards that help families trust an Ellesmere education.',
    image: null,
    linkedin: 'https://www.linkedin.com/in/paul-shropshire-88559843',
    initials: 'PS',
  },
]
