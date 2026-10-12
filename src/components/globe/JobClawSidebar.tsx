import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Briefcase,
  MapPin,
  ExternalLink,
  CheckCircle2,
  BookmarkPlus,
  Sparkles,
  Building2,
  DollarSign,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { JobPin, GlobeSidebarMode } from '@/types/jobclaw';
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '@/data/jobclawJobs';
import { useAuth } from '@/context/AuthContext';

interface JobClawSidebarProps {
  mode: GlobeSidebarMode;
  selectedCountry: string | null;
  selectedCountryName: string | null;
  countryJobs: JobPin[];
  selectedJob: JobPin | null;
  matchScores?: Record<string, number>;
  onSelectJob: (job: JobPin) => void;
  onBack: () => void;
  onClose: () => void;
}

export const JobClawSidebar: React.FC<JobClawSidebarProps> = ({
  mode,
  selectedCountry,
  selectedCountryName,
  countryJobs,
  selectedJob,
  matchScores = {},
  onSelectJob,
  onBack,
  onClose,
}) => {
  const { profile } = useAuth();
  const [listSearch, setListSearch] = useState('');
  const [trackedMessage, setTrackedMessage] = useState<string | null>(null);

  const isOpen = mode !== 'closed';

  const filteredCountryJobs = countryJobs.filter((job) => {
    if (!listSearch.trim()) return true;
    const q = listSearch.toLowerCase();
    return (
      job.job_title.toLowerCase().includes(q) ||
      job.employer_name.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleTrackApplication = (job: JobPin) => {
    try {
      const storageKey = `dmiher_applications_${profile?.id || 'default'}`;
      const saved = localStorage.getItem(storageKey);
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];

      const exists = list.some((a: any) => a.job_id === job.job_id);
      if (!exists) {
        const newApp = {
          id: `app-claw-${Date.now()}`,
          student_id: profile?.id || 'demo-student',
          job_id: job.job_id,
          status: 'prepared',
          applied_at: new Date().toISOString(),
          student_notes: `Tracked via JobClaw 3D Global Radar for ${job.job_title} at ${job.employer_name}.`,
        };
        list.unshift(newApp);
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
      setTrackedMessage(`Added "${job.job_title}" to Application Tracker!`);
      setTimeout(() => setTrackedMessage(null), 3500);
    } catch (err) {
      console.warn('Failed to track job', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sliding Drawer Container */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] z-50 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700/80 shadow-2xl flex flex-col text-slate-100 transition-transform duration-300 ease-out`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {mode === 'job-detail' && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Back to country jobs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div>
              {mode === 'country-list' && (
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedCountry ? COUNTRY_FLAGS[selectedCountry] || '🌐' : '🌐'}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {selectedCountryName || (selectedCountry ? COUNTRY_NAMES[selectedCountry] : 'Global Regions')}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {countryJobs.length} active placement &amp; tech roles
                    </p>
                  </div>
                </div>
              )}

              {mode === 'job-detail' && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
                    Role Specification
                  </div>
                  <h3 className="text-sm font-bold text-white truncate max-w-[260px]">
                    {selectedJob?.job_title}
                  </h3>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {trackedMessage && (
          <div className="mx-4 mt-3 p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{trackedMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* MODE 1: Country Job List */}
          {mode === 'country-list' && (
            <div className="space-y-3">
              {/* Country List Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="Filter jobs in this region..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {filteredCountryJobs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs">No active positions matching current query in this region.</p>
                </div>
              ) : (
                filteredCountryJobs.map((job) => {
                  const match = matchScores[job.job_id] || 0;
                  return (
                    <div
                      key={job.job_id}
                      onClick={() => onSelectJob(job)}
                      className="p-4 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-brand-500/50 rounded-xl cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                            {job.job_title}
                          </h4>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>{job.employer_name}</span>
                          </div>
                        </div>

                        {match > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              match >= 75
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            }`}
                          >
                            {match}% Match
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-400" />
                          {job.job_city}
                        </span>
                        <span>&bull;</span>
                        <span className="px-1.5 py-0.5 bg-slate-700/60 rounded text-slate-300">
                          {job.job_employment_type}
                        </span>
                        {job.job_is_remote && (
                          <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-400 rounded">
                            Remote
                          </span>
                        )}
                      </div>

                      {job.salary && (
                        <div className="text-[11px] font-semibold text-emerald-400">
                          {job.salary}
                        </div>
                      )}

                      {/* Top Skills Preview */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-slate-900 border border-slate-700/60 rounded text-[10px] text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* MODE 2: Job Detail View */}
          {mode === 'job-detail' && selectedJob && (
            <div className="space-y-5">
              {/* Top Card */}
              <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {selectedJob.domain || 'Technology & Engineering'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {selectedJob.job_title}
                    </h3>
                    <div className="text-xs font-semibold text-slate-300 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedJob.employer_name}</span>
                    </div>
                  </div>

                  {(matchScores[selectedJob.job_id] || 0) > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-center shrink-0">
                      <div className="text-base font-extrabold text-emerald-400 leading-none">
                        {matchScores[selectedJob.job_id]}%
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold mt-1">
                        ATS Match
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/70">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="truncate">{selectedJob.job_location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{selectedJob.job_employment_type}</span>
                  </div>
                  {selectedJob.salary && (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedJob.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{selectedJob.experience_level}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={selectedJob.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Apply on Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleTrackApplication(selectedJob)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  title="Save to Application Tracker"
                >
                  <BookmarkPlus className="w-4 h-4 text-amber-400" />
                  <span>Track</span>
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Role Overview
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                  {selectedJob.description}
                </p>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Key Deliverables
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-400 mt-0.5">&bull;</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Target Technical Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
