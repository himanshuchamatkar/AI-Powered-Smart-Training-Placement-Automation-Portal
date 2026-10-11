import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Filter,
  Search,
  MessageSquare,
  Award,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { SEED_APPLICATIONS, SEED_JOBS, SEED_COMPANIES, SEED_SYNTHETIC_STUDENTS } from '@/data/mockSeed';
import { Application, ApplicationStatus } from '@/types/database';

export const AdminApplicationManagementPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(SEED_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('shortlisted');
  const [adminNote, setAdminNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('2026-10-25T11:00');

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id
          ? {
              ...app,
              status: newStatus,
              admin_notes: adminNote || app.admin_notes,
              interview_at: newStatus === 'interview' ? new Date(interviewDate).toISOString() : app.interview_at,
              updated_at: new Date().toISOString(),
            }
          : app
      )
    );

    setSelectedApp(null);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'selected':
        return 'bg-emerald-500/20 text-emerald-400 font-bold';
      case 'interview':
        return 'bg-purple-500/20 text-purple-400 font-semibold';
      case 'shortlisted':
        return 'bg-blue-500/20 text-blue-400 font-semibold';
      case 'applied':
        return 'bg-amber-500/20 text-amber-400 font-medium';
      case 'prepared':
        return 'bg-slate-700 text-slate-300 font-medium';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-16">
      <DashboardHeader
        title="Application Review &amp; Placement Pipeline"
        subtitle="Manage student applications, assign interview slots, record internal notes, and confirm offers"
        breadcrumbs={[
          { label: 'T&P Portal', href: '/admin/overview' },
          { label: 'Application Pipeline' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Pipeline Table */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-semibold bg-slate-850">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Target Job</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Interview Schedule</th>
                  <th className="py-3 px-4">T&amp;P Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {applications.map((app) => {
                  const job = SEED_JOBS.find((j) => j.id === app.job_id);
                  const company = SEED_COMPANIES.find((c) => c.id === job?.company_id);
                  const student = SEED_SYNTHETIC_STUDENTS.find((s) => s.id === app.student_id);

                  return (
                    <tr key={app.id} className="hover:bg-slate-750 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {student?.full_name || 'Himanshu Vikas Chamatkar'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">{job?.title || 'Engineer'}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold">{company?.name}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {app.interview_at ? (
                          <span className="text-purple-400 font-medium">
                            {new Date(app.interview_at).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-500">Not scheduled</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {app.admin_notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNewStatus(app.status);
                            setAdminNote(app.admin_notes || '');
                          }}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Status Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-850 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-700 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-white">Update Candidate Application</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Lifecycle Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="prepared">Prepared</option>
                    <option value="applied">Applied (User-Confirmed)</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview Scheduled</option>
                    <option value="selected">Selected / Offer Made</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {newStatus === 'interview' && (
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Interview Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">T&amp;P Internal Notes</label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Candidate passed technical round; shortlisted for manager round..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                  >
                    Save &amp; Notify Student View
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
