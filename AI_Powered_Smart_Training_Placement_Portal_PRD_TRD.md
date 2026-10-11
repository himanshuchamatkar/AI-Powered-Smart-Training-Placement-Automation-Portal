# AI-Powered Smart Training & Placement Automation Portal

## Product Requirements Document (PRD) and Technical Requirements Document (TRD)

**Project owner:** Himanshu Vikas Chamatkar\
**Institution:** DMIHER, Faculty of Engineering and Technology,
Department of Computer Science and Engineering\
**Project folder:** `D:\final year project`\
**Resume source:**
`D:\final year project\himanshu Chamatkar_CSE_01Jun26.pdf`\
**Repository:**
`https://github.com/himanshuchamatkar/AI-Powered-Smart-Training-Placement-Automation-Portal`\
**Document purpose:** Single source of truth for the Antigravity/Gemini
coding agent.

------------------------------------------------------------------------

# PART I --- PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product vision

Build a polished, professional, responsive, full-stack Training &
Placement portal that brings student profile building, resume analysis,
job recommendations, cover-letter generation, application tracking, and
T&P administration into one coherent application.

The application should feel like a complete institutional software
product: consistent navigation, high-quality visual design, realistic
populated screens, robust validation, useful empty/error/loading states,
and working interactions. Avoid visibly unfinished pages, placeholder
buttons, lorem ipsum, broken routes, and labels such as "prototype" or
"demo" in the user-facing interface.

**Integrity requirement:** Seeded records are synthetic records for
development/presentation. Do not claim that generated statistics are
actual DMIHER outcomes, that an application was sent to an employer when
only an external link was opened, or that a deterministic score is the
result of a trained AI model. Keep seeded data and implementation notes
identifiable in code, README, and database metadata. The visible product
can remain professional without misrepresenting real-world outcomes.

## 2. Time and delivery constraints

-   The project must be built within a very short academic submission
    window.
-   Prioritize a reliable end-to-end flow over complex, fragile
    integrations.
-   Do not spend time training a machine-learning model or integrating
    multiple paid AI services.
-   Use deterministic, explainable rules and seeded datasets for
    matching and ATS analysis unless a live AI API is explicitly
    configured and working.
-   The application must work locally before optional deployment.
-   Avoid adding infrastructure that does not materially improve the
    required features.

## 3. Target users and roles

### 3.1 Student

Can register, verify their email, sign in, create/update a profile,
upload a resume, review extracted or prefilled details, see ATS
analysis, browse relevant jobs, generate/download a tailored cover
letter, open an employer application link, and track application records
saved in the portal.

### 3.2 T&P administrator / placement officer

Can access a protected admin area, view student records, manage job
listings, run candidate matching, monitor applications, update
application statuses, view training/skill-gap information, publish
announcements, and view placement analytics.

### 3.3 Authorization rules

-   Every account has a role stored in a protected database field.
-   Public registration must always create a `student` account. A user
    must never be able to set their own role to `admin`.
-   The initial administrator account is associated with
    `feat2230@gmail.com`, but it must only receive admin privileges
    through a deliberate, secure seed/migration process or manual
    authorized assignment.
-   Do not hard-code a public admin password such as `admin123`.
-   Admin routes must check both authenticated session and admin role;
    hiding navigation alone is not security.
-   Students may only read/write their own private profile and
    application data, except for intentionally public job and
    announcement information.
-   Enforce access control in Supabase Row Level Security (RLS), not
    only in frontend code.

## 4. Authentication and account lifecycle

### 4.1 Preferred approach: Supabase Auth email OTP

Use Supabase Auth's supported email one-time-password/magic-code flow.
Configure custom SMTP in Supabase if Gmail delivery is required. The
Gmail app password is an SMTP secret and must only be entered in a
secure server/provider configuration field; it must never be sent to the
browser or committed to Git.

-   Registration form: full name, email address, optional phone number,
    password only if password-based auth is also deliberately enabled,
    and consent/terms checkbox if required by the implementation.
-   Verify the user's email through Supabase Auth email OTP.
-   Login uses the email address and the configured Supabase Auth flow.
-   Provide resend-code cooldown, clear expiry messages, invalid-code
    handling, and sign-out.
-   Add password reset only if password authentication is enabled.
-   Do not invent a separate custom OTP mechanism unless Supabase Auth
    cannot meet a confirmed requirement. If a custom OTP service is
    implemented, it must be server-side, expire quickly, be
    rate-limited, be stored hashed, be single-use, and never log the OTP
    or SMTP secret.

**Important architecture note:** A Vite frontend cannot safely send
email through Gmail SMTP directly. Never put SMTP credentials in a
`VITE_*` variable. If custom backend mail delivery is required, use a
server-only service on Render and server-only environment variables.
Prefer Supabase Auth's own email OTP and SMTP configuration to reduce
complexity.

### 4.2 Session and access behavior

-   Preserve a valid session on refresh using the Supabase client.
-   Redirect unauthenticated users to the appropriate sign-in page.
-   Redirect students away from `/admin/*`.
-   Redirect non-admins away from all admin endpoints/screens.
-   Provide a clear logout action.
-   Handle expired sessions and network failures gracefully.

## 5. Product scope and navigation

### 5.1 Student portal

1.  Landing / sign-in / registration
2.  Student home dashboard
3.  Profile builder
4.  Resume upload and resume details
5.  ATS analysis and improvement suggestions
6.  Job recommendations and job details
7.  Cover-letter builder and PDF download
8.  Application tracker
9.  Announcements
10. Account/profile settings

### 5.2 T&P portal

1.  Admin sign-in / role-guarded entry
2.  Overview dashboard
3.  Student management
4.  Jobs and recruitment drives
5.  Candidate matching
6.  Application tracking
7.  Skills and training
8.  Placement analytics and reports
9.  Announcements management
10. Admin settings / sign out

## 6. Detailed functional requirements

### FR-01 --- Public landing and authentication

-   Create a polished institutional SaaS-style landing page with a
    concise product explanation and sign-in/register calls to action.
-   Build responsive login, registration, email verification, and
    resend-code states.
