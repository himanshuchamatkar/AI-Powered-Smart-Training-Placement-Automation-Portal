import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  FileCheck2,
  Briefcase,
  FileText,
  BarChart3,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const LandingPage: React.FC = () => {
  const { switchDemoUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 text-brand-800 text-xs font-semibold mb-6 border border-brand-200 shadow-xs">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>DMIHER Faculty of Engineering &amp; Technology &bull; Dept. of CSE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              AI-Powered Smart Training &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600">
                Placement Automation
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Institutional portal unifying student profile builder, deterministic ATS resume audit,
              explainable skill-based job matching, automated cover letters, and T&amp;P recruitment pipelines.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/auth?mode=register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
              >
                Get Started as Student
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  switchDemoUser('owner');
                  window.location.href = '/student/dashboard';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-brand-600" />
                Explore Student Dashboard (Himanshu)
              </button>
              <button
                onClick={() => {
                  switchDemoUser('admin');
                  window.location.href = '/admin/overview';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                T&amp;P Admin Overview
              </button>
            </div>

            {/* Verified Capabilities Strip */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">78%</div>
                <div className="text-xs text-slate-500 font-medium">Owner ATS Baseline</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">50+</div>
                <div className="text-xs text-slate-500 font-medium">Synthetic Job Openings</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Explainable Match Rules</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-bold text-emerald-600">RLS</div>
                <div className="text-xs text-slate-500 font-medium">Protected Supabase DB</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Enterprise Institutional Placement Architecture
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Engineered to replace manual coordination with deterministic, audit-ready workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Deterministic ATS Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates resumes against role-specific keyword benchmarks across Machine Learning, Full-Stack, and Cybersecurity.
                Provides stable, repeatable readiness ratings without random drift.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Explainable Job Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                60% required skill overlap, 20% preferred skills, 10% domain alignment, and 10% experience level.
                Transparent candidate rank breakdowns eliminate black-box AI claims.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">T&amp;P Placement Officer Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized candidate matching for campus drives, application status lifecycle tracking,
                skill-gap analytics, and verified exportable reports for institutional accreditation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
                Integrated Workflow
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                From Resume Upload to Offer Acceptance Tracking
              </h2>
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Owner Resume Auto-Populated</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Himanshu Chamatkar's verified academic and project credentials preloaded from <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">himanshu Chamatkar_CSE_01Jun26.pdf</code>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Tailored Cover Letter Engine</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Auto-synthesizes applicant project bullet points and job requirements with instant client-side PDF export.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Transparent External Link Handling</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Distinguishes portal-tracked status from external company career portals with zero false submission claims.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-mono text-slate-300">ATS Readiness Engine v1.2</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-medium">
                  Verified 78%
                </span>
              </div>

              <div className="mt-6 space-y-4 font-mono text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[11px]">Applicant Profile</div>
                  <div className="text-white font-semibold">Himanshu Vikas Chamatkar &bull; B.Tech CSE (DMIHER)</div>
                  <div className="text-emerald-400 text-[11px] mt-1">Readiness Level: Intermediate (Cyber Security Intern)</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[11px]">Primary Matched Competencies</div>
                  <div className="text-slate-200 mt-1 flex flex-wrap gap-1.5">
                    <span className="px-1.5 py-0.5 bg-brand-900/60 text-brand-300 rounded text-[11px]">TensorFlow</span>
                    <span className="px-1.5 py-0.5 bg-brand-900/60 text-brand-300 rounded text-[11px]">OpenCV</span>
                    <span className="px-1.5 py-0.5 bg-brand-900/60 text-brand-300 rounded text-[11px]">n8n Automation</span>
                    <span className="px-1.5 py-0.5 bg-brand-900/60 text-brand-300 rounded text-[11px]">SHAP</span>
                    <span className="px-1.5 py-0.5 bg-brand-900/60 text-brand-300 rounded text-[11px]">Streamlit</span>
                  </div>
                </div>

                <div className="text-slate-400 text-[11px] flex justify-between items-center pt-2">
                  <span>Target Role: AI/ML &amp; Automation Engineer</span>
                  <span className="text-brand-400">Deterministic Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
