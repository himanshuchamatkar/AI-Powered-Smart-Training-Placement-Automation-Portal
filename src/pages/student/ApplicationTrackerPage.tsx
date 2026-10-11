import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import {
  ListTodo,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  RotateCcw,
  Sparkles,
  Award,
  Filter,
  Search,
  Check,
} from 'lucide-react';
import { SEED_APPLICATIONS, SEED_JOBS, SEED_COMPANIES } from '@/data/mockSeed';
import { ApplicationStatus, Application } from '@/types/database';

export const ApplicationTrackerPage: React.FC = () => {
  const { profile } = useAuth();
  const storageKey = `dmiher_applications_${profile?.id || 'default'}`;

  // Load saved applications or initialize with student-specific applications
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved applications', e);
    }

    const userApps = SEED_APPLICATIONS.filter((a) => a.student_id === profile?.id);
    if (userApps.length > 0) return userApps;

    // Fallback: map seed applications to current student
    return SEED_APPLICATIONS.map((app) => ({
      ...app,
      id: `${app.id}-${profile?.id ? profile.id.slice(0, 8) : 'student'}`,
      student_id: profile?.id || 'demo-student',
    }));
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist applications whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(applications));
    } catch (e) {
      console.warn('Failed to save applications to localStorage', e);
    }
  }, [applications, storageKey]);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-semibold';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-semibold';
      case 'applied':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-medium';
      case 'prepared':
        return 'bg-slate-100 text-slate-700 border-slate-300 font-medium';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-medium';
      case 'withdrawn':
        return 'bg-zinc-100 text-zinc-600 border-zinc-300 font-medium';
      case 'draft':
        return 'bg-sky-50 text-sky-700 border-sky-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Update status directly from dropdown
  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const updated: Application = {
          ...app,
          status: newStatus,
        };

        if (newStatus === 'applied') {
          if (!updated.applied_at) {
            updated.applied_at = new Date().toISOString();
          }
          if (!updated.student_notes) {
            updated.student_notes = 'Application confirmed and submitted via employer portal.';
          }
        } else if (newStatus === 'interview') {
          if (!updated.interview_at) {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 4);
            nextWeek.setHours(14, 30, 0, 0);
            updated.interview_at = nextWeek.toISOString();
          }
          updated.admin_notes = 'Technical Interview Slot Scheduled. Link and syllabus dispatched.';
        } else if (newStatus === 'selected') {
          updated.admin_notes = 'Offer letter roll-out confirmed by partner hiring team. Congratulations!';
        } else if (newStatus === 'shortlisted') {
          updated.admin_notes = 'Profile cleared ATS & automated keyword screening threshold.';
        } else if (newStatus === 'rejected') {
          updated.admin_notes = 'Application cycle completed. Keep optimizing resume for subsequent drives.';
        } else if (newStatus === 'withdrawn') {
          updated.student_notes = 'Application retracted by candidate.';
        }

        return updated;
      })
    );

    setToastMessage(`Application status updated to "${newStatus.toUpperCase()}" successfully.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Reset to original seed applications
  const handleResetApplications = () => {
    const freshApps = SEED_APPLICATIONS.map((app) => ({
      ...app,
      id: `${app.id}-${profile?.id ? profile.id.slice(0, 8) : 'student'}`,
      student_id: profile?.id || 'demo-student',
    }));
    setApplications(freshApps);
    localStorage.removeItem(storageKey);
    setToastMessage('Applications reset to default seed benchmark.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const job = SEED_JOBS.find((j) => j.id === app.job_id);
    const company = SEED_COMPANIES.find((c) => c.id === job?.company_id);

    const matchesFilter =
      statusFilter === 'all' ? true : app.status === statusFilter;

    const matchesSearch =
      searchQuery === ''
        ? true
        : (job?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.student_notes || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // KPI Metrics
  const totalCount = applications.length;
  const appliedCount = applications.filter((a) => a.status === 'applied').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'interview').length;
  const selectedCount = applications.filter((a) => a.status === 'selected').length;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Application Tracker & Pipeline Management"
        subtitle="Manage live stages, update application progress, and track scheduled interviews"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Application Tracker' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Pipeline Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Tracked</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active entries</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-2xs">
            <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Submitted</div>
            <div className="text-2xl font-black text-amber-700 mt-1">{appliedCount}</div>
            <div className="text-[10px] text-amber-600/80 mt-0.5">Awaiting feedback</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Shortlisted</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{shortlistedCount}</div>
            <div className="text-[10px] text-blue-600/80 mt-0.5">Screening cleared</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-purple-200/80 bg-purple-50/20 shadow-2xs">
            <div className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Interviews</div>
            <div className="text-2xl font-black text-purple-700 mt-1">{interviewCount}</div>
            <div className="text-[10px] text-purple-600/80 mt-0.5">Rounds scheduled</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs col-span-2 sm:col-span-1">
            <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Selected / Offers</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{selectedCount}</div>
            <div className="text-[10px] text-emerald-600/80 mt-0.5">Final selections</div>
          </div>
        </div>

        {/* Integrity Notice Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Lifecycle Status Control:</span> You can now use the status dropdown on any application card to manually advance its state (e.g. from <em>Applied</em> to <em>Interview</em> or <em>Selected</em>). Changes are automatically preserved in your session.
            </div>
          </div>
          <button
            onClick={handleResetApplications}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
            title="Reset to default seed applications"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            Reset Defaults
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'prepared', label: 'Prepared' },
              { id: 'applied', label: 'Applied' },
              { id: 'shortlisted', label: 'Shortlisted' },
              { id: 'interview', label: 'Interview' },
              { id: 'selected', label: 'Selected' },
              { id: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative shrink-0 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role or company..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Application Cards List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <ListTodo className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No applications match the current filter</h4>
              <p className="text-xs text-slate-400 mt-1">
                Try selecting "All" or clear your search query to see active applications.
              </p>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const job = SEED_JOBS.find((j) => j.id === app.job_id);
              const company = SEED_COMPANIES.find((c) => c.id === job?.company_id);

              return (
                <div
                  key={app.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left Column: Details & Status */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border capitalize ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status === 'selected' ? '🎉 Selected / Placed' : app.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Ref: #{app.id}
                      </span>
                      {app.applied_at && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Applied: {new Date(app.applied_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {job?.title || 'Campus Placement Role'}
                      </h3>
                      <div className="text-xs font-semibold text-brand-700 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-600" />
                        {company?.name || 'Partner Technology Firm'} &bull; {job?.location || 'India'}
                      </div>
                    </div>

                    {app.student_notes && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 max-w-2xl">
                        <span className="font-semibold text-slate-700">Student Note:</span> {app.student_notes}
                      </div>
                    )}

                    {app.admin_notes && (
                      <div className="text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/90 max-w-2xl">
                        <span className="font-bold text-emerald-950">T&amp;P Placement Cell:</span>{' '}
                        {app.admin_notes}
                      </div>
                    )}

                    {app.interview_at && (
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        Interview Scheduled:{' '}
                        {new Date(app.interview_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Status Dropdown & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0 lg:min-w-[240px]">
                    {/* Status Dropdown */}
                    <div className="w-full sm:w-auto lg:w-full space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                        <RotateCcw className="w-3 h-3 text-brand-600" />
                        Update Application Status
                      </label>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as ApplicationStatus)
                        }
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-2xs hover:border-brand-500 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all cursor-pointer"
                      >
                        <option value="draft">Draft (Planning)</option>
                        <option value="prepared">Prepared (Cover Letter Ready)</option>
                        <option value="applied">Applied (Submitted)</option>
                        <option value="shortlisted">Shortlisted (Screened)</option>
                        <option value="interview">Interview (Scheduled)</option>
                        <option value="selected">Selected (Offer Received 🏆)</option>
                        <option value="rejected">Rejected (Closed)</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                      <div className="text-[10px] text-slate-400 text-left lg:text-right pt-0.5">
                        Select new stage to update live
                      </div>
                    </div>

                    {/* Quick Action Badges */}
                    <div className="flex items-center gap-2">
                      {app.status === 'prepared' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'applied')}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
                        >
                          Mark as Applied
                        </button>
                      )}
                      {app.status === 'applied' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'interview')}
                          className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors"
                        >
                          Schedule Interview
                        </button>
                      )}
                      {app.status === 'interview' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'selected')}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
                        >
                          Mark as Selected 🏆
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
