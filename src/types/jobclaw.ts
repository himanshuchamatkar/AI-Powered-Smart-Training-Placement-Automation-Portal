export interface JobPin {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string | null;
  job_country: string;
  job_city: string;
  job_state?: string;
  job_location: string;
  job_latitude: number;
  job_longitude: number;
  job_employment_type: string;
  job_is_remote: boolean;
  experience_level: string;
  salary?: string;
  skills: string[];
  description: string;
  responsibilities?: string[];
  apply_url: string;
  source: string;
  posted_at?: string;
  domain?: string;
}

export interface CountryJobCount {
  country: string;
  count: number;
}

export interface GlobeFilterState {
  search: string;
  roles: string[];
  countries: string[];
  remote: boolean;
  internship: boolean;
  minMatchScore?: number;
  domain?: string;
}

export type GlobeSidebarMode = 'closed' | 'country-list' | 'job-detail';
