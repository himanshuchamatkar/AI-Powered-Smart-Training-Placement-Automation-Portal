import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { SEED_SYNTHETIC_STUDENTS } from '@/data/mockSeed';
import { Profile } from '@/types/database';

export const AdminStudentManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [activeStudent, setActiveStudent] = useState<Profile | null>(null);

  const departments = ['All', 'Computer Science and Engineering', 'Artificial Intelligence & Data Science', 'Information Technology'];
  const years = ['All', '2026', '2027'];

  const filteredStudents = SEED_SYNTHETIC_STUDENTS.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.preferred_domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    const matchesYear = selectedYear === 'All' || s.graduation_year?.toString() === selectedYear;
    return matchesSearch && matchesDept && matchesYear;
  });

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-16">
      <DashboardHeader
        title="Student Roster & Placement Readiness"
        subtitle="Searchable student registry with ATS benchmark scores, domain targets, and qualification profiles"
        breadcrumbs={[
          { label: 'T&P Portal', href: '/admin/overview' },
          { label: 'Student Management' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Search & Filter Controls */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate name or domain..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Batch:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-semibold bg-slate-850">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">ATS Score</th>
                  <th className="py-3 px-4">Preferred Domain</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-slate-750 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                        {stud.full_name.charAt(0)}
                      </div>
                      <span>{stud.full_name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{stud.department?.split(' ')[0] || 'CSE'}</td>
                    <td className="py-3.5 px-4 text-slate-400">{stud.graduation_year}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{stud.cgpa || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          stud.experience_level === 'intermediate'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {stud.experience_level || 'Beginner'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-400">{stud.ats_score || 78}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{stud.preferred_domain || 'AI/ML'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveStudent(stud)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Modal */}
        {activeStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-850 rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-700 shadow-2xl text-slate-100">
              <div className="flex items-start justify-between border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{activeStudent.full_name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activeStudent.department} &bull; Batch of {activeStudent.graduation_year}
                  </div>
                </div>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[11px]">Academic CGPA</span>
                  <div className="text-base font-bold text-emerald-400">{activeStudent.cgpa}</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[11px]">ATS Readiness Score</span>
                  <div className="text-base font-bold text-amber-400">{activeStudent.ats_score}%</div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-semibold">Career Objective</span>
                <p className="text-slate-300 bg-slate-800 p-3 rounded-xl border border-slate-700 leading-relaxed">
                  {activeStudent.career_objective || 'Dedicated engineer preparing for institutional recruitment.'}
                </p>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-semibold">Verified Resume Reference</span>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 flex items-center justify-between">
                  <span>{activeStudent.resume_file_name || 'himanshu Chamatkar_CSE_01Jun26.pdf'}</span>
                  <span className="text-emerald-400 text-[11px] font-semibold">Private Bucket Verified</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end">
                <button
                  onClick={() => setActiveStudent(null)}
                  className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