-   Validate email format, required fields, password policy if
    applicable, and duplicate account errors.
-   Never show secret configuration values in UI, logs, or error
    messages.
-   Do not allow self-registration as an administrator.
-   Use the verified user's Supabase identity as the primary identity
    key.

### FR-02 --- Student profile builder

Profile fields should include: - Full name - Email - Optional phone
number - College/university - Department/branch - Current year and
semester - Graduation year - CGPA/percentage (optional) - Career
objective / summary - Technical skills - Tools and frameworks - Projects
(name, description, technologies, dates, project URL) -
Internships/experience (organization, role, dates, description) -
Certifications - Achievements/leadership - Preferred domain and role -
Experience/readiness level - Resume file reference - Profile completion
percentage

Requirements: - Support a guided manual form with validation. - Save
data to Supabase and reload it after signing in again. - Let students
edit and save their profile. - Allow resume upload with file type and
size validation. - Show upload progress, success/failure state, and
current file name. - Store files in a private Supabase Storage bucket
and use authenticated access or signed URLs. - Do not make personal
resumes publicly accessible. - Do not overwrite existing user-entered
details without confirmation.

### FR-03 --- Resume parsing and preloaded owner profile

-   The provided PDF at
    `D:\final year project\himanshu Chamatkar_CSE_01Jun26.pdf` is the
    source for the owner's prefilled profile.
-   Read this file only from the specified project folder; do not search
    other folders or the internet for personal information.
-   Create a local structured seed/profile JSON from the resume content,
    or parse it locally during development if a dependable parser is
    available.
-   Do not require a cloud AI API just to populate the owner's profile.
-   When the owner uploads the same resume, populate the profile with
    the saved resume-derived information and show a review/edit step
    before saving.
-   For other uploaded resumes, implement basic PDF text extraction if
    it can be done reliably in the time available. If extraction fails,
    present the manual form and an honest, clear error/retry option
    rather than inventing resume details.
-   Do not claim that arbitrary resumes were fully parsed if only the
    owner profile is preconfigured.
-   Handle PDF parsing errors and scanned/image-only PDFs gracefully.
-   Do not expose the raw PDF publicly or commit it to Git.

### FR-04 --- Owner's preloaded resume data

Use the following information from the supplied resume to seed the owner
account/profile. Treat it as editable profile data and avoid displaying
private contact details on public pages.

**Identity and education** - Name: Himanshu Vikas Chamatkar - Location:
Nagpur, Maharashtra, India - Email in resume:
`123himanshuchamatkar@gmail.com` - Current degree: B.Tech, Computer
Science & Engineering - Institution: Datta Meghe Institute of Higher
Education and Research (DMIHER), Wardha - Degree period: 2023--Present -
CGPA stated in resume: 6.29 - HSC: New English Jr. College, Wardha,
2022--2023, 65.83% - Class X: Bhavans Lloyds Vidya Niketan, 2020--2021,
74.2%

**Experience** - Cyber Security Intern, Cluster Computing Pvt. Ltd.,
Nagpur, May--July 2025 - Resume describes scam-pattern analysis,
digital-evidence organization, and fraud investigation/compliance
support.

**Projects** - YOLO-Based Answer Sheet Block Extraction System: Python,
YOLO, OpenCV, NumPy, OCR, Streamlit - AI Influencer Content Automation
Workflow: n8n, ComfyUI, OpenAI/Gemini APIs, Docker, Python, Instagram
API - Phishing Detection Chrome Extension with Explainable Risk Scoring:
Node.js, Express, MongoDB Atlas, Puppeteer, Chrome Extension API,
Render - Explainable AI-Based Intrusion Detection System: Python,
scikit-learn, SHAP, Streamlit - Stock Analysis & Decision Support
System: Python, Pandas, Plotly/Dash, Streamlit - Face Expression
Recognition System: TensorFlow/Keras, OpenCV, scikit-learn - Soil
Moisture Analysis using Drone RGB Images: NumPy, OpenCV, TensorFlow

**Skills** - Programming: Python, C/C++, JavaScript, SQL, HTML/CSS -
AI/ML: TensorFlow, Keras, PyTorch, scikit-learn, OpenCV, CNNs, SHAP,
computer vision, deep learning - Agentic AI/automation: n8n, AI workflow
automation, LLM pipelines, multi-agent systems, REST API integrations,
Telegram bot automation - Web: React, Node.js, Express, Streamlit,
Plotly/Dash, REST APIs, Firebase - Data: Pandas, NumPy, Matplotlib,
Seaborn - Tools: Git, Linux, MySQL, Google Colab, VTK, DICOM, Docker

**Certifications and leadership** - Research paper presented at DMIHER
3rd International Conference (2025), about 3D volumetric reconstruction
from 2D CT scan slices using DICOM processing and VTK-based rendering -
President, IGNITRA 4.0, Dec 2025--Feb 2026 - Technical Student Incharge,
3rd IEEE DMIHER International Conference on AI in Healthcare, Education
& Industry (2025); coordinated 200+ participants - Treasurer, IGNITRA
3.0 and Student Council (FEAT), Jun 2024--Jun 2025 - Coursera courses
listed in the resume: C/C++, Generative AI Prompt Engineering Basics,
HTML/CSS/JavaScript, Python for Data Science/AI Development

The resume contains a phone number and personal links. Do not
unnecessarily expose these on public job cards, dashboards, seed data,
or screenshots. Use the authenticated account email for account
identity. Do not silently change the resume's facts.

### FR-05 --- Experience-level classification

Use a transparent, deterministic classification: - **Beginner:** no
internship/work-experience records. - **Intermediate:** at least one
internship/work-experience record. - Do not create a separate "Pro"
category unless a future rule is defined; the agreed initial rule does
not include a practical "Pro" condition. - Display the classification as
a readiness indicator, not as a validated assessment or hiring
decision. - Allow students/admins to correct erroneous experience data.

### FR-06 --- ATS score and keyword suggestions

-   For the owner's preloaded resume, show a fixed score of **78%** for
    the agreed presentation flow.
