import { Job, Candidate, Application, Interview, Notification, Placement, DashboardStats } from '../types';

export const seedJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Python Developer',
    company: 'HyperScale Cloud',
    department: 'Engineering',
    location: 'Remote / US',
    employment_type: 'Full-time',
    salary: '$140,000 - $175,000',
    description: 'Lead backend microservices development, high-throughput distributed systems, and modern AI API integrations using Python, FastAPI, and Docker.',
    responsibilities: [
      'Architect robust, asynchronous REST & GraphQL APIs using FastAPI and Python 3.12',
      'Optimize database queries on PostgreSQL and cache layers with Redis',
      'Containerize applications with Docker and deploy to Kubernetes',
      'Collaborate with AI researchers to deploy LLM inference microservices'
    ],
    required_skills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Redis', 'AWS'],
    experience_required: '4+ years',
    min_experience_years: 4,
    education_required: 'Bachelor in Computer Science or equivalent',
    deadline: '2026-10-15',
    status: 'Open',
    applicants_count: 14,
    created_at: '2026-09-01T08:00:00Z'
  },
  {
    id: 'job-2',
    title: 'Frontend React Developer',
    company: 'PixelPulse Studios',
    department: 'Design & Frontend',
    location: 'San Francisco, CA (Hybrid)',
    employment_type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: 'Build sleek, accessible web applications and reusable design system components using modern React 19, TypeScript, and Tailwind CSS.',
    responsibilities: [
      'Develop pixel-perfect web interfaces with high test coverage and accessibility standards',
      'Maintain and expand our core Tailwind design token library and UI component suite',
      'Optimize client-side performance, core web vitals, and SPA load times'
    ],
    required_skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'Bachelor in Software Engineering or equivalent experience',
    deadline: '2026-10-20',
    status: 'Open',
    applicants_count: 18,
    created_at: '2026-09-02T09:00:00Z'
  },
  {
    id: 'job-3',
    title: 'Full-Stack Node.js Engineer',
    company: 'FinTech Horizons',
    department: 'Product Development',
    location: 'New York, NY (Hybrid)',
    employment_type: 'Full-time',
    salary: '$130,000 - $160,000',
    description: 'Work across the entire stack delivering financial transaction services, user authentication flows, and real-time ledger dashboards.',
    responsibilities: [
      'Implement mission-critical financial backend services in Node.js and TypeScript',
      'Connect responsive React frontend components to resilient backend endpoints',
      'Ensure strict PCI-DSS security compliance, audit logging, and automated testing'
    ],
    required_skills: ['React', 'Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'RESTful APIs'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'Bachelor in Computer Science, Math, or related field',
    deadline: '2026-10-18',
    status: 'Open',
    applicants_count: 11,
    created_at: '2026-09-03T10:00:00Z'
  },
  {
    id: 'job-4',
    title: 'Cloud DevOps Specialist',
    company: 'CloudScale Matrix',
    department: 'Platform Engineering',
    location: 'Remote',
    employment_type: 'Full-time',
    salary: '$135,000 - $170,000',
    description: 'Manage continuous deployment pipelines, Kubernetes cluster orchestration, and infrastructure-as-code across AWS and Google Cloud.',
    responsibilities: [
      'Manage multi-region Kubernetes clusters with Terraform and Helm',
      'Build zero-downtime CI/CD workflows using GitHub Actions and ArgoCD',
      'Implement Prometheus and Grafana observability monitoring'
    ],
    required_skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
    experience_required: '4+ years',
    min_experience_years: 4,
    education_required: 'BS in Computer Science or equivalent',
    deadline: '2026-10-25',
    status: 'Open',
    applicants_count: 9,
    created_at: '2026-09-04T11:00:00Z'
  },
  {
    id: 'job-5',
    title: 'AI / ML Research Engineer',
    company: 'NeuralCognition Labs',
    department: 'Data & AI',
    location: 'Boston, MA (Hybrid)',
    employment_type: 'Full-time',
    salary: '$160,000 - $210,000',
    description: 'Train, fine-tune, and deploy state-of-the-art transformer architectures, multimodal models, and retrieval-augmented generation pipelines.',
    responsibilities: [
      'Research and implement state-of-the-art LLM fine-tuning methodologies (LoRA, QLoRA)',
      'Construct high-speed vector embeddings search clusters with FAISS and pgvector',
      'Benchmark model hallucinations and inference latencies'
    ],
    required_skills: ['Python', 'PyTorch', 'LLMs', 'Transformers', 'Vector Databases', 'Docker'],
    experience_required: '4+ years',
    min_experience_years: 4,
    education_required: 'Master or PhD in AI, Computer Science, or Robotics',
    deadline: '2026-10-30',
    status: 'Open',
    applicants_count: 7,
    created_at: '2026-09-05T08:30:00Z'
  },
  {
    id: 'job-6',
    title: 'Data Platform Engineer',
    company: 'Quantis Analytics',
    department: 'Infrastructure',
    location: 'Chicago, IL (Hybrid)',
    employment_type: 'Full-time',
    salary: '$125,000 - $155,000',
    description: 'Construct real-time and batch ETL pipelines processing tens of terabytes of telemetry data using Apache Spark, Kafka, and Snowflake.',
    responsibilities: [
      'Design reliable streaming pipelines with Apache Kafka and Apache Spark',
      'Manage data warehouse schemas in Snowflake with dbt transformations',
      'Optimize SQL queries and data partitions for high-throughput reporting'
    ],
    required_skills: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Snowflake', 'dbt'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'Bachelor in Computer Science, Data Science, or related field',
    deadline: '2026-11-05',
    status: 'Open',
    applicants_count: 8,
    created_at: '2026-09-06T09:15:00Z'
  },
  {
    id: 'job-7',
    title: 'Technical Product Manager',
    company: 'AgileVentures',
    department: 'Product Development',
    location: 'Austin, TX (Remote Available)',
    employment_type: 'Full-time',
    salary: '$135,000 - $165,000',
    description: 'Bridge engineering teams and enterprise customers, translating customer pain points into prioritized engineering roadmaps and PRDs.',
    responsibilities: [
      'Define clear technical specs, user stories, and acceptance criteria for engineering sprints',
      'Conduct user interviews, qualitative usability testing, and metric reviews',
      'Lead quarterly roadmapping and cross-functional feature launches'
    ],
    required_skills: ['Product Management', 'Agile/Scrum', 'Data Analysis', 'Jira', 'User Research'],
    experience_required: '4+ years',
    min_experience_years: 4,
    education_required: 'Bachelor degree in Business, Tech, or equivalent experience',
    deadline: '2026-11-10',
    status: 'Open',
    applicants_count: 12,
    created_at: '2026-09-06T14:00:00Z'
  },
  {
    id: 'job-8',
    title: 'Lead Security Engineer',
    company: 'CyberShield Inc.',
    department: 'Security & Compliance',
    location: 'Washington, DC / Remote',
    employment_type: 'Full-time',
    salary: '$150,000 - $190,000',
    description: 'Safeguard cloud infrastructures, conduct vulnerability assessments, implement zero-trust access, and maintain SOC2 compliance.',
    responsibilities: [
      'Lead automated penetration tests, vulnerability scans, and code audits',
      'Implement zero-trust network access (ZTNA) and strict IAM policies',
      'Conduct incident response drills and post-mortem investigations'
    ],
    required_skills: ['Cybersecurity', 'SOC2', 'Penetration Testing', 'AWS Security', 'Network Security'],
    experience_required: '5+ years',
    min_experience_years: 5,
    education_required: 'Bachelor in Cybersecurity, CS, or CISSP certification',
    deadline: '2026-11-12',
    status: 'Open',
    applicants_count: 6,
    created_at: '2026-09-07T11:20:00Z'
  },
  {
    id: 'job-9',
    title: 'UI / UX Product Designer',
    company: 'VividInterface',
    department: 'Design & Frontend',
    location: 'Remote',
    employment_type: 'Contract',
    salary: '$75 - $95 / hr',
    description: 'Create responsive web and mobile application prototypes, user flows, and complete Figma design systems with high typography craft.',
    responsibilities: [
      'Design modular wireframes, prototypes, and final UI screens in Figma',
      'Run rapid usability tests with actual users and synthesize findings',
      'Collaborate closely with frontend developers during component handoffs'
    ],
    required_skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'Degree in Graphic Design, HCI, or portfolio proof',
    deadline: '2026-10-28',
    status: 'Open',
    applicants_count: 15,
    created_at: '2026-09-07T15:45:00Z'
  },
  {
    id: 'job-10',
    title: 'Mobile App Developer (React Native)',
    company: 'AppVenture Global',
    department: 'Mobile Engineering',
    location: 'Seattle, WA (Hybrid)',
    employment_type: 'Full-time',
    salary: '$115,000 - $145,000',
    description: 'Deliver cross-platform iOS and Android mobile applications featuring smooth 60fps animations, offline persistence, and push notifications.',
    responsibilities: [
      'Build performant mobile features using React Native and TypeScript',
      'Manage App Store and Google Play release pipelines with Fastlane',
      'Diagnose native thread performance bottlenecks and memory leaks'
    ],
    required_skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Mobile Performance'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'BS in Computer Science or Software Engineering',
    deadline: '2026-11-15',
    status: 'Open',
    applicants_count: 10,
    created_at: '2026-09-08T09:00:00Z'
  },
  {
    id: 'job-11',
    title: 'Quality Assurance Automation Engineer',
    company: 'TestRig Technologies',
    department: 'Quality Engineering',
    location: 'Remote',
    employment_type: 'Full-time',
    salary: '$100,000 - $125,000',
    description: 'Build automated end-to-end testing suites using Playwright, Cypress, and Jest to prevent regression bugs in production releases.',
    responsibilities: [
      'Write end-to-end regression suites using Playwright and TypeScript',
      'Integrate synthetic monitoring checks into GitHub Actions CI/CD pipelines',
      'Perform stress testing and API contract verification'
    ],
    required_skills: ['Playwright', 'Cypress', 'TypeScript', 'Jest', 'CI/CD', 'API Testing'],
    experience_required: '2+ years',
    min_experience_years: 2,
    education_required: 'Bachelor in CS, IT, or equivalent experience',
    deadline: '2026-11-20',
    status: 'Open',
    applicants_count: 8,
    created_at: '2026-09-08T13:30:00Z'
  },
  {
    id: 'job-12',
    title: 'Site Reliability Engineer (SRE)',
    company: 'Apex Cloud Systems',
    department: 'Infrastructure',
    location: 'Remote',
    employment_type: 'Full-time',
    salary: '$140,000 - $180,000',
    description: 'Ensure 99.99% uptime for global microservices clusters, establishing SLOs, error budgets, on-call runbooks, and chaos engineering drills.',
    responsibilities: [
      'Establish Service Level Objectives (SLOs) and automated alerting rules',
      'Conduct chaos engineering simulations to identify failover weaknesses',
      'Automate incident remediation scripts in Go or Python'
    ],
    required_skills: ['Linux', 'Kubernetes', 'Python', 'Go', 'Prometheus', 'Datadog'],
    experience_required: '4+ years',
    min_experience_years: 4,
    education_required: 'Bachelor in Computer Science or Computer Engineering',
    deadline: '2026-11-25',
    status: 'Open',
    applicants_count: 5,
    created_at: '2026-09-09T10:00:00Z'
  },
  {
    id: 'job-13',
    title: 'Junior Backend Developer',
    company: 'GrowthForge Labs',
    department: 'Engineering',
    location: 'Remote / US',
    employment_type: 'Full-time',
    salary: '$85,000 - $105,000',
    description: 'Great entry-level engineering role to build backend REST APIs, write database migrations, and learn scalable cloud architectures.',
    responsibilities: [
      'Write unit tests and develop straightforward CRUD endpoints under senior mentorship',
      'Collaborate in agile daily standups, code reviews, and pair-programming sessions',
      'Document API parameters in OpenAPI / Swagger specifications'
    ],
    required_skills: ['Python', 'Node.js', 'SQL', 'Git', 'REST APIs'],
    experience_required: '1+ years',
    min_experience_years: 1,
    education_required: 'BS in Computer Science or Software Engineering Boot Camp',
    deadline: '2026-11-30',
    status: 'Open',
    applicants_count: 24,
    created_at: '2026-09-09T14:15:00Z'
  },
  {
    id: 'job-14',
    title: 'Backend Rust Engineer',
    company: 'HighVelocity Systems',
    department: 'Core Platform',
    location: 'Remote',
    employment_type: 'Full-time',
    salary: '$150,000 - $195,000',
    description: 'Build ultra-low latency transaction engines, memory-safe network protocols, and high-concurrency event brokers in modern Rust.',
    responsibilities: [
      'Develop high-throughput networking services with Tokio async runtime',
      'Design zero-allocation memory data structures for high-speed packet processing',
      'Benchmark throughput and latency under heavy concurrency workloads'
    ],
    required_skills: ['Rust', 'Tokio', 'Async Systems', 'Linux Internals', 'Networking'],
    experience_required: '3+ years',
    min_experience_years: 3,
    education_required: 'BS in Computer Science or Systems Engineering',
    deadline: '2026-12-01',
    status: 'Open',
    applicants_count: 7,
    created_at: '2026-09-10T08:00:00Z'
  }
];

