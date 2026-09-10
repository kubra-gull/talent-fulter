import React, { useEffect, useState } from 'react';
import { useAppAuth } from '../components/AuthProvider';
import { Candidate, Application, Interview, CandidateActivity, JobMatchResult } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  User,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles,
  Award,
  Video,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Layers,
  Building2,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface CandidatePortalPageProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const CandidatePortalPage: React.FC<CandidatePortalPageProps> = ({ onNavigate }) => {
  const { activeCandidateId, activeCandidateName, setActiveCandidateId, setActiveCandidateName } = useAppAuth();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [activities, setActivities] = useState<CandidateActivity[]>([]);
  const [recommendations, setRecommendations] = useState<JobMatchResult[]>([]);
  const [allCandidatesList, setAllCandidatesList] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'applications' | 'recommendations' | 'interviews' | 'activity'>('applications');

  const loadPortalData = async () => {
    setLoading(true);
    try {
      // First fetch all candidates to see if we have one
      const candRes = await fetch('/api/candidates');
      if (candRes.ok) {
        const cands: Candidate[] = await candRes.json();
        setAllCandidatesList(cands);

        let targetId = activeCandidateId;
        if (!targetId && cands.length > 0) {
          targetId = cands[0].id;
          setActiveCandidateId(targetId);
          setActiveCandidateName(cands[0].name);
        }

        if (targetId) {
          const detailRes = await fetch(`/api/candidates/${targetId}`);
          if (detailRes.ok) {
            const data = await detailRes.json();
            setCandidate(data.candidate);
            setApplications(data.applications || []);
            setInterviews(data.interviews || []);
            setActivities(data.activities || []);
          }

          // Fetch recommendations
          const recRes = await fetch(`/api/candidates/${targetId}/recommendations`);
          if (recRes.ok) {
            const recData = await recRes.json();
            setRecommendations(recData.slice(0, 4));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load candidate portal data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [activeCandidateId]);

  const handleApplyRecommended = async (jobId: string) => {
    if (!candidate) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidate.id,
          job_id: jobId
        })
      });
      if (res.ok) {
        loadPortalData();
      }
    } catch (err) {
      console.error('Apply error:', err);
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Interview Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interviewed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Offer':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Under Review':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading candidate profile & recruitment pipeline...
      </div>
    );
  }

  // If no candidate exists in the system yet
  if (!candidate) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Candidate Profile Active Yet</h2>
        <p className="text-sm text-slate-600">
          Upload your CV to automatically create your candidate profile, analyze skills, and track your recruitment journey.
        </p>
        <button
          onClick={() => onNavigate('upload-cv')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
        >
          <Sparkles className="w-4 h-4" />
          Upload CV / Load Ahmad Khan Demo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Candidate Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {candidate.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Candidate
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-0.5">{candidate.profession}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.phone}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.education}
                </span>
              </div>
            </div>
          </div>

          {/* Switch Candidate Dropdown (if multiple exist) */}
          <div className="flex flex-col sm:items-end gap-2">
            {allCandidatesList.length > 1 && (
              <div className="text-xs text-slate-500">
                <span>Switch profile: </span>
                <select
                  value={candidate.id}
                  onChange={(e) => {
                    setActiveCandidateId(e.target.value);
                    const c = allCandidatesList.find((x) => x.id === e.target.value);
                    if (c) setActiveCandidateName(c.name);
                  }}
                  className="ml-1 py-1 px-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                >
                  {allCandidatesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.profession})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => onNavigate('upload-cv')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Upload New / Updated CV
            </button>
          </div>
        </div>

        {/* Skills Ribbon */}
        <div className="pt-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Extracted Skills & Competencies ({candidate.skills.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          My Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'recommendations'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Recommended Jobs ({recommendations.length})
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'interviews'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          My Interviews ({interviews.length})
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'activity'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Recruitment Timeline
        </button>
      </div>

      {/* Tab Contents */}

      {/* Tab 1: Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active applications yet</h3>
              <p className="text-xs text-slate-500">
                Explore recommended jobs below or apply directly from the Jobs directory.
              </p>
              <button
                onClick={() => onNavigate('jobs')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
              >
                Browse Open Roles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {app.match_score}% Score
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-3">
                      {app.job?.title || 'Position Applied'}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="font-semibold text-slate-700">{app.job?.company}</span>
                      <span>•</span>
                      <span>{app.job?.location}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-xs text-slate-600 flex items-center justify-between">
                        <span>Skills Match Score:</span>
                        <strong className="text-slate-800">{app.skills_score}%</strong>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center justify-between">
                        <span>Experience Match:</span>
                        <strong className="text-slate-800">{app.experience_score}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                    {app.status === 'Interview Scheduled' && (
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" /> Interview Ready
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.map((rec) => (
              <div
                key={rec.job.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-blue-400 transition group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {rec.job.department}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {rec.job.salary}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition">
                    {rec.job.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">{rec.job.company}</span>
                    <span>•</span>
                    <span>{rec.job.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {rec.job.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <ScoreGauge
                      score={rec.overallScore}
                      skillsScore={rec.skillsScore}
                      experienceScore={rec.experienceScore}
                      educationScore={rec.educationScore}
                      matchedSkills={rec.matchedSkills}
                      missingSkills={rec.missingSkills}
                      showDetails={false}
                    />
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {rec.matchedSkills.length} of {rec.job.required_skills.length} skills matched
                  </span>

                  <button
                    onClick={() => handleApplyRecommended(rec.job.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
                  >
                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interviews */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          {interviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No interviews scheduled yet</h3>
              <p className="text-xs text-slate-500">
                When the HR recruitment team reviews your CV and match score, interview invitations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-500">{item.interview_type} Format</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {item.job?.title || 'Interview Invitation'}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">{item.job?.company}</span>
                      <span>•</span>
                      <span>Interviewer: {item.interviewer}</span>
                    </div>

                    <p className="text-xs text-slate-500 italic">
                      "{item.instructions}"
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:items-end gap-3 shrink-0">
                    <div className="text-xs">
                      <div className="text-slate-500 font-medium">Date & Time</div>
                      <div className="text-base font-extrabold text-slate-900">
                        {item.interview_date} at {item.interview_time}
                      </div>
                    </div>

                    {item.meeting_link && (
                      <a
                        href={item.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
                      >
                        <Video className="w-4 h-4" />
                        Join Google Meet Room
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Activity Log */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recruitment Journey Log</h3>
            <p className="text-xs text-slate-500">
              Audit log of all AI parsing, recommendations, status changes, and notifications.
            </p>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-4 relative">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 ring-4 ring-white mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-slate-900 font-bold">{act.action}</strong>
                    <span className="text-[11px] text-slate-400">
                      {new Date(act.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{act.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
