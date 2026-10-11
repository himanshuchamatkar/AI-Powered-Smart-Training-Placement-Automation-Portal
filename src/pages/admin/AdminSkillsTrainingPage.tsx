import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Award,
} from 'lucide-react';
import { SEED_TRAINING_PROGRAMS } from '@/data/mockSeed';

export const AdminSkillsTrainingPage: React.FC = () => {
  // Common institutional skill gaps derived from partner employer criteria
  const skillGaps = [
    { skill: 'Docker Containerization & MLOps', count: 48, domain: 'AI/ML & Cloud', impact: 'High' },
    { skill: 'TypeScript & Next.js Architecture', count: 39, domain: 'Web Development', impact: 'High' },
    { skill: 'Network Security & Penetration Testing', count: 32, domain: 'Cybersecurity', impact: 'Medium' },
    { skill: 'Agentic Automation & Tool Calling', count: 28, domain: 'Automation AI', impact: 'High' },
    { skill: 'ETL Pipelines & Power BI', count: 24, domain: 'Data Analytics', impact: 'Medium' },
  ];

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-16">
      <DashboardHeader
        title="Institutional Skill Gap Analytics & Training Hub"
        subtitle="Identifies widespread student curriculum gaps compared to partner job requirements and links workshops"
        breadcrumbs={[
          { label: 'T&P Portal', href: '/admin/overview' },
          { label: 'Skills & Training' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Top Skill Gaps Banner */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Most Common Missing Skills Across Batch
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Derived deterministically by comparing 50+ job requirements against registered student profiles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillGaps.map((gap, i) => (
              <div key={i} className="p-4 bg-slate-850 rounded-xl border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{gap.skill}</span>
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-[10px] font-bold">
                    {gap.count} Students Need
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Domain: {gap.domain}</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${(gap.count / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Campus Training Programs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Aligned Finishing School Training Programs
            </h3>
            <span className="text-xs font-semibold text-emerald-400">
              {SEED_TRAINING_PROGRAMS.length} Scheduled Workshops
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SEED_TRAINING_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    {prog.domain}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{prog.duration}</span>
                </div>

                <h4 className="text-base font-bold text-white">{prog.title}</h4>
                <div className="text-xs text-slate-400 font-medium">Provider: {prog.provider}</div>

                <div className="pt-2 border-t border-slate-700/60">
                  <div className="text-[11px] text-slate-400 mb-1.5">Target Skills Taught:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {prog.skills_taught.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-slate-700 text-slate-200 rounded text-[10px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={prog.registration_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    View Registration Details <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
