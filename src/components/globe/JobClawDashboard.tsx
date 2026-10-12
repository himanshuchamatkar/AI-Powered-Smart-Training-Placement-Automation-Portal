import React, { useState, useMemo, useCallback } from 'react';
import {
  Globe,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  MapPin,
  Briefcase,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';
import { JobClawGlobe } from './JobClawGlobe';
import { JobClawSidebar } from './JobClawSidebar';
import { JOBCLAW_PINS, COUNTRY_NAMES, COUNTRY_FLAGS } from '@/data/jobclawJobs';
import { JobPin, GlobeFilterState, GlobeSidebarMode } from '@/types/jobclaw';
import { useAuth } from '@/context/AuthContext';
import { OWNER_SKILLS } from '@/data/ownerProfile';

interface JobClawDashboardProps {
  embedded?: boolean;
}

export const JobClawDashboard: React.FC<JobClawDashboardProps> = ({ embedded = false }) => {
  const { profile } = useAuth();

  const isOwner =
    profile?.email?.trim().toLowerCase() === '123himanshuchamatkar@gmail.com' ||
    profile?.id === 'owner-himanshu-chamatkar';

  // Extract student skills for matching
  const studentSkills = useMemo(() => {
    if (isOwner) return OWNER_SKILLS.map((s) => s.name.toLowerCase());
    try {
      const saved = localStorage.getItem(`dmiher_student_profile_${profile?.id || 'default'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
          return parsed.skills.map((s: any) => (s.name || s).toLowerCase());
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return ['python', 'react', 'sql', 'machine learning'];
  }, [profile?.id, isOwner]);

  // Compute match score for each pin
  const matchScores = useMemo(() => {
    const scores: Record<string, number> = {};
    JOBCLAW_PINS.forEach((pin) => {
      if (studentSkills.length === 0) {
        scores[pin.job_id] = 50;
        return;
      }
      const jobSkills = pin.skills.map((s) => s.toLowerCase());
      const matched = jobSkills.filter((js) =>
        studentSkills.some((ss: string) => ss.includes(js) || js.includes(ss))
      );
      const ratio = matched.length / (jobSkills.length || 1);
      const calculated = Math.min(95, Math.max(40, Math.round(ratio * 100)));
      scores[pin.job_id] = calculated;
    });
    return scores;
  }, [studentSkills]);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [onlyRemote, setOnlyRemote] = useState<boolean>(false);
  const [onlyInternship, setOnlyInternship] = useState<boolean>(false);
  const [onlyHighMatch, setOnlyHighMatch] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Sidebar Drawer State
  const [sidebarMode, setSidebarMode] = useState<GlobeSidebarMode>('closed');
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeCountryName, setActiveCountryName] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<JobPin | null>(null);

  // Filtered Pins
  const filteredPins = useMemo(() => {
    return JOBCLAW_PINS.filter((pin) => {
      // Keyword search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = pin.job_title.toLowerCase().includes(q);
        const matchesCompany = pin.employer_name.toLowerCase().includes(q);
        const matchesCity = pin.job_city.toLowerCase().includes(q);
        const matchesSkills = pin.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesCity && !matchesSkills) {
          return false;
        }
      }

      // Country filter
      if (selectedCountryCode !== 'ALL' && pin.job_country !== selectedCountryCode) {
        return false;
      }

      // Domain filter
      if (selectedDomain !== 'ALL' && pin.domain !== selectedDomain) {
        return false;
      }

      // Remote filter
      if (onlyRemote && !pin.job_is_remote) {
        return false;
      }

      // Internship filter
      if (onlyInternship && !pin.job_employment_type.toLowerCase().includes('intern')) {
        return false;
      }

      // High Match filter (>= 70%)
      if (onlyHighMatch && (matchScores[pin.job_id] || 0) < 70) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedCountryCode, selectedDomain, onlyRemote, onlyInternship, onlyHighMatch, matchScores]);

  // Country counts derivation
  const countryCounts = useMemo(() => {
    const map = new Map<string, number>();
    filteredPins.forEach((pin) => {
      map.set(pin.job_country, (map.get(pin.job_country) || 0) + 1);
    });
    return Array.from(map.entries()).map(([country, count]) => ({ country, count }));
  }, [filteredPins]);

  // Jobs for selected country
  const countryJobs = useMemo(() => {
    if (!activeCountry) return filteredPins;
    return filteredPins.filter((p) => p.job_country === activeCountry);
  }, [filteredPins, activeCountry]);

  // Pin selection handler
  const handleSelectPin = useCallback((pin: JobPin) => {
    setSelectedPin(pin);
    setActiveCountry(pin.job_country);
    setActiveCountryName(COUNTRY_NAMES[pin.job_country] || pin.job_country);
    setSidebarMode('job-detail');
  }, []);

  // Country selection handler
  const handleSelectCountry = useCallback((code: string, name: string) => {
    setActiveCountry(code);
    setActiveCountryName(name);
    setSelectedPin(null);
    setSidebarMode('country-list');
  }, []);

  const handleBackToCountryList = useCallback(() => {
    setSidebarMode('country-list');
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarMode('closed');
  }, []);

  const availableDomains = [
    'ALL',
    'Artificial Intelligence & Machine Learning',
    'Web Development',
    'Cybersecurity & Infrastructure',
    'Automation & Agentic AI',
    'Cloud Infrastructure & SRE',
    'Computer Vision & Robotics',
    'Data Science & Analytics',
  ];

  return (
    <div className={`relative bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col ${embedded ? 'h-[640px]' : 'h-[calc(100vh-140px)] min-h-[620px]'}`}>
      {/* Top Floating Glass HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Brand & Stats Capsule */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
            <Globe className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">JobClaw 3D Radar</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-bold">
                Live
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>{filteredPins.length} Opportunities</span>
              <span>&bull;</span>
              <span>{countryCounts.length} Countries</span>
            </div>
          </div>
        </div>

        {/* Search Bar HUD */}
        <div className="pointer-events-auto flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, skill (e.g. PyTorch, React, SIEM), or company..."
              className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 text-xs text-white placeholder-slate-400 rounded-2xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xl"
            />
          </div>

          {/* Rotation Toggle */}
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className="p-2.5 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl text-slate-300 hover:text-white transition-colors shrink-0 shadow-xl"
            title={isRotating ? 'Pause Rotation' : 'Resume Auto-Rotate'}
          >
            {isRotating ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Filter Quick-Pill Floating Strip */}
      <div className="absolute top-20 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center gap-1.5">
        {/* Country Quick Selector */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-xl p-1 overflow-x-auto max-w-full text-[11px] font-semibold shadow-lg">
          <button
            onClick={() => setSelectedCountryCode('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-all ${selectedCountryCode === 'ALL' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            🌐 All
          </button>
          <button
            onClick={() => setSelectedCountryCode('IN')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${selectedCountryCode === 'IN' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🇮🇳 India</span>
            <span className="text-[9px] bg-black/40 px-1 rounded font-mono">
              {JOBCLAW_PINS.filter((p) => p.job_country === 'IN').length}
            </span>
          </button>
          <button
            onClick={() => setSelectedCountryCode('US')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${selectedCountryCode === 'US' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🇺🇸 US</span>
          </button>
          <button
            onClick={() => setSelectedCountryCode('GB')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${selectedCountryCode === 'GB' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🇬🇧 UK</span>
          </button>
          <button
            onClick={() => setSelectedCountryCode('DE')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${selectedCountryCode === 'DE' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🇩🇪 DE</span>
          </button>
          <button
            onClick={() => setSelectedCountryCode('SG')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${selectedCountryCode === 'SG' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            <span>🇸🇬 SG</span>
          </button>
        </div>

        {/* Remote Toggle Pill */}
        <button
          onClick={() => setOnlyRemote((prev) => !prev)}
          className={`pointer-events-auto px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all shadow-lg ${onlyRemote ? 'bg-sky-500/20 text-sky-300 border-sky-400/60 shadow-sky-500/10' : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'}`}
        >
          ☁️ Remote Only
        </button>

        {/* Internship Toggle Pill */}
        <button
          onClick={() => setOnlyInternship((prev) => !prev)}
          className={`pointer-events-auto px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all shadow-lg ${onlyInternship ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-amber-500/10' : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'}`}
        >
          🎓 Internships
        </button>

        {/* High Match Pill */}
        <button
          onClick={() => setOnlyHighMatch((prev) => !prev)}
          className={`pointer-events-auto px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all shadow-lg flex items-center gap-1 ${onlyHighMatch ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-emerald-500/10' : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'}`}
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Top Matches (≥70%)</span>
        </button>
      </div>

      {/* 3D WebGL Globe Canvas */}
      <div className="flex-1 w-full h-full">
        <JobClawGlobe
          pins={filteredPins}
          countryCounts={countryCounts}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          onSelectCountry={handleSelectCountry}
          matchScores={matchScores}
          isRotated={isRotating}
        />
      </div>

      {/* Bottom Floating Legend & Reset */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between gap-3 text-xs">
        {/* Match Color Legend */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-3 text-[10px] text-slate-300 shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>High Fit (≥75%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span>Moderate (50-74%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
            <span>Active Drive</span>
          </div>
        </div>

        {/* Quick Drawer Open / Country List Trigger */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              setActiveCountry('IN');
              setActiveCountryName('India (Institutional Campus Openings)');
              setSidebarMode('country-list');
            }}
            className="px-3 py-1.5 bg-amber-600/90 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xl flex items-center gap-1.5"
          >
            <span>🇮🇳 View India Drives ({JOBCLAW_PINS.filter((p) => p.job_country === 'IN').length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliding Sidebar Drawer */}
      <JobClawSidebar
        mode={sidebarMode}
        selectedCountry={activeCountry}
        selectedCountryName={activeCountryName}
        countryJobs={countryJobs}
        selectedJob={selectedPin}
        matchScores={matchScores}
        onSelectJob={(job) => {
          setSelectedPin(job);
          setSidebarMode('job-detail');
        }}
        onBack={handleBackToCountryList}
        onClose={handleCloseSidebar}
      />
    </div>
  );
};
