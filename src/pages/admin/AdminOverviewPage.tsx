import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  Users,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Calendar,
  Building2,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  SEED_SYNTHETIC_STUDENTS,
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_RECRUITMENT_DRIVES,
} from '@/data/mockSeed';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminOverviewPage: React.FC = () => {
  // Aggregate KPI metrics
  const totalStudents = SEED_SYNTHETIC_STUDENTS.length;
  const activeJobs = SEED_JOBS.filter((j) => j.status === 'published').length;
  const totalApplications = SEED_APPLICATIONS.length;
  const placedStudents = 18; // Documented synthetic placement count
  const averageATS = Math.round(
    SEED_SYNTHETIC_STUDENTS.reduce((acc, s) => acc + (s.ats_score || 78), 0) / totalStudents
  );
  const upcomingDrives = SEED_RECRUITMENT_DRIVES.length;

  // Chart data: Applications by Status
  const statusData = [
    { name: 'Prepared', count: 12 },
    { name: 'Applied', count: 24 },
    { name: 'Shortlisted', count: 19 },
    { name: 'Interview', count: 14 },
    { name: 'Selected', count: 18 },
  ];

  // Chart data: Domain Readiness
  const domainData = [
    { domain: 'AI/ML', readiness: 81 },
    { domain: 'Web Dev', readiness: 79 },
    { domain: 'Cybersecurity', readiness: 77 },
    { domain: 'Data Science', readiness: 80 },
    { domain: 'Automation', readiness: 78 },
  ];

  const COLORS = ['#94a3b8', '#38bdf8', '#3b82f6', '#a855f7', '#10b981'];

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-16">
      <DashboardHeader
        title="Training & Placement Officer Overview"
        subtitle="Institutional placement analytics, drive schedules, and candidate readiness metrics"
        breadcrumbs={[
          { label: 'T&P Portal', href: '/admin/overview' },
          { label: 'Executive Dashboard' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Students</span>
              <Users className="w-3.5 h-3.5 text-brand-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalStudents}</div>
            <div className="text-[11px] text-brand-400 font-semibold mt-1">Enrolled CSE/IT</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Active Jobs</span>
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">{activeJobs}</div>
            <div className="text-[11px] text-indigo-400 font-semibold mt-1">Published Drives</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Tracked Apps</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{statusData.reduce((a, b) => a + b.count, 0)}</div>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">Across Domains</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Selected / Placed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{placedStudents}</div>
            <div className="text-[11px] text-emerald-400/80 font-semibold mt-1">Synthetic Placed</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Average ATS</span>
              <FileCheck2 className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{averageATS}%</div>
            <div className="text-[11px] text-purple-400 font-semibold mt-1">Benchmark Score</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Campus Drives</span>
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white">{upcomingDrives}</div>
            <div className="text-[11px] text-rose-400 font-semibold mt-1">Active Pipeline</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Application Funnel */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Application Pipeline Distribution</h3>
                <p className="text-xs text-slate-400">Total volume categorized by review status</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-700 text-slate-300">
                Live Reconciled
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Domain Readiness Average */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Domain-Wise Student ATS Readiness</h3>
                <p className="text-xs text-slate-400">Average match score benchmark per domain</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-700 text-slate-300">
                Rule Engine
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData} layout="vertical">
                  <XAxis type="number" domain={[50, 100]} stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="domain" stroke="#94a3b8" fontSize={11} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="readiness" fill="#38bdf8" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Upcoming Drives Table */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recruitment Drives Schedule</h3>
              <p className="text-xs text-slate-400">Scheduled campus assessment dates and criteria</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Drive Title</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Venue / Mode</th>
                  <th className="py-2.5 px-3">Eligibility</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {SEED_RECRUITMENT_DRIVES.map((drive) => (
                  <tr key={drive.id} className="hover:bg-slate-750">
                    <td className="py-3 px-3 font-semibold text-white">{drive.title}</td>
                    <td className="py-3 px-3 text-slate-300">
                      {new Date(drive.drive_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{drive.venue_or_mode}</td>
                    <td className="py-3 px-3 text-emerald-400">{drive.eligibility}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                        {drive.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
