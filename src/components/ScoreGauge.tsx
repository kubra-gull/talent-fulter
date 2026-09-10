import React from 'react';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  skillsScore?: number;
  experienceScore?: number;
  educationScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  reasons?: string[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  skillsScore = 88,
  experienceScore = 90,
  educationScore = 95,
  matchedSkills = [],
  missingSkills = [],
  reasons = [],
  size = 'md',
  showDetails = false
}) => {
  // Score color tiers
  const getScoreColor = (val: number) => {
    if (val >= 85) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', label: 'Strong Match' };
    if (val >= 70) return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500', label: 'Good Match' };
    if (val >= 50) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', label: 'Moderate Match' };
    return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500', label: 'Low Match' };
  };

  const colors = getScoreColor(score);

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5">
        <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
          {score}%
        </div>
        <span className="text-[11px] text-slate-500 font-medium">{colors.label}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      {/* Top Banner with Overall Score */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Talent Filter Score
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className={`text-2xl font-extrabold ${colors.text}`}>{score}%</span>
            <span className="text-xs font-medium text-slate-600">{colors.label}</span>
          </div>
        </div>

        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 shrink-0">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
        <div
          className={`h-full ${colors.bar} transition-all duration-500 rounded-full`}
          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
        />
      </div>

      {/* Dimensional Breakdown Bars */}
      <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-[11px]">
        <div>
          <div className="text-slate-500 font-medium">Skills Match</div>
          <div className="font-bold text-slate-800 mt-0.5">{skillsScore}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${skillsScore}%` }} />
          </div>
        </div>

        <div>
          <div className="text-slate-500 font-medium">Experience</div>
          <div className="font-bold text-slate-800 mt-0.5">{experienceScore}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${experienceScore}%` }} />
          </div>
        </div>

        <div>
          <div className="text-slate-500 font-medium">Education</div>
          <div className="font-bold text-slate-800 mt-0.5">{educationScore}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${educationScore}%` }} />
          </div>
        </div>
      </div>

      {/* Matched & Missing Skills Pills */}
      {showDetails && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          {matchedSkills.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 block mb-1.5">
                Matched Requirements ({matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                Skills to Develop ({missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {reasons && reasons.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                AI Match Rationale
              </span>
              <ul className="text-xs text-slate-600 space-y-1">
                {reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
