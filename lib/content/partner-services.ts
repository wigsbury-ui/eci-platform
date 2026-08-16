/** ECI Partner Services & Product Offering Framework — structured from the draft. */

export type ServiceGroupId = 1 | 2 | 3

export type ImpactLevel = 'Low' | 'Moderate' | 'High' | 'Very High' | 'Core' | '-'

export interface PartnerService {
  id: string
  number: number
  group: ServiceGroupId
  name: string
  shortName: string
  overview: string
  attributes: string[]
  products?: string[]
  successCriteria?: string[]
  educationImpact?: ImpactLevel
  relationshipImpact?: ImpactLevel
  brandImpact?: ImpactLevel
  profitPotential?: ImpactLevel
}

export const SERVICE_GROUPS = [
  {
    id: 1 as const,
    label: 'Group 1',
    title: 'Obligatory commitments',
    subtitle: 'The non-negotiable foundation of every ECI partnership',
    colour: '#C8A84B',
    narrative:
      'Shared commitments between ECI and the partner school — the bedrock of school quality and brand integrity. These are not optional extras; they define what it means to be an Ellesmere partner.',
    commercialNote: 'ECI core commitments · Partner commitments',
  },
  {
    id: 2 as const,
    label: 'Group 2',
    title: 'Core services',
    subtitle: 'Experience-enhancing services that differentiate the school',
    colour: '#6B3DA8',
    narrative:
      'Services that significantly enhance the student, staff and parent experience — adding market differentiation and educational impact. Typically integrated by agreement, with additional fees where appropriate.',
    commercialNote: 'Optional agreement integration · Additional fees attached',
  },
  {
    id: 3 as const,
    label: 'Group 3',
    title: 'Premium add-ons',
    subtitle: 'High-value specialisation and strategic flexibility',
    colour: '#34D399',
    narrative:
      'Premium offerings that enable deeper engagement and specialisation, while giving partners strategic flexibility to meet unique local needs — often with strong commercial potential.',
    commercialNote: 'Premium engagement · High-margin / specialist delivery',
  },
] as const

export const GROUP1_PARTNER_COMMITMENTS = [
  'Faithful implementation of the ECI model',
  'Commitment to continuous improvement',
  'Evidenced commitment to best practice',
  'Local market engagement and recruitment',
  'Financial and operational transparency',
  'Demonstrable, ongoing commitment to Life:Ready',
  'Investment in staff quality',
]

