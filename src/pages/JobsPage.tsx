import React, { useEffect, useState } from 'react';
import { Job, Application } from '../types';
import { useAppAuth } from '../components/AuthProvider';
import { apiClient } from '../lib/apiClient';
import { seedJobs } from '../data/seedData';
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Plus,
  Filter,
  CheckCircle,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface JobsPageProps {
  onNavigate: (tab: string, context?: any) => void;
  selectedJobIdFromNav?: string | null;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onNavigate, selectedJobIdFromNav }) => {
  const { role, activeCandidateId, activeCandidateName } = useAppAuth();

  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Job detail modal
  const [activeModalJob, setActiveModalJob] = useState<Job | null>(null);

  // Apply modal
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const [applyApplicantName, setApplyApplicantName] = useState(activeCandidateName || 'Ahmad Khan');
  const [applyApplicantEmail, setApplyApplicantEmail] = useState('ahmad.khan.dev@example.com');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Post Job modal (for HR)
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobDept, setNewJobDept] = useState('Engineering');
  const [newJobLocation, setNewJobLocation] = useState('Remote / US');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote'>('Full-time');
  const [newJobSalary, setNewJobSalary] = useState('$110,000 - $140,000');
  const [newJobExp, setNewJobExp] = useState('2+ years');
  const [newJobSkills, setNewJobSkills] = useState('Python, FastAPI, SQL, Git');
  const [newJobDesc, setNewJobDesc] = useState('');

  const departments = [
    'All',
    'Engineering',
    'Design & Frontend',
    'Platform Engineering',
    'Product Development',
    'Data & AI',
    'Infrastructure',
    'Business Intelligence',
    'Core Platform',
    'Growth & Marketing',
    'People Operations',
    'Operations'
  ];

  const employmentTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];

  const fetchJobs = async () => {
    try {
      const data = await apiClient.getJobs();
      if (data && data.length > 0) {
        setJobs(data);
        if (selectedJobIdFromNav) {
          const match = data.find((j) => j.id === selectedJobIdFromNav);
          if (match) setActiveModalJob(match);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
      setJobs(seedJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedJobIdFromNav]);

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.required_skills.some((s) => s.toLowerCase().includes(q));

    const matchesDept =
      selectedDepartment === 'All' ||
      job.department.toLowerCase() === selectedDepartment.toLowerCase();

    const matchesType =
      selectedType === 'All' ||
      job.employment_type.toLowerCase() === selectedType.toLowerCase();

    return matchesQuery && matchesDept && matchesType;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;

    setIsApplying(true);
    try {
      let candId = activeCandidateId;

      // If no active candidate ID, register one first
      if (!candId) {
        const candRes = await fetch('/api/cv/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: applyApplicantName || 'Ahmad Khan',
            email: applyApplicantEmail || 'candidate@example.com',
            phone: '+1 (555) 019-2834',
            desiredProfession: applyModalJob.title
          })
        });
        const candData = await candRes.json();
        candId = candData.candidate?.id;
      }

      if (candId) {
        const appRes = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidate_id: candId,
            job_id: applyModalJob.id
          })
        });

        if (appRes.ok) {
          setApplySuccess(true);
          setTimeout(() => {
            setApplySuccess(false);
            setApplyModalJob(null);
            fetchJobs();
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Apply error:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArr = newJobSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobTitle,
          company: newJobCompany || 'Talent Filter Partner',
          department: newJobDept,
          location: newJobLocation,
          employment_type: newJobType,
          salary: newJobSalary,
          experience_required: newJobExp,
          min_experience_years: parseInt(newJobExp, 10) || 2,
          required_skills: skillsArr.length > 0 ? skillsArr : ['Communication'],
          description: newJobDesc || 'Exciting opportunity to build core technology.'
        })
      });

      if (res.ok) {
        setShowPostJobModal(false);
        setNewJobTitle('');
        setNewJobDesc('');
        fetchJobs();
      }
    } catch (err) {
      console.error('Create job error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
            Enterprise Directory
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Browse Verified Job Openings
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            All roles are actively managed by partnered hiring teams and screened using Talent Filter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('upload-cv')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
          >
            <Sparkles className="w-4 h-4" />
            Upload CV for Auto-Match
          </button>

          <button
            onClick={() => setShowPostJobModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            <Plus className="w-4 h-4" />
            Post New Job (HR)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, technology, or skills..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Select */}
          <div className="w-full md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Job Types</option>
              {employmentTypes.filter((t) => t !== 'All').map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Department Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Department:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`whitespace-nowrap px-3 py-1 rounded-lg font-medium transition ${
                selectedDepartment === dept
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading jobs from database...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching positions found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search criteria or clear the filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('All');
              setSelectedType('All');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {job.department}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {job.salary}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition line-clamp-1">
                  {job.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                    {job.experience_required}
                  </span>
                  <span>•</span>
                  <span>{job.employment_type}</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.required_skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.required_skills.length > 4 && (
                    <span className="text-[11px] text-slate-400 self-center">
                      +{job.required_skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {job.applicants_count || 0} applicants
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalJob(job)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => setApplyModalJob(job)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition active:scale-95"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {activeModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalJob(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                  {activeModalJob.department}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  {activeModalJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="font-semibold text-slate-800">{activeModalJob.company}</span>
                  <span>•</span>
                  <span>{activeModalJob.location}</span>
                  <span>•</span>
                  <span>{activeModalJob.employment_type}</span>
                  <span>•</span>
                  <span className="font-bold text-emerald-700">{activeModalJob.salary}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Job Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeModalJob.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Responsibilities
                </h3>
                <ul className="text-sm text-slate-700 space-y-2">
                  {activeModalJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Required Competencies & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeModalJob.required_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Application Deadline: {activeModalJob.deadline}
                </span>

                <button
                  onClick={() => {
                    const job = activeModalJob;
                    setActiveModalJob(null);
                    setApplyModalJob(job);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                >
                  Apply to this Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setApplyModalJob(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-600">
                  Your application has been placed Under Review. You can track your status in the Candidate Portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                    Submit Application
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Apply for {applyModalJob.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {applyModalJob.company} • {applyModalJob.location}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applyApplicantName}
                    onChange={(e) => setApplyApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={applyApplicantEmail}
                    onChange={(e) => setApplyApplicantEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
                  Our AI engine will instantly compare your profile against the job's {applyModalJob.required_skills.length} required skills and generate a Talent Filter Match Score.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalJob(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                  >
                    {isApplying ? 'Processing Application...' : 'Confirm Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post Job Modal (for HR Team) */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPostJobModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  HR Portal Action
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Post New Enterprise Position</h2>
                <p className="text-xs text-slate-500">
                  Adds directly to the persistent database and enables automated CV matching.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    placeholder="e.g. Apex Labs"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {departments.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="e.g. Remote / New York"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    placeholder="e.g. $110,000 - $130,000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={newJobSkills}
                  onChange={(e) => setNewJobSkills(e.target.value)}
                  placeholder="Python, FastAPI, SQL, Docker, Git"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Key deliverables and team context..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