-   For other users, return a score within **75--82%** using a
    deterministic rule/seeded result so the experience is repeatable. Do
    not use a random score on every page refresh.
-   Use a label such as "Resume Match / ATS Readiness" and show a clear
    breakdown: relevant skills, role keywords, projects/experience
    evidence, and formatting/completeness.
-   Provide a fixed, role-specific list of missing or recommended
    keywords based on the selected target role.
-   Suggestions should be generated from actual differences between
    profile skills and job/role keyword lists, not unrelated random
    words.
-   Show positive and actionable suggestions, for example adding a
    measurable project outcome, specifying relevant tools, or including
    a missing skill only if it genuinely applies.
-   Do not claim that the score comes from a real ATS vendor or a
    trained model.
-   Persist the calculated score and analysis timestamp for a consistent
    experience.

### FR-07 --- Job dataset and recommendations

Seed a realistic but clearly synthetic dataset with approximately: -
15--20 fictional or appropriately attributed company records - 50--100
job openings across 5--10 domains - Multiple levels: internship,
entry-level, junior - Job titles, location/work mode, employment type,
description, required skills, preferred skills, eligibility,
package/stipend range, posted date, closing date, application URL,
company details, and status - At least several jobs for each of the
owner's relevant areas: AI/ML, Python, full-stack/web development,
cybersecurity, automation, data analytics, and computer vision.

Data and company requirements: - Do not fabricate real companies' open
positions, salaries, or application links. - Use fictional companies and
clearly non-operational or explicitly seeded external links unless an
actual verified public job URL is supplied. - Do not present fictional
openings as confirmed real vacancies. - Use consistent dates/statuses
and avoid impossible combinations (e.g. expired jobs marked accepting
applications). - Use deterministic seeding so refreshing or redeploying
does not duplicate rows. - Seed script must be safe to run more than
once.

Recommendation rules: - Match profile skills, project technologies,
target role, experience level, and eligibility against job
requirements. - Return a match percentage with an explanation of matched
and missing skills. - Rank higher-skill-overlap jobs first; apply
eligibility constraints before ranking. - Provide filters for domain,
location/work mode, job type, experience level, and keyword. - Show
loading/skeleton states and a polished "finding suitable opportunities"
transition; keep the transition brief and do not imply a long-running
real AI job if the matching is local. - Provide a meaningful no-results
state with filters to adjust.

### FR-08 --- Job details and application preparation

-   Job cards show title, company, location/work mode, employment type,
    stipend/salary range, experience level, closing date, and match
    score.
-   Job detail view includes role description, required skills,
    eligibility, responsibilities, and application instructions.
-   "Prepare cover letter" opens a generator populated with the
    student's name, relevant skills, project/experience details, job
    title, and company.
-   Allow preview and editing before downloading.
-   Generate a clean PDF with professional typography, sensible margins,
    and the student's details.
-   Use a client-side PDF library if it is reliable and avoids
    unnecessary backend complexity.
-   "Apply" must open the configured application URL in a new tab with
    safe link attributes. If the job is synthetic and has no real
    application destination, show an honest application-instructions
    page rather than pretending an application was submitted to an
    employer.
-   When the user chooses "Track application" or confirms an
    application-preparation action, save a portal application record.
    Clearly distinguish "Prepared", "Link opened", and any actual
    portal-managed status.
-   Never auto-submit job applications or claim employer submission
    without a real integration and explicit user confirmation.

### FR-09 --- Student application tracker

-   List the student's saved applications with job, company, date,
    status, and next action.
-   Status values: Draft, Prepared, Applied (user-confirmed),
    Shortlisted, Interview, Selected, Rejected, Withdrawn.
-   A user may update their own draft/preparation records but cannot
    self-assign an admin-confirmed hiring outcome.
-   Display timestamps and empty states correctly.
-   Admin changes must reflect in the student's tracker.

### FR-10 --- T&P admin overview

Create a premium, responsive admin dashboard with a consistent sidebar
and header.

KPI cards: - Total registered students - Active job listings -
Applications tracked - Students selected/placed (seeded records only) -
Average resume readiness - Upcoming recruitment drives

Charts and tables: - Applications by status - Domain-wise student
readiness - Job/domain distribution - Recent student activity - Upcoming
recruitment drives - Recent application updates - Placement trend across
academic periods if seeded data supports it

Requirements: - Use aggregate queries or consistent derived values from
the same database, not unrelated hard-coded chart numbers. - Provide
filters by department, graduation year, domain, and time period where
relevant. - Keep charts responsive and accessible. - Clearly distinguish
"selected/placed" records from general application records in data
logic. - No empty-looking chart areas or broken charts when the dataset
is small.

### FR-11 --- Student management

-   Search, sort, filter, paginate, and open student details.
-   Table columns: name, department, graduation year, experience level,
    resume score, preferred domain, profile completion, application
    count, placement status.
-   Detail page includes profile, resume metadata, skills, projects,
    experience, ATS history, matched jobs, and applications.
-   Admin can edit appropriate student fields and review a student's
    placement readiness.
-   Avoid displaying a student's private phone/email unnecessarily in
    overview tables.
-   Restrict resume access to authorized roles and use private storage.

### FR-12 --- Jobs and recruitment administration

-   Admin can create, edit, publish, close, and archive job records.
-   Validate required fields, closing dates, skills, salary/stipend
    fields, and eligibility rules.
-   Admin can create recruitment-drive records with company/role,
    registration deadline, drive date, eligibility, venue/mode, and
    status.
-   Student job listings should reflect admin changes.
-   Provide confirmation before destructive actions.
-   Soft-delete/archive jobs by default rather than permanently deleting
    records.

### FR-13 --- Candidate matching for a selected job

-   Admin selects a job and requests eligible student matches.
-   Matching uses the same deterministic scoring rules as the student
    job recommendation engine.
-   Show candidate rank, score, matched skills, missing skills,
    eligibility result, experience level, and profile link.
-   Explain that the ranking is decision support, not an automatic
    hiring decision.
-   Allow filtering and exporting a CSV if feasible.
-   Do not infer protected/sensitive traits or use them in ranking.
-   Keep matching results consistent for identical inputs.