export const PARTNER_SERVICES: PartnerService[] = [
  {
    id: 'brand-marketing',
    number: 1,
    group: 1,
    name: 'Brand and Marketing Support',
    shortName: 'Brand & marketing',
    overview:
      'Protects and projects the Ellesmere identity across every partner market — ensuring brand fidelity while enabling locally resonant storytelling, admissions marketing and network-wide visibility.',
    attributes: [
      'Global brand standards and visual identity guidance',
      'Marketing playbooks for admissions and community engagement',
      'Campaign and content support aligned to Life:Ready',
      'Network consistency with room for local cultural adaptation',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'High',
    brandImpact: 'Very High',
    profitPotential: 'Core',
  },
  {
    id: 'academic-curriculum',
    number: 2,
    group: 1,
    name: 'Academic and Curriculum Framework',
    shortName: 'Curriculum framework',
    overview:
      'The academic DNA of the partnership — curriculum pathways, assessment philosophy and learning standards drawn from Ellesmere’s heritage and adapted for international delivery.',
    attributes: [
      'Curriculum frameworks aligned to ECI values and local regulation',
      'Pathway design across phases and programmes',
      'Assessment and progression standards',
      'Quality benchmarks shared across the network',
    ],
    educationImpact: 'Very High',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'Core',
  },
  {
    id: 'quality-assurance',
    number: 3,
    group: 1,
    name: 'Quality Assurance and School Improvement',
    shortName: 'Quality assurance',
    overview:
      'A structured approach to inspection-readiness, self-evaluation and continuous improvement that protects educational standards and the Ellesmere name.',
    attributes: [
      'QA cycles and school improvement planning',
      'Self-evaluation and evidence frameworks',
      'Network peer review and challenge',
      'Measurable delivery standards across offerings',
    ],
    educationImpact: 'Very High',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'Core',
  },
  {
    id: 'pd-leadership',
    number: 4,
    group: 1,
    name: 'Professional Development & Leadership Training',
    shortName: 'PD & leadership',
    overview:
      'Builds teaching and leadership capacity across the network so every campus can recruit, develop and retain people who deliver the Ellesmere model with confidence.',
    attributes: [
      'Leadership development pathways',
      'Teacher professional learning programmes',
      'Middle and senior leader calibration',
      'Network sharing of practice and mentoring',
    ],
    educationImpact: 'High',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'Core',
  },
  {
    id: 'alumni',
    number: 5,
    group: 1,
    name: 'Alumni Integration',
    shortName: 'Alumni',
    overview:
      'Connects partner schools into a living Ellesmere alumni community — strengthening belonging, reputation and lifelong relationship with the brand.',
    attributes: [
      'Alumni network participation',
      'Storytelling and ambassador opportunities',
      'Cross-campus community connection',
      'Long-term brand and relationship equity',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Very High',
    brandImpact: 'Very High',
    profitPotential: 'Core',
  },
  {
    id: 'digital-ops',
    number: 6,
    group: 1,
    name: 'Digital and Operational Infrastructure Support',
    shortName: 'Digital & operations',
    overview:
      'Foundational systems and operational guidance that keep partner schools running coherently — from digital platforms to day-to-day organisational rhythm.',
    attributes: [
      'Operational infrastructure guidance',
      'Core digital systems alignment',
      'Process clarity for growing schools',
      'Support for scalable school operations',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'High',
    profitPotential: 'Core',
  },
  {
    id: 'uniform-supply',
    number: 7,
    group: 2,
    name: 'School Uniform and Branding Supply Chain',
    shortName: 'Uniform supply chain',
    overview:
      'A centralised supply and distribution model with an ECI-managed supplier and online ordering platform — preserving global brand standards while easing procurement for schools and families.',
    attributes: [
      'Centralised supplier partnership tailored to regional climates and cultures',
      'ECI-controlled online ordering platform for schools and families',
      'Customisation with brand fidelity (modesty, climate, local needs)',
      'Fulfilment, logistics oversight and aftercare support',
    ],
    products: [
      'ECI Global Uniform Catalogue',
      'ECI Online Shop',
      'Customisation request workflow',
      'Shipping and fulfilment dashboard',
    ],
    successCriteria: [
      '90% of orders fulfilled on time for academic year starts; 99%+ platform uptime',
      '100% brand alignment — no unapproved local variation',
      '80%+ satisfaction from operations teams and/or families',
      'Positive contribution to ECI overhead recovery through margin or service fee',
    ],
    educationImpact: 'Low',
    relationshipImpact: 'Moderate',
    brandImpact: 'Very High',
    profitPotential: 'Very High',
  },
  {
    id: 'school-design',
    number: 8,
    group: 2,
    name: 'New School Design and Facilities Planning',
    shortName: 'School design',
    overview:
      'Expert design advisory so campuses are efficient, future-proof and reflective of Ellesmere values — balancing aesthetics, functionality, sustainability and local compliance.',
    attributes: [
      'Concept and schematic design advisory',
      'Learning-centric layouts and specialist space planning',
      'Facilities benchmarking against Ellesmere UK and peers',
      'Sustainable, safe design and phased campus strategies',
    ],
    products: [
      'ECI Design Principles Handbook',
      'Design review submission template',
      'Facilities planning checklist',
      'Model campus layouts and visuals',
    ],
    successCriteria: [
      '≥90% alignment with ECI spatial, academic and safety design principles',
      'Partners rate advisory as timely and actionable',
      'Masterplans support staged expansion and flexible learning',
      'Measurable fee income or enhanced licensing value for ECI',
    ],
    educationImpact: 'High',
    relationshipImpact: 'Moderate',
    brandImpact: 'High',
    profitPotential: 'Moderate',
  },
  {
    id: 'org-design',
    number: 9,
    group: 2,
    name: 'Organisational Design and Staffing Models',
    shortName: 'Org & staffing',
    overview:
      'Efficient, scalable organisational models and staffing plans aligned to school size, curriculum pathways and financial reality — building long-term leadership capacity.',
    attributes: [
      'Organisational structure advisory',
      'Role definition and scoping',
      'Phased growth staffing models',
      'Workforce benchmarking and load analysis',
    ],
    products: [
      'Model org charts and staffing grids',
      'Job description library',
      'Staffing plan builder',
      'Leadership role calibration guide',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'High',
    brandImpact: 'Moderate',
    profitPotential: 'Moderate',
  },
  {
    id: 'timetable',
    number: 10,
    group: 2,
    name: 'Timetable and Curriculum Architecture Support',
    shortName: 'Timetable & architecture',
    overview:
      'Strategic and technical support to design curriculum frameworks and timetables that align pedagogy with operational realities — the operational spine of the school.',
    attributes: [
      'Curriculum architecture across Key Stages and programmes',
      'Timetable model advisory',
      'Staffing and rooming efficiency',
      'Co-curricular and pastoral integration',
    ],
    products: [
      'Sample curriculum maps and programme models',
      'Timetable configuration toolkit',
      'Staff and facility allocation calculators',
      'Curriculum pathways audit template',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'Low',
    profitPotential: 'Low',
  },
  {
    id: 'playground',
    number: 11,
    group: 2,
    name: 'Playground Design and Development',
    shortName: 'Playgrounds',
    overview:
      'Purposeful outdoor learning environments that foster exploration, creativity, social development and wellbeing — play as an extension of the Ellesmere whole-child model.',
    attributes: [
      'Playground philosophy and design principles',
      'Age and purpose zoning',
      'Cultural and climate adaptation',
      'Curriculum and wellbeing integration',
    ],
    educationImpact: 'High',
    relationshipImpact: 'High',
    brandImpact: 'Moderate',
    profitPotential: 'Moderate',
  },
  {
    id: 'benchmarking',
    number: 12,
    group: 2,
    name: 'International Benchmarking and Student Data Analytics',
    shortName: 'Data & benchmarking',
    overview:
      'Evidence-based improvement through international benchmarking, internal analytics and leadership capacity to use data well.',
    attributes: [
      'Standardised assessment integration (e.g. CAT4, GL, MAP)',
      'Internal data frameworks and dashboards',
      'Capacity building for data-informed leadership',
      'Ethical data use protocols',
    ],
    educationImpact: 'High',
    relationshipImpact: 'Moderate',
    brandImpact: 'Moderate',
    profitPotential: 'Low',
  },
  {
    id: 'sport-academy',
    number: 13,
    group: 2,
    name: 'Sport Academy Development Support',
    shortName: 'Sport academies',
    overview:
      'Design and delivery of high-quality sport programmes and academies that become a signature of the school offer — from recreational provision to elite pathways.',
    attributes: [
      'Strategic sport positioning',
      'Academy model design and talent pathways',
      'Facilities and equipment advisory',
      'Co-curricular and competitive programming',
    ],
    educationImpact: 'High',
    relationshipImpact: 'High',
    brandImpact: 'Very High',
    profitPotential: 'Moderate',
  },
  {
    id: 'arts',
    number: 14,
    group: 2,
    name: 'The Arts and Performance Partnerships',
    shortName: 'Arts & performance',
    overview:
      'Robust arts programmes beyond the classroom — partnerships, enrichment and showcases that treat the arts as core to a holistic Ellesmere education.',
    attributes: [
      'Arts curriculum enrichment',
      'Performance and exhibition strategy',
      'External arts partnerships',
      'Links to character and student leadership',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'High',
    brandImpact: 'Very High',
    profitPotential: 'Low',
  },
  {
    id: 'cultural-exchange',
    number: 15,
    group: 2,
    name: 'Cultural Exchange and Twinning Initiatives',
    shortName: 'Cultural exchange',
    overview:
      'Structured twinning and exchange — physical or virtual — that builds intercultural understanding across the ECI network and beyond.',
    attributes: [
      'School twinning programme design',
      'Cultural and language exchange opportunities',
      'Global thematic collaboration projects',
      'Logistics, safeguarding and compliance support',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'Low',
  },
  {
    id: 'college-counselling-framework',
    number: 16,
    group: 2,
    name: 'College Counselling Framework',
    shortName: 'College counselling',
    overview:
      'Frameworks, tools and expertise so partner schools can build student-centred university counselling programmes spanning UK, US, EU and global pathways.',
    attributes: [
      'Multi-year counselling programme design',
      'Advisory tools and milestone calendars',
      'Application process support templates',
      'University network development',
    ],
    educationImpact: 'High',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'Moderate',
  },
  {
    id: 'edtech',
    number: 17,
    group: 2,
    name: 'EdTech Integration Support',
    shortName: 'EdTech',
    overview:
      'Coherent digital strategies that enhance learning — platform selection, blended models and safeguarding-compliant practice.',
    attributes: [
      'Digital strategy development',
      'Platform and tool selection',
      'Blended and remote learning models',
      'Data protection and student wellbeing alignment',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'Moderate',
  },
  {
    id: 'sustainability',
    number: 18,
    group: 2,
    name: 'Sustainability Consulting',
    shortName: 'Sustainability',
    overview:
      'Embedding sustainability into campus operations and curriculum so schools model climate responsibility and empower student change-makers.',
    attributes: [
      'Campus sustainability review',
      'Sustainable building advisory',
      'Curriculum and co-curricular integration',
      'Community engagement and advocacy',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'Moderate',
    profitPotential: 'Moderate',
  },
  {
    id: 'service-learning',
    number: 19,
    group: 2,
    name: 'Service Learning and Citizenship Frameworks',
    shortName: 'Service learning',
    overview:
      'Structured service learning that fosters empathy, responsibility and active citizenship — preparing students for life beyond examinations.',
    attributes: [
      'Whole-school service learning frameworks',
      'Curriculum integration and assessment',
      'Local partnership and outreach planning',
      'Student leadership and reflection models',
    ],
    educationImpact: 'High',
    relationshipImpact: 'Very High',
    brandImpact: 'Very High',
    profitPotential: '-',
  },
  {
    id: 'partner-scholarship',
    number: 20,
    group: 2,
    name: 'Ellesmere College Partner Scholarship Programme',
    shortName: 'Partner scholarships',
    overview:
      'Network scholarship structures that elevate academic standing, attract exceptional students and strengthen inclusivity across partner schools.',
    attributes: [
      'Mission-aligned scholarship design',
      'Fair and rigorous selection models',
      'Financial sustainability modelling',
      'Brand and communications support',
    ],
    educationImpact: 'High',
    relationshipImpact: 'Very High',
    brandImpact: 'Very High',
    profitPotential: 'Very High',
  },
  {
    id: 'summer-schools',
    number: 21,
    group: 2,
    name: 'ECI Partner Summer Schools',
    shortName: 'Summer schools',
    overview:
      'Partner summer school programmes that extend the Ellesmere experience, deepen family engagement and create high-visibility brand moments.',
    attributes: [
      'Programme design and quality standards',
      'Brand-aligned enrichment experiences',
      'Operational and staffing guidance',
      'Network participation opportunities',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Very High',
    brandImpact: 'Very High',
    profitPotential: 'High',
  },
  {
    id: 'central-uni-counselling',
    number: 22,
    group: 3,
    name: 'Centralised University Counselling Services',
    shortName: 'Centralised counselling',
    overview:
      'A premium, remotely delivered counselling model from ECI specialists — personalised guidance through the full university admissions journey.',
    attributes: [
      'One-to-one specialist counselling',
      'End-to-end application management',
      'Access to ECI’s global university network',
      'Parent webinars and communication',
    ],
    products: [
      'ECI University Counselling Portal',
      'Personal roadmap templates',
      'Global Pathways Handbook',
      'Feedback and reporting tools',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'High',
    brandImpact: 'Moderate',
    profitPotential: 'Very High',
  },
  {
    id: 'psychometrics',
    number: 23,
    group: 3,
    name: 'Psychometric Profiling and Learner Analytics',
    shortName: 'Learner analytics',
    overview:
      'Validated psychometric tools and analytics dashboards so schools understand learners beyond grades — informing teaching, pastoral care and pathways.',
    attributes: [
      'Cognitive and aptitude profiling',
      'Learner analytics dashboards',
      'Pastoral and wellbeing applications',
      'Staff training in profile interpretation',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'High',
    profitPotential: 'High',
  },
  {
    id: 'talent-id',
    number: 24,
    group: 3,
    name: 'Bespoke Scholarship and Talent Identification Frameworks',
    shortName: 'Talent identification',
    overview:
      'Fair, mission-aligned scholarship and talent frameworks — academic, arts or sport — that add value without compromising equity or rigour.',
    attributes: [
      'Scholarship programme design',
      'Talent assessment models',
      'Financial modelling and risk management',
      'Branding and communications strategy',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Very High',
    brandImpact: 'Very High',
    profitPotential: 'Moderate',
  },
  {
    id: 'teacher-recruitment',
    number: 25,
    group: 3,
    name: 'End-to-End Teacher Recruitment Services',
    shortName: 'Teacher recruitment',
    overview:
      'Full-spectrum recruitment from sourcing to onboarding — reducing administrative burden while improving quality and values alignment.',
    attributes: [
      'Global sourcing and shortlisting',
      'Interview support and reference checks',
      'Contracting and onboarding advisory',
      'Access to pre-screened talent pools',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'Very High',
  },
  {
    id: 'leadership-secondment',
    number: 26,
    group: 3,
    name: 'Leadership Secondment or Interim Placement',
    shortName: 'Leadership secondment',
    overview:
      'Experienced interim leaders for openings, transitions or turnaround moments — ensuring continuity and building local capacity.',
    attributes: [
      'Strategic matching to school context',
      'Defined scope and mandate',
      'Onboarding and integration support',
      'Capacity building and handover planning',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'High',
    profitPotential: 'Moderate',
  },
  {
    id: 'governance',
    number: 27,
    group: 3,
    name: 'Governance and Board Development',
    shortName: 'Governance',
    overview:
      'Effective governance structures and board capability — bridging educational insight and corporate oversight for sustainable schools.',
    attributes: [
      'Governance framework advisory',
      'Board training and induction',
      'Self-evaluation and review tools',
      'Policy and compliance support',
    ],
    educationImpact: 'High',
    relationshipImpact: 'High',
    brandImpact: 'Very High',
    profitPotential: 'Moderate',
  },
  {
    id: 'turnkey-opening',
    number: 28,
    group: 3,
    name: 'Turnkey New School Opening Support',
    shortName: 'Turnkey opening',
    overview:
      'End-to-end support from concept to enrolment for new Ellesmere-branded institutions — academic, operational, legal and market launch.',
    attributes: [
      'School concept and positioning strategy',
      'Regulatory and licensing advisory',
      'Academic and operational planning',
      'Marketing, admissions and launch campaigns',
    ],
    products: [
      'New school opening project plan',
      'Founding document library',
      'Launch marketing toolkit',
      'Founding team training pack',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'Moderate',
    profitPotential: 'Very High',
  },
  {
    id: 'feasibility',
    number: 29,
    group: 3,
    name: 'Feasibility Studies and Market Entry Strategy',
    shortName: 'Feasibility & entry',
    overview:
      'Data-driven due diligence before market entry — demographics, regulation, competition and strategic recommendations that reduce risk.',
    attributes: [
      'Demographic and market analysis',
      'Regulatory landscape mapping',
      'Competitive benchmarking',
      'Strategic entry recommendations and light financial projections',
    ],
    educationImpact: 'High',
    relationshipImpact: 'High',
    brandImpact: 'High',
    profitPotential: 'High',
  },
  {
    id: 'boarding',
    number: 30,
    group: 3,
    name: 'Integrated Boarding School Development',
    shortName: 'Boarding development',
    overview:
      'Design and launch of boarding provision as a fully integrated part of the school offer — facilities, pastoral systems and market positioning.',
    attributes: [
      'Boarding strategy and positioning',
      'Facility and residential life planning',
      'Pastoral systems and safeguarding',
      'Recruitment and marketing support',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'Very High',
    profitPotential: 'Very High',
  },
  {
    id: 'sub-models',
    number: 31,
    group: 3,
    name: 'Brand Licensing for Sub-Models',
    shortName: 'Sub-model licensing',
    overview:
      'Licensed Ellesmere sub-models — such as sixth-form hubs or sport academies — that preserve brand integrity while adapting to specialised local opportunities.',
    attributes: [
      'Sub-model definition and customisation',
      'Brand usage and quality control',
      'Curriculum and programme design',
      'Marketing and positioning support',
    ],
    educationImpact: 'High',
    relationshipImpact: 'Very High',
    brandImpact: 'High',
    profitPotential: 'Very High',
  },
  {
    id: 'advisory-council',
    number: 32,
    group: 3,
    name: 'Access to ECI International Advisory Council',
    shortName: 'Advisory Council',
    overview:
      'Privileged access to ECI’s International Advisory Council for strategy, innovation and thought partnership at the highest level.',
    attributes: [
      'Strategic engagement and formal Council input',
      'Annual roundtable participation',
      'Thought leadership exchange',
      'Recognition within a global excellence network',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'Moderate',
    profitPotential: '-',
  },
  {
    id: 'innovation-pilots',
    number: 33,
    group: 3,
    name: 'Custom Research or Innovation Pilots',
    shortName: 'Innovation pilots',
    overview:
      'Co-created research and innovation pilots with ECI — generating actionable insight while positioning the school as a forward-thinking institution.',
    attributes: [
      'Collaborative project design',
      'Implementation and monitoring support',
      'Dissemination and sector engagement',
      'Alignment with global education trends',
    ],
    educationImpact: 'Moderate',
    relationshipImpact: 'Moderate',
    brandImpact: 'Moderate',
    profitPotential: 'Moderate',
  },
]

export function servicesByGroup(group: ServiceGroupId) {
  return PARTNER_SERVICES.filter(s => s.group === group)
}

export const FRAMEWORK_INTRO = {
  title: 'Partner Services & Product Offering',
  eyebrow: 'The ECI product',
  summary:
    'A clear, tiered suite of services for international partner schools — from non-negotiable foundations to premium specialisation — so quality, brand integrity and commercial clarity travel together.',
  whyItMatters: [
    'Group 1 defines what every partnership must include to protect quality and brand.',
    'Group 2 enhances student, staff and parent experience with market-ready differentiation.',
    'Group 3 unlocks premium depth, flexibility and high-value engagement.',
  ],
}
