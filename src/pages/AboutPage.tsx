import React from 'react';
import { ShieldCheck, Target, Users, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
          Platform Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Solving the #1 Headache in Modern Recruitment
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          HR teams waste up to 80% of their time manually reviewing resumes that fail basic qualifications. Talent Filter was built to automate the screening burden while giving candidates instant, transparent feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Semantic Matching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike legacy ATS that look for exact keyword matches, Talent Filter understands engineering frameworks, certifications, and experience levels contextually.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero Bias Scoring</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transparent scoring algorithms breakdown Skills (55%), Experience (30%), and Education (15%) so hiring managers make data-driven, merit-based decisions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Human-in-the-Loop</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            AI assists with extraction and scoring, but recruiters retain full control to shortlist, interview, and confirm hiring placements.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ready to experience automated candidate filtering?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Upload a resume in seconds or test using our sample applicant profile.
        </p>
        <button
          onClick={() => onNavigate('upload-cv')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition"
        >
          Upload Your CV Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
