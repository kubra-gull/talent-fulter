import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">Talent Filter</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Powered recruitment intelligence platform that eliminates manual CV screening fatigue for modern talent acquisition teams.
            </p>
            <div className="text-[11px] text-slate-500">
              Built for speed, accuracy, and transparent skills matching.
            </div>
          </div>

          {/* Col 2: For Candidates */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              For Candidates
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('upload-cv')}
                  className="hover:text-white transition"
                >
                  Upload & Score CV
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="hover:text-white transition"
                >
                  Explore Active Jobs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('candidate-portal')}
                  className="hover:text-white transition"
                >
                  Candidate Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('interviews')}
                  className="hover:text-white transition"
                >
                  My Interviews
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: For HR & Hiring Teams */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              For HR Teams
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('hr-dashboard')}
                  className="hover:text-white transition"
                >
                  HR Recruitment Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="hover:text-white transition"
                >
                  Post New Opening
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('interviews')}
                  className="hover:text-white transition"
                >
                  Interview Calendar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition"
                >
                  Scoring Algorithm
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Security */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Security & Reliability
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Enterprise SOC2-compliant architecture. Server-side AI parsing safeguards sensitive candidate credentials.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Clerk Auth Secured • Gemini 2.5 Intelligence
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Talent Filter Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">
              About
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">
              Contact
            </button>
            <span>•</span>
            <span>Zero Slop Corporate Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
