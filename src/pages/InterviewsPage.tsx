import React, { useEffect, useState } from 'react';
import { Interview } from '../types';
import { apiClient } from '../lib/apiClient';
import { seedInterviews, seedCandidates, seedJobs } from '../data/seedData';
import {
  Calendar,
  Video,
  Clock,
  Building2,
  User,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface InterviewsPageProps {
  onNavigate: (tab: string, context?: any) => void;
}

const defaultInterviews: Interview[] = seedInterviews.map((i) => ({
  ...i,
  candidate: seedCandidates.find((c) => c.id === i.candidate_id),
  job: seedJobs.find((j) => j.id === i.job_id)
}));

export const InterviewsPage: React.FC<InterviewsPageProps> = ({ onNavigate }) => {
  const [interviews, setInterviews] = useState<Interview[]>(defaultInterviews);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('All');

  const fetchInterviews = async () => {
    try {
      const data = await apiClient.getInterviews();
      if (data && data.length > 0) {
        setInterviews(data);
      }
    } catch (err) {
      console.error('Failed to load interviews', err);
      setInterviews(defaultInterviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const filtered = interviews.filter((item) => {
    if (filterType === 'All') return true;
    return item.status.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
            Coordinated Recruitment Sessions
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Scheduled Interviews & Technical Screenings
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Direct video links, schedule coordination, and interviewer instructions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInterviews}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <button
            onClick={() => onNavigate('hr-dashboard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition"
          >
            <Calendar className="w-4 h-4" />
            Schedule New (via HR)
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {['All', 'Scheduled', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterType(status)}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              filterType === status
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status} ({status === 'All' ? interviews.length : interviews.filter((i) => i.status.toLowerCase() === status.toLowerCase()).length})
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading interview schedules...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No interviews scheduled yet</h3>
          <p className="text-xs text-slate-500">
            Shortlist a candidate in the HR Dashboard and schedule an interview to populate this board.
          </p>
          <button
            onClick={() => onNavigate('hr-dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
          >
            Go to HR Pipeline
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-500">{item.interview_type}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-3">
                  {item.job?.title || 'Technical Interview'}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {item.job?.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Candidate: <strong className="text-slate-800">{item.candidate?.name}</strong>
                  </span>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-slate-500 font-medium">Session Date & Time</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {item.interview_date} at {item.interview_time}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-slate-500 font-medium">Interviewer</div>
                    <div className="font-bold text-slate-800 mt-0.5">{item.interviewer}</div>
                  </div>
                </div>

                {item.instructions && (
                  <p className="text-xs text-slate-600 mt-3 italic">
                    "{item.instructions}"
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {item.candidate?.email}
                </span>

                {item.meeting_link ? (
                  <a
                    href={item.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join Video Room
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">In-person session</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
