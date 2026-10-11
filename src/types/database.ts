export type UserRole = 'student' | 'admin';
export type ExperienceLevel = 'beginner' | 'intermediate';
export type ApplicationStatus =
  | 'draft'
  | 'prepared'
  | 'applied'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'withdrawn';
export type JobStatus = 'draft' | 'published' | 'closed' | 'archived';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';
export type TrainingStatus = 'recommended' | 'enrolled' | 'in_progress' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  institution?: string;
  department?: string;
  graduation_year?: number;
  current_year?: number;
  semester?: number;
  cgpa?: number;
  career_objective?: string;
  preferred_domain?: string;
  preferred_role?: string;
  experience_level?: ExperienceLevel;
  profile_completion: number;
  resume_storage_path?: string;
  resume_file_name?: string;
  ats_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  created_at?: string;
}

export interface StudentSkill {
  id: string;
  student_id: string;
  skill_id: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced';
  skill?: Skill;
}

export interface Project {
  id: string;
  student_id: string;
  title: string;
  description: string;
  technologies: string[];
  start_date?: string;
  end_date?: string;
  project_url?: string;
  created_at?: string;
}

export interface Experience {
  id: string;
  student_id: string;
  organization: string;
  role_title: string;
  experience_type: 'internship' | 'employment' | 'other';
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface Certification {
  id: string;
  student_id: string;
  title: string;
  provider: string;
  issue_date?: string;
  credential_url?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  logo_url?: string;
  created_at?: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  domain: string;
  description: string;
  responsibilities: string[];
  required_skills: string[];
  preferred_skills: string[];
  eligibility?: string;
  minimum_cgpa?: number;
  experience_level: 'beginner' | 'intermediate' | 'any';
  employment_type: 'Full-time' | 'Internship' | 'Contract';
  work_mode: 'On-site' | 'Hybrid' | 'Remote';
  location: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  application_url?: string;
  is_synthetic: boolean;
  status: JobStatus;
  posted_at?: string;
  closing_at?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  company?: Company;
}

export interface Application {
  id: string;
  student_id: string;
  job_id: string;
  status: ApplicationStatus;
  applied_at?: string;
  cover_letter_storage_path?: string;
  student_notes?: string;
  admin_notes?: string;
  interview_at?: string;
  offer_salary?: number;
  status_updated_by?: string;
  created_at?: string;
  updated_at?: string;
  job?: Job;
  student?: Profile;
}

export interface JobMatch {
  id: string;
  student_id: string;
  job_id: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  eligibility_passed: boolean;
  algorithm_version: string;
  created_at?: string;
  job?: Job;
  student?: Profile;
}

export interface ATSAnalysis {
  id: string;
  student_id: string;
  target_role: string;
  score: number;
  matched_keywords: string[];
  recommended_keywords: string[];
  suggestions: {
    category: 'skills' | 'experience' | 'projects' | 'formatting';
    title: string;
    description: string;
    actionable: boolean;
  }[];
  analysis_method: string;
  created_at?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  provider: string;
  domain: string;
  skills_taught: string[];
  duration: string;
  registration_url?: string;
  status: 'active' | 'upcoming' | 'archived';
  created_at?: string;
}

export interface TrainingEnrollment {
  id: string;
  student_id: string;
  training_id: string;
  status: TrainingStatus;
  enrolled_at?: string;
  completed_at?: string;
  training_program?: TrainingProgram;
}

export interface RecruitmentDrive {
  id: string;
  company_id: string;
  job_id?: string;
  title: string;
  description?: string;
  drive_at: string;
  registration_deadline: string;
  venue_or_mode: string;
  eligibility: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  created_at?: string;
  company?: Company;
  job?: Job;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: 'all_students' | 'department' | 'graduating_batch';
  department_filter?: string;
  graduation_year_filter?: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: AnnouncementStatus;
  published_at?: string;
  expires_at?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}
