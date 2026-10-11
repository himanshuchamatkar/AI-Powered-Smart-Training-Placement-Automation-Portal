import React from 'react';
import { GraduationCap, Shield, Award, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Institution Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <GraduationCap className="w-5 h-5 text-brand-400" />
              Datta Meghe Institute of Higher Education &amp; Research (DMIHER)
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-md">
              Faculty of Engineering and Technology, Department of Computer Science &amp; Engineering.
              Automated institutional training, resume readiness analysis, job recommendation engine, and placement tracking.
            </p>
            <div className="mt-3 flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-brand-400" />
              <span>Project Lead: Himanshu Vikas Chamatkar (B.Tech CSE)</span>
            </div>
          </div>

          {/* Quick Institutional Links */}
          <div>
            <div className="text-white font-semibold mb-3">T&amp;P Services</div>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors">Deterministic ATS Resume Scoring</span></li>
              <li><span className="hover:text-white transition-colors">Explainable Skill-Based Matching</span></li>
              <li><span className="hover:text-white transition-colors">Dynamic Cover Letter Builder</span></li>
              <li><span className="hover:text-white transition-colors">Recruitment Drive Announcements</span></li>
            </ul>
          </div>

          {/* Compliance & Verification */}
          <div>
            <div className="text-white font-semibold mb-3">Security &amp; Integrity</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Row-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-brand-400" />
                <span>Private Resume Bucket</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                All records, drives, and interview schedules are governed by DMIHER Placement Cell guidelines.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} DMIHER FEAT. All rights reserved. Built for Academic Final Year Submission.
          </div>
          <div className="flex items-center gap-4">
            <span>Deterministic Scoring Engine</span>
            <span>&bull;</span>
            <span>Single Source of Truth: PRD/TRD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