### FR-14 --- Application management

-   Admin can filter applications by job, company, department, status,
    and graduation year.
-   Admin can update statuses, add internal notes, and record interview
    schedules/offers.
-   Every status change should update the same application record and be
    reflected in the student's view.
-   Store an audit trail for admin status changes where feasible.
-   Prevent students from editing admin-only notes or setting
    selected/placed status.
-   Use confirmation and validation for bulk changes.

### FR-15 --- Skills and training

-   Seed training records with course/workshop title, provider, domain,
    skills taught, duration, registration URL, and status.
-   Derive common skill gaps from job requirements compared with student
    skills.
-   Show top missing skills and counts of students who could benefit
    from training.
-   Admin can add/edit/archive training records.
-   Student recommendations should be based on actual skill gaps in
    their profile.
-   Do not claim that a student completed training unless there is a
    saved completion record.

### FR-16 --- Announcements

-   Admin can create, edit, publish, and archive announcements.
-   Fields: title, body, audience, publish date, optional expiry,
    category, and priority.
-   Audience can be all students or supported filters such as
    department/year.
-   Students see currently published announcements targeted to them.
-   Seed several realistic announcements with consistent dates.
-   Do not send emails to all students unless a real, explicitly enabled
    mail workflow is configured.

### FR-17 --- Placement analytics and export

-   Provide branch/year/domain summaries and company/job-level
    summaries.
-   Calculate rates from explicit denominators; document how "placement
    rate" is calculated.
-   Use seeded placement outcomes only for initial populated analytics.
-   Allow CSV export for permitted tables where feasible.
-   Never call synthetic values official college statistics.
-   Do not show salary averages if there is insufficient or inconsistent
    salary data.

### FR-18 --- Profile, settings, and notifications

-   Let students edit personal/profile fields and sign out.
-   Provide in-app notification/announcement indicators if feasible.
-   Keep notifications local to the app unless an email notification is
    intentionally implemented.
-   Do not expose secrets in settings or error screens.

## 7. Synthetic dataset requirements

Generate a cohesive seed dataset, not unrelated random numbers.

Suggested initial size: - 100--200 student profiles - 15--20 company
records - 50--100 job openings - 200--400 application records - 30--60
selected/placed outcomes where supported by consistent application
records - 20--30 training records - 5--10 announcements - 5--10
recruitment drives

Rules: - The owner's profile must use the resume-derived facts listed
above and the fixed 78% ATS score. - Other student names and emails must
be synthetic and use reserved/example domains or non-deliverable
addresses. Do not use real students' private information. - Synthetic
records should have varied but plausible skills, experience, profile
completeness, target domains, application histories, and statuses. - Use
referentially valid foreign keys. - Applications must reference existing
students and jobs. - Placement outcomes must be supported by
corresponding selected/offer records. - Use a fixed seed or
deterministic generator. - Provide a repeatable seed/reset script. Reset
must require explicit confirmation and must never delete existing
production data. - Keep seeded data visibly professional in the product,
while documenting its synthetic nature in developer documentation.

## 8. Visual design requirements

-   Professional institutional SaaS interface; clean typography,
    balanced whitespace, consistent spacing, and restrained accent
    colors.
-   Desktop-first admin dashboard that also works well on tablets and
    mobile.
-   Student portal should be mobile-friendly.
-   Use a consistent component library/design system and shared
    components for cards, tables, filters, dialogs, forms, badges,
    skeletons, toasts, and empty states.
-   Use charts only where they answer a real question.
-   Provide a cohesive sidebar, active navigation state, breadcrumb/page
    title, profile menu, and logout.
-   Use icons consistently; avoid emoji as core UI icons.
-   Use subtle transitions and polished loading states; avoid excessive
    animations.
-   Ensure contrast, focus states, keyboard navigation, and accessible
    labels.
-   No dead buttons, placeholder links, unfinished "coming soon" pages,
    lorem ipsum, or user-facing "prototype/demo" wording.
-   All major buttons must perform a real action or be clearly disabled
    with an explanation.
-   Do not expose synthetic data as official real-world results.

## 9. Non-functional requirements

-   Reliability: no fatal errors in the primary end-to-end flow.
-   Security: RLS, role checks, private resume storage, secure secret
    management.
-   Performance: paginated tables, indexed foreign keys/search fields
    where needed, reasonable initial load time.
-   Maintainability: modular components, typed data models, reusable
    service functions, clear naming.
-   Responsiveness: mobile, tablet, desktop.
-   Accessibility: semantic HTML, labels, keyboard support, visible
    focus.
-   Error handling: useful user messages without stack traces or secret
    leakage.
-   Data consistency: common records power both student and admin views.
-   Privacy: minimize personally identifiable data in synthetic records
    and public screens.
-   Deployment: production build must complete successfully.

## 10. Acceptance criteria

The project is ready for submission when: 1. Registration and email
verification work using the configured auth flow. 2. Sign-in, sign-out,
session persistence, and role-based route protection work. 3. Public
registration cannot create an admin. 4. The owner's profile can be
populated from the provided resume-derived data. 5. Manual profile entry
and editing persist after refresh/relogin. 6. Resume upload works with
private storage and correct access restrictions. 7. The owner's ATS
score displays 78% consistently. 8. Other profiles get consistent
75--82% scores with meaningful suggestions. 9. Job recommendations use
profile skills and explain their matches. 10. Cover-letter
preview/edit/PDF download works. 11. External application links behave
honestly and safely. 12. Student application records are persisted and
visible to T&P. 13. Admin can manage students, jobs, applications,
training, and announcements. 14. Admin candidate matching is consistent
and explainable. 15. Dashboard metrics and charts derive from the seeded
database and reconcile with tables. 16. RLS prevents cross-student
access and blocks unauthorized admin access. 17. No secret keys or SMTP
credentials appear in the browser bundle or Git history. 18. The
application runs from a clean setup using documented commands. 19. The
README explains setup, environment variables, seeding, and deployment.
20. The UI contains no visibly unfinished controls or broken routes.

------------------------------------------------------------------------

# PART II --- TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## 11. Recommended architecture

### Frontend

