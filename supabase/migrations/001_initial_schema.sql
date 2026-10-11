-- ==============================================================================
-- AI-Powered Smart Training & Placement Automation Portal
-- Initial Database Schema, Constraints, Indexes & RLS Policies
-- Single Source of Truth: PRD & TRD (DMIHER FEAT CSE)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS (OR CHECK CONSTRAINTS)
-- Using check constraints for portability and direct inspection

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  institution TEXT DEFAULT 'DMIHER, Faculty of Engineering and Technology',
  department TEXT DEFAULT 'Computer Science and Engineering',
  graduation_year INTEGER,
  current_year INTEGER,
  semester INTEGER,
  cgpa NUMERIC(4,2),
  career_objective TEXT,
  preferred_domain TEXT,
  preferred_role TEXT,
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate')),
  profile_completion INTEGER DEFAULT 0 CHECK (profile_completion BETWEEN 0 AND 100),
  resume_storage_path TEXT,
  resume_file_name TEXT,
  ats_score INTEGER CHECK (ats_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENT_SKILLS
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency TEXT DEFAULT 'intermediate' CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_student_skill UNIQUE (student_id, skill_id)
);

-- 6. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  project_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPERIENCES
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization TEXT NOT NULL,
  role_title TEXT NOT NULL,
  experience_type TEXT NOT NULL DEFAULT 'internship' CHECK (experience_type IN ('internship', 'employment', 'other')),
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  industry TEXT,
  location TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. JOBS
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  eligibility TEXT,
  minimum_cgpa NUMERIC(4,2),
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'any')),
  employment_type TEXT DEFAULT 'Full-time' CHECK (employment_type IN ('Full-time', 'Internship', 'Contract')),
  work_mode TEXT DEFAULT 'Hybrid' CHECK (work_mode IN ('On-site', 'Hybrid', 'Remote')),
  location TEXT NOT NULL,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_currency TEXT DEFAULT 'INR',
  application_url TEXT,
  is_synthetic BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  closing_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'prepared', 'applied', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn')),
  applied_at TIMESTAMPTZ,
  cover_letter_storage_path TEXT,
  student_notes TEXT,
  admin_notes TEXT,
  interview_at TIMESTAMPTZ,
  offer_salary NUMERIC,
  status_updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_student_job_app UNIQUE (student_id, job_id)
);

-- 12. JOB_MATCHES
CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  matched_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  eligibility_passed BOOLEAN DEFAULT TRUE,
  algorithm_version TEXT DEFAULT 'v1.0-rules',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_student_job_match UNIQUE (student_id, job_id, algorithm_version)
);

-- 13. ATS_ANALYSES
CREATE TABLE IF NOT EXISTS public.ats_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  matched_keywords TEXT[] DEFAULT '{}',
  recommended_keywords TEXT[] DEFAULT '{}',
  suggestions JSONB DEFAULT '[]',
  analysis_method TEXT DEFAULT 'deterministic-rules',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TRAINING_PROGRAMS
CREATE TABLE IF NOT EXISTS public.training_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  domain TEXT NOT NULL,
  skills_taught TEXT[] DEFAULT '{}',
  duration TEXT NOT NULL,
  registration_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TRAINING_ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.training_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'recommended' CHECK (status IN ('recommended', 'enrolled', 'in_progress', 'completed', 'cancelled')),
  enrolled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  CONSTRAINT uq_student_training UNIQUE (student_id, training_id)
);

-- 16. RECRUITMENT_DRIVES
CREATE TABLE IF NOT EXISTS public.recruitment_drives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  drive_at TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  venue_or_mode TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT DEFAULT 'all_students' CHECK (audience IN ('all_students', 'department', 'graduating_batch')),
  department_filter TEXT,
  graduation_year_filter INTEGER,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_status_domain ON public.jobs(status, domain);
CREATE INDEX IF NOT EXISTS idx_applications_student_status ON public.applications(student_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_job_status ON public.applications(job_id, status);
CREATE INDEX IF NOT EXISTS idx_job_matches_student ON public.job_matches(student_id);

-- ==============================================================================
-- SECURITY HELPER: Check if current authenticated user is an Admin
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile or admin can view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile except role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

CREATE POLICY "Users can insert own profile defaulting to student"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id AND (role = 'student' OR public.is_admin())
  );

-- SKILLS POLICIES (Public read, admin write)
CREATE POLICY "Anyone authenticated can view skills"
  ON public.skills FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage skills"
  ON public.skills FOR ALL
  USING (public.is_admin());

-- STUDENT SKILLS, PROJECTS, EXPERIENCES, CERTIFICATIONS
CREATE POLICY "Students manage own skills, admins view/manage"
  ON public.student_skills FOR ALL
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Students manage own projects, admins view/manage"
  ON public.projects FOR ALL
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Students manage own experiences, admins view/manage"
  ON public.experiences FOR ALL
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Students manage own certifications, admins view/manage"
  ON public.certifications FOR ALL
  USING (student_id = auth.uid() OR public.is_admin());

-- COMPANIES & JOBS (All authenticated can view published; admins manage)
CREATE POLICY "Authenticated users view companies"
  ON public.companies FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage companies"
  ON public.companies FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users view published jobs; admins view all"
  ON public.jobs FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage jobs"
  ON public.jobs FOR ALL
  USING (public.is_admin());

-- APPLICATIONS POLICIES
CREATE POLICY "Students view own applications, admins view all"
  ON public.applications FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Students insert/update draft applications"
  ON public.applications FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own draft/prepared applications; admins update all"
  ON public.applications FOR UPDATE
  USING (student_id = auth.uid() OR public.is_admin())
  WITH CHECK (
    (student_id = auth.uid() AND status IN ('draft', 'prepared', 'applied', 'withdrawn'))
    OR public.is_admin()
  );

-- ATS & JOB MATCHES
CREATE POLICY "Users view own ATS analysis, admins view all"
  ON public.ats_analyses FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users or system insert ATS analyses"
  ON public.ats_analyses FOR INSERT
  WITH CHECK (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users view own matches, admins view all"
  ON public.job_matches FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

-- TRAINING & ANNOUNCEMENTS
CREATE POLICY "Authenticated users view training programs"
  ON public.training_programs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage training programs"
  ON public.training_programs FOR ALL
  USING (public.is_admin());

CREATE POLICY "Students manage own enrollments"
  ON public.training_enrollments FOR ALL
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated users view recruitment drives"
  ON public.recruitment_drives FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage recruitment drives"
  ON public.recruitment_drives FOR ALL
  USING (public.is_admin());

CREATE POLICY "Authenticated users view published announcements"
  ON public.announcements FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage announcements"
  ON public.announcements FOR ALL
  USING (public.is_admin());

-- AUDIT LOGS (Admins only)
CREATE POLICY "Admins view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- ==============================================================================
-- PRIVILEGED HELPER FOR SAFE ADMIN CREATION
-- Initial Admin setup for authorized account feat2230@gmail.com
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email(target_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin', updated_at = NOW()
  WHERE email = LOWER(TRIM(target_email));
END;
$$;