export const seedCandidates: Candidate[] = [
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
    summary: 'Full-stack Python specialist experienced in asynchronous backend systems, FastAPI microservices, and LLM integrations.',
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
    experience: '4 years creating responsive enterprise web applications and scalable design systems.',
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

export const seedApplications: Application[] = [
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

export const seedInterviews: Interview[] = [
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

export const seedPlacements: Placement[] = [
  {
    id: 'plc-1',
    candidate_id: 'cand-alex-miller',
    job_id: 'job-6',
    candidate_name: 'Alex Miller',
    job_title: 'Senior Data Platform Engineer',
    company: 'Quantis Analytics',
    hired_date: 'Yesterday',
    announcement: 'Alex Miller accepted the Data Platform Engineer position at Quantis Analytics with a 96% talent filter score.',
    created_at: '2026-09-09T17:00:00Z'
  },
  {
    id: 'plc-2',
    candidate_id: 'cand-liam',
    job_id: 'job-8',
    candidate_name: 'Liam Davies',
    job_title: 'Lead Security Engineer',
    company: 'CyberShield Inc.',
    hired_date: '3 days ago',
    announcement: 'Liam Davies placed as Lead Security Engineer at CyberShield Inc. after automated talent matching.',
    created_at: '2026-09-07T12:00:00Z'
  },
  {
    id: 'plc-3',
    candidate_id: 'cand-elena',
    job_id: 'job-5',
    candidate_name: 'Elena Rostova',
    job_title: 'AI / ML Research Engineer',
    company: 'NeuralCognition Labs',
    hired_date: '5 days ago',
    announcement: 'Elena Rostova joined NeuralCognition Labs as AI / ML Research Engineer through Talent Filter.',
    created_at: '2026-09-05T10:15:00Z'
  }
];

export const seedNotifications: Notification[] = [
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

export const seedStats: DashboardStats = {
  totalJobs: 14,
  totalCandidates: 7,
  newCvsToday: 4,
  totalApplications: 8,
  shortlistedCount: 2,
  interviewsCount: 4,
  hiredCount: 3
};
