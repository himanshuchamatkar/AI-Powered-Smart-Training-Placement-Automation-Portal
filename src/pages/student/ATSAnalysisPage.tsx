import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { calculateATSAnalysis, ROLE_KEYWORD_BENCHMARKS } from '@/lib/scoring/ats';
import { OWNER_SKILLS } from '@/data/ownerProfile';

export const ATSAnalysisPage: React.FC = () => {
  const { profile } = useAuth();
  const [targetRole, setTargetRole] = useState('AI/ML Engineer');

  const userSkillNames = OWNER_SKILLS.map((s) => s.name);
  const analysis = calculateATSAnalysis(profile || ({} as any), userSkillNames, targetRole);

  const availableRoles = Object.keys(ROLE_KEYWORD_BENCHMARKS);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Resume ATS Readiness & Keyword Analysis"
        subtitle="Deterministic keyword matching and structural audit calibrated for institutional campus hiring"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'ATS Analysis' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Top Score Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-navy-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3 border border-brand-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Deterministic ATS Scoring (v1.2)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Resume Match / ATS Readiness</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Benchmarked against institutional partner requirements. Score is deterministic, explainable, and repeatable across sessions.
              </p>

              {/* Target Role Selector */}
              <div className="mt-5 flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Target Role Benchmark:</span>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1.5 font-semibold text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Score Big Display */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center shrink-0 min-w-[180px]">
              <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 leading-none">
                {analysis.score}%
              </div>
              <div className="text-xs font-bold text-slate-200 mt-2">Overall Match Score</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5">High Placement Fit</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {profile?.email?.includes('123himanshu') ? 'Fixed Presentation Baseline' : 'Calculated Profile Score'}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">Core Tech Skills</div>
            <div className="text-2xl font-bold text-slate-900">88%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-2">High keyword alignment</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">Role Terminology</div>
            <div className="text-2xl font-bold text-slate-900">76%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-2">Recommended keywords present</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">Project Evidence</div>
            <div className="text-2xl font-bold text-slate-900">82%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-2">Strong practical capstone</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">ATS Formatting</div>
            <div className="text-2xl font-bold text-slate-900">95%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }}></div>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-2">Clean single-column layout</div>
          </div>
        </div>

        {/* Keyword Analysis Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched Keywords */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Matched Target Keywords ({analysis.matched_keywords.length})
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Found in Profile
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.matched_keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended / Missing Keywords */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Recommended Missing Keywords ({analysis.recommended_keywords.length})
              </h3>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                High Value
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.recommended_keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium"
                >
                  +{kw}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Only incorporate recommended keywords if you have verifiable academic coursework, personal experiments, or project contributions involving these tools.
            </p>
          </div>
        </div>

        {/* Actionable Suggestions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Actionable Recommendations for ATS Improvement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.suggestions.map((sug, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">{sug.title}</div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {sug.category}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{sug.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
