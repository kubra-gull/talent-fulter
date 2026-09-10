import React, { useEffect, useState } from 'react';
import { Placement } from '../types';
import { Award, CheckCircle, Sparkles, Building2, Calendar, RefreshCw } from 'lucide-react';

export const SuccessStoriesFeed: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlacements = async () => {
    try {
      const res = await fetch('/api/placements');
      if (res.ok) {
        const data = await res.json();
        setPlacements(data);
      }
    } catch (err) {
      console.error('Failed to load placements feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  if (compact) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-900">Recent Placements Feed</h3>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Database Live
          </span>
        </div>

        {loading ? (
          <div className="py-4 text-center text-xs text-slate-400">Loading placement feed...</div>
        ) : placements.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-400">No placements recorded yet.</div>
        ) : (
          <div className="space-y-2.5">
            {placements.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50/40 border border-slate-100 transition flex items-start gap-2.5 text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-slate-900 font-semibold truncate">
                      {item.candidate_name} got hired!
                    </strong>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.hired_date}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 mt-0.5">{item.announcement}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Recruitment Outcomes
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Success Stories & Recent Placements
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real candidates matched with relevant roles through Talent Filter’s automated screening engine.
          </p>
        </div>

        <button
          onClick={fetchPlacements}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Live Feed
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Fetching placement records from database...
        </div>
      ) : placements.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No candidates hired yet. Complete an application and interview workflow to see live placements!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {placements.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between transition group shadow-sm hover:border-blue-500/50"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    Hired Milestone
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {item.hired_date}
                  </span>
                </div>

                <div className="text-base font-bold text-white group-hover:text-blue-400 transition flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>{item.candidate_name} got hired!</span>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  "{item.announcement}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300 font-medium truncate">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  {item.company}
                </span>
                <span className="text-[11px] text-slate-400">{item.job_title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
