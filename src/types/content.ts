export interface TimelineRole {
  id: string;
  company: string;
  title: string;
  dateRange: string;
  location?: string;
  scope: string;
  summary?: string;
  returnEngagement?: boolean;
  bullets: string[];
  tags: string[];
}

export interface SkillEntry {
  name: string;
  category: string;
  tags: string[];
}

export interface SkillCategorySummary {
  category: string;
  depth: number; // 1-5, rough relative depth for the chart
}

export interface Achievement {
  value: string;
  label: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}