-   React
-   Vite
-   TypeScript
-   Tailwind CSS
-   A consistent accessible component system
-   React Router
-   React Hook Form + Zod (or equivalent form validation)
-   Recharts (or a similarly maintained chart library)
-   Supabase JavaScript client
-   A reliable client-side PDF generation library for cover letters

### Backend and data

-   Supabase Auth for account identity and email OTP
-   Supabase PostgreSQL for application data
-   Supabase Storage with a private resume bucket
-   Supabase Row Level Security for data authorization
-   SQL migrations and idempotent seed scripts
-   Optional Render-hosted backend only if a requirement cannot safely
    be implemented with Supabase. Do not add a separate backend by
    default.

### Deployment

-   Vercel for the React frontend
-   Supabase for auth/database/storage
-   Render only if a separate server-side API becomes necessary

This stack minimizes moving parts. Do not add n8n, a vector database, a
separate Python ML service, or a paid AI provider unless the core
application is already working and there is time to test the
integration.

## 12. Project-folder and tool-safety rules (mandatory)

The coding agent MUST follow all of these:

1.  **Working directory:** `D:\final year project`.
2.  **Resume source:**
    `D:\final year project\himanshu Chamatkar_CSE_01Jun26.pdf`.
3.  Treat the working directory as the project boundary. Do not search
    other folders, drives, unrelated repositories, personal directories,
    or the internet for files or credentials.
4.  Do not run broad filesystem searches outside the working directory.
5.  Do not read or modify files outside the project folder unless the
    user explicitly approves the exact action and path.
6.  Do not delete, rename, move, overwrite, or bulk-reformat existing
    files without first asking the user and receiving explicit
    permission.
7.  Do not run destructive commands such as recursive deletion,
    destructive database resets, or force pushes without explicit
    approval.
8.  Inspect the current folder and Git status before making changes. If
    the folder already contains files, preserve them.
9.  Do not reinitialize Git if `.git` already exists. Do not add a
    remote that already exists. Inspect first.
10. Do not push to GitHub automatically. Ask for confirmation before the
    first push and before any force push.
11. Do not commit `.env`, `credentials.txt`, private resumes, app
    passwords, API tokens, service-role keys, or other secrets.
12. Never print secret values in terminal output, logs, screenshots,
    generated documentation, or chat. When checking configuration,
    report only whether a variable is present.
13. Do not copy secret values into `README.md`, PRD/TRD, source files,
    test fixtures, or frontend variables.
14. Do not put Gmail SMTP credentials, Supabase secret/service-role
    keys, Vercel tokens, Render API keys, or Gemini keys in any `VITE_*`
    variable.
15. Use placeholders in `.env.example`; never duplicate the real `.env`.
16. If a required key is absent or ambiguous, ask the user for the exact
    missing configuration or give secure manual setup instructions. Do
    not guess credentials or silently switch providers.
17. Do not install large or unrelated dependencies without checking
    whether a smaller existing dependency already meets the requirement.
18. If a task risks data loss, deployment disruption, unexpected cost,
    or exposure of private information, stop and ask.
19. Work incrementally: inspect, plan, implement, test, report. Keep the
    app runnable after each major phase.
20. At the end, report changed files, commands run, test results,
    deployment status, and any unfinished requirements. Never claim a
    feature works unless it was actually tested.

## 13. Environment configuration and secret handling

Create `.env.example` with placeholders only. The exact variables depend
on the chosen architecture. For a Vite + Supabase frontend, a safe
example is:

``` dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

These two values are intended for the browser and must be protected by
RLS; the publishable key is not a substitute for database authorization.

Server-only variables, only if a backend is actually added:

``` dotenv
SUPABASE_URL=
SUPABASE_SECRET_KEY=
GMAIL_SMTP_HOST=
GMAIL_SMTP_PORT=
GMAIL_SMTP_USERNAME=
GMAIL_SMTP_APP_PASSWORD=
GEMINI_API_KEY=
```

Do not add server-only variables unless the selected backend uses them.
Do not use a secret/service-role key in a frontend Vite build.

### Gmail and email OTP

Preferred configuration: - Use Supabase Auth email OTP. - Configure
custom SMTP in Supabase using Gmail SMTP details and the Gmail app
password through the Supabase dashboard's secure SMTP settings. - The
frontend requests an OTP using Supabase Auth; it does not generate or
send the email itself. - Never expose the Gmail app password to the
client. - Do not send test emails to real students without permission. -
Use a verified sender/configuration and test only with accounts the
project owner controls.

If a separate Render backend is required for email: - Store Gmail
credentials in Render environment variables. - Restrict CORS to the
deployed frontend. - Add rate limiting and OTP expiry/single-use
protections if implementing custom codes. - Never log email app
passwords, OTP codes, authorization headers, or complete environment
objects.

### Git ignore

Ensure `.gitignore` excludes at minimum:

``` gitignore
node_modules/
dist/
.env
.env.*
!.env.example
*.log
.DS_Store
Thumbs.db
himanshu Chamatkar_CSE_01Jun26.pdf
credentials.txt
```

If any secret has already been committed, removing it in a later commit
is not sufficient. Revoke/rotate it and clean repository history if
needed, with user approval before history-rewriting operations.

## 14. Database design

Use UUID primary keys, timestamps, foreign keys, appropriate indexes,
and check constraints where useful. Table names can be adapted to the
existing project, but the logical model must be preserved.

### 14.1 `profiles`

-   `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
-   `full_name TEXT NOT NULL`
-   `email TEXT`
-   `phone TEXT`
-   `role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin'))`
-   `institution TEXT`
-   `department TEXT`
-   `graduation_year INTEGER`
-   `current_year INTEGER`
-   `semester INTEGER`
-   `cgpa NUMERIC`
-   `career_objective TEXT`
-   `preferred_domain TEXT`
-   `preferred_role TEXT`
-   `experience_level TEXT CHECK (experience_level IN ('beginner','intermediate'))`
-   `profile_completion INTEGER DEFAULT 0`
-   `resume_storage_path TEXT`
-   `resume_file_name TEXT`
-   `ats_score INTEGER`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`
-   `updated_at TIMESTAMPTZ DEFAULT NOW()`

Important: role must not be settable by public profile update policies.
Assign admin status only through a secure migration/manual privileged
action.

### 14.2 `skills`

-   `id UUID PRIMARY KEY`
-   `name TEXT UNIQUE NOT NULL`
-   `category TEXT`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

### 14.3 `student_skills`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `skill_id UUID REFERENCES skills(id) ON DELETE CASCADE`
-   `proficiency TEXT`
-   Unique constraint on `(student_id, skill_id)`

### 14.4 `projects`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `title TEXT NOT NULL`
-   `description TEXT`
-   `technologies TEXT[]`
-   `start_date DATE`
-   `end_date DATE`
-   `project_url TEXT`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

### 14.5 `experiences`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `organization TEXT`
-   `role_title TEXT`
-   `experience_type TEXT CHECK (experience_type IN ('internship','employment','other'))`
-   `description TEXT`
-   `start_date DATE`
-   `end_date DATE`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

### 14.6 `certifications`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `title TEXT NOT NULL`
-   `provider TEXT`
-   `issue_date DATE`
-   `credential_url TEXT`

### 14.7 `companies`

-   `id UUID PRIMARY KEY`
-   `name TEXT NOT NULL`
-   `description TEXT`
-   `website TEXT`
-   `industry TEXT`
-   `location TEXT`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

### 14.8 `jobs`

-   `id UUID PRIMARY KEY`
-   `company_id UUID REFERENCES companies(id)`
-   `title TEXT NOT NULL`
-   `domain TEXT NOT NULL`
-   `description TEXT`
-   `responsibilities TEXT[]`
-   `required_skills TEXT[] NOT NULL DEFAULT '{}'`
-   `preferred_skills TEXT[] NOT NULL DEFAULT '{}'`
-   `eligibility TEXT`
-   `minimum_cgpa NUMERIC`
-   `experience_level TEXT`
-   `employment_type TEXT`
-   `work_mode TEXT`
-   `location TEXT`
-   `salary_min NUMERIC`
-   `salary_max NUMERIC`
-   `salary_currency TEXT DEFAULT 'INR'`
-   `application_url TEXT`
-   `is_synthetic BOOLEAN DEFAULT TRUE`
-   `status TEXT CHECK (status IN ('draft','published','closed','archived'))`
-   `posted_at TIMESTAMPTZ`
-   `closing_at TIMESTAMPTZ`
-   `created_by UUID REFERENCES profiles(id)`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`
-   `updated_at TIMESTAMPTZ DEFAULT NOW()`

