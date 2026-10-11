import { Profile, Project, Experience, Certification } from '@/types/database';

export const OWNER_PROFILE: Profile = {
  id: 'owner-himanshu-chamatkar',
  full_name: 'Himanshu Vikas Chamatkar',
  email: '123himanshuchamatkar@gmail.com',
  role: 'student',
  institution: 'Datta Meghe Institute of Higher Education and Research (DMIHER), Wardha',
  department: 'Computer Science and Engineering',
  graduation_year: 2027,
  current_year: 3,
  semester: 6,
  cgpa: 6.29,
  career_objective: 'Aspiring AI/ML & Automation Engineer passionate about building scalable explainable AI architectures, agentic workflow automations, and intelligent full-stack systems.',
  preferred_domain: 'Artificial Intelligence & Machine Learning',
  preferred_role: 'AI/ML Engineer & Automation Specialist',
  experience_level: 'intermediate',
  profile_completion: 96,
  resume_file_name: 'himanshu Chamatkar_CSE_01Jun26.pdf',
  ats_score: 78,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const OWNER_SKILLS = [
  // Programming
  { name: 'Python', category: 'Programming', proficiency: 'advanced' },
  { name: 'JavaScript', category: 'Programming', proficiency: 'intermediate' },
  { name: 'C/C++', category: 'Programming', proficiency: 'intermediate' },
  { name: 'SQL', category: 'Programming', proficiency: 'intermediate' },
  { name: 'HTML/CSS', category: 'Programming', proficiency: 'advanced' },
  // AI/ML & Deep Learning
  { name: 'TensorFlow', category: 'AI & Machine Learning', proficiency: 'advanced' },
  { name: 'PyTorch', category: 'AI & Machine Learning', proficiency: 'intermediate' },
  { name: 'scikit-learn', category: 'AI & Machine Learning', proficiency: 'advanced' },
  { name: 'OpenCV', category: 'AI & Machine Learning', proficiency: 'advanced' },
  { name: 'Computer Vision', category: 'AI & Machine Learning', proficiency: 'advanced' },
  { name: 'SHAP (Explainable AI)', category: 'AI & Machine Learning', proficiency: 'intermediate' },
  // Automation & Agentic AI
  { name: 'n8n Workflow Automation', category: 'Automation & Agentic AI', proficiency: 'advanced' },
  { name: 'LLM Pipelines & Prompt Engineering', category: 'Automation & Agentic AI', proficiency: 'advanced' },
  { name: 'Multi-Agent Systems', category: 'Automation & Agentic AI', proficiency: 'intermediate' },
  { name: 'REST API Integrations', category: 'Automation & Agentic AI', proficiency: 'advanced' },
  // Web & Cloud
  { name: 'React', category: 'Web Development', proficiency: 'intermediate' },
  { name: 'Node.js', category: 'Web Development', proficiency: 'intermediate' },
  { name: 'Express', category: 'Web Development', proficiency: 'intermediate' },
  { name: 'Streamlit', category: 'Web Development', proficiency: 'advanced' },
  { name: 'Docker', category: 'DevOps & Tools', proficiency: 'intermediate' },
  { name: 'Git & GitHub', category: 'DevOps & Tools', proficiency: 'advanced' },
  { name: 'Linux', category: 'DevOps & Tools', proficiency: 'intermediate' },
  // Data
  { name: 'Pandas', category: 'Data Science', proficiency: 'advanced' },
  { name: 'NumPy', category: 'Data Science', proficiency: 'advanced' },
];

export const OWNER_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    student_id: 'owner-himanshu-chamatkar',
    organization: 'Cluster Computing Pvt. Ltd., Nagpur',
    role_title: 'Cyber Security Intern',
    experience_type: 'internship',
    start_date: '2025-05-01',
    end_date: '2025-07-31',
    description: 'Conducted scam-pattern analysis, digital-evidence organization, and supported fraud investigation/compliance audits with explainable security metrics.',
    created_at: new Date().toISOString(),
  },
];

export const OWNER_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    student_id: 'owner-himanshu-chamatkar',
    title: 'YOLO-Based Answer Sheet Block Extraction System',
    description: 'Automated end-to-end extraction and segmentation of evaluation blocks from university answer sheets using YOLO object detection, OpenCV pre-processing, and OCR.',
    technologies: ['Python', 'YOLO', 'OpenCV', 'NumPy', 'OCR', 'Streamlit'],
    start_date: '2025-01-01',
    end_date: '2025-04-01',
  },
  {
    id: 'proj-2',
    student_id: 'owner-himanshu-chamatkar',
    title: 'AI Influencer Content Automation Workflow',
    description: 'Engineered an autonomous content creation pipeline combining n8n orchestration, ComfyUI generative pipelines, LLM prompt chaining, and automated social publishing.',
    technologies: ['n8n', 'ComfyUI', 'OpenAI/Gemini API', 'Docker', 'Python'],
    start_date: '2024-09-01',
    end_date: '2024-12-01',
  },
  {
    id: 'proj-3',
    student_id: 'owner-himanshu-chamatkar',
    title: 'Phishing Detection Chrome Extension with Explainable Risk Scoring',
    description: 'Built a real-time browser extension that inspects incoming URLs and DOM structures, calculates explainable heuristic risk scores, and flags credential harvesting attacks.',
    technologies: ['Node.js', 'Express', 'MongoDB Atlas', 'Puppeteer', 'Chrome Extension API', 'Render'],
    start_date: '2024-04-01',
    end_date: '2024-07-01',
  },
  {
    id: 'proj-4',
    student_id: 'owner-himanshu-chamatkar',
    title: 'Explainable AI-Based Intrusion Detection System',
    description: 'Network anomaly and intrusion classification system utilizing machine learning with SHAP interpretability to give security analysts clear attribution for every alert.',
    technologies: ['Python', 'scikit-learn', 'SHAP', 'Streamlit'],
    start_date: '2024-02-01',
    end_date: '2024-05-01',
  },
  {
    id: 'proj-5',
    student_id: 'owner-himanshu-chamatkar',
    title: 'Stock Analysis & Decision Support System',
    description: 'Interactive financial dashboard providing time-series technical indicators, moving-average trend forecasts, and volatility analytics with Plotly visual components.',
    technologies: ['Python', 'Pandas', 'Plotly/Dash', 'Streamlit'],
    start_date: '2023-10-01',
    end_date: '2024-01-01',
  },
];

export const OWNER_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    student_id: 'owner-himanshu-chamatkar',
    title: 'Research Paper Presentation - 3D Volumetric CT Reconstruction (DICOM & VTK)',
    provider: '3rd International Conference, DMIHER (2025)',
    issue_date: '2025-02-15',
  },
  {
    id: 'cert-2',
    student_id: 'owner-himanshu-chamatkar',
    title: 'Generative AI & Prompt Engineering Basics',
    provider: 'Coursera',
    issue_date: '2024-08-10',
  },
  {
    id: 'cert-3',
    student_id: 'owner-himanshu-chamatkar',
    title: 'Python for Data Science & AI Development',
    provider: 'Coursera',
    issue_date: '2024-05-18',
  },
];
