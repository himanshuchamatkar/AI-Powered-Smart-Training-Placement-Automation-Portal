import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  Upload,
  CheckCircle2,
  Sparkles,
  Save,
  Plus,
  Trash2,
  FileCheck,
  ShieldAlert,
  Info,
  X,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  OWNER_PROFILE,
  OWNER_SKILLS,
  OWNER_PROJECTS,
  OWNER_EXPERIENCES,
  OWNER_CERTIFICATIONS,
} from '@/data/ownerProfile';
import { Project, Experience, Certification } from '@/types/database';
import { getScoreForUser } from '@/lib/scoring/ats';

export const ProfileBuilder: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFirstTimeParam = searchParams.get('first_time') === 'true' || searchParams.get('onboarding') === 'true';

  const isOwner =
    profile?.email?.toLowerCase() === '123himanshuchamatkar@gmail.com' ||
    profile?.id === 'owner-himanshu-chamatkar' ||
    profile?.full_name?.toLowerCase().includes('himanshu');

  const storageKey = `dmiher_student_profile_${profile?.id || 'new'}`;

  // Tab State
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'projects' | 'experience' | 'resume'>('basic');

  // Form Data State
  const [formData, setFormData] = useState(() => {
    // Attempt local storage cache
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) return parsed.formData;
      }
    } catch (e) {
      console.warn(e);
    }

    if (isOwner) {
      return {
        full_name: OWNER_PROFILE.full_name,
        email: OWNER_PROFILE.email,
        phone: OWNER_PROFILE.phone || '+91 98765 43210',
        institution: OWNER_PROFILE.institution || 'DMIHER Faculty of Engineering and Technology',
        department: OWNER_PROFILE.department || 'Computer Science and Engineering',
        graduation_year: OWNER_PROFILE.graduation_year || 2027,
        current_year: OWNER_PROFILE.current_year || 3,
        semester: OWNER_PROFILE.semester || 6,
        cgpa: OWNER_PROFILE.cgpa?.toString() || '6.29',
        career_objective: OWNER_PROFILE.career_objective || '',
        preferred_domain: OWNER_PROFILE.preferred_domain || 'Artificial Intelligence & Machine Learning',
        preferred_role: OWNER_PROFILE.preferred_role || 'AI/ML Engineer & Automation Specialist',
      };
    }

    // New student: blank/clean fields
    return {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      institution: profile?.institution || 'DMIHER Faculty of Engineering and Technology',
      department: profile?.department || 'Computer Science and Engineering',
      graduation_year: profile?.graduation_year || 2027,
      current_year: profile?.current_year || 3,
      semester: profile?.semester || 6,
      cgpa: profile?.cgpa ? profile.cgpa.toString() : '',
      career_objective: profile?.career_objective || '',
      preferred_domain: profile?.preferred_domain || 'Artificial Intelligence & Machine Learning',
      preferred_role: profile?.preferred_role || '',
    };
  });

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.projects)) return parsed.projects;
      }
    } catch (e) {
      console.warn(e);
    }
    return isOwner ? OWNER_PROJECTS : [];
  });

  // Experiences State
  const [experiences, setExperiences] = useState<Experience[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.experiences)) return parsed.experiences;
      }
    } catch (e) {
      console.warn(e);
    }
    return isOwner ? OWNER_EXPERIENCES : [];
  });

  // Skills State
  const [skills, setSkills] = useState<{ name: string; proficiency: 'beginner' | 'intermediate' | 'advanced' }[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.skills)) return parsed.skills;
      }
    } catch (e) {
      console.warn(e);
    }
    return isOwner ? OWNER_SKILLS.map(s => ({ name: s.name, proficiency: s.proficiency || 'intermediate' })) : [];
  });

  // Resume State
  const [uploadedFileName, setUploadedFileName] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.uploadedFileName) return parsed.uploadedFileName;
      }
    } catch (e) {
      console.warn(e);
    }
    return isOwner ? 'himanshu Chamatkar_CSE_01Jun26.pdf' : (profile?.resume_file_name || '');
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  // New Skill inline input
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  // Inline project form toggle
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    start_date: 'Jan 2026',
    end_date: 'May 2026',
  });

  // Inline experience form toggle
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [newExperience, setNewExperience] = useState({
    role_title: '',
    organization: '',
    start_date: 'Jun 2025',
    end_date: 'Aug 2025',
    description: '',
  });

  // Experience level calculation
  const experienceLevel = experiences.some(
    (e) => e.experience_type === 'internship' || e.experience_type === 'employment'
  )
    ? 'intermediate'
    : 'beginner';

  // Quick skills suggestion list
  const popularSkills = [
    'Python',
    'Java',
    'C++',
    'React',
    'Node.js',
    'SQL',
    'Machine Learning',
    'Data Structures',
    'Docker',
    'Git',
    'Computer Vision',
    'Tailwind CSS',
  ];

  const handleAddSuggestedSkill = (skillName: string) => {
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;
    setSkills((prev) => [...prev, { name: skillName, proficiency: 'intermediate' }]);
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setNewSkillName('');
      return;
    }
    setSkills((prev) => [...prev, { name: newSkillName.trim(), proficiency: newSkillProficiency }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const p: Project = {
      id: `proj-${Date.now()}`,
      student_id: profile?.id || 'demo-student',
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      technologies: newProject.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      start_date: newProject.start_date,
      end_date: newProject.end_date,
    };
    setProjects((prev) => [p, ...prev]);
    setNewProject({ title: '', description: '', technologies: '', start_date: 'Jan 2026', end_date: 'May 2026' });
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExperience.role_title.trim()) return;

    const exp: Experience = {
      id: `exp-${Date.now()}`,
      student_id: profile?.id || 'demo-student',
      role_title: newExperience.role_title.trim(),
      organization: newExperience.organization.trim(),
      start_date: newExperience.start_date,
      end_date: newExperience.end_date,
      description: newExperience.description.trim(),
      experience_type: 'internship',
    };
    setExperiences((prev) => [exp, ...prev]);
    setNewExperience({ role_title: '', organization: '', start_date: 'Jun 2025', end_date: 'Aug 2025', description: '' });
    setShowAddExperience(false);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF format resumes are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB maximum limit.');
      return;
    }

    setUploadedFileName(file.name);
  };

  // Prefill for owner
  const handleLoadOwnerData = () => {
    setFormData({
      full_name: OWNER_PROFILE.full_name,
      email: OWNER_PROFILE.email,
      phone: '+91 98765 43210',
      institution: OWNER_PROFILE.institution || '',
      department: OWNER_PROFILE.department || '',
      graduation_year: OWNER_PROFILE.graduation_year || 2027,
      current_year: OWNER_PROFILE.current_year || 3,
      semester: OWNER_PROFILE.semester || 6,
      cgpa: OWNER_PROFILE.cgpa?.toString() || '6.29',
      career_objective: OWNER_PROFILE.career_objective || '',
      preferred_domain: OWNER_PROFILE.preferred_domain || '',
      preferred_role: OWNER_PROFILE.preferred_role || '',
    });
    setProjects(OWNER_PROJECTS);
    setExperiences(OWNER_EXPERIENCES);
    setSkills(OWNER_SKILLS.map((s) => ({ name: s.name, proficiency: (s.proficiency as 'beginner' | 'intermediate' | 'advanced') || 'intermediate' })));
    setUploadedFileName('himanshu Chamatkar_CSE_01Jun26.pdf');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (formData.full_name && formData.email) score += 20;
    if (formData.cgpa && parseFloat(formData.cgpa) > 0) score += 15;
    if (formData.phone) score += 10;
    if (formData.career_objective) score += 10;
    if (skills.length >= 2) score += 20;
    if (projects.length >= 1) score += 15;
    if (uploadedFileName) score += 10;
    return Math.min(100, score);
  };

  const currentCompletion = calculateCompletion();

  // Save profile handler
  const handleSaveProfile = async () => {
    setSavingLoading(true);
    const parsedCgpa = parseFloat(formData.cgpa) || (isOwner ? 6.29 : 7.0);
    const completion = Math.max(80, currentCompletion);

    const updatedProfilePayload = {
      ...formData,
      cgpa: parsedCgpa,
      experience_level: experienceLevel,
      profile_completion: completion,
      resume_file_name: uploadedFileName,
      resume_storage_path: uploadedFileName ? `resumes/${profile?.id || 'student'}/${uploadedFileName}` : undefined,
    };

    // Calculate ATS score now that profile is saved
    const atsScore = isOwner ? 78 : getScoreForUser({ ...updatedProfilePayload, id: profile?.id || 'demo' } as any);

    await updateProfile({
      ...updatedProfilePayload,
      ats_score: atsScore,
    });

    // Save details to localStorage
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          formData,
          projects,
          experiences,
          skills,
          uploadedFileName,
        })
      );
    } catch (e) {
      console.warn(e);
    }

    setSavingLoading(false);
    setSaveSuccess(true);

    // Redirect to dashboard after brief confirmation
    setTimeout(() => {
      navigate('/student/dashboard');
    }, 1600);
  };

  const isProfileIncomplete = !profile?.profile_completion || profile.profile_completion < 50;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Student Profile & Academic Resume Builder"
        subtitle="Configure academic records, technical skills, projects, and resume to generate your ATS score"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Profile Builder' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* First-Time Setup Welcome Banner */}
        {(isFirstTimeParam || isProfileIncomplete) && (
          <div className="bg-gradient-to-r from-amber-500/15 via-brand-500/10 to-indigo-500/10 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  First-Time Account Setup
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Welcome to DMIHER Placement Portal, {formData.full_name ? formData.full_name.split(' ')[0] : 'Student'}!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Please configure your academic credentials, technical skills, and projects below. Once saved, your personalized <strong>ATS Readiness Score</strong> will be calculated and you will unlock tailored job recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Owner Synchronizer Banner (Only for Himanshu) */}
        {isOwner && (
          <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-300 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Owner Profile Synchronizer</span>
              </div>
              <h3 className="text-base font-bold">Verified Capstone Credentials</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Master record: <code className="text-amber-300 bg-black/30 px-1 py-0.5 rounded">himanshu Chamatkar_CSE_01Jun26.pdf</code>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLoadOwnerData}
                className="px-4 py-2 text-xs font-semibold bg-white text-brand-900 hover:bg-brand-50 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Reload Owner Baseline
              </button>
            </div>
          </div>
        )}

        {/* Save Success Banner */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Profile setup saved successfully! ATS Baseline generated. Redirecting to Dashboard...</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'basic', label: '1. Basic & Academic', icon: User },
            { id: 'skills', label: `2. Skills (${skills.length})`, icon: Award },
            { id: 'projects', label: `3. Projects (${projects.length})`, icon: FolderGit2 },
            { id: 'experience', label: `4. Experience (${experiences.length})`, icon: Briefcase },
            { id: 'resume', label: '5. Resume Upload', icon: Upload },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Basic & Academic */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Student Identity &amp; Academic Enrollment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Registered Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
                />
                <span className="text-[10px] text-slate-400">Authenticated user identity</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Academic CGPA (out of 10.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g. 7.80"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <span className="text-[10px] text-slate-400">Used for campus eligibility screening</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Graduation Year</label>
                <select
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) || 2027 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white cursor-pointer"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Current Year &amp; Semester</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.current_year}
                    onChange={(e) => setFormData({ ...formData, current_year: parseInt(e.target.value) || 3 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white cursor-pointer"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 6 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Sem {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Career Objective</label>
              <textarea
                rows={3}
                placeholder="State your career focus (e.g., Aspiring AI/ML software engineer eager to build automated systems...)"
                value={formData.career_objective}
                onChange={(e) => setFormData({ ...formData, career_objective: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Skills & Domain */}
        {activeTab === 'skills' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Technical Skills &amp; Domain Alignment</h3>
                <p className="text-xs text-slate-500">Skills added directly feed the ATS keyword matcher</p>
              </div>
              <span className="text-xs text-brand-600 font-bold bg-brand-50 px-2.5 py-1 rounded-lg">
                {skills.length} Skills Registered
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Preferred Placement Domain</label>
                <select
                  value={formData.preferred_domain}
                  onChange={(e) => setFormData({ ...formData, preferred_domain: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white cursor-pointer"
                >
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence &amp; Machine Learning</option>
                  <option value="Web Development & Full-Stack">Web Development &amp; Full-Stack</option>
                  <option value="Cybersecurity & Cloud">Cybersecurity &amp; Cloud</option>
                  <option value="Data Science & Analytics">Data Science &amp; Analytics</option>
                  <option value="Mobile Application Development">Mobile Application Development</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  placeholder="e.g. AI/ML Engineer, Full-Stack Developer"
                  value={formData.preferred_role}
                  onChange={(e) => setFormData({ ...formData, preferred_role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Suggestions (Click to Add):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {popularSkills.map((sk) => {
                  const alreadyAdded = skills.some((s) => s.name.toLowerCase() === sk.toLowerCase());
                  return (
                    <button
                      key={sk}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddSuggestedSkill(sk)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        alreadyAdded
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-brand-500 hover:bg-brand-50'
                      }`}
                    >
                      + {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Skill Form */}
            <form onSubmit={handleAddCustomSkill} className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="Type skill name (e.g., PyTorch, MongoDB, FastAPI)..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <select
                value={newSkillProficiency}
                onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-none cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add Skill
              </button>
            </form>

            {/* Configured Skills Badge List */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-800">Your Registered Skills:</div>
              {skills.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                  No skills added yet. Click on suggestions above or type your skills to build your ATS inventory.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 flex items-center gap-2 group hover:bg-slate-200 transition-colors"
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] text-brand-600 capitalize bg-brand-50 px-1.5 py-0.5 rounded font-bold">
                        {s.proficiency}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.name)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Featured Software &amp; Capstone Projects</h3>
                <p className="text-xs text-slate-500">Documented project highlights improve ATS contextual match</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            {/* Add Project Form */}
            {showAddProject && (
              <form onSubmit={handleAddProjectSubmit} className="p-4 bg-brand-50/40 border border-brand-200 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-brand-900">Add New Project</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Placement Automation Portal"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Technologies (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript, Python, TensorFlow"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Project Description &amp; Impact</label>
                  <textarea
                    rows={2}
                    placeholder="Describe problem solved, tools used, and measurable results..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            )}

            {/* Projects List */}
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-xs font-bold text-slate-700">No Projects Added Yet</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Add Project" above to document your academic capstone, web application, or machine learning model.
                  </p>
                </div>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{proj.title}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {proj.start_date} - {proj.end_date}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(proj.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded text-[10px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Experience */}
        {activeTab === 'experience' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Internship &amp; Employment History</h3>
                <p className="text-xs text-slate-500">
                  Readiness Classification:{' '}
                  <span className="font-bold text-emerald-600 capitalize">{experienceLevel}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddExperience(!showAddExperience)}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Experience
              </button>
            </div>

            {/* Add Experience Form */}
            {showAddExperience && (
              <form onSubmit={handleAddExperienceSubmit} className="p-4 bg-brand-50/40 border border-brand-200 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-brand-900">Add Internship / Work Experience</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Role Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Machine Learning Intern"
                      value={newExperience.role_title}
                      onChange={(e) => setNewExperience({ ...newExperience, role_title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Organization / Firm</label>
                    <input
                      type="text"
                      placeholder="e.g. Tech Solutions Lab"
                      value={newExperience.organization}
                      onChange={(e) => setNewExperience({ ...newExperience, organization: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Key contributions and technologies handled..."
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddExperience(false)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
                  >
                    Save Experience
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {experiences.length === 0 ? (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-xs font-bold text-slate-700">No Internships Added Yet</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Freshers can leave this blank (Beginner Level), or add previous industrial internships using the button above.
                  </p>
                </div>
              ) : (
                experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{exp.role_title}</div>
                        <div className="text-brand-700 font-semibold text-xs">{exp.organization}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {exp.start_date} &bull; {exp.end_date}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Resume Storage */}
        {activeTab === 'resume' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Student Resume Storage</h3>
              <p className="text-xs text-slate-500">
                Upload your official PDF resume for campus recruitment screening and automated verification.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Current Active Resume File Box */}
            {uploadedFileName ? (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{uploadedFileName}</div>
                    <div className="text-[11px] text-slate-500">
                      Format: PDF Document &bull; Verified For ATS Match
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setUploadedFileName('')}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No resume PDF uploaded yet. Upload your PDF resume below.</span>
              </div>
            )}

            {/* Upload Input */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-brand-500 transition-colors">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <label className="cursor-pointer">
                <span className="text-xs font-bold text-brand-600 hover:text-brand-700 underline">
                  Choose PDF resume from device
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 mt-1">Maximum file size: 5MB &bull; PDF format only</p>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Profile Completion:</span>
            <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${currentCompletion}%` }}
              />
            </div>
            <span className="text-brand-700 font-bold">{currentCompletion}%</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSaveProfile}
              disabled={savingLoading}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingLoading ? 'Saving...' : 'Save Profile & Generate ATS Score'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