### 14.9 `applications`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `job_id UUID REFERENCES jobs(id)`
-   `status TEXT CHECK (status IN ('draft','prepared','applied','shortlisted','interview','selected','rejected','withdrawn'))`
-   `applied_at TIMESTAMPTZ`
-   `cover_letter_storage_path TEXT`
-   `student_notes TEXT`
-   `admin_notes TEXT`
-   `interview_at TIMESTAMPTZ`
-   `offer_salary NUMERIC`
-   `status_updated_by UUID REFERENCES profiles(id)`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`
-   `updated_at TIMESTAMPTZ DEFAULT NOW()`
-   Add a unique constraint on `(student_id, job_id)` if only one active
    application per student/job is intended.

### 14.10 `job_matches`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `job_id UUID REFERENCES jobs(id) ON DELETE CASCADE`
-   `match_score INTEGER CHECK (match_score BETWEEN 0 AND 100)`
-   `matched_skills TEXT[]`
-   `missing_skills TEXT[]`
-   `eligibility_passed BOOLEAN`
-   `algorithm_version TEXT`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`
-   Unique constraint on `(student_id, job_id, algorithm_version)` if
    results are upserted.

### 14.11 `ats_analyses`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `target_role TEXT`
-   `score INTEGER CHECK (score BETWEEN 0 AND 100)`
-   `matched_keywords TEXT[]`
-   `recommended_keywords TEXT[]`
-   `suggestions JSONB`
-   `analysis_method TEXT`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

### 14.12 `training_programs`

-   `id UUID PRIMARY KEY`
-   `title TEXT NOT NULL`
-   `provider TEXT`
-   `domain TEXT`
-   `skills_taught TEXT[]`
-   `duration TEXT`
-   `registration_url TEXT`
-   `status TEXT`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

### 14.13 `training_enrollments`

-   `id UUID PRIMARY KEY`
-   `student_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
-   `training_id UUID REFERENCES training_programs(id) ON DELETE CASCADE`
-   `status TEXT CHECK (status IN ('recommended','enrolled','in_progress','completed','cancelled'))`
-   `enrolled_at TIMESTAMPTZ`
-   `completed_at TIMESTAMPTZ`
-   Unique constraint on `(student_id, training_id)`.

### 14.14 `recruitment_drives`

-   `id UUID PRIMARY KEY`
-   `company_id UUID REFERENCES companies(id)`
-   `job_id UUID REFERENCES jobs(id)`
-   `title TEXT NOT NULL`
-   `description TEXT`
-   `drive_at TIMESTAMPTZ`
-   `registration_deadline TIMESTAMPTZ`
-   `venue_or_mode TEXT`
-   `eligibility TEXT`
-   `status TEXT`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

### 14.15 `announcements`

-   `id UUID PRIMARY KEY`
-   `title TEXT NOT NULL`
-   `body TEXT NOT NULL`
-   `audience TEXT DEFAULT 'all_students'`
-   `department_filter TEXT`
-   `graduation_year_filter INTEGER`
-   `priority TEXT`
-   `status TEXT CHECK (status IN ('draft','published','archived'))`
-   `published_at TIMESTAMPTZ`
-   `expires_at TIMESTAMPTZ`
-   `created_by UUID REFERENCES profiles(id)`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`
-   `updated_at TIMESTAMPTZ DEFAULT NOW()`

### 14.16 `audit_logs` (recommended)

