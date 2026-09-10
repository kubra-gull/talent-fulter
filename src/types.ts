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
  experience_required: string;
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
  applicationsCount?: number;
  topScore?: number;
  latestStatus?: string;
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
  candidate?: Candidate;
  job?: Job;
}

export interface Interview {
  id: string;
  candidate_id: string;
  job_id: string;
  interviewer: string;
  interview_date: string;
  interview_time: string;
  interview_type: 'Online' | 'In-person' | 'Phone';
  meeting_link: string;
  instructions: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  created_at: string;
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

export interface JobMatchResult {
  job: Job;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchReasons: string[];
}

export interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  newCvsToday: number;
  totalApplications: number;
  shortlistedCount: number;
  interviewsCount: number;
  hiredCount: number;
}
