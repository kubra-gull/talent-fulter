import React, { useEffect, useState } from 'react';
import { Job } from '../types';
import { SuccessStoriesFeed } from '../components/SuccessStoriesFeed';
import {
  UploadCloud,
  Search,
  CheckCircle,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Briefcase
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data: Job[]) => setFeaturedJobs(data.slice(0, 6)))
      .catch((err) => console.error('Failed to load featured jobs', err));
  }, []);

  const workflowSteps = [
    {
      num: '01',
      title: 'Upload CV',
      desc: 'Upload standard PDF or DOCX format resumes. Secure, zero manual data entry required.',
      icon: UploadCloud,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      num: '02',
      title: 'CV Analysis',
      desc: 'AI parses candidate identity, verified skills, years of experience, projects, and education.',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      num: '03',
      title: 'AI Matching',
      desc: 'Compares extracted credentials directly against active enterprise job requirements.',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      num: '04',
      title: 'Candidate Score',
      desc: 'Computes transparent Talent Filter Match Score (%) with detailed skill alignment breakdown.',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      num: '05',
      title: 'Recommendation',
      desc: 'Recommends top opportunities to candidates while ranking applicant pools for hiring teams.',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      num: '06',
      title: 'Interview',
      desc: 'HR issues automated invitations with Google Meet / Zoom links and schedules directly.',
      icon: Clock,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI-Powered HR Recruitment Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find the Right Job.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
              Get Discovered Faster.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Talent Filter helps candidates find relevant opportunities while helping HR teams automatically filter, evaluate, and schedule interviews without screening fatigue.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('upload-cv')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition active:scale-95"
            >
              <UploadCloud className="w-5 h-5" />
              Upload Your CV
            </button>

            <button
              onClick={() => onNavigate('jobs')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Search className="w-5 h-5 text-slate-400" />
              Explore Jobs
            </button>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-300">
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Automated Parsing</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">&lt; 30 sec</div>
              <div className="text-xs text-slate-400 mt-0.5">Candidate Match Speed</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">14+</div>
              <div className="text-xs text-slate-400 mt-0.5">Active Enterprise Roles</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">92%</div>
              <div className="text-xs text-slate-400 mt-0.5">Average Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Recruitment Workflow */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
            End-to-End Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            How Talent Filter Eliminates HR Screening Friction
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From CV upload to interview confirmation in six continuous, automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-slate-400 group-hover:text-blue-600 transition">
                    STEP {step.num}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs from Database */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Active Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Featured Positions Open for Screening
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Live roles accepting applications through the Talent Filter matching engine.
            </p>
          </div>

          <button
            onClick={() => onNavigate('jobs')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 self-start sm:self-auto"
          >
            View all 14+ openings <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {job.department}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {job.salary}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition line-clamp-1">
                  {job.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.required_skills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.required_skills.length > 4 && (
                    <span className="text-[11px] text-slate-400 self-center">
                      +{job.required_skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {job.applicants_count || 0} applicants
                </span>
                <button
                  onClick={() => onNavigate('jobs', { selectedJobId: job.id })}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  Apply / View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories & Recent Placements Feed (REQUIRED SECTION) */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        <SuccessStoriesFeed />
      </section>

      {/* HR Problem & Solution Value Section */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                The Recruitment Bottleneck Solved
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Why Traditional Manual Screening Fails
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                HR teams waste up to 75% of their working hours manually opening PDFs, deciphering inconsistent formats, and trying to identify if a candidate has relevant experience.
              </p>

              <div className="space-y-3.5 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Zero Keyword Blind Spots</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Extracts semantic meaning rather than naive keyword matching across technical and soft skills.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Instant Transparent Scoring</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Every candidate is scored with clear skills, experience, and education sub-scores.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Integrated Interview Pipeline</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Shortlist candidates, invite them via email notifications, and coordinate interviews effortlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Live Candidate Filtering Flow
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">1. Candidate Submits CV</div>
                    <div className="text-[11px] text-slate-500">Ahmad Khan — Python Developer</div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                    Uploaded
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">2. AI Skills & Experience Parsing</div>
                    <div className="text-[11px] text-slate-500">Python, SQL, FastAPI, Git, Docker (2 yrs)</div>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                    Parsed
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">3. Talent Filter Match Score</div>
                    <div className="text-[11px] text-slate-500">Python Developer @ Apex Systems</div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-200">
                    95% Match
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">4. Automated Action</div>
                    <div className="text-[11px] text-slate-500">Shortlisted & Interview Invitation Dispatched</div>
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-bold">
                    Scheduled
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => onNavigate('upload-cv')}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition text-center shadow-md shadow-blue-600/20"
                >
                  Test CV Upload Engine Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
