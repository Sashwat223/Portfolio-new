export interface ChapterItem {
  id: string;
  number: string;
  label: string;
}

export const CHAPTERS: ChapterItem[] = [
  { id: 'introduction', number: '01', label: 'Introduction' },
  { id: 'journey', number: '02', label: 'My Journey' },
  { id: 'education', number: '03', label: 'Education' },
  { id: 'experience', number: '04', label: 'Experience' },
  { id: 'qualifications', number: '05', label: 'Qualifications' },
  { id: 'projects', number: '06', label: 'Projects' },
  { id: 'creative', number: '07', label: 'Creative Side' },
  { id: 'contact', number: '08', label: 'Contact' },
];

export const PROFILE = {
  name: 'SASHWAT DHAKAL',
  statement: 'Building at the intersection of finance, technology, data and creativity.',
  location: 'Biratnagar, Koshi Province, Nepal',
  email: 'sashwatdhakal224@gmail.com',
  phone: '+977 9707985099',
  languages: ['Nepali (Native)', 'English (Fluent)'],
  cvPath: '/assets/cv/Sashwat_Dhakal_CV.pdf',
};

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  isOngoing: boolean;
  details: string;
}

export const EDUCATION: EducationItem[] = [
  {
    degree: 'Bachelor of Business Administration (BBA)',
    institution: 'Mahendra Morang Adarsha Multiple Campus',
    location: 'Biratnagar, Nepal',
    period: '2022 – 2026',
    status: 'Ongoing — Completing in the coming months',
    isOngoing: true,
    details:
      'Undergraduate business and management studies bridging corporate finance, quantitative analysis, and organizational strategy while building real-world software and AI automation systems.',
  },
  {
    degree: 'Higher Secondary Education (+2), Management',
    institution: 'Merryland College',
    location: 'Biratnagar, Nepal',
    period: '2020 – 2022',
    status: 'Completed',
    isOngoing: false,
    details:
      'Focused on Management stream foundations including accounting, economics, and business principles.',
  },
];

export interface ExperienceItem {
  role: string;
  organization: string;
  department?: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    role: 'Trade Finance Operations',
    organization: 'Nabil Bank Limited',
    department: 'Trade Finance Department',
    period: 'Banking Experience',
    location: 'Nepal',
    type: 'Banking & Finance',
    highlights: [
      'Supported trade finance operations and structured banking workflows within the Trade Finance Department.',
      'Handled banking documentation, verification, and procedural compliance in a high-precision financial environment.',
      'Gained firsthand exposure to commercial banking operations, client service, and financial documentation standards.',
    ],
  },
  {
    role: 'Exam Invigilator (Part-time Contract)',
    organization: 'British Council Nepal',
    period: 'May 2025 – July 2026',
    location: 'Nepal',
    type: 'Operations & Assessment',
    highlights: [
      'Provided examination-day operational support under a part-time contract.',
      'Maintained strict procedural compliance, candidate coordination, and structured assessment delivery.',
      'Ensured accurate documentation and calm, reliable execution in high-stakes testing environments.',
    ],
  },
  {
    role: 'Administrative Assistant',
    organization: 'Birat Biotech',
    period: 'January 2022 – April 2025',
    location: 'Biratnagar, Nepal',
    type: 'Administration & Operations',
    highlights: [
      'Served in a core administrative support role for three years, ensuring smooth daily office operations.',
      'Maintained and organized company records, documents, files, and official correspondence.',
      'Managed data entry, digital documentation, and preparation of administrative reports.',
      'Coordinated internal communication, meetings, appointments, and office activities.',
    ],
  },
  {
    role: 'UN Online Volunteer — Digital Outreach',
    organization: 'United Nations Volunteers',
    period: 'Volunteer & Training',
    location: 'Remote',
    type: 'Volunteering & Civic Impact',
    highlights: [
      'Volunteered in spreading digital outreach in support of an election campaign.',
      'Completed United Nations BSAFE security awareness training.',
    ],
  },
];

export interface QualificationItem {
  title: string;
  issuer: string;
  category: string;
  summary: string;
}

