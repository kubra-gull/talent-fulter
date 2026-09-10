import fs from 'fs';
import path from 'path';

export interface Job {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  description: string;
  responsibilities: string[];
  required_skills: string[];
  experience_required: string; // e.g. "2+ years"
  min_experience_years: number;
  education_required: string;
  deadline: string;
  status: 'Open' | 'Closed' | 'Draft';
  applicants_count: number;
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  skills: string[];
  education: string;
  experience: string;
  experience_years: number;
  certifications: string[];
  projects: string[];
  summary: string;
  cv_file?: string;
  cv_filename?: string;
  cv_text?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  match_score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  matched_skills: string[];
  missing_skills: string[];
  match_reasons: string[];
  status: 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Interviewed' | 'Offer' | 'Hired' | 'Rejected';
  applied_at: string;
  updated_at: string;
  // joined fields
  candidate?: Candidate;
  job?: Job;
}

export interface Interview {
  id: string;
  candidate_id: string;
  job_id: string;
  interviewer: string;
  interview_date: string; // YYYY-MM-DD
  interview_time: string; // e.g. "11:00 AM"
  interview_type: 'Online' | 'In-person' | 'Phone';
  meeting_link: string;
  instructions: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  created_at: string;
  // joined fields
  candidate?: Candidate;
  job?: Job;
}

export interface Notification {
  id: string;
  candidate_id: string;
  type: 'application_received' | 'candidate_shortlisted' | 'interview_invitation' | 'interview_rescheduled' | 'candidate_hired';
  channel: 'email' | 'in_app' | 'system';
  recipient: string;
  subject: string;
  message: string;
  status: 'Sent' | 'Queued' | 'Failed';
  sent_at: string;
}

export interface Placement {
  id: string;
  candidate_id: string;
  job_id: string;
  candidate_name: string;
  job_title: string;
  company: string;
  hired_date: string;
  announcement: string;
  created_at: string;
}

export interface CandidateActivity {
  id: string;
  candidate_id: string;
  action: string;
  details: string;
  created_at: string;
}

interface DatabaseSchema {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  notifications: Notification[];
  placements: Placement[];
  activities: CandidateActivity[];
}

function getDatabaseFilePath(): string {
  try {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.accessSync(dataDir, fs.constants.W_OK);
    return path.join(dataDir, 'talent_filter.json');
  } catch {
    const tmpDir = '/tmp';
    return path.join(tmpDir, 'talent_filter.json');
  }
}

const DB_FILE = getDatabaseFilePath();

const initialJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Python Developer',
    company: 'Apex Systems',
    department: 'Engineering',
    location: 'Remote / New York, NY',
    employment_type: 'Full-time',
    salary: '$110,000 - $135,000',
    description: 'We are seeking a skilled Python Developer to build and maintain high-performance backend microservices and data pipelines.',
    responsibilities: [
      'Design and deploy RESTful APIs using FastAPI and Django',
      'Optimize database queries and data processing pipelines in PostgreSQL',
      'Collaborate with front-end teams to integrate user-facing elements',
      'Implement automated unit and integration tests'
    ],
    required_skills: ['Python', 'SQL', 'FastAPI', 'Git', 'Docker', 'REST APIs'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'BS in Computer Science or equivalent',
    deadline: '2026-10-30',
    status: 'Open',
    applicants_count: 12,
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'job-2',
    title: 'Frontend Developer',
    company: 'Nova Interactive',
    department: 'Design & Frontend',
    location: 'San Francisco, CA / Hybrid',
    employment_type: 'Full-time',
    salary: '$105,000 - $130,000',
    description: 'Looking for a passionate Frontend Developer with deep React experience to build sleek enterprise software interfaces.',
    responsibilities: [
      'Build responsive, accessible user interfaces using React, TypeScript, and Tailwind CSS',
      'Integrate REST and GraphQL APIs with optimistic UI updates',
      'Collaborate closely with UI/UX designers to refine customer journeys',
      'Profile and optimize web app client-side performance'
    ],
    required_skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5/CSS3', 'Git'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'Bachelor\'s degree in related field or proven experience',
    deadline: '2026-11-15',
    status: 'Open',
    applicants_count: 18,
    created_at: '2026-09-02T11:00:00Z'
  },
  {
    id: 'job-3',
    title: 'Backend Developer',
    company: 'CloudSphere Labs',
    department: 'Platform Engineering',
    location: 'Austin, TX / Remote',
    employment_type: 'Full-time',
    salary: '$115,000 - $145,000',
    description: 'Join our cloud infrastructure team developing scalable distributed microservices in Node.js and Go.',
    responsibilities: [
      'Architect resilient backend services handling high-concurrency workloads',
      'Manage database schemas, indexing, and migrations in PostgreSQL and Redis',
      'Develop secure authentication and authorization systems (OAuth, JWT)',
      'Monitor application metrics and troubleshoot production bottlenecks'
    ],
    required_skills: ['Node.js', 'TypeScript', 'SQL', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'BS in Computer Science or Software Engineering',
    deadline: '2026-10-25',
    status: 'Open',
    applicants_count: 9,
    created_at: '2026-09-03T09:30:00Z'
  },
  {
    id: 'job-4',
    title: 'Full Stack Developer',
    company: 'Vanguard Health Tech',
    department: 'Product Development',
    location: 'Boston, MA / Remote',
    employment_type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: 'Drive end-to-end features for our digital health portal, bridging responsive React frontend and Node/Python services.',
    responsibilities: [
      'Deliver full-stack web applications from database schemas to polished browser UI',
      'Write clean, modular code with automated testing across stack layers',
      'Work alongside medical compliance officers to guarantee HIPAA standards'
    ],
    required_skills: ['React', 'Node.js', 'Python', 'SQL', 'TypeScript', 'Git'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'Bachelor\'s in Computer Science or related',
    deadline: '2026-11-01',
    status: 'Open',
    applicants_count: 15,
    created_at: '2026-09-04T14:15:00Z'
  },
  {
    id: 'job-5',
    title: 'React Developer',
    company: 'PixelPoint Digital',
    department: 'Engineering',
    location: 'Chicago, IL / Remote',
    employment_type: 'Full-time',
    salary: '$95,000 - $120,000',
    description: 'Specialist React Developer needed to craft interactive components and state management architectures.',
    responsibilities: [
      'Develop modern reusable UI libraries in React with Tailwind CSS',
      'Manage complex client state with React Query and Zustand',
      'Ensure WCAG 2.1 AA accessibility compliance'
    ],
    required_skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Redux/Zustand', 'REST APIs'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'Degree in CS or equivalent portfolio',
    deadline: '2026-10-20',
    status: 'Open',
    applicants_count: 8,
    created_at: '2026-09-05T08:00:00Z'
  },
  {
    id: 'job-6',
    title: 'Data Scientist',
    company: 'Quantis Analytics',
    department: 'Data & AI',
    location: 'Seattle, WA / Remote',
    employment_type: 'Full-time',
    salary: '$130,000 - $165,000',
    description: 'Build predictive machine learning models and extract actionable intelligence from large-scale customer behavioral data.',
    responsibilities: [
      'Formulate ML solutions for predictive forecasting and churn mitigation',
      'Conduct exploratory data analysis using Pandas, NumPy, and Scikit-Learn',
      'Deploy inference models via cloud containers'
    ],
    required_skills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Data Analysis', 'Statistics'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'Master\'s or BS in Data Science, Mathematics or CS',
    deadline: '2026-11-10',
    status: 'Open',
    applicants_count: 7,
    created_at: '2026-09-05T12:00:00Z'
  },
  {
    id: 'job-7',
    title: 'AI/ML Engineer',
    company: 'Synthetix AI',
    department: 'Applied Research',
    location: 'San Jose, CA / Remote',
    employment_type: 'Full-time',
    salary: '$140,000 - $180,000',
    description: 'Help develop generative AI pipelines, model fine-tuning workflows, and low-latency retrieval-augmented generation (RAG) services.',
    responsibilities: [
      'Build LLM-powered applications, embedding stores, and semantic search systems',
      'Fine-tune transformer models and evaluate output quality systematically',
      'Collaborate with backend engineers to deploy robust vector database pipelines'
    ],
    required_skills: ['Python', 'PyTorch', 'LLMs', 'Vector Databases', 'Docker', 'FastAPI'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'BS/MS in Computer Science or Artificial Intelligence',
    deadline: '2026-11-20',
    status: 'Open',
    applicants_count: 11,
    created_at: '2026-09-06T09:00:00Z'
  },
  {
    id: 'job-8',
    title: 'UI/UX Designer',
    company: 'Loomis Design Studio',
    department: 'Product Design',
    location: 'Denver, CO / Hybrid',
    employment_type: 'Full-time',
    salary: '$90,000 - $115,000',
    description: 'Create intuitive user experiences, wireframes, and design systems for enterprise SaaS applications.',
    responsibilities: [
      'Lead user research sessions, usability testing, and persona creation',
      'Deliver high-fidelity Figma prototypes and design token libraries',
      'Partner closely with frontend engineers during sprint implementation'
    ],
    required_skills: ['Figma', 'UI/UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'Degree in Interaction Design, HCI, or equivalent portfolio',
    deadline: '2026-10-31',
    status: 'Open',
    applicants_count: 14,
    created_at: '2026-09-06T15:30:00Z'
  },
  {
    id: 'job-9',
    title: 'DevOps Engineer',
    company: 'Strata Cloudworks',
    department: 'Infrastructure',
    location: 'Remote (US/Canada)',
    employment_type: 'Full-time',
    salary: '$125,000 - $155,000',
    description: 'Manage CI/CD pipelines, Kubernetes clusters, and automated cloud infrastructure with Terraform.',
    responsibilities: [
      'Maintain multi-region Kubernetes clusters on AWS/GCP',
      'Automate deployment pipelines and security scanning with GitHub Actions',
      'Implement observability suites using Prometheus and Grafana'
    ],
    required_skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Python'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'BS in Computer Science or relevant cloud certifications',
    deadline: '2026-11-05',
    status: 'Open',
    applicants_count: 6,
    created_at: '2026-09-07T10:00:00Z'
  },
  {
    id: 'job-10',
    title: 'Data Analyst',
    company: 'Beacon Insights',
    department: 'Business Intelligence',
    location: 'Atlanta, GA / Remote',
    employment_type: 'Full-time',
    salary: '$80,000 - $100,000',
    description: 'Transform complex business questions into clear executive dashboards and analytical reports.',
    responsibilities: [
      'Query relational databases using advanced SQL joins and window functions',
      'Build automated Tableau and PowerBI dashboards for executive stakeholders',
      'Collaborate with marketing and sales to track revenue KPIs'
    ],
    required_skills: ['SQL', 'Excel', 'Tableau', 'PowerBI', 'Python', 'Data Visualization'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'Bachelor\'s in Analytics, Business, Statistics, or Math',
    deadline: '2026-10-28',
    status: 'Open',
    applicants_count: 16,
    created_at: '2026-09-07T14:00:00Z'
  },
  {
    id: 'job-11',
    title: 'Software Engineer',
    company: 'OmniCore Software',
    department: 'Core Platform',
    location: 'Salt Lake City, UT / Hybrid',
    employment_type: 'Full-time',
    salary: '$105,000 - $135,000',
    description: 'Generalist software engineer eager to tackle architectural challenges across our web and mobile applications.',
    responsibilities: [
      'Write reliable, test-driven application code in TypeScript and Java/Go',
      'Participate in design reviews and maintain codebase hygiene',
      'Support client integration APIs and webhook systems'
    ],
    required_skills: ['TypeScript', 'JavaScript', 'SQL', 'Git', 'REST APIs', 'Java'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'BS in Computer Science or related degree',
    deadline: '2026-11-12',
    status: 'Open',
    applicants_count: 10,
    created_at: '2026-09-08T09:00:00Z'
  },
  {
    id: 'job-12',
    title: 'Digital Marketing Specialist',
    company: 'Horizon Brand Studio',
    department: 'Growth & Marketing',
    location: 'Miami, FL / Remote',
    employment_type: 'Full-time',
    salary: '$75,000 - $95,000',
    description: 'Drive candidate acquisition campaigns, employer branding, and digital talent outreach.',
    responsibilities: [
      'Manage multi-channel paid acquisition campaigns across LinkedIn and Google Ads',
      'Track conversion funnels and optimize CAC and candidate lead volumes',
      'Craft compelling recruitment copy and social media campaigns'
    ],
    required_skills: ['SEO', 'Google Ads', 'Content Marketing', 'Analytics', 'Social Media', 'Copywriting'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'Bachelor\'s in Marketing, Communications or Business',
    deadline: '2026-11-08',
    status: 'Open',
    applicants_count: 13,
    created_at: '2026-09-08T11:30:00Z'
  },
  {
    id: 'job-13',
    title: 'HR Executive',
    company: 'Talent Filter Headquarters',
    department: 'People Operations',
    location: 'Dallas, TX / Hybrid',
    employment_type: 'Full-time',
    salary: '$80,000 - $95,000',
    description: 'Coordinate talent acquisition lifecycles, conduct candidate screenings, and manage employee onboarding programs.',
    responsibilities: [
      'Screen incoming candidate profiles and coordinate with hiring managers',
      'Schedule technical and behavioral interviews across departments',
      'Oversee new hire onboarding and compliance records'
    ],
    required_skills: ['Talent Acquisition', 'HRIS', 'Communication', 'Interviewing', 'Onboarding', 'Employment Law'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'Bachelor\'s in Human Resources or Business Administration',
    deadline: '2026-10-29',
    status: 'Open',
    applicants_count: 19,
    created_at: '2026-09-08T16:00:00Z'
  },
  {
    id: 'job-14',
    title: 'Project Manager',
    company: 'Vanguard Global',
    department: 'Operations',
    location: 'Remote (US)',
    employment_type: 'Full-time',
    salary: '$110,000 - $135,000',
    description: 'Lead cross-functional engineering and design teams to deliver high-priority client deliverables on time.',
    responsibilities: [
      'Facilitate agile sprint planning, backlog grooming, and daily standups',
      'Track project milestones and manage risk mitigation plans',
      'Communicate delivery timelines clearly to senior executive leadership'
    ],
    required_skills: ['Agile', 'Scrum', 'Jira', 'Project Planning', 'Risk Management', 'Stakeholder Communication'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'BS/BA Degree, PMP/Scrum certification preferred',
    deadline: '2026-11-02',
    status: 'Open',
    applicants_count: 11,
    created_at: '2026-09-09T08:00:00Z'
  }
];

const initialPlacements: Placement[] = [
  {
    id: 'plc-1',
    candidate_id: 'cand-sarah',
    job_id: 'job-2',
    candidate_name: 'Sarah Ahmed',
    job_title: 'Frontend Developer',
    company: 'Nova Interactive',
    hired_date: 'Yesterday',
    announcement: 'Sarah Ahmed was matched with a Frontend Developer role at Nova Interactive through Talent Filter.',
    created_at: '2026-09-09T14:30:00Z'
  },
  {
    id: 'plc-2',
    candidate_id: 'cand-david',
    job_id: 'job-9',
    candidate_name: 'David Chen',
    job_title: 'DevOps Engineer',
    company: 'Strata Cloudworks',
    hired_date: '3 days ago',
    announcement: 'David Chen was successfully placed as Senior DevOps Engineer at Strata Cloudworks with a 94% skills match score.',
    created_at: '2026-09-07T16:00:00Z'
  },
  {
    id: 'plc-3',
    candidate_id: 'cand-elena',
    job_id: 'job-6',
    candidate_name: 'Elena Rostova',
    job_title: 'Data Scientist',
    company: 'Quantis Analytics',
    hired_date: '5 days ago',
    announcement: 'Elena Rostova joined Quantis Analytics as Data Scientist after screening through Talent Filter.',
    created_at: '2026-09-05T10:15:00Z'
  }
];

const initialCandidates: Candidate[] = [
  {
    id: 'cand-ahmad-khan',
    name: 'Ahmad Khan',
    email: 'ahmad.khan.dev@example.com',
    phone: '+1 (555) 234-8901',
    profession: 'Senior Python & AI Engineer',
    skills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'PyTorch', 'LLMs', 'Redis', 'AWS'],
    education: 'BS in Computer Science, University of Washington',
    experience: '5+ years building distributed Python microservices and generative AI services.',
    experience_years: 5,
    certifications: ['AWS Certified Solutions Architect', 'TensorFlow Developer Certificate'],
    projects: ['Automated Document Parser API', 'High-throughput RAG Pipeline'],
    summary: 'Full-stack Python specialist experienced in asynchronous backend systems and LLM integrations.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cand-sarah-ahmed',
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    phone: '+1 (555) 345-6789',
    profession: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'GraphQL', 'Jest'],
    education: 'BS in Software Engineering, UC Berkeley',
    experience: '4 years creating responsive enterprise web applications and design systems.',
    experience_years: 4,
    certifications: ['Meta Certified Frontend Developer'],
    projects: ['Component Design System', 'E-commerce Checkout Microfrontend'],
    summary: 'Expert in modern React architectures, state management, and accessible UI engineering.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cand-marcus-vance',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '+1 (555) 456-7890',
    profession: 'Full-Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript', 'Express', 'MongoDB', 'Docker', 'RESTful APIs'],
    education: 'BS in Information Systems, NYU',
    experience: '3.5 years full stack development delivering end-to-end web platforms.',
    experience_years: 3.5,
    certifications: ['Node.js Application Developer'],
    projects: ['Realtime Project Management App'],
    summary: 'Versatile full-stack engineer bridging modern React interfaces with Node.js APIs.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cand-emily-zhang',
    name: 'Emily Zhang',
    email: 'emily.zhang@example.com',
    phone: '+1 (555) 567-8901',
    profession: 'Cloud DevOps Specialist',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Python'],
    education: 'BS in Computer Engineering, Georgia Tech',
    experience: '4.5 years implementing automated multi-region Kubernetes deployments and CI/CD pipelines.',
    experience_years: 4.5,
    certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS DevOps Engineer Professional'],
    projects: ['Zero-Downtime Migration Cluster', 'Multi-tenant GitOps Workflow'],
    summary: 'Dedicated infrastructure automation engineer specializing in container orchestration and declarative cloud architecture.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cand-david-kim',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 678-9012',
    profession: 'Machine Learning Engineer',
    skills: ['Python', 'PyTorch', 'LLMs', 'Transformers', 'Vector Databases', 'Docker', 'FastAPI'],
    education: 'MS in Artificial Intelligence, Carnegie Mellon University',
    experience: '4 years fine-tuning transformer foundation models and building enterprise semantic search engines.',
    experience_years: 4,
    certifications: ['DeepLearning.AI Generative AI Specialist'],
    projects: ['High-throughput Vector Search Engine', 'Medical Domain LLM Fine-tuning'],
    summary: 'Applied AI researcher proficient in deploying production RAG architectures and low-latency inference endpoints.',
    created_at: '2026-09-09T14:20:00Z',
    updated_at: '2026-09-09T14:20:00Z'
  },
  {
    id: 'cand-priya-patel',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+1 (555) 789-0123',
    profession: 'Technical Product Manager',
    skills: ['Product Management', 'Agile/Scrum', 'Data Analysis', 'Jira', 'User Research', 'SQL'],
    education: 'MBA & BS in Computer Science, Northwestern University',
    experience: '5 years directing cross-functional SaaS product teams from discovery through global release.',
    experience_years: 5,
    certifications: ['Certified Scrum Product Owner (CSPO)'],
    projects: ['B2B Enterprise Analytics Portal', 'Automated Onboarding Funnel'],
    summary: 'Data-driven Product Manager with deep technical acumen aligning engineering throughput with high-impact customer outcomes.',
    created_at: '2026-09-08T11:00:00Z',
    updated_at: '2026-09-08T11:00:00Z'
  },
  {
    id: 'cand-alex-miller',
    name: 'Alex Miller',
    email: 'alex.miller@example.com',
    phone: '+1 (555) 890-1234',
    profession: 'Senior Data Platform Engineer',
    skills: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Snowflake', 'dbt', 'Docker'],
    education: 'BS in Computer Science, University of Illinois',
    experience: '4 years constructing high-volume event streaming architectures and analytical warehouses.',
    experience_years: 4,
    certifications: ['Snowflake SnowPro Core Certified', 'Databricks Spark Developer'],
    projects: ['Streaming Telemetry Ingestion Cluster', 'Enterprise Data Mesh'],
    summary: 'Senior Data Engineer experienced in building distributed streaming pipelines and analytical data platforms.',
    created_at: '2026-09-07T16:00:00Z',
    updated_at: '2026-09-07T16:00:00Z'
  }
];

const initialApplications: Application[] = [
  {
    id: 'app-seed-1',
    candidate_id: 'cand-ahmad-khan',
    job_id: 'job-1',
    match_score: 95,
    skills_score: 96,
    experience_score: 95,
    education_score: 94,
    matched_skills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'AWS'],
    missing_skills: ['Kubernetes'],
    match_reasons: [
      'Strong 5-year Python background matching Senior requirements',
      'Extensive FastAPI and asynchronous microservice expertise',
      'Solid Docker and cloud containerization credentials'
    ],
    status: 'Shortlisted',
    applied_at: '2026-09-08T10:15:00Z',
    updated_at: '2026-09-08T12:00:00Z'
  },
  {
    id: 'app-seed-2',
    candidate_id: 'cand-sarah-ahmed',
    job_id: 'job-2',
    match_score: 92,
    skills_score: 94,
    experience_score: 90,
    education_score: 92,
    matched_skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux'],
    missing_skills: ['Webpack'],
    match_reasons: [
      'Exceptional React & TypeScript production experience',
      'Proven expertise with modern Tailwind and responsive layouts',
      'Strong track record in enterprise design system modularity'
    ],
    status: 'Interview Scheduled',
    applied_at: '2026-09-08T11:45:00Z',
    updated_at: '2026-09-09T09:00:00Z'
  },
  {
    id: 'app-seed-3',
    candidate_id: 'cand-marcus-vance',
    job_id: 'job-3',
    match_score: 88,
    skills_score: 89,
    experience_score: 86,
    education_score: 90,
    matched_skills: ['React', 'Node.js', 'TypeScript', 'Express', 'RESTful APIs'],
    missing_skills: ['GraphQL', 'AWS'],
    match_reasons: [
      'Well-balanced full-stack competencies spanning React and Node.js',
      'Proficient in robust REST API development and data persistence'
    ],
    status: 'Under Review',
    applied_at: '2026-09-09T08:30:00Z',
    updated_at: '2026-09-09T08:30:00Z'
  },
  {
    id: 'app-seed-4',
    candidate_id: 'cand-emily-zhang',
    job_id: 'job-4',
    match_score: 94,
    skills_score: 95,
    experience_score: 93,
    education_score: 94,
    matched_skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
    missing_skills: ['Helm'],
    match_reasons: [
      'Certified Kubernetes Administrator with hands-on Terraform infrastructure',
      'Extensive experience managing multi-region automated CI/CD deployments'
    ],
    status: 'Interview Scheduled',
    applied_at: '2026-09-09T10:00:00Z',
    updated_at: '2026-09-09T11:30:00Z'
  },
  {
    id: 'app-seed-5',
    candidate_id: 'cand-david-kim',
    job_id: 'job-5',
    match_score: 91,
    skills_score: 93,
    experience_score: 88,
    education_score: 96,
    matched_skills: ['Python', 'PyTorch', 'LLMs', 'Transformers', 'Docker'],
    missing_skills: ['C++'],
    match_reasons: [
      'Master in AI with proven transformer fine-tuning research experience',
      'Deep practical knowledge of vector database indexing and RAG architectures'
    ],
    status: 'Shortlisted',
    applied_at: '2026-09-09T15:00:00Z',
    updated_at: '2026-09-09T16:00:00Z'
  },
  {
    id: 'app-seed-6',
    candidate_id: 'cand-priya-patel',
    job_id: 'job-7',
    match_score: 89,
    skills_score: 90,
    experience_score: 90,
    education_score: 88,
    matched_skills: ['Product Management', 'Agile/Scrum', 'Data Analysis', 'Jira', 'User Research'],
    missing_skills: ['Python'],
    match_reasons: [
      'Proven leadership delivering B2B SaaS software products',
      'Strong analytical capabilities bridging business objectives and sprint deliverables'
    ],
    status: 'Interview Scheduled',
    applied_at: '2026-09-09T16:30:00Z',
    updated_at: '2026-09-10T08:00:00Z'
  },
  {
    id: 'app-seed-7',
    candidate_id: 'cand-alex-miller',
    job_id: 'job-6',
    match_score: 96,
    skills_score: 97,
    experience_score: 95,
    education_score: 94,
    matched_skills: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Snowflake', 'dbt'],
    missing_skills: [],
    match_reasons: [
      'Complete tech stack alignment with Spark, Kafka, and Snowflake',
      '4+ years building high-throughput production data platforms'
    ],
    status: 'Hired',
    applied_at: '2026-09-07T16:30:00Z',
    updated_at: '2026-09-09T17:00:00Z'
  },
  {
    id: 'app-seed-8',
    candidate_id: 'cand-ahmad-khan',
    job_id: 'job-3',
    match_score: 85,
    skills_score: 86,
    experience_score: 88,
    education_score: 90,
    matched_skills: ['React', 'TypeScript', 'PostgreSQL', 'RESTful APIs'],
    missing_skills: ['Node.js'],
    match_reasons: [
      'Strong general engineering and database credentials',
      'Capable frontend competencies in React and TypeScript'
    ],
    status: 'Under Review',
    applied_at: '2026-09-10T08:15:00Z',
    updated_at: '2026-09-10T08:15:00Z'
  }
];

const initialInterviews: Interview[] = [
  {
    id: 'int-seed-1',
    candidate_id: 'cand-sarah-ahmed',
    job_id: 'job-2',
    interviewer: 'Sarah Jenkins (HR Director)',
    interview_date: '2026-09-18',
    interview_time: '11:00 AM',
    interview_type: 'Online',
    meeting_link: 'https://meet.google.com/talent-filter-room',
    instructions: 'Technical frontend architecture review, state management evaluation, and live component coding walkthrough.',
    status: 'Scheduled',
    created_at: '2026-09-09T09:00:00Z'
  },
  {
    id: 'int-seed-2',
    candidate_id: 'cand-emily-zhang',
    job_id: 'job-4',
    interviewer: 'David Cho (VP of Infrastructure)',
    interview_date: '2026-09-19',
    interview_time: '02:00 PM',
    interview_type: 'Online',
    meeting_link: 'https://meet.google.com/talent-devops-room',
    instructions: 'Kubernetes cluster deployment, CI/CD pipeline automation, and Terraform best practices review.',
    status: 'Scheduled',
    created_at: '2026-09-09T11:30:00Z'
  },
  {
    id: 'int-seed-3',
    candidate_id: 'cand-ahmad-khan',
    job_id: 'job-1',
    interviewer: 'Sarah Jenkins (HR Director)',
    interview_date: '2026-09-20',
    interview_time: '10:30 AM',
    interview_type: 'Online',
    meeting_link: 'https://meet.google.com/talent-python-room',
    instructions: 'Distributed microservices architecture, async FastAPI pipelines, and high-throughput PostgreSQL scaling.',
    status: 'Scheduled',
    created_at: '2026-09-10T08:30:00Z'
  },
  {
    id: 'int-seed-4',
    candidate_id: 'cand-priya-patel',
    job_id: 'job-7',
    interviewer: 'Mark Sterling (Chief Product Officer)',
    interview_date: '2026-09-21',
    interview_time: '04:00 PM',
    interview_type: 'Online',
    meeting_link: 'https://meet.google.com/talent-pm-room',
    instructions: 'Product roadmap alignment, stakeholder metrics definition, and customer journey optimization.',
    status: 'Scheduled',
    created_at: '2026-09-10T08:00:00Z'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-seed-1',
    candidate_id: 'cand-sarah-ahmed',
    type: 'interview_invitation',
    channel: 'email',
    recipient: 'sarah.ahmed@example.com',
    subject: 'Interview Invitation — Frontend React Developer at PixelPulse Studios',
    message: 'Dear Sarah Ahmed,\n\nYou are invited to an interview for Frontend React Developer on 2026-09-18 at 11:00 AM via Google Meet.',
    status: 'Sent',
    sent_at: '2026-09-09T09:00:00Z'
  },
  {
    id: 'notif-seed-2',
    candidate_id: 'cand-sarah-ahmed',
    type: 'interview_invitation',
    channel: 'email',
    recipient: 'kubrakhan585130@gmail.com',
    subject: '[HR Calendar] Interview Confirmed: Sarah Ahmed — Frontend React Developer',
    message: 'Interview scheduled on 2026-09-18 at 11:00 AM with Sarah Ahmed (Online). Meeting: https://meet.google.com/talent-filter-room',
    status: 'Sent',
    sent_at: '2026-09-09T09:00:00Z'
  },
  {
    id: 'notif-seed-3',
    candidate_id: 'cand-ahmad-khan',
    type: 'application_received',
    channel: 'email',
    recipient: 'kubrakhan585130@gmail.com',
    subject: '[HR Alert] New Candidate Application: Ahmad Khan (95% Match)',
    message: 'Candidate: Ahmad Khan (ahmad.khan.dev@example.com)\nPosition: Senior Python Developer (HyperScale Cloud)\nTalent Filter Score: 95%\nStatus: Under Review',
    status: 'Sent',
    sent_at: '2026-09-08T10:15:00Z'
  },
  {
    id: 'notif-seed-4',
    candidate_id: 'cand-emily-zhang',
    type: 'interview_invitation',
    channel: 'email',
    recipient: 'emily.zhang@example.com',
    subject: 'Interview Invitation — Cloud DevOps Specialist at CloudScale Matrix',
    message: 'Dear Emily Zhang,\n\nYou have been invited to interview on 2026-09-19 at 02:00 PM with David Cho.',
    status: 'Sent',
    sent_at: '2026-09-09T11:30:00Z'
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(raw);
        if (parsed.candidates && parsed.candidates.length > 0 && parsed.interviews && parsed.interviews.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse existing DB file, reinitializing', err);
      }
    }

    const defaultData: DatabaseSchema = {
      jobs: initialJobs,
      candidates: initialCandidates,
      applications: initialApplications,
      interviews: initialInterviews,
      notifications: initialNotifications,
      placements: initialPlacements,
      activities: []
    };

    this.saveDataDirect(defaultData);
    return defaultData;
  }

  private saveData() {
    this.saveDataDirect(this.data);
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (e) {
      console.warn('Filesystem write not permitted or failed, state preserved in memory:', e);
    }
  }

  // --- Jobs ---
  public getJobs(): Job[] {
    return [...this.data.jobs];
  }

  public getJob(id: string): Job | undefined {
    return this.data.jobs.find(j => j.id === id);
  }

  public addJob(jobData: Omit<Job, 'id' | 'applicants_count' | 'created_at'>): Job {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      applicants_count: 0,
      created_at: new Date().toISOString()
    };
    this.data.jobs.unshift(newJob);
    this.saveData();
    return newJob;
  }

  public updateJob(id: string, updates: Partial<Job>): Job | null {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.data.jobs[idx] = { ...this.data.jobs[idx], ...updates };
    this.saveData();
    return this.data.jobs[idx];
  }

  public deleteJob(id: string): boolean {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return false;
    this.data.jobs.splice(idx, 1);
    this.saveData();
    return true;
  }

  // --- Candidates ---
  public getCandidates(): Candidate[] {
    return [...this.data.candidates];
  }

  public getCandidate(id: string): Candidate | undefined {
    return this.data.candidates.find(c => c.id === id);
  }

  public getCandidateByEmail(email: string): Candidate | undefined {
    return this.data.candidates.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  public saveCandidate(candData: Omit<Candidate, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Candidate {
    const now = new Date().toISOString();
    let candidate: Candidate;

    if (candData.id) {
      const idx = this.data.candidates.findIndex(c => c.id === candData.id);
      if (idx !== -1) {
        candidate = {
          ...this.data.candidates[idx],
          ...candData,
          updated_at: now
        };
        this.data.candidates[idx] = candidate;
        this.saveData();
        return candidate;
      }
    }

    // Check if email already exists
    const existing = this.getCandidateByEmail(candData.email);
    if (existing) {
      candidate = {
        ...existing,
        ...candData,
        updated_at: now
      };
      const idx = this.data.candidates.findIndex(c => c.id === existing.id);
      this.data.candidates[idx] = candidate;
      this.saveData();
      return candidate;
    }

    candidate = {
      ...candData,
      id: candData.id || `cand-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: now,
      updated_at: now
    };
    this.data.candidates.unshift(candidate);
    this.saveData();
    return candidate;
  }

  // --- Applications ---
  public getApplications(): Application[] {
    return this.data.applications.map(app => {
      const candidate = this.getCandidate(app.candidate_id);
      const job = this.getJob(app.job_id);
      return {
        ...app,
        candidate,
        job
      };
    });
  }

  public getCandidateApplications(candidateId: string): Application[] {
    return this.getApplications().filter(a => a.candidate_id === candidateId);
  }

  public getApplication(id: string): Application | undefined {
    return this.getApplications().find(a => a.id === id);
  }

  public findApplication(candidateId: string, jobId: string): Application | undefined {
    return this.data.applications.find(a => a.candidate_id === candidateId && a.job_id === jobId);
  }

  public createApplication(appData: Omit<Application, 'id' | 'applied_at' | 'updated_at'>): Application {
    const now = new Date().toISOString();
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      applied_at: now,
      updated_at: now
    };
    this.data.applications.unshift(newApp);

    // Increment applicants_count in job
    const job = this.getJob(appData.job_id);
    if (job) {
      this.updateJob(job.id, { applicants_count: (job.applicants_count || 0) + 1 });
    }

    this.saveData();
    return this.getApplication(newApp.id) || newApp;
  }

  public updateApplicationStatus(id: string, status: Application['status']): Application | null {
    const idx = this.data.applications.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.applications[idx].status = status;
    this.data.applications[idx].updated_at = new Date().toISOString();
    this.saveData();
    return this.getApplication(id) || this.data.applications[idx];
  }

  // --- Interviews ---
  public getInterviews(): Interview[] {
    return this.data.interviews.map(item => ({
      ...item,
      candidate: this.getCandidate(item.candidate_id),
      job: this.getJob(item.job_id)
    }));
  }

  public getCandidateInterviews(candidateId: string): Interview[] {
    return this.getInterviews().filter(i => i.candidate_id === candidateId);
  }

  public scheduleInterview(interviewData: Omit<Interview, 'id' | 'created_at'>): Interview {
    const newInterview: Interview = {
      ...interviewData,
      id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.data.interviews.unshift(newInterview);

    // Also update application status if exists
    const app = this.findApplication(interviewData.candidate_id, interviewData.job_id);
    if (app) {
      this.updateApplicationStatus(app.id, 'Interview Scheduled');
    }

    this.saveData();
    return this.getInterviews().find(i => i.id === newInterview.id) || newInterview;
  }

  public updateInterviewStatus(id: string, status: Interview['status']): Interview | null {
    const idx = this.data.interviews.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.data.interviews[idx].status = status;
    this.saveData();
    return this.getInterviews().find(i => i.id === id) || this.data.interviews[idx];
  }

  // --- Notifications ---
  public getNotifications(): Notification[] {
    return [...this.data.notifications];
  }

  public addNotification(notification: Omit<Notification, 'id' | 'sent_at'>): Notification {
    const item: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sent_at: new Date().toISOString()
    };
    this.data.notifications.unshift(item);
    this.saveData();
    return item;
  }

  // --- Placements (Success Stories) ---
  public getPlacements(): Placement[] {
    return [...this.data.placements];
  }

  public recordPlacement(placementData: Omit<Placement, 'id' | 'created_at'>): Placement {
    const newPlacement: Placement = {
      ...placementData,
      id: `plc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.data.placements.unshift(newPlacement);

    // Update application status to Hired
    const app = this.findApplication(placementData.candidate_id, placementData.job_id);
    if (app) {
      this.updateApplicationStatus(app.id, 'Hired');
    }

    this.saveData();
    return newPlacement;
  }

  // --- Candidate Activity History ---
  public getActivities(candidateId?: string): CandidateActivity[] {
    if (!candidateId) return [...this.data.activities];
    return this.data.activities.filter(a => a.candidate_id === candidateId);
  }

  public logActivity(candidateId: string, action: string, details: string): CandidateActivity {
    const item: CandidateActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      candidate_id: candidateId,
      action,
      details,
      created_at: new Date().toISOString()
    };
    this.data.activities.unshift(item);
    this.saveData();
    return item;
  }

  // --- Dashboard Stats ---
  public getStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const totalJobs = this.data.jobs.filter(j => j.status === 'Open').length;
    const totalCandidates = this.data.candidates.length;
    const newCvsToday = this.data.candidates.filter(c => c.created_at >= startOfToday).length;
    const totalApplications = this.data.applications.length;
    const shortlistedCount = this.data.applications.filter(a => a.status === 'Shortlisted').length;
    const interviewsCount = this.data.interviews.filter(i => i.status === 'Scheduled').length;
    const hiredCount = this.data.placements.length;

    return {
      totalJobs,
      totalCandidates,
      newCvsToday,
      totalApplications,
      shortlistedCount,
      interviewsCount,
      hiredCount
    };
  }

  // Reset/seed helper for testing
  public resetToSeed() {
    this.data = {
      jobs: initialJobs,
      candidates: initialCandidates,
      applications: initialApplications,
      interviews: initialInterviews,
      notifications: initialNotifications,
      placements: initialPlacements,
      activities: []
    };
    this.saveData();
  }
}

export const db = new Database();
