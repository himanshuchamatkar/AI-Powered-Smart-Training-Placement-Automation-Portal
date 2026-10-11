-- ==============================================================================
-- AI-Powered Smart Training & Placement Automation Portal
-- Synthetic Seed Dataset (Idempotent: Safe to re-run multiple times)
-- ==============================================================================

-- 1. COMPANIES
INSERT INTO public.companies (id, name, industry, location, website, description)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'NeuralCraft Systems', 'Artificial Intelligence & Deep Learning', 'Bengaluru / Hybrid', 'https://example.com/neuralcraft', 'Enterprise generative AI infrastructure, computer vision pipelines, and intelligent agent automation.'),
  ('c2222222-2222-2222-2222-222222222222', 'ShieldPoint Cyber Solutions', 'Information Security & Cloud Defense', 'Hyderabad / On-site', 'https://example.com/shieldpoint', 'Specialized managed detection, threat attribution, and autonomous digital forensics response.'),
  ('c3333333-3333-3333-3333-333333333333', 'Vanguard Stack Technologies', 'Enterprise Software & Cloud Platforms', 'Pune / Hybrid', 'https://example.com/vanguardstack', 'Next-generation microservices, high-throughput distributed databases, and real-time frontend suites.'),
  ('c4444444-4444-4444-4444-444444444444', 'CognitiveVision Labs', 'Computer Vision & Robotics', 'Bengaluru / On-site', 'https://example.com/cognitivevision', 'Edge-AI video stream analysis, embedded inference models, and automated inspection systems.'),
  ('c5555555-5555-5555-5555-555555555555', 'FlowMatrix Automations', 'Agentic Workflows & RPA', 'Mumbai / Remote', 'https://example.com/flowmatrix', 'Orchestrating autonomous enterprise processes using multi-agent LLM pipelines and low-code integrations.')
ON CONFLICT (id) DO NOTHING;

