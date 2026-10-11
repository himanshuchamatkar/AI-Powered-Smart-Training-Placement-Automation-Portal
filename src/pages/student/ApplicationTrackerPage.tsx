import React, { useState } from 'react';
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
} from 'lucide-react';
import { SEED_APPLICATIONS, SEED_JOBS, SEED_COMPANIES } from '@/data/mockSeed';
import { ApplicationStatus, Application } from '@/types/database';

export const ApplicationTrackerPage: React.FC = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>(
    SEED_APPLICATIONS.filter((a) => a.student_id === profile?.id)
  );

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
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Student can advance their own application from 'prepared' to 'applied' (user-confirmed)
  const handleMarkAsApplied = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'applied',
              applied_at: new Date().toISOString(),
              student_notes: 'User confirmed application submission via employer destination portal.',
            }
          : app
      )
    );
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Application Tracker & Interview Pipeline"
        subtitle="Live tracking of prepared, submitted, shortlisted, and interview scheduled applications"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Application Tracker' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Integrity Notice Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Portal Application Integrity:</span> The portal distinguishes between "Prepared" (cover letter generated), "Applied" (user-confirmed external application), and verified institutional outcomes ("Shortlisted", "Interview", "Selected") recorded by the T&amp;P Placement Office.
          </div>
        </div>

        {/* Application Cards List */}
        <div className="space-y-4">
          {applications.map((app) => {
            const job = SEED_JOBS.find((j) => j.id === app.job_id);
            const company = SEED_COMPANIES.find((c) => c.id === job?.company_id);

            return (
              <div
                key={app.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs border capitalize ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref: #{app.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {job?.title || 'Engineering Role'}
                  </h3>
                  <div className="text-xs font-semibold text-brand-700">
                    {company?.name || 'Partner Technology Firm'} &bull; {job?.location}
                  </div>

                  {app.student_notes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 max-w-xl">
                      <span className="font-semibold text-slate-700">Student Note:</span> {app.student_notes}
                    </div>
                  )}

                  {app.admin_notes && (
                    <div className="text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 max-w-xl">
                      <span className="font-semibold text-emerald-900">T&amp;P Office Update:</span>{' '}
                      {app.admin_notes}
                    </div>
                  )}

                  {app.interview_at && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      Interview Scheduled:{' '}
                      {new Date(app.interview_at).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <div className="text-right text-xs text-slate-400">
                    {app.applied_at && (
                      <div>
                        Submitted on{' '}
                        {new Date(app.applied_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    )}
                  </div>

                  {app.status === 'prepared' && (
                    <button
                      onClick={() => handleMarkAsApplied(app.id)}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
                    >
                      Confirm Applied on Portal
                    </button>
                  )}

                  {app.status === 'shortlisted' && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                      Pending Interview Slot
                    </span>
                  )}

                  {app.status === 'interview' && (
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                      Interview In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
