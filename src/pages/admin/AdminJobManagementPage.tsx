import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  Briefcase,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  Archive,
  Edit2,
  Trash2,
} from 'lucide-react';
import { SEED_JOBS, SEED_COMPANIES, SEED_RECRUITMENT_DRIVES } from '@/data/mockSeed';
import { Job, RecruitmentDrive } from '@/types/database';

export const AdminJobManagementPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [drives, setDrives] = useState<RecruitmentDrive[]>(SEED_RECRUITMENT_DRIVES);
  const [activeTab, setActiveTab] = useState<'jobs' | 'drives'>('jobs');
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // Simple form state for adding job
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Artificial Intelligence & Machine Learning');
  const [newLocation, setNewLocation] = useState('Bengaluru, India');
  const [newMinCgpa, setNewMinCgpa] = useState('6.0');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created: Job = {
      id: `job-custom-${Date.now()}`,
      company_id: SEED_COMPANIES[0].id,
      title: newTitle,
      domain: newDomain,
      description: 'Newly registered campus recruitment position managed by T&P Office.',
      responsibilities: ['Execute engineering deliverables and collaborate with product teams.'],
      required_skills: ['Python', 'SQL', 'Git & GitHub'],
      preferred_skills: ['Docker', 'REST APIs'],
      eligibility: `B.Tech all streams with minimum ${newMinCgpa} CGPA`,
      minimum_cgpa: parseFloat(newMinCgpa) || 6.0,
      experience_level: 'beginner',
      employment_type: 'Full-time',
      work_mode: 'Hybrid',
      location: newLocation,
      salary_min: 700000,
      salary_max: 950000,
      salary_currency: 'INR',
      is_synthetic: true,
      status: 'published',
      posted_at: new Date().toISOString(),
    };

    setJobs([created, ...jobs]);
    setShowAddJobModal(false);
    setNewTitle('');
  };

  const handleToggleJobStatus = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: j.status === 'published' ? 'closed' : 'published' } : j
      )
    );
  };

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-16">
      <DashboardHeader
        title="Jobs & Campus Recruitment Drives Administration"
        subtitle="Publish, modify, and monitor recruitment eligibility criteria for participating corporate employers"
        breadcrumbs={[
          { label: 'T&P Portal', href: '/admin/overview' },
          { label: 'Jobs & Drives' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Navigation & Add Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Job Openings ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('drives')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'drives'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Recruitment Drives ({drives.length})
            </button>
          </div>

          <button
            onClick={() => setShowAddJobModal(true)}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Job Opening
          </button>
        </div>

        {/* Tab 1: Job Openings Table */}
        {activeTab === 'jobs' && (
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-semibold bg-slate-850">
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Work Mode</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {jobs.map((job) => {
                    const comp = SEED_COMPANIES.find((c) => c.id === job.company_id);
                    return (
                      <tr key={job.id} className="hover:bg-slate-750 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{job.title}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-semibold">{comp?.name || 'Partner Org'}</td>
                        <td className="py-3.5 px-4 text-slate-300">{job.domain}</td>
                        <td className="py-3.5 px-4 text-slate-300">{job.work_mode}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-200">
                          ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              job.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleJobStatus(job.id)}
                            className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[11px] font-medium text-slate-200"
                          >
                            {job.status === 'published' ? 'Archive' : 'Publish'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Drives */}
        {activeTab === 'drives' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                    {drive.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Drive Date:{' '}
                    {new Date(drive.drive_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{drive.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{drive.description}</p>

                <div className="pt-2 border-t border-slate-700/80 text-xs space-y-1">
                  <div>
                    <span className="text-slate-400">Venue:</span>{' '}
                    <span className="text-white font-medium">{drive.venue_or_mode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Eligibility:</span>{' '}
                    <span className="text-emerald-400 font-medium">{drive.eligibility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Job Modal */}
        {showAddJobModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-850 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-700 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-white">Create New Campus Job Listing</h3>
                <button
                  onClick={() => setShowAddJobModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Junior Autonomous Systems Developer"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Engineering Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence &amp; Machine Learning</option>
                    <option value="Automation & Agentic AI">Automation &amp; Agentic AI</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cybersecurity & Infrastructure">Cybersecurity &amp; Infrastructure</option>
                    <option value="Data Science & Analytics">Data Science &amp; Analytics</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Location</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Minimum CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newMinCgpa}
                      onChange={(e) => setNewMinCgpa(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddJobModal(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                  >
                    Save &amp; Publish Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