-   `id UUID PRIMARY KEY`
-   `actor_id UUID REFERENCES profiles(id)`
-   `action TEXT NOT NULL`
-   `entity_type TEXT NOT NULL`
-   `entity_id UUID`
-   `metadata JSONB`
-   `created_at TIMESTAMPTZ DEFAULT NOW()`

Do not store secrets, OTP codes, raw SMTP credentials, or unnecessary
personal information in audit metadata.

## 15. RLS and authorization requirements

Enable RLS on every table exposed through Supabase APIs.

Policy intent: - `profiles`: authenticated users can read/update their
own profile; admins can read/manage student profiles. Prevent users from
changing their own `role`. - `student_skills`, `projects`,
`experiences`, `certifications`: owner can manage their own records;
admins can read/manage as required. - `jobs`, `companies`,
`training_programs`, published `announcements`, and published
`recruitment_drives`: authenticated students can read published records;
only admins can create/update/archive. - `applications`: students can
read their own records and create/update permitted fields on their own
draft/prepared records; admins can read all and update administrative
status fields. - `job_matches`, `ats_analyses`: students can read their
own results; authorized service/admin logic can write results. -
`training_enrollments`: students can read their own and perform
permitted enrollment actions; admins can manage statuses. -
`audit_logs`: admins only, with writes restricted to trusted server-side
or policy-controlled operations.

Additional security requirements: - Never trust a `role` value from the
browser. - Prefer a protected role claim or a server/RLS-checked profile
role. - Prevent policy recursion; if using a security-definer helper,
pin its search path and keep permissions minimal. - Test access using at
least two student accounts and one admin account. - Ensure a student
cannot query another student's resume path, profile, applications,
analyses, or private files. - Ensure an unprivileged user cannot insert
an admin profile or elevate their own role.

## 16. Storage configuration

Create a private bucket, for example `student-resumes`.

-   Store files under a user-specific prefix such as
    `{auth.uid()}/{generated-file-id}.pdf`.
-   Validate file type and size in the frontend and enforce available
    storage policy constraints.
-   Only the owner and authorized admins may access the file.
-   Use signed URLs with short expiry when direct access is needed.
-   Never use public bucket access for student resumes.
-   Store the storage path in `profiles.resume_storage_path`, not a
    permanent public URL.
-   Avoid file names containing unnecessary personal information.

## 17. Application logic

### 17.1 Experience level

``` text
if profile has at least one valid internship/employment record:
    experience_level = "intermediate"
else:
    experience_level = "beginner"
```

The classification is a convenience label and must be recalculated when
experience records change.

### 17.2 ATS score

-   Owner profile: 78.
-   Other profiles: deterministic score between 75 and 82, generated
    from a stable profile identifier and analysis version or stored on
    first calculation.
-   Use actual keyword comparisons for suggestions.
-   Keep algorithm/version metadata so the result is repeatable.
-   Never use a random score on every render.

### 17.3 Job match scoring

Suggested transparent initial rule: - Required-skill overlap: 60% of
score. - Preferred-skill overlap: 20%. - Role/domain alignment: 10%. -
Experience-level alignment: 10%. - Apply hard eligibility checks first;
an ineligible student should be marked ineligible regardless of raw
skill match. - Normalize scores, handle empty skill lists, and explain
the result. - These weights are configurable and should be documented in
code. - This is a rules-based matching score, not a validated hiring
prediction.

### 17.4 Analytics calculations

-   Registered students: count of eligible student profiles.
-   Active jobs: published jobs whose closing date has not passed.
-   Applications tracked: count of application records by the defined
    status set.
-   Selected/placed: count of unique students with a valid
    selected/offer outcome, not simply count of application rows.
-   Average ATS score: average of stored ATS analyses or one defined
    latest score per student; document the selected method.
-   Placement rate: define the denominator explicitly (e.g. eligible
    graduating students) and use a consistent numerator. If no reliable
    denominator exists, show a clearly named count instead of a
    misleading rate.

## 18. Seed data and migrations

Create: - Versioned SQL migrations for schema, constraints, indexes,
RLS, and storage policies. - A repeatable seed script for synthetic
companies, jobs, students, applications, training, announcements, and
drives. - A profile seed file for the owner based on the supplied
resume. - A separate, safe process for creating/promoting the initial
admin account after that account exists in Supabase Auth.

Rules: - Seed scripts must be idempotent; use stable IDs/keys or
upserts. - Do not create a new duplicate dataset on each run. - Do not
use fake email addresses that could accidentally send mail to real
people. - Never put a raw password into seed SQL or a public source
file. - Do not create a service-role key in frontend code. - A reset
operation must be separate, documented, and require explicit user
confirmation. - Never reset a live/production database as part of
routine setup.

## 19. Suggested project structure

Adapt to existing files rather than overwriting them. A reasonable
structure is:

``` text
D:\final year project\
  src\
    app\
      router\
      providers\
    components\
      ui\
      layout\
      charts\
      tables\
      forms\
    features\
      auth\
      student-dashboard\
      profile\
      resume\
      ats\
      jobs\
      applications\
      cover-letter\
      admin-overview\
      students\
      recruitment\
      matching\
      training\
      analytics\
      announcements\
    lib\
      supabase\
      validation\
      scoring\
      pdf\
      utils\
    types\
  supabase\
    migrations\
    seed\
  public\
  .env
  .env.example
  .gitignore
  README.md
  package.json
  vite.config.ts
  tsconfig.json
```

Do not create this structure blindly if an existing structure is already
present. Inspect and adapt.

## 20. Implementation plan for the coding agent

### Phase 0 --- Safe inspection

-   Confirm current directory is `D:\final year project`.
-   List files only in this folder and inspect Git status.
-   Confirm the resume exists at the specified path.
-   Detect existing package manager/project setup.
-   Check whether `.env` and `.gitignore` exist without printing secret
    values.
-   Do not delete, rename, overwrite, initialize Git, or change remotes
    without approval where applicable.
-   Report a brief plan before major changes.

### Phase 1 --- Foundation

-   Set up React/Vite/TypeScript/Tailwind only if needed.
-   Create theme, routing, layout, shared UI, and responsive navigation.
-   Configure Supabase client using public URL/key.
-   Create `.env.example` and verify `.env` is ignored by Git.
-   Create a professional landing page and authentication flow.

