import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Download,
  Building2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { SEED_JOBS, SEED_COMPANIES } from '@/data/mockSeed';
import { OWNER_PROJECTS, OWNER_EXPERIENCES } from '@/data/ownerProfile';

export const CoverLetterBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || SEED_JOBS[0].id;
  const navigate = useNavigate();
  const { profile } = useAuth();

  const selectedJob = SEED_JOBS.find((j) => j.id === jobId) || SEED_JOBS[0];
  const company = SEED_COMPANIES.find((c) => c.id === selectedJob.company_id);

  const isOwner =
    profile?.email?.trim().toLowerCase() === '123himanshuchamatkar@gmail.com' ||
    profile?.id === 'owner-himanshu-chamatkar';

  // Load saved student projects or experiences if available
  const savedData = React.useMemo(() => {
    try {
      const saved = localStorage.getItem(`dmiher_student_profile_${profile?.id || 'default'}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return null;
  }, [profile?.id]);

  const applicantProjects = savedData?.projects?.length > 0
    ? savedData.projects.slice(0, 3).map((p: any) => `• ${p.title}: ${p.description || 'Hands-on practical development'}`).join('\n')
    : (isOwner
      ? `• Engineered an automated YOLO-based answer sheet block extraction and OCR pipeline using Python, OpenCV, and Streamlit.\n• Architected an autonomous agentic content automation workflow coordinating n8n orchestration, ComfyUI generative models, and Docker containerization.\n• Developed an Explainable AI Intrusion Detection System utilizing scikit-learn and SHAP interpretability metrics.`
      : `• Developed domain applications applying modern software frameworks and clean architecture principles.\n• Executed academic project modules emphasizing algorithm efficiency and code maintainability.\n• Collaborated on technical deliverables aligned with institutional standards.`);

  const experienceHighlight = savedData?.experiences?.length > 0
    ? `During my role as ${savedData.experiences[0].role_title} at ${savedData.experiences[0].organization}, I delivered practical technical results. In parallel, my recent technical projects directly intersect with your core technology requirements:`
    : (isOwner
      ? `During my Cyber Security Internship at Cluster Computing Pvt. Ltd., I conducted scam-pattern investigations, threat signature analysis, and digital-evidence synthesis. In parallel, my recent technical projects directly intersect with your core technology requirements:`
      : `Throughout my academic curriculum and coursework, I have concentrated on practical engineering problem-solving. My core projects directly intersect with your technology requirements:`);

  // Auto-generate template text matching applicant credentials
  const defaultLetterBody = `Dear Hiring Team at ${company?.name || 'the Organization'},

I am writing to express my strong interest in the ${selectedJob.title} position (${selectedJob.work_mode}, ${selectedJob.location}) as part of the DMIHER campus placement program. As a pre-final year Computer Science & Engineering undergraduate at Datta Meghe Institute of Higher Education and Research (DMIHER) with demonstrated technical foundations in software engineering and modern problem-solving, I am eager to contribute effectively to your engineering initiatives.

${experienceHighlight}
${applicantProjects}

With proven proficiency in ${selectedJob.required_skills?.slice(0, 4).join(', ') || 'modern software engineering'}, strong analytical fundamentals${profile?.cgpa ? ` (CGPA: ${profile.cgpa})` : (isOwner ? ' (CGPA: 6.29)' : '')}, and a disciplined work ethic, I am confident in my capability to deliver immediate value to ${company?.name}.

Thank you for your time, consideration, and review of my application. I welcome the opportunity to discuss my qualifications and how my technical background aligns with your team's objectives.

Sincerely,
${profile?.full_name || (isOwner ? 'Himanshu Vikas Chamatkar' : 'Student Applicant')}
Department of Computer Science & Engineering
Datta Meghe Institute of Higher Education and Research (DMIHER), Wardha
Email: ${profile?.email || (isOwner ? '123himanshuchamatkar@gmail.com' : '')}
${profile?.phone || (isOwner ? 'Phone: +91 98765 43210' : '')}`;

  const [letterContent, setLetterContent] = useState(defaultLetterBody);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setLetterContent(defaultLetterBody);
  }, [selectedJob.id, profile?.id, isOwner]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;

    // Header styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(profile?.full_name || 'Himanshu Vikas Chamatkar', margin, margin);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${profile?.department || 'Computer Science & Engineering'} | DMIHER FEAT Wardha`,
      margin,
      margin + 6
    );
    doc.text(
      `Email: ${profile?.email || '123himanshuchamatkar@gmail.com'} | Generated via DMIHER T&P Automation Portal`,
      margin,
      margin + 11
    );

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, margin + 15, pageWidth - margin, margin + 15);

    // Body content
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10.5);
    doc.setLineHeightFactor(1.4);

    const splitText = doc.splitTextToSize(letterContent, maxLineWidth);
    doc.text(splitText, margin, margin + 24);

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Document certified for institutional placement submission • DMIHER FEAT',
      margin,
      pageHeight - 12
    );

    const filename = `Cover_Letter_${profile?.full_name?.replace(/\s+/g, '_')}_${company?.name?.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Cover Letter Builder & PDF Generator"
        subtitle="Auto-populated with your verified projects and tailored to selected employer specifications"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Job Recommendations', href: '/student/jobs' },
          { label: 'Cover Letter Builder' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Top Info Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Selected Opportunity:</div>
              <h3 className="text-sm font-bold text-slate-900">
                {selectedJob.title} &bull; <span className="text-brand-600">{company?.name}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/student/jobs')}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change Job
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF Letter
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>PDF generated and downloaded cleanly!</span>
          </div>
        )}

        {/* Live Editable Text Area */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Editable Cover Letter Content
            </span>
            <button
              onClick={() => setLetterContent(defaultLetterBody)}
              className="text-[11px] text-slate-500 hover:text-brand-600 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to Auto-Generated
            </button>
          </div>

          <textarea
            rows={18}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className="w-full p-4 text-xs font-mono leading-relaxed border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50 text-slate-900"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Client-side PDF compilation powered by jsPDF engine.</span>
            <button
              onClick={handleDownloadPDF}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Download as PDF &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
