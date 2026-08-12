export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Interview Scheduled'
  | 'Interviewing'
  | 'Offer'
  | 'Rejected'
  | 'Joined'
  | 'Withdrawn';

export type Platform =
  | 'LinkedIn'
  | 'Indeed'
  | 'Naukri'
  | 'Glassdoor'
  | 'Company Website'
  | 'Referral'
  | 'Other';

export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  location: string;
  applied_date: string;
  status: ApplicationStatus;
  salary: string;
  platform: Platform;
  job_url: string;
  recruiter_name: string;
  recruiter_email: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_applications: number;
  applied_count: number;
  interviewing_count: number;
  offers_count: number;
  rejected_count: number;
  response_rate: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface PlatformBreakdown {
  platform: string;
  count: number;
  percentage: number;
}

export interface MonthlyBreakdown {
  month: string;
  count: number;
}

export interface AnalyticsData {
  total_applications: number;
  by_status: StatusBreakdown[];
  by_platform: PlatformBreakdown[];
  by_month: MonthlyBreakdown[];
  response_rate: number;
  offers_count: number;
  rejections_count: number;
}

export interface ImportResult {
  message: string;
  imported_count: number;
  duplicate_count: number;
  invalid_count: number;
  errors: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  has_password?: boolean;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