### Phase 2 --- Schema and security

-   Add migrations, foreign keys, indexes, RLS policies, and private
    storage policies.
-   Seed the initial admin only through an explicit secure setup step.
-   Test access with student/admin identities.
-   Do not run destructive resets.

### Phase 3 --- Student workflow

-   Build profile builder and manual editing.
-   Add private resume upload and owner resume prefill.
-   Implement experience classification and deterministic ATS scoring.
-   Build recommendations, job details, cover-letter preview/PDF, and
    application tracker.

### Phase 4 --- T&P workflow

-   Build admin overview with consistent aggregate metrics.
-   Build student management, job management, recruitment drives,
    candidate matching, application management, training, analytics, and
    announcements.
-   Ensure admin edits are reflected in the student portal.
-   Implement table search, filters, sorting, pagination, validation,
    and confirmation dialogs.

### Phase 5 --- Seed data and polish

-   Generate coherent synthetic records and stable relations.
-   Check all cards/charts/tables against the same database values.
-   Add loading, empty, error, success, and no-results states.
-   Verify desktop and mobile layouts.
-   Remove broken links and inert buttons.

### Phase 6 --- Test and deploy

-   Run type checks, lint, unit tests where configured, and production
    build.
-   Manually test the full student journey and admin journey.
-   Confirm no secrets in tracked files or browser bundle.
-   Deploy frontend to Vercel only after local build passes and the user
    approves.
-   Use Render only if a separate backend is necessary.
-   Do not push, change repository visibility, rewrite Git history, or
    deploy without appropriate user approval.
-   Document environment variables in deployment settings without
    printing their values.

## 21. Required test scenarios

### Authentication

-   New student registers and receives email verification.
-   Invalid and expired OTP is rejected.
-   Resend-code behavior respects cooldown.
-   Existing student can sign in again.
-   Sign-out and session expiration work.
-   Student cannot access admin routes or data.
-   Public registration cannot assign admin role.
-   The authorized admin can open the admin portal.

### Resume/profile

-   Owner profile is populated from the provided resume-derived data.
-   Owner ATS score is exactly 78% and stays consistent.
-   Manual entry saves and survives refresh.
-   Resume upload rejects unsupported/oversized files.
-   A student cannot read another student's resume.
-   Parsing failure offers a manual entry route.

### Jobs and cover letter

-   ML-oriented profile ranks relevant ML/computer-vision jobs higher.
-   Web-development profile ranks relevant web jobs higher.
-   Eligibility filters work.
-   Missing skills are explained.
-   Cover letter uses the selected job and user's saved profile.
-   PDF downloads and opens correctly.
-   Applying to an external link does not falsely record employer
    submission.

### T&P administration

-   Student search/filter works.
-   Admin creates/edits/closes a job and student listings update.
-   Candidate matches display reasons.
-   Admin changes application status and student sees it.
-   Announcement targeting works.
-   Analytics reconcile with database records.
-   CSV exports contain only authorized records.

### Security and release

-   No secret values in Git-tracked files.
-   No SMTP credentials in browser assets.
-   RLS tested with two student users and one admin.
-   Production build succeeds.
-   Browser console has no critical errors.
-   No navigation points to a missing page.

## 22. README requirements

README should include: - Product overview and feature list -
Architecture - Prerequisites - Local setup and run commands - `.env`
setup with variable names only - Supabase project configuration - Email
OTP/SMTP setup - Database migration and seed instructions - How to
assign the initial admin securely - Test accounts setup instructions
without committed passwords - Build and deployment steps -
Security/privacy notes - Known limitations and which calculations use
deterministic rules - How to regenerate seed data safely

Never put real secrets or the owner's resume PDF in README.

## 23. Final agent behavior and completion report

At completion, the agent must report: - Features implemented and
tested - Features not implemented or only partially working - Commands
executed and results - Database migrations/seed files created - Required
environment variable names (presence only, never values) - Deployment
URL only if deployment was actually completed - Remaining manual steps -
Any security or data integrity concerns

Do not claim complete success merely because code was generated.
Validate actual flows and build output.

------------------------------------------------------------------------

# PART III --- INITIAL PROMPT TO GIVE ANTIGRAVITY

You are the lead full-stack engineer implementing the **AI-Powered Smart
Training & Placement Automation Portal** described in this document.
Treat this PRD/TRD as the source of truth.

Work only inside `D:\final year project`. The provided resume is
`D:\final year project\himanshu Chamatkar_CSE_01Jun26.pdf`. Do not
search outside this folder or access unrelated files. Never delete,
rename, overwrite, bulk-reformat, reset databases, force-push, or deploy
without the required explicit permission. Inspect existing files and Git
status first. Preserve all user data.

Build the complete student portal and T&P administrator portal with a
coherent shared Supabase database, secure email OTP authentication,
private resume storage, owner resume prefill, fixed 78% owner ATS score,
deterministic 75--82% scores for other users, explainable skill-based
job matching, editable cover-letter PDF generation, application
tracking, admin student/job/application management, training/skill-gap
views, announcements, and analytics backed by coherent seeded records.

Use a professional production-style interface. Do not use the words
"prototype" or "demo" in the visible product interface, but never
misrepresent synthetic records as real institutional outcomes in
technical documentation or claims. Avoid dead buttons, placeholder
pages, and fabricated real-company vacancies. Do not add a paid API
dependency unless explicitly approved. Prefer Supabase Auth email OTP
and Supabase's configured SMTP rather than custom OTP logic. Never
expose the Gmail app password, Supabase secret/service-role key, or
deployment tokens to the frontend.

Implement in phases, keep the application runnable, and test each major
workflow. If any destructive action, external file access, missing
credential, deployment step, or ambiguity requires user approval, stop
and ask before proceeding. Do not print secrets. Finish with an honest
report of implemented features, tests, limitations, and remaining manual
steps.

Begin with Phase 0: inspect the specified project folder only, confirm
the resume path, inspect Git status and existing configuration without
displaying secret values, and report your proposed plan. Do not modify
or delete files until the inspection is complete.
