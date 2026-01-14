/**
 * Analytics Types
 * Privacy-focused analytics tracking for template usage
 */

export interface AnalyticsConfig {
  enabled: boolean;
  userId: string; // Anonymous UUID
  consentDate?: string;
  lastAsked?: string;
}

export interface AnalyticsEvent {
  eventType: 'project_created' | 'project_failed';
  template: string;
  success: boolean;
  timestamp: string;
  nodeVersion: string;
  packageManager?: string;
  errorType?: string; // Generic error category, no sensitive details
}

export interface UsageStats {
  totalProjects: number;
  successfulProjects: number;
  failedProjects: number;
  templateUsage: Record<string, number>;
  firstUsed?: string;
  lastUsed?: string;
}

export interface AnalyticsStorage {
  config: AnalyticsConfig;
  events: AnalyticsEvent[];
  stats: UsageStats;
}

