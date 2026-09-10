import React, { useEffect, useState } from 'react';
import { DashboardStats, Candidate, Application, Job, Interview, Notification } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  Users,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Award,
  Search,
  Filter,
  Video,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Bell
} from 'lucide-react';

interface HRDashboardPageProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const HRDashboardPage: React.FC<HRDashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 14,
    totalCandidates: 0,
    newCvsToday: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    interviewsCount: 0,
    hiredCount: 0
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJobId, setFilterJobId] = useState('All');
  const [filterMinScore, setFilterMinScore] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState('All');

  // Candidate deep-dive drawer/modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateApps, setCandidateApps] = useState<Application[]>([]);
  const [candidateActivities, setCandidateActivities] = useState<any[]>([]);

  // Schedule Interview Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState<Candidate | null>(null);
  const [interviewJobId, setInterviewJobId] = useState('');
  const [interviewerName, setInterviewerName] = useState('Sarah Jenkins (HR Director)');
  const [interviewDate, setInterviewDate] = useState('2026-09-18');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [interviewType, setInterviewType] = useState<'Online' | 'In-person' | 'Phone'>('Online');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/talent-filter-room');
  const [interviewNotes, setInterviewNotes] = useState('Technical screening and coding architecture review.');
  const [isScheduling, setIsScheduling] = useState(false);

  // Mark Hired Modal
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireCandidate, setHireCandidate] = useState<Candidate | null>(null);
  const [hireJobId, setHireJobId] = useState('');
  const [hireAnnouncement, setHireAnnouncement] = useState('');
  const [isHiring, setIsHiring] = useState(false);

  // Active View Tab: Candidates or Notifications
  const [dashboardTab, setDashboardTab] = useState<'candidates' | 'applications' | 'notifications'>('candidates');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpStatusMessage, setSmtpStatusMessage] = useState<string | null>(null);

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setSmtpStatusMessage(null);
    try {
      const res = await fetch('/api/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'kubrakhan585130@gmail.com' })
      });
      const data = await res.json();
      if (res.ok) {
        setSmtpStatusMessage('Verification email sent to kubrakhan585130@gmail.com via port 587');
        fetchDashboardData();
      } else {
        setSmtpStatusMessage(data.error || 'SMTP test failed');
      }
    } catch (err: any) {
      setSmtpStatusMessage(err.message || 'SMTP request error');
    } finally {
      setIsTestingSmtp(false);
      setTimeout(() => setSmtpStatusMessage(null), 6000);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, candsRes, appsRes, jobsRes, notifRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/candidates'),
        fetch('/api/applications'),
        fetch('/api/jobs'),
        fetch('/api/notifications')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (candsRes.ok) setCandidates(await candsRes.json());
      if (appsRes.ok) setApplications(await appsRes.json());
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
    } catch (err) {
      console.error('Failed to load HR dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openCandidateDetail = async (cand: Candidate) => {
    setSelectedCandidate(cand);
    try {
      const res = await fetch(`/api/candidates/${cand.id}`);
      if (res.ok) {
        const data = await res.json();
        setCandidateApps(data.applications || []);
        setCandidateActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Failed to load candidate full details', err);
    }
  };

  // Recruitment actions
  const handleShortlistApplication = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Shortlisted' })
      });
      if (res.ok) {
        fetchDashboardData();
        if (selectedCandidate) openCandidateDetail(selectedCandidate);
      }
    } catch (err) {
      console.error('Shortlist error:', err);
    }
  };

  const handleRejectApplication = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        fetchDashboardData();
        if (selectedCandidate) openCandidateDetail(selectedCandidate);
      }
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const submitScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewCandidate || !interviewJobId) return;

    setIsScheduling(true);
    try {
      const res = await fetch('/api/interviews/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: interviewCandidate.id,
          job_id: interviewJobId,
          interviewer: interviewerName,
          interview_date: interviewDate,
          interview_time: interviewTime,
          interview_type: interviewType,
          meeting_link: meetingLink,
          instructions: interviewNotes
        })
      });

      if (res.ok) {
        setShowScheduleModal(false);
        fetchDashboardData();
        if (selectedCandidate) openCandidateDetail(selectedCandidate);
      }
    } catch (err) {
      console.error('Schedule interview error:', err);
    } finally {
      setIsScheduling(false);
    }
  };

  const submitMarkAsHired = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireCandidate || !hireJobId) return;

    setIsHiring(true);
    try {
      const res = await fetch(`/api/candidates/${hireCandidate.id}/hire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: hireJobId,
          hired_date: 'Today',
          announcement: hireAnnouncement || `${hireCandidate.name} was successfully matched and hired through Talent Filter.`
        })
      });

      if (res.ok) {
        setShowHireModal(false);
        fetchDashboardData();
        if (selectedCandidate) openCandidateDetail(selectedCandidate);
      }
    } catch (err) {
      console.error('Hire error:', err);
    } finally {
      setIsHiring(false);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    const candName = app.candidate?.name.toLowerCase() || '';
    const candProfession = app.candidate?.profession.toLowerCase() || '';
    const jobTitle = app.job?.title.toLowerCase() || '';
    const candSkills = (app.candidate?.skills || []).join(' ').toLowerCase();

    const matchesQuery =
      !searchQuery ||
      candName.includes(q) ||
      candProfession.includes(q) ||
      jobTitle.includes(q) ||
      candSkills.includes(q);

    const matchesJob = filterJobId === 'All' || app.job_id === filterJobId;
    const matchesScore = (app.match_score || 0) >= filterMinScore;
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;

    return matchesQuery && matchesJob && matchesScore && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Users className="w-3.5 h-3.5" />
            Recruiter Command Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            HR Recruitment & Candidate Filter Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Automated applicant screening, AI scoring, and one-click interview scheduling.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Stats & Pipeline
        </button>
      </div>

      {/* Real Calculated KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Open Jobs
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalJobs}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Candidates
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.totalCandidates}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            New CVs Today
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{stats.newCvsToday}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Applications
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.totalApplications}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Shortlisted
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.shortlistedCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Interviews
          </span>
          <div className="text-2xl font-black text-teal-600 mt-1">{stats.interviewsCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Hired Candidates
          </span>
          <div className="text-2xl font-black text-purple-600 mt-1">{stats.hiredCount}</div>
        </div>
      </div>

      {/* Navigation View Switch */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setDashboardTab('candidates')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            dashboardTab === 'candidates'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Candidate Pipeline ({applications.length})
        </button>

        <button
          onClick={() => setDashboardTab('notifications')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            dashboardTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notification Dispatch Center ({notifications.length})
        </button>
      </div>

      {/* Tab 1: Candidates Filtering & Pipeline */}
      {dashboardTab === 'candidates' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skill, title..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Job Filter */}
              <div>
                <select
                  value={filterJobId}
                  onChange={(e) => setFilterJobId(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Jobs ({jobs.length})</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.company})
                    </option>
                  ))}
                </select>
              </div>

              {/* Match Score Threshold */}
              <div>
                <select
                  value={filterMinScore}
                  onChange={(e) => setFilterMinScore(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={0}>Any Match Score</option>
                  <option value={80}>High Match (&gt;= 80%)</option>
                  <option value={70}>Good Match (&gt;= 70%)</option>
                  <option value={50}>Moderate Match (&gt;= 50%)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Application Statuses</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Loading candidates and match data...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No applicants matching criteria</h3>
              <p className="text-xs text-slate-500">
                Try uploading a CV or clearing search filters.
              </p>
              <button
                onClick={() => onNavigate('upload-cv')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
              >
                Upload / Test Candidate CV
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => {
                const cand = app.candidate;
                const job = app.job;

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-300 transition group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Candidate Identity & Role */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            app.status === 'Shortlisted'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : app.status === 'Interview Scheduled'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : app.status === 'Hired'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {app.status}
                        </span>

                        <span className="text-xs text-slate-400">
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                          {cand?.name.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h3
                            onClick={() => cand && openCandidateDetail(cand)}
                            className="text-lg font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer"
                          >
                            {cand?.name || 'Candidate Name'}
                          </h3>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>Position: <strong className="text-slate-700">{job?.title}</strong></span>
                            <span>•</span>
                            <span>{job?.company}</span>
                          </div>
                        </div>
                      </div>

                      {/* Verified Skills chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cand?.skills.slice(0, 5).map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-100"
                          >
                            {s}
                          </span>
                        ))}
                        {(cand?.skills.length || 0) > 5 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{(cand?.skills.length || 0) - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Talent Filter Score Component */}
                    <div className="lg:w-64 shrink-0">
                      <ScoreGauge
                        score={app.match_score}
                        skillsScore={app.skills_score}
                        experienceScore={app.experience_score}
                        educationScore={app.education_score}
                        showDetails={false}
                      />
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                      <button
                        onClick={() => cand && openCandidateDetail(cand)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        View Full Dossier
                      </button>

                      {app.status !== 'Shortlisted' && app.status !== 'Hired' && (
                        <button
                          onClick={() => handleShortlistApplication(app.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                        >
                          Shortlist
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setInterviewCandidate(cand || null);
                          setInterviewJobId(app.job_id);
                          setShowScheduleModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition"
                      >
                        Schedule Interview
                      </button>

                      {app.status !== 'Hired' && (
                        <button
                          onClick={() => {
                            setHireCandidate(cand || null);
                            setHireJobId(app.job_id);
                            setShowHireModal(true);
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition"
                        >
                          Mark as Hired
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Notifications Center */}
      {dashboardTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Automated Recruitment Notifications Log
              </h3>
              <p className="text-xs text-slate-500">
                Live audit trail of applicant confirmations, HR alerts, and interview invitations via SMTP (kubrakhan585130@gmail.com:587).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestSmtp}
                disabled={isTestingSmtp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                {isTestingSmtp ? 'Sending Test...' : 'Send Test SMTP Email'}
              </button>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                SMTP: kubrakhan585130@gmail.com (587)
              </span>
            </div>
          </div>

          {smtpStatusMessage && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 flex items-center justify-between">
              <span>{smtpStatusMessage}</span>
              <button onClick={() => setSmtpStatusMessage(null)} className="text-blue-500 hover:text-blue-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {notif.channel}
                    </span>
                    <strong className="text-xs text-slate-900">{notif.subject}</strong>
                  </div>
                  <div className="text-xs text-slate-600 whitespace-pre-line line-clamp-2">
                    {notif.message}
                  </div>
                  <div className="text-[11px] text-slate-400">To: {notif.recipient}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" /> Sent
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(notif.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Deep Dive Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCandidate.name}</h2>
                  <p className="text-sm font-semibold text-blue-600">{selectedCandidate.profession}</p>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>{selectedCandidate.email}</span>
                    <span>•</span>
                    <span>{selectedCandidate.phone}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Verified Skills Matrix ({selectedCandidate.skills.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {selectedCandidate.summary && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Executive Summary
                  </h3>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {selectedCandidate.summary}
                  </p>
                </div>
              )}

              {/* Applications for this candidate */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Active Applications & Scores
                </h3>
                <div className="space-y-3">
                  {candidateApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-sm text-slate-900">{app.job?.title}</strong>
                          <span className="text-xs text-slate-500 ml-2">({app.job?.company})</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          {app.status}
                        </span>
                      </div>

                      <ScoreGauge
                        score={app.match_score}
                        skillsScore={app.skills_score}
                        experienceScore={app.experience_score}
                        educationScore={app.education_score}
                        matchedSkills={app.matched_skills}
                        missingSkills={app.missing_skills}
                        reasons={app.match_reasons}
                        showDetails={true}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Recruitment Audit Trail
                </h3>
                <div className="space-y-2">
                  {candidateActivities.map((act) => (
                    <div
                      key={act.id}
                      className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-slate-800 font-semibold">{act.action}: </strong>
                        <span className="text-slate-600">{act.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && interviewCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={submitScheduleInterview} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Interview Scheduling
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Schedule Interview with {interviewCandidate.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Automatically generates and sends an official interview invitation email to {interviewCandidate.email}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Position</label>
                <select
                  value={interviewJobId}
                  onChange={(e) => setInterviewJobId(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select Target Job</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interview Time</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 11:00 AM"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Format</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Online">Online (Google Meet / Zoom)</option>
                    <option value="In-person">In-person</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interviewer</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link / Address</label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Instructions</label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                >
                  {isScheduling ? 'Dispatching Invitation...' : 'Send Interview Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark As Hired Modal */}
      {showHireModal && hireCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowHireModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={submitMarkAsHired} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                  Placement Confirmation
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Mark {hireCandidate.name} as Hired!
                </h2>
                <p className="text-xs text-slate-500">
                  This will record a verified placement in the database and automatically publish to the website's Success Stories feed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Position</label>
                <select
                  value={hireJobId}
                  onChange={(e) => setHireJobId(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select Hired Job</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Public Announcement Text</label>
                <textarea
                  rows={3}
                  value={hireAnnouncement}
                  onChange={(e) => setHireAnnouncement(e.target.value)}
                  placeholder={`${hireCandidate.name} was successfully matched with a Python Developer opportunity through Talent Filter.`}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHireModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isHiring}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                >
                  {isHiring ? 'Recording Placement...' : 'Confirm Hire & Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
