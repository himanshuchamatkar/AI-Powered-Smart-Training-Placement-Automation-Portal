import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  BarChart3,
  Download,
  Info,
  TrendingUp,
  Award,
  Building2,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  // Department-wise stats
  const branchStats = [
    { branch: 'CSE', registered: 65, eligible: 58, placed: 12, rate: '20.7%' },
    { branch: 'AI & Data Science', registered: 32, eligible: 29, placed: 4, rate: '13.8%' },
    { branch: 'IT', registered: 28, eligible: 24, placed: 2, rate: '8.3%' },
  ];

  // Salary Range Breakdown
  const salaryData = [
    { range: '₹4 - 6 LPA', count: 6 },
    { range: '₹6 - 8 LPA', count: 7 },
    { range: '₹8 - 10 LPA', count: 3 },
    { range: '₹10+ LPA', count: 2 },
  ];

  const handleExportCSV = () => {
    const headers = ['Department', 'Registered Students', 'Eligible Candidates', 'Placed Offers', 'Placement Rate'];
    const rows = branchStats.map((b) => [
      `"${b.branch}"`,
      b.registered,
      b.eligible,
      b.placed,
      `"${b.rate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DMIHER_Placement_Department_Summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-16">
      <DashboardHeader
        title="Placement Outcomes & Institutional Analytics"
        subtitle="Departmental denominator breakdowns, salary distributions, and audit-ready data reports"
        breadcrumbs={[
          { label: 'T&P Portal', href: '/admin/overview' },
          { label: 'Analytics' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Integrity Disclaimer Banner */}
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-slate-300 text-xs flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-white">Methodology &amp; Synthetic Data Notice:</span> Placement Rate is calculated with an explicit denominator: <code className="text-emerald-400 bg-black/40 px-1 py-0.5 rounded">Placed Count / Eligible Graduating Students</code>. Records shown represent synthetic seed datasets generated for portal presentation and demonstration.
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Summary (CSV)
          </button>
        </div>

        {/* Branch Summary Table */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Department-Wise Placement Summary</h3>
            <span className="text-xs text-slate-400">Batch 2026–2027</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold bg-slate-850">
                <th className="py-3 px-4">Department / Branch</th>
                <th className="py-3 px-4">Total Registered</th>
                <th className="py-3 px-4">Eligible Candidates</th>
                <th className="py-3 px-4">Verified Offers</th>
                <th className="py-3 px-4">Effective Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {branchStats.map((b) => (
                <tr key={b.branch} className="hover:bg-slate-750">
                  <td className="py-3 px-4 font-bold text-white">{b.branch}</td>
                  <td className="py-3 px-4 text-slate-300">{b.registered}</td>
                  <td className="py-3 px-4 text-slate-300">{b.eligible}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{b.placed}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{b.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Salary Distribution Visual */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-white">Compensation Package Distribution (LPA)</h3>
          <p className="text-xs text-slate-400">Offer distribution across verified synthetic records</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
