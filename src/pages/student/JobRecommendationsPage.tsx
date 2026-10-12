import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  BookmarkPlus,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Info,
  AlertCircle,
} from 'lucide-react';
import { SEED_JOBS, SEED_COMPANIES, SEED_APPLICATIONS } from '@/data/mockSeed';
import { OWNER_SKILLS } from '@/data/ownerProfile';
import { rankJobsForStudent, evaluateJobMatch } from '@/lib/scoring/matching';
import { Job } from '@/types/database';

export const JobRecommendationsPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const isOwner =
    profile?.email?.toLowerCase() === '123himanshuchamatkar@gmail.com' ||
    profile?.id === 'owner-himanshu-chamatkar' ||
    profile?.full_name?.toLowerCase().includes('himanshu');

  const userSkillNames = useMemo(() => {
    if (isOwner) return OWNER_SKILLS.map((s) => s.name);
    try {
      const saved = localStorage.getItem(`dmiher_student_profile_${profile?.id || 'default'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
          return parsed.skills.map((s: any) => s.name || s);
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  }, [profile?.id, isOwner]);

  const isProfileIncomplete = !isOwner && (!profile?.profile_completion || profile.profile_completion < 50);
  const rankedAll = rankJobsForStudent(profile || ({} as any), userSkillNames, SEED_JOBS);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [trackMessage, setTrackMessage] = useState<string | null>(null);

  const domains = ['All', ...Array.from(new Set(SEED_JOBS.map((j) => j.domain)))];
  const workModes = ['All', 'Hybrid', 'Remote', 'On-site'];

  const filteredJobs = rankedAll.filter(({ job }) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || job.domain === selectedDomain;
    const matchesMode = selectedWorkMode === 'All' || job.work_mode === selectedWorkMode;
    return matchesSearch && matchesDomain && matchesMode;
  });

  const handleTrackApplication = (job: Job) => {
    try {
      const storageKey = `dmiher_applications_${profile?.id || 'default'}`;
      const saved = localStorage.getItem(storageKey);
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list) || list.length === 0) {
        list = [...SEED_APPLICATIONS];
      }
      const existing = list.find((a: any) => a.job_id === job.id);
      if (!existing) {
        const newApp = {
          id: `app-${Date.now().toString().slice(-6)}`,
          student_id: profile?.id || 'demo-student',
          job_id: job.id,
          status: 'prepared',
          applied_at: new Date().toISOString(),
          student_notes: `Tracked from Recommended Jobs for ${job.title}.`,
        };
        list.unshift(newApp);
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Failed to save tracked application', e);
    }
    setTrackMessage(`Application for "${job.title}" saved to your Application Tracker with status "Prepared".`);
    setTimeout(() => setTrackMessage(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Recommended Jobs & Campus Drives"
        subtitle="Transparent skill-based matching calibrated against your verified academic profile"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Job Recommendations' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Incomplete Profile Setup Banner */}
        {isProfileIncomplete && (
          <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-950">Action Required: Profile Setup Incomplete</h4>
                <p className="text-xs text-amber-800 mt-0.5 max-w-2xl leading-relaxed">
                  As a newly registered student, add your skills, academic scores, and projects in the Profile Builder to receive personalized, accurate job matches tailored to your profile.
                </p>
              </div>
            </div>
            <Link
              to="/student/profile?first_time=true"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 inline-flex items-center gap-1.5 transition-colors"
            >
              Complete Profile Setup &rarr;
            </Link>
          </div>
        )}

        {/* Track Feedback Notice */}
        {trackMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{trackMessage}</span>
            </div>
            <button
              onClick={() => navigate('/student/applications')}
              className="text-brand-600 font-bold hover:underline"
            >
              Go to Tracker &rarr;
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title, keyword, or technology..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Domain:</span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Mode:</span>
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
              >
                {workModes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredJobs.map(({ job, match }) => {
            const company = SEED_COMPANIES.find((c) => c.id === job.company_id);
            return (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-500/80 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Tags & Match Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {job.employment_type}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
                        {job.work_mode}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{match.score}% Match</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                  <div className="text-xs font-semibold text-brand-700 mt-0.5">
                    {company?.name || 'Partner Technology Firm'}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span>&bull;</span>
                    <span className="font-semibold text-slate-800">
                      ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()} {job.salary_currency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills Match Breakdown */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-500">Skill Breakdown:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {match.matchedRequired.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-medium flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          {s}
                        </span>
                      ))}
                      {match.missingRequired.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-medium flex items-center gap-1"
                        >
                          <XCircle className="w-2.5 h-2.5 text-rose-500" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTrackApplication(job)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      title="Save to tracker"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      Track
                    </button>

                    <button
                      onClick={() => navigate(`/student/cover-letter?jobId=${job.id}`)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Cover Letter
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Job Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedJob.title}</h3>
                  <div className="text-xs font-semibold text-brand-600 mt-0.5">
                    {SEED_COMPANIES.find((c) => c.id === selectedJob.company_id)?.name} &bull; {selectedJob.domain}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Role Description</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Key Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Eligibility Criteria</h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                    {selectedJob.eligibility} &bull; Minimum CGPA required: {selectedJob.minimum_cgpa || 'None'}
                  </div>
                </div>

                {/* External Destination Notice (Section 6 FR-08) */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-bold">Institutional Transparency Notice:</span> Clicking "Open Application URL" navigates directly to the external employer/recruiter portal. Submissions made externally are tracked here only after you confirm your application in the portal.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleTrackApplication(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  Save to Application Tracker
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigate(`/student/cover-letter?jobId=${selectedJob.id}`);
                      setSelectedJob(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Prepare Cover Letter
                  </button>

                  <a
                    href={selectedJob.application_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    Open Application Link
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
