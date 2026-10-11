import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  FileCheck2,
  Briefcase,
  ListTodo,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { SEED_JOBS, SEED_COMPANIES, SEED_APPLICATIONS, SEED_RECRUITMENT_DRIVES, SEED_ANNOUNCEMENTS } from '@/data/mockSeed';
import { OWNER_SKILLS } from '@/data/ownerProfile';
import { rankJobsForStudent } from '@/lib/scoring/matching';
import { getScoreForUser } from '@/lib/scoring/ats';
import { Application, ApplicationStatus } from '@/types/database';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const atsScore = getScoreForUser(profile || ({} as any));
  const userSkillNames = OWNER_SKILLS.map((s) => s.name);

  // Top ranked jobs for this student
  const rankedJobs = rankJobsForStudent(profile || ({} as any), userSkillNames, SEED_JOBS);
  const topJobs = rankedJobs.slice(0, 3);

  // Student applications with persistent localStorage synchronization
  const storageKey = `dmiher_applications_${profile?.id || 'default'}`;
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved applications on dashboard', e);
    }
    const apps = SEED_APPLICATIONS.filter((a) => a.student_id === profile?.id);
    if (apps.length > 0) return apps;
    return SEED_APPLICATIONS.map((app) => ({
      ...app,
      id: `${app.id}-${profile?.id ? profile.id.slice(0, 8) : 'student'}`,
      student_id: profile?.id || 'demo-student',
    }));
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleUpdateAppStatus = (appId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) => {
      const next = prev.map((app) => {
        if (app.id !== appId) return app;
        const updated: Application = { ...app, status: newStatus };
        if (newStatus === 'applied' && !updated.applied_at) {
          updated.applied_at = new Date().toISOString();
        } else if (newStatus === 'interview' && !updated.interview_at) {
          const future = new Date();
          future.setDate(future.getDate() + 4);
          future.setHours(14, 30, 0, 0);
          updated.interview_at = future.toISOString();
        }
        return updated;
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to sync application status from dashboard', e);
      }
      return next;
    });

    setToastMessage(`Application status updated to "${newStatus.toUpperCase()}"!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <DashboardHeader
        title={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Student'}`}
        subtitle="DMIHER Faculty of Engineering & Technology &bull; Department of CSE"
        breadcrumbs={[{ label: 'Student Portal', href: '/student/dashboard' }, { label: 'Dashboard Overview' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Top Profile Summary Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-navy-800 to-brand-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-brand-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-2 border border-brand-500/30">
                <Award className="w-3.5 h-3.5" />
                <span>B.Tech CSE &bull; Batch of {profile?.graduation_year || 2027}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {profile?.full_name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {profile?.career_objective || 'AI/ML & Automation Engineer'}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-slate-300">
                <div>
                  <span className="text-slate-400">CGPA:</span>{' '}
                  <span className="text-white font-bold">{profile?.cgpa || '6.29'}</span>
                </div>
                <div>&bull;</div>
                <div>
                  <span className="text-slate-400">Readiness Level:</span>{' '}
                  <span className="text-emerald-400 font-semibold capitalize">
                    {profile?.experience_level || 'Intermediate'}
                  </span>
                </div>
                <div>&bull;</div>
                <div>
                  <span className="text-slate-400">Profile Completion:</span>{' '}
                  <span className="text-brand-300 font-semibold">{profile?.profile_completion || 96}%</span>
                </div>
              </div>
            </div>

            {/* ATS Score Dial Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex items-center gap-5 shrink-0">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400"
                    strokeDasharray={`${atsScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-bold text-white leading-none">
                    {atsScore}%
                  </span>
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">Score</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-white">ATS Readiness</div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  Above Campus Benchmark
                </div>
                <div className="text-[10px] text-slate-400 mt-1 max-w-[130px]">
                  Calibrated for AI/ML &amp; Automation roles
                </div>
                <Link
                  to="/student/ats"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300"
                >
                  View full breakdown <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action Shortcuts & Pipeline Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/student/profile"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">Profile Builder</div>
            <div className="text-xs text-slate-500 mt-0.5">Projects, skills &amp; resume details</div>
          </Link>

          <Link
            to="/student/ats"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">ATS Resume Audit</div>
            <div className="text-xs text-slate-500 mt-0.5">Missing keywords &amp; score impact</div>
          </Link>

          <Link
            to="/student/jobs"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">Recommended Jobs</div>
            <div className="text-xs text-slate-500 mt-0.5">Skill-aligned campus opportunities</div>
          </Link>

          <Link
            to="/student/applications"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ListTodo className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">Application Tracker</div>
            <div className="text-xs text-slate-500 mt-0.5">{applications.length} active portal submissions</div>
          </Link>
        </div>

        {/* Dashboard Status Update Feedback Toast */}
        {toastMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage} (Saved across portal)</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Live Application Tracker & Quick Status Updater Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <ListTodo className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Active Application Tracker &amp; Pipeline
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {applications.length} Tracked
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Update your job application stages directly here or from the dedicated tracker page
              </p>
            </div>
            <Link
              to="/student/applications"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline shrink-0"
            >
              Open Full Tracker Page <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => {
              const job = SEED_JOBS.find((j) => j.id === app.job_id);
              const company = SEED_COMPANIES.find((c) => c.id === job?.company_id);

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status === 'selected' ? '🎉 Selected' : app.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ref: #{app.id.slice(0, 8)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {job?.title || 'Campus Placement Role'}
                      </h4>
                      <div className="text-xs font-semibold text-brand-700 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-brand-600" />
                        {company?.name || 'Partner Technology Firm'} &bull; {job?.location}
                      </div>
                    </div>

                    {app.interview_at && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                        <Clock className="w-3 h-3 text-purple-600" />
                        Interview:{' '}
                        {new Date(app.interview_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dropdown to update status directly from Dashboard */}
                  <div className="pt-2 border-t border-slate-200/70 space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                      <RotateCcw className="w-2.5 h-2.5 text-brand-600" />
                      Update Status:
                    </label>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleUpdateAppStatus(app.id, e.target.value as ApplicationStatus)
                      }
                      className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-2xs hover:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer"
                    >
                      <option value="draft">Draft (Planning)</option>
                      <option value="prepared">Prepared (Ready)</option>
                      <option value="applied">Applied (Submitted)</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview (Scheduled)</option>
                      <option value="selected">Selected (Offer 🎉)</option>
                      <option value="rejected">Rejected (Closed)</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout: Recommended Jobs & Drives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommended Jobs (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Top Recommended Positions</h3>
                <p className="text-xs text-slate-500">Ranked using transparent 60/20/10/10 skill matching rules</p>
              </div>
              <Link
                to="/student/jobs"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all ({SEED_JOBS.length}) <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {topJobs.map(({ job, match }) => (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {job.employment_type}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                        {job.work_mode}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                    <div className="text-xs text-slate-500 font-medium">
                      {job.location} &bull; Min CGPA: {job.minimum_cgpa || 'N/A'}
                    </div>

                    {/* Matched skills pill preview */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {match.matchedRequired.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium rounded-md flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          {s}
                        </span>
                      ))}
                      {match.missingRequired.length > 0 && (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-medium rounded-md">
                          +{match.missingRequired.length} missing skill
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-600">{match.score}%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Match Score</div>
                    </div>

                    <Link
                      to={`/student/jobs`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recruitment Drives & Announcements */}
          <div className="space-y-6">
            {/* Campus Drives */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  Upcoming Campus Drives
                </h3>
                <span className="text-[11px] font-semibold text-brand-600">
                  {SEED_RECRUITMENT_DRIVES.length} Scheduled
                </span>
              </div>

              <div className="space-y-3">
                {SEED_RECRUITMENT_DRIVES.slice(0, 2).map((drive) => (
                  <div
                    key={drive.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5"
                  >
                    <div className="font-semibold text-slate-900">{drive.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Date:{' '}
                      <span className="text-slate-800 font-medium">
                        {new Date(drive.drive_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Venue: <span className="text-slate-700">{drive.venue_or_mode}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block font-medium">
                      {drive.eligibility}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Announcements */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Placement Cell Notices</h3>
                <Link to="/student/announcements" className="text-xs text-brand-600 font-semibold">
                  All Notices
                </Link>
              </div>

              <div className="space-y-2.5">
                {SEED_ANNOUNCEMENTS.slice(0, 2).map((ann) => (
                  <div key={ann.id} className="border-l-2 border-brand-500 pl-3 py-1 text-xs">
                    <div className="font-semibold text-slate-900">{ann.title}</div>
                    <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{ann.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
