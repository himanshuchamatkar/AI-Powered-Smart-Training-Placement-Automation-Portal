import { Job, Profile, JobMatch } from '@/types/database';

export interface MatchResult {
  score: number;
  matchedRequired: string[];
  missingRequired: string[];
  matchedPreferred: string[];
  missingPreferred: string[];
  domainAligned: boolean;
  experienceAligned: boolean;
  eligibilityPassed: boolean;
  eligibilityReasons: string[];
}

export function evaluateJobMatch(
  profile: Profile,
  userSkills: string[],
  job: Job
): MatchResult {
  const normUserSkills = userSkills.map((s) => s.toLowerCase().trim());
  const hasSkill = (skill: string) => {
    const sLower = skill.toLowerCase().trim();
    return normUserSkills.some(
      (userS) => userS === sLower || userS.includes(sLower) || sLower.includes(userS)
    );
  };

  // 1. Required Skills (60% weight)
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];
  (job.required_skills || []).forEach((req) => {
    if (hasSkill(req)) matchedRequired.push(req);
    else missingRequired.push(req);
  });
  const reqTotal = job.required_skills?.length || 0;
  const reqScore = reqTotal > 0 ? (matchedRequired.length / reqTotal) * 60 : 60;

  // 2. Preferred Skills (20% weight)
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];
  (job.preferred_skills || []).forEach((pref) => {
    if (hasSkill(pref)) matchedPreferred.push(pref);
    else missingPreferred.push(pref);
  });
  const prefTotal = job.preferred_skills?.length || 0;
  const prefScore = prefTotal > 0 ? (matchedPreferred.length / prefTotal) * 20 : 20;

  // 3. Domain Alignment (10% weight)
  const profileDomain = (profile.preferred_domain || '').toLowerCase();
  const jobDomain = (job.domain || '').toLowerCase();
  const domainAligned =
    profileDomain.includes(jobDomain) ||
    jobDomain.includes(profileDomain) ||
    job.title.toLowerCase().includes(profile.preferred_role?.toLowerCase() || '');
  const domainScore = domainAligned ? 10 : 4;

  // 4. Experience Level Alignment (10% weight)
  let experienceAligned = true;
  if (job.experience_level === 'intermediate' && profile.experience_level === 'beginner') {
    experienceAligned = false;
  }
  const expScore = experienceAligned ? 10 : 2;

  // 5. Eligibility Checks (CGPA & graduation year)
  const eligibilityReasons: string[] = [];
  let eligibilityPassed = true;

  if (job.minimum_cgpa && profile.cgpa) {
    if (profile.cgpa < job.minimum_cgpa) {
      eligibilityPassed = false;
      eligibilityReasons.push(`Requires minimum CGPA of ${job.minimum_cgpa} (Your profile: ${profile.cgpa})`);
    }
  }

  // Total raw score calculation
  const totalScore = Math.min(100, Math.round(reqScore + prefScore + domainScore + expScore));

  return {
    score: totalScore,
    matchedRequired,
    missingRequired,
    matchedPreferred,
    missingPreferred,
    domainAligned,
    experienceAligned,
    eligibilityPassed,
    eligibilityReasons,
  };
}

export function rankJobsForStudent(
  profile: Profile,
  userSkills: string[],
  jobs: Job[]
): Array<{ job: Job; match: MatchResult }> {
  return jobs
    .map((job) => ({
      job,
      match: evaluateJobMatch(profile, userSkills, job),
    }))
    .sort((a, b) => {
      // Eligible first
      if (a.match.eligibilityPassed && !b.match.eligibilityPassed) return -1;
      if (!a.match.eligibilityPassed && b.match.eligibilityPassed) return 1;
      // Then by score descending
      return b.match.score - a.match.score;
    });
}
