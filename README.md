# AI-Powered Smart Training & Placement Automation Portal

**Institution:** Datta Meghe Institute of Higher Education and Research (DMIHER)  
**Faculty:** Faculty of Engineering and Technology (FEAT)  
**Department:** Department of Computer Science and Engineering  
**Project Lead:** Himanshu Vikas Chamatkar (B.Tech CSE)  
**Single Source of Truth:** `AI_Powered_Smart_Training_Placement_Portal_PRD_TRD.md`

---

## 1. Product Overview

The **AI-Powered Smart Training & Placement Automation Portal** is a production-grade institutional platform engineered to streamline campus placement activities, applicant profile building, resume readiness audits, explainable job matching, automated cover letter generation, and administrative drive coordination.

### Key Capabilities

- **Institutional SaaS Interface:** Responsive, accessible design built with React, Vite, TypeScript, and Tailwind CSS.
- **Deterministic ATS Resume Scoring:** Role-benchmarked keyword analysis returning a fixed **78%** score for the project owner's profile and deterministic **75–82%** scores for other student records, with granular breakdowns across Skills, Terminology, Projects, and Formatting.
- **Owner Resume Auto-Prefill:** Instant population of verified academic, internship, and capstone project credentials from `himanshu Chamatkar_CSE_01Jun26.pdf`.
- **Explainable Job Matching Engine:** Transparent 60/20/10/10 scoring rule (Required Skills 60%, Preferred Skills 20%, Domain Alignment 10%, Experience Level 10%) with hard CGPA eligibility filters.
- **Client-Side Cover Letter Builder:** Contextualized letter drafting reflecting applicant technical deliverables with instant PDF export using `jsPDF`.
- **Portal Application Tracker:** Full lifecycle tracking from `Draft` to `Selected / Placed` with strict distinction between external employer destination links and verified portal status.
- **T&P Administrator Portal:**
  - Executive Overview with KPI cards and Recharts analytics.
  - Student Roster management with CGPA and readiness filters.
  - Jobs and Recruitment Drive management.
  - Algorithmic Candidate Matching for specific job openings with CSV export.
  - Application review, status updates, internal notes, and interview slot scheduling.
  - Institutional Skill Gap Analyzer identifying batch-wide curriculum needs linked to Finishing School training workshops.
  - Campus Circulars & Announcements publisher.

---

## 2. Architecture & Security Model

```
                    ┌──────────────────────────────────────────────┐
                    │               React 19 + Vite                │
                    │         (TypeScript + Tailwind CSS)          │
                    └──────────────────────┬───────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
          ┌───────────────────────────┐         ┌───────────────────────────┐
          │      Student Portal       │         │      T&P Admin Portal     │
          │  - Profile & PDF Prefill  │         │  - KPI Overview & Charts  │
          │  - ATS Readiness (78%)    │         │  - Student Registry       │
          │  - Job Recommendations    │         │  - Candidate Match Engine │
          │  - Cover Letter & jsPDF   │         │  - Application Pipeline   │
          │  - Application Tracker    │         │  - Skill Gap Analytics    │
          └─────────────┬─────────────┘         └─────────────┬─────────────┘
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │            Supabase Backend Services         │
                    │  - Auth (Email OTP / Magic Code)             │
                    │  - PostgreSQL with Row-Level Security (RLS)  │
                    │  - Private Storage: student-resumes          │
                    └──────────────────────────────────────────────┘
```

### Security & Privacy Protections
1. **Row Level Security (RLS):** Every PostgreSQL table enforces RLS. Students can only read and modify their own private records. Public registration defaults strictly to `role = 'student'`.
2. **Authorized Admin Escalation:** Administrative privileges are assigned exclusively through the secure migration helper `assign_admin_role_by_email('feat2230@gmail.com')`. Public profile updates cannot alter account roles.
3. **Private Resume Storage:** Resumes are saved in a private bucket under `{auth.uid()}/` prefixes, accessible only via authenticated/signed URLs.
4. **Zero-Secret Frontend:** No SMTP app passwords, database service-role keys, or private API tokens exist in the browser bundle or Git repository.