-- 2. JOBS
INSERT INTO public.jobs (
  id, company_id, title, domain, description, responsibilities, required_skills, preferred_skills,
  eligibility, minimum_cgpa, experience_level, employment_type, work_mode, location,
  salary_min, salary_max, salary_currency, application_url, is_synthetic, status
)
VALUES
  (
    'j1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Associate AI/ML Engineer',
    'Artificial Intelligence & Machine Learning',
    'Develop, fine-tune, and optimize computer vision and deep learning models for production cloud runtimes.',
    ARRAY['Implement convolutional neural networks and vision transformers.', 'Optimize latency with Docker and ONNX.', 'Construct explainable AI reports using SHAP.'],
    ARRAY['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'OpenCV', 'Docker'],
    ARRAY['SHAP', 'Streamlit', 'Computer Vision', 'Git'],
    'B.Tech CSE/IT/AI with minimum 6.0 CGPA',
    6.00,
    'intermediate',
    'Full-time',
    'Hybrid',
    'Bengaluru, India',
    750000, 1100000, 'INR',
    'https://careers.neuralcraft.example/apply/aiml-01',
    TRUE, 'published'
  ),
  (
    'j2222222-2222-2222-2222-222222222222',
    'c5555555-5555-5555-5555-555555555555',
    'Agentic AI & Workflow Automation Intern',
    'Automation & Agentic AI',
    'Develop autonomous orchestration pipelines utilizing n8n, LLM tool calling, and webhook integrations.',
    ARRAY['Design modular workflow routines in n8n and Python.', 'Integrate multi-modal LLM APIs (Gemini/OpenAI).', 'Implement fault tolerance and webhook exception handlers.'],
    ARRAY['Python', 'n8n Workflow Automation', 'REST API Integrations', 'Docker'],
    ARRAY['LLM Pipelines & Prompt Engineering', 'Multi-Agent Systems', 'JavaScript'],
    'B.Tech any year, proven automation portfolio',
    5.50,
    'beginner',
    'Internship',
    'Remote',
    'Remote, India',
    30000, 45000, 'INR / month',
    'https://careers.flowmatrix.example/interns/agentic-02',
    TRUE, 'published'
  ),
  (
    'j3333333-3333-3333-3333-333333333333',
    'c2222222-2222-2222-2222-222222222222',
    'Junior Cyber Threat Analyst',
    'Cybersecurity & Infrastructure',
    'Investigate suspicious network traffic, analyze phishing indicators, and assist in security audit reporting.',
    ARRAY['Perform heuristic pattern evaluation on credential harvesting.', 'Analyze server logs for intrusion signatures.', 'Maintain automated alert feeds.'],
    ARRAY['Python', 'Linux', 'Network Security', 'SQL'],
    ARRAY['Phishing Analysis', 'SHAP (Explainable AI)', 'Node.js'],
    'B.Tech CSE/ECE, minimum 6.0 CGPA',
    6.00,
    'intermediate',
    'Full-time',
    'On-site',
    'Hyderabad, India',
    650000, 900000, 'INR',
    'https://careers.shieldpoint.example/jobs/cta-03',
    TRUE, 'published'
  ),
  (
    'j4444444-4444-4444-4444-444444444444',
    'c3333333-3333-3333-3333-333333333333',
    'Graduate Full-Stack Web Developer',
    'Web Development',
    'Build responsive client dashboards, integrate RESTful backends, and maintain production TypeScript codebases.',
    ARRAY['Develop modular component systems using React and Tailwind CSS.', 'Build performant API route handlers in Node.js/Express.', 'Manage PostgreSQL schema design.'],
    ARRAY['JavaScript', 'React', 'Node.js', 'Express', 'SQL', 'HTML/CSS'],
    ARRAY['Docker', 'Git & GitHub', 'REST API Integrations'],
    'Graduating Batch 2026/2027, minimum 6.0 CGPA',
    6.00,
    'beginner',
    'Full-time',
    'Hybrid',
    'Pune, India',
    700000, 950000, 'INR',
    'https://careers.vanguardstack.example/grad/fswd-04',
    TRUE, 'published'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. TRAINING PROGRAMS
INSERT INTO public.training_programs (id, title, provider, domain, skills_taught, duration, registration_url, status)
VALUES
  ('t1111111-1111-1111-1111-111111111111', 'Enterprise LLM Application Engineering & Agentic RAG', 'DMIHER Center of Excellence in AI', 'Artificial Intelligence & Machine Learning', ARRAY['LLM Pipelines', 'RAG Architectures', 'Vector Embeddings', 'Agentic Workflows'], '4 Weeks (24 Hours)', 'https://training.dmiher.edu.in/ai-rag-2026', 'active'),
  ('t2222222-2222-2222-2222-222222222222', 'Cloud-Native Containerization & Kubernetes Fundamentals', 'FEAT Department of CSE & Red Hat Academy', 'Cloud Infrastructure & SRE', ARRAY['Docker', 'Kubernetes', 'Helm', 'CI/CD Pipelines'], '3 Weeks (18 Hours)', 'https://training.dmiher.edu.in/cloud-k8s', 'active'),
  ('t3333333-3333-3333-3333-333333333333', 'Applied Penetration Testing & Defensive Security Lab', 'FEAT Cyber Defense Cell', 'Cybersecurity & Infrastructure', ARRAY['Penetration Testing', 'Network Security', 'Wireshark', 'Burp Suite'], '5 Weeks (30 Hours)', 'https://training.dmiher.edu.in/cyber-lab', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. ANNOUNCEMENTS
INSERT INTO public.announcements (id, title, body, audience, priority, status, published_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Campus Recruitment Drive Schedule Announced for Batch 2026–27', 'The Training & Placement Cell has finalized on-campus drive schedules for NeuralCraft Systems, Vanguard Stack, and ShieldPoint Solutions. All eligible candidates must update their portal profile, verify ATS readiness, and register before deadlines.', 'all_students', 'high', 'published', NOW()),
  ('a2222222-2222-2222-2222-222222222222', 'Mandatory Technical Resume Audit & ATS Readiness Verification', 'Students are advised to review missing keywords for their target domain in the ATS Module. Profiles with updated projects, technical skills, and verifiable GitHub links will receive priority shortlisting.', 'all_students', 'normal', 'published', NOW())
ON CONFLICT (id) DO NOTHING;
