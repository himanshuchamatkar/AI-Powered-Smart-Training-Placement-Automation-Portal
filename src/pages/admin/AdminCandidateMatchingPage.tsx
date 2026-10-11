import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  GitCompare,
  Briefcase,
  CheckCircle2,
  XCircle,
  Download,
  Sparkles,
  Info,
  Users,
} from 'lucide-react';
import { SEED_JOBS, SEED_SYNTHETIC_STUDENTS, SEED_COMPANIES } from '@/data/mockSeed';
import { OWNER_SKILLS } from '@/data/ownerProfile';
import { evaluateJobMatch } from '@/lib/scoring/matching';

export const AdminCandidateMatchingPage: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState(SEED_JOBS[0].id);
  const selectedJob = SEED_JOBS.find((j) => j.id === selectedJobId) || SEED_JOBS[0];
  const company = SEED_COMPANIES.find((c) => c.id === selectedJob.company_id);

  // Evaluate all students against selected job
  const candidateMatches = SEED_SYNTHETIC_STUDENTS.map((student) => {
    // For owner we use owner skills, for synthetic students generate aligned skills
    const skills =
      student.email === '123himanshuchamatkar@gmail.com'
        ? OWNER_SKILLS.map((s) => s.name)
        : [
            ...(selectedJob.required_skills?.slice(0, 3) || []),
            'Python',
            'SQL',
            'Git & GitHub',
          ];

    const match = evaluateJobMatch(student, skills, selectedJob);
    return {
      student,
      match,
    };
  }).sort((a, b) => b.match.score - a.match.score);

  const handleExportCSV = () => {
    const headers = ['Rank', 'Student Name', 'Department', 'CGPA', 'Match Score', 'Eligibility', 'Matched Skills'];
    const rows = candidateMatches.map((c, idx) => [
      idx + 1,
      `"${c.student.full_name}"`,
      `"${c.student.department}"`,
      c.student.cgpa || 'N/A',
      `${c.match.score}%`,
      c.match.eligibilityPassed ? 'Eligible' : 'Ineligible',
      `"${c.match.matchedRequired.join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Candidate_Match_${selectedJob.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-16">
      <DashboardHeader
        title="Candidate Matching Engine"
        subtitle="Transparent algorithmic matching ranking eligible students against active job requirements"
        breadcrumbs={[
          { label: 'T&P Portal', href: '/admin/overview' },
          { label: 'Candidate Matching' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Job Selection Bar */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Evaluate Candidates for Job Opening:</span>
            <div className="flex items-center gap-3">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SEED_JOBS.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({SEED_COMPANIES.find((c) => c.id === j.company_id)?.name})
                  </option>
                ))}
              </select>
              <span className="text-xs text-emerald-400 font-medium">
                Min CGPA: {selectedJob.minimum_cgpa || 'None'}
              </span>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Export Matching Shortlist (CSV)
          </button>
        </div>

        {/* Explainability Notice */}
        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl text-slate-300 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-white">Decision Support Principle:</span> Rankings are determined by deterministic rule weights: 60% required skills, 20% preferred skills, 10% domain alignment, and 10% experience level. Hard CGPA eligibility thresholds are applied first. This ranking is strictly decision support for placement officers.
          </div>
        </div>

        {/* Candidate Ranking List */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-semibold bg-slate-850">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Match Score</th>
                  <th className="py-3 px-4">Matched Required Skills</th>
                  <th className="py-3 px-4">Eligibility Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {candidateMatches.map(({ student, match }, idx) => (
                  <tr key={student.id} className="hover:bg-slate-750 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span>{student.full_name}</span>
                        {student.email?.includes('123himanshu') && (
                          <span className="px-1.5 py-0.5 bg-brand-900/80 text-brand-300 text-[10px] rounded font-mono">
                            Owner
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{student.department?.split(' ')[0] || 'CSE'}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{student.cgpa || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-emerald-400 text-sm">{match.score}%</span>
                        <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${match.score}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {match.matchedRequired.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {match.eligibilityPassed ? (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
                          Eligible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold">
                          Ineligible (CGPA)
                        </span>
                      )}
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