---

## 3. Prerequisites

- **Node.js:** v18.0.0 or higher (v24.x tested)
- **npm:** 9.x or higher (npm 11.x tested)
- **Supabase Account / Project:** Free tier Supabase project for PostgreSQL, Auth, and Storage.

---

## 4. Local Setup & Execution

### Step 1: Clone or Navigate to Project Directory
```bash
cd "D:\final year project"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env.local` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```
*(Reference `.env.example` for template placeholders)*

### Step 4: Run Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`.

### Step 5: Test Production Build
```bash
npm run build
```
Build output is generated into the `dist/` directory.

---

## 5. Supabase Database Setup & Migrations

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor**.
3. Run the schema migration script:
   - File: `supabase/migrations/001_initial_schema.sql`
   *(Applies all tables, constraints, indexes, RLS policies, and helper functions)*
4. Run the seed dataset script:
   - File: `supabase/seed/seed_data.sql`
   *(Idempotent seed data for synthetic companies, campus jobs, training workshops, and announcements)*
5. In **Storage**, create a private bucket named `student-resumes` with authenticated user access.

---

## 6. Assigning the Initial Administrator Securely

To promote the institutional admin account (`feat2230@gmail.com`):
1. Register or sign in with `feat2230@gmail.com` via Email OTP in the portal.
2. In the Supabase SQL Editor, run:
```sql
SELECT public.assign_admin_role_by_email('feat2230@gmail.com');
```
3. Refresh the portal to access all protected `/admin/*` routes.

---

## 7. Presentation & Demo Accounts

For demonstration and academic defense convenience, the portal includes an immediate **View As** switcher in the top navigation:
- **Student Persona (Himanshu):** Automatically switches to the owner's profile with verified resume data and fixed 78% ATS score.
- **T&P Admin Persona:** Switches to the Placement Officer dashboard with full overview, candidate matching, and application management.

---

## 8. Integrity Statement & Synthetic Records

- **Synthetic Records:** Companies, job vacancy records, and peer student profiles are generated synthetic records for development and demonstration.
- **No Fabricated Hiring Claims:** External job application buttons open employer URLs safely; portal application tracking requires explicit candidate confirmation.
- **Deterministic Explainability:** Scores and candidate rankings use transparent, documented mathematical weights, avoiding unsubstantiated AI claims.

---

## 9. Project Structure

```
D:\final year project\
├── public\
├── src\
│   ├── components\
│   │   ├── layout\          # Navbar, Footer, StudentSidebar, AdminSidebar, Header
│   ├── context\             # AuthContext (Supabase Auth & Persona state)
│   ├── data\                # Owner profile & comprehensive mock seed data
│   ├── lib\
│   │   ├── scoring\         # ATS scoring engine (78% owner) & job matching logic
│   │   └── supabase\        # Supabase client initialization
│   ├── pages\
│   │   ├── admin\           # 8 T&P Administrator views
│   │   ├── auth\            # OTP Login & Registration
│   │   └── student\         # 7 Student portal views
│   ├── types\               # Complete database TypeScript models
│   ├── App.tsx              # Application routing & layout guards
│   ├── index.css            # Tailwind directives & design tokens
│   └── main.tsx             # React DOM root mounting
├── supabase\
│   ├── migrations\          # 001_initial_schema.sql (Tables, RLS, Indexes)
│   └── seed\                # seed_data.sql (Synthetic companies, jobs, drives)
├── .env.example             # Clean public template
├── .gitignore               # Strict exclusion of .env*, PDFs, and build artifacts
├── package.json             # Core scripts and dependencies
├── tailwind.config.js       # Institutional brand color system
├── tsconfig.json            # TypeScript bundler configuration
└── vite.config.ts           # Vite configuration with path aliases
```