export const QUALIFICATIONS: QualificationItem[] = [
  {
    title: 'CS50x — Introduction to Computer Science',
    issuer: 'Harvard University',
    category: 'Computer Science',
    summary: 'Algorithmic thinking, memory, data structures, C, Python, SQL, and web engineering.',
  },
  {
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Coursera / Google',
    category: 'Data Analytics',
    summary: 'Data cleaning, SQL querying, R/spreadsheet modeling, visualization, and analytical storytelling.',
  },
  {
    title: 'Bank of America Investment Banking Job Simulation',
    issuer: 'Forage',
    category: 'Investment Banking',
    summary: 'M&A financial modeling, company screening, valuation fundamentals, and client advisory decks.',
  },
  {
    title: 'Deloitte Job Simulation',
    issuer: 'Deloitte / Forage',
    category: 'Consulting & Tech',
    summary: 'Structured problem-solving, enterprise technology analysis, and data-driven business recommendations.',
  },
  {
    title: 'Microsoft Customer Relationship Management',
    issuer: 'Coursera / Microsoft',
    category: 'CRM & Operations',
    summary: 'Client lifecycle management, CRM workflows, operational pipelines, and service delivery.',
  },
  {
    title: 'United Nations BSAFE',
    issuer: 'United Nations',
    category: 'Security & Compliance',
    summary: 'Official UN security awareness and operational safety certification.',
  },
];

export interface SkillGroup {
  domain: string;
  accent: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    domain: 'Banking & Financial Operations',
    accent: '#D4AF7A',
    items: ['Trade Finance Documentation', 'Banking Compliance', 'Financial Operations', 'Valuation & Screening Fundamentals'],
  },
  {
    domain: 'Data Analytics',
    accent: '#9FB4C7',
    items: ['SQL & Data Cleaning', 'Spreadsheet Modeling', 'Analytical Reporting', 'Data Visualization'],
  },
  {
    domain: 'Python & Programming',
    accent: '#D4AF7A',
    items: ['Python', 'TypeScript / React', 'Node.js & Express', 'SQL & REST APIs'],
  },
  {
    domain: 'AI & Machine Learning',
    accent: '#9FB4C7',
    items: ['Resume Parsing & NLP', 'Gemini AI Integration', 'Prompt Engineering', 'AI Review Pipelines'],
  },
  {
    domain: 'Business Automation',
    accent: '#D4AF7A',
    items: ['WhatsApp Workflow Automation', 'HR Screening Pipelines', 'CRM Systems', 'Process Optimization'],
  },
  {
    domain: 'Video Editing & Graphic Design',
    accent: '#9FB4C7',
    items: ['Cinematic Video Editing', 'Visual Storytelling', 'Book Cover & Editorial Design', 'Digital Media Production'],
  },
  {
    domain: 'Business & Administrative Operations',
    accent: '#D4AF7A',
    items: ['Records & Documentation', 'Examination Administration', 'Stakeholder Coordination', 'Microsoft Office Suite'],
  },
];

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  introduction: string;
  problemSolved: string;
  whatIBuilt: string;
  technologies: string[];
  accentColor: string;
  highlights: string[];
  link?: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'nuvio-ai',
    name: 'NUVIO AI',
    tagline: 'AI-Powered HR Automation & Resume Screening Platform',
    category: 'Artificial Intelligence · HR Tech',
    introduction:
      'An intelligent HR automation platform engineered to transform unstructured candidate resumes into verified, structured hiring intelligence.',
    problemSolved:
      'Manual resume screening is slow, inconsistent, and prone to overlooking qualified candidates or missing critical profile gaps.',
    whatIBuilt:
      'Built a two-stage hybrid pipeline: a local AI/ML extraction engine parses resume data first, followed by Gemini AI review to identify missing details and improve candidate profile accuracy.',
    technologies: ['Python', 'Local AI / ML Extraction', 'Google Gemini API', 'Web Application', 'Automated Filtering'],
    accentColor: '#D4AF7A',
    highlights: [
      'Local AI/ML structured information extraction',
      'Secondary Gemini review for gap detection & accuracy',
      'Automated candidate filtering & HR workflow support',
    ],
  },
  {
    id: 'agenthub',
    name: 'AGENTHUB',
    tagline: 'WhatsApp Automation Platform for Businesses & Startups',
    category: 'Business Automation · Messaging',
    introduction:
      'A dedicated WhatsApp automation platform built to help businesses and startups streamline client communication and repetitive operational workflows.',
    problemSolved:
      'Growing teams struggle to manage high-volume customer inquiries, lead follow-ups, and structured messaging manually on WhatsApp.',
    whatIBuilt:
      'Engineered automated messaging flows, business communication pipelines, and workflow triggers tailored for startups and technology-driven businesses.',
    technologies: ['TypeScript', 'Node.js', 'WhatsApp Automation', 'Workflow Engine', 'Real-time Messaging'],
    accentColor: '#9FB4C7',
    highlights: [
      'Automated business messaging & response pipelines',
      'Startup-ready workflow automation',
      'Centralized communication & operational control',
    ],
  },
  {
    id: 'freelance-systems',
    name: 'Custom Web & AI Systems',
    tagline: 'Freelance Software, AI Integration & Automation',
    category: 'Full-Stack · Consulting',
    introduction:
      'End-to-end website development, custom software solutions, AI integration, and workflow automation delivered for technology businesses.',
    problemSolved:
      'Small and emerging businesses often lack unified digital infrastructure connecting their public web presence with internal AI and automation tools.',
    whatIBuilt:
      'Designed and shipped custom web platforms, integrated AI capabilities, and automated operational workflows tailored to client needs.',
    technologies: ['React', 'TypeScript', 'AI Integration', 'Workflow Automation', 'Digital Documentation'],
    accentColor: '#D4AF7A',
    highlights: [
      'Custom web & software delivery',
      'Applied AI & automation integration',
      'Client-aligned technical execution',
    ],
  },
];

export interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  isbn: string;
  frontCover: string;
  backCover: string;
  themeColor: string;
}

export const BOOKS: BookItem[] = [
  {
    id: 'xtroverted-introvert',
    title: 'An Xtroverted Introvert',
    subtitle: '15 Days Challenge to Better Personality',
    description:
      'A structured 15-day personal transformation guide exploring the balance between introversion and extroversion—crafted for dedicated readers seeking intentional growth.',
    isbn: '9798867226992',
    frontCover: '/assets/books/61g9K+VWD5L._SL1000_.jpg',
    backCover: '/assets/books/61Ex9rsPHmL._SY466_.jpg',
    themeColor: '#D4AF7A',
  },
  {
    id: 'fading-stars',
    title: 'Fading Stars',
    subtitle: 'A Mysterious Journey of Young Boy',
    description:
      'A fiction narrative following Ben on a mysterious, emotional journey of memory, resilience, and discovery beneath the night sky.',
    isbn: '9798866410699',
    frontCover: '/assets/books/61iT8UJoa3L._SL1499_.jpg',
    backCover: '/assets/books/61SRNbrN1uL._SY466_.jpg',
    themeColor: '#9FB4C7',
  },
];

export interface CreativeFacet {
  title: string;
  subtitle: string;
  description: string;
}

export const CREATIVE_FACETS: CreativeFacet[] = [
  {
    title: 'Finance & Markets',
    subtitle: 'Structured Capital',
    description: 'Trade finance documentation, investment banking analysis, and disciplined financial operations.',
  },
  {
    title: 'Technology & AI',
    subtitle: 'Applied Intelligence',
    description: 'Building practical AI pipelines, local ML extractors, and Gemini-assisted review systems.',
  },
  {
    title: 'Software & Automation',
    subtitle: 'Operational Leverage',
    description: 'Turning repetitive manual work into reliable automated software and messaging workflows.',
  },
  {
    title: 'Writing & Publishing',
    subtitle: 'Amazon KDP Author',
    description: 'Writing and self-publishing original non-fiction and fiction titles with global distribution.',
  },
  {
    title: 'Video & Graphic Design',
    subtitle: 'Visual Storytelling',
    description: 'Editing cinematic visuals, designing book covers, and crafting digital experiences.',
  },
  {
    title: 'Volunteering & Civic Impact',
    subtitle: 'UN Online Volunteer',
    description: 'Contributing to digital outreach initiatives and completing UN BSAFE preparedness training.',
  },
];

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  arrangement: string;
  src: string;
  accent: string;
  mood: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: '7-years',
    title: '7 Years',
    artist: 'Lukas Graham',
    arrangement: 'Piano Cover by Pianella Piano',
    src: '/assets/music/Lukas Graham - 7 Years Piano Cover by Pianella Piano.mp3',
    accent: '#7EC4D8',
    mood: 'Reflective · Piano Storytelling',
  },
  {
    id: 'mockingbird',
    title: 'Mockingbird',
    artist: 'Eminem',
    arrangement: 'Piano Cover',
    src: '/assets/music/Eminem - Mockingbird (Piano Cover).mp3',
    accent: '#5DB8D3',
    mood: 'Intimate · Nocturnal Piano',
  },
  {
    id: 'line-without-a-hook',
    title: 'Line Without A Hook',
    artist: 'Ricky Montgomery',
    arrangement: 'Piano Cover with Strings',
    src: '/assets/music/Ricky Montgomery - Line Without A Hook Piano Cover with Strings (with Lyrics & Sheet Music).mp3',
    accent: '#9FB4C7',
    mood: 'Cinematic · Piano & Strings',
  },
];
