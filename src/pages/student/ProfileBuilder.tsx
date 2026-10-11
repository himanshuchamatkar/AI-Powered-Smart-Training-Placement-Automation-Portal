import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  OWNER_PROFILE,
  OWNER_SKILLS,
  OWNER_PROJECTS,
  OWNER_EXPERIENCES,
  OWNER_CERTIFICATIONS,
} from '@/data/ownerProfile';
import { Project, Experience, Certification } from '@/types/database';

export const ProfileBuilder: React.FC = () => {
  const { profile, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'projects' | 'experience' | 'resume'>('basic');
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '+91 98765 43210',
    institution: profile?.institution || 'DMIHER Faculty of Engineering and Technology',
    department: profile?.department || 'Computer Science and Engineering',
    graduation_year: profile?.graduation_year || 2027,
    current_year: profile?.current_year || 3,
    semester: profile?.semester || 6,
    cgpa: profile?.cgpa || 6.29,
    career_objective: profile?.career_objective || '',
    preferred_domain: profile?.preferred_domain || 'Artificial Intelligence & Machine Learning',
    preferred_role: profile?.preferred_role || 'AI/ML Engineer & Automation Specialist',
  });

  const [projects, setProjects] = useState<Project[]>(OWNER_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(OWNER_EXPERIENCES);
  const [certifications, setCertifications] = useState<Certification[]>(OWNER_CERTIFICATIONS);
  const [skills, setSkills] = useState(OWNER_SKILLS);

  // Resume upload states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState(profile?.resume_file_name || 'himanshu Chamatkar_CSE_01Jun26.pdf');
  const [uploadProgress, setUploadProgress] = useState(100);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Recalculate experience level deterministically (FR-05)
  const experienceLevel = experiences.some(
    (e) => e.experience_type === 'internship' || e.experience_type === 'employment'
  )
    ? 'intermediate'
    : 'beginner';

  // Handle Owner Prefill (FR-03 & FR-04)
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
      cgpa: OWNER_PROFILE.cgpa || 6.29,
      career_objective: OWNER_PROFILE.career_objective || '',
      preferred_domain: OWNER_PROFILE.preferred_domain || '',
      preferred_role: OWNER_PROFILE.preferred_role || '',
    });
    setProjects(OWNER_PROJECTS);
    setExperiences(OWNER_EXPERIENCES);
    setCertifications(OWNER_CERTIFICATIONS);
    setSkills(OWNER_SKILLS);
    setUploadedFileName('himanshu Chamatkar_CSE_01Jun26.pdf');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
      setUploadError('File size exceeds the 5MB maximum institutional limit.');
      return;
    }

    setResumeFile(file);
    setUploadedFileName(file.name);
    setUploadProgress(0);

    // Simulate upload to Supabase private bucket
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      ...formData,
      experience_level: experienceLevel,
      profile_completion: 96,
      resume_file_name: uploadedFileName,
      resume_storage_path: `resumes/${profile?.id || 'owner'}/${uploadedFileName}`,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Student Profile & Resume Builder"
        subtitle="Manage academic credentials, technical skills, projects, and private resume records"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Profile Builder' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Banner with Resume Prefill Action */}
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-300 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Owner Profile Synchronizer</span>
            </div>
            <h3 className="text-base font-bold">Prefill Credentials from Verified PDF</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Source file: <code className="text-amber-300 bg-black/30 px-1 py-0.5 rounded">himanshu Chamatkar_CSE_01Jun26.pdf</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadOwnerData}
              className="px-4 py-2 text-xs font-semibold bg-white text-brand-900 hover:bg-brand-50 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Prefill Owner Resume Details
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and verified resume details saved successfully!</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'basic', label: '1. Basic & Academic', icon: User },
            { id: 'skills', label: '2. Skills & Domain', icon: Award },
            { id: 'projects', label: '3. Technical Projects', icon: FolderGit2 },
            { id: 'experience', label: '4. Internships & Exp.', icon: Briefcase },
            { id: 'resume', label: '5. Resume PDF Storage', icon: Upload },
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
              Identity &amp; Institutional Enrollment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
                />
                <span className="text-[10px] text-slate-400">Authenticated user identity</span>
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
                <label className="block font-medium text-slate-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) || 2027 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">CGPA (out of 10.0)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 6.29 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <span className="text-[10px] text-slate-400">Source: B.Tech Degree Record (6.29)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Career Objective</label>
              <textarea
                rows={3}
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
              <h3 className="text-sm font-bold text-slate-900">Technical Skills Inventory</h3>
              <span className="text-xs text-brand-600 font-semibold">{skills.length} Skills Registered</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Preferred Placement Domain</label>
                <input
                  type="text"
                  value={formData.preferred_domain}
                  onChange={(e) => setFormData({ ...formData, preferred_domain: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  value={formData.preferred_role}
                  onChange={(e) => setFormData({ ...formData, preferred_role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-slate-700">Configured Technical Competencies</div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 flex items-center gap-1.5"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-brand-600 capitalize">({s.proficiency})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Featured Capstone &amp; Software Projects</h3>
              <span className="text-xs text-slate-500">{projects.length} Documented Projects</span>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 text-sm">{proj.title}</div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {proj.start_date} - {proj.end_date}
                    </span>
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
              ))}
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
                  <span className="font-bold text-emerald-600 capitalize">{experienceLevel}</span> (FR-05)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{exp.role_title}</div>
                      <div className="text-brand-700 font-semibold text-xs">{exp.organization}</div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {exp.start_date} &bull; {exp.end_date}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Resume Storage */}
        {activeTab === 'resume' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Private Resume Storage</h3>
              <p className="text-xs text-slate-500">
                Uploaded resumes are stored in private Supabase Storage buckets accessible only to authorized T&amp;P staff.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Current Active Resume File Box */}
            <div className="p-4 bg-brand-50/60 border border-brand-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{uploadedFileName}</div>
                  <div className="text-[11px] text-slate-500">
                    Storage Path: <code className="text-brand-800">resumes/{profile?.id || 'owner'}/{uploadedFileName}</code>
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Verified Active
              </span>
            </div>

            {/* Upload Input */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-brand-500 transition-colors">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <label className="cursor-pointer">
                <span className="text-xs font-bold text-brand-600 hover:text-brand-700 underline">
                  Choose a PDF resume to replace or update
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
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Profile Completion:{' '}
            <span className="text-emerald-600 font-bold">{profile?.profile_completion || 96}%</span>
          </div>

          <button
            onClick={handleSaveProfile}
            className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile &amp; Update ATS Baseline
          </button>
        </div>
      </div>
    </div>
  );
};
