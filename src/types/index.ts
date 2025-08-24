export interface Feature {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  year: number;
  quarter: number;
  startMonth: number;
  endMonth: number;
  themeId?: string;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface Roadmap {
  id: string;
  name: string;
  description?: string;
  features: Feature[];
  themes: Theme[];
}

export interface ProjectInfo {
  name: string;
  description: string;
  team: string;
  lastUpdated: string;
  teamMembers: TeamMember[];
  stakeholders: Stakeholder[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface RoadmapData {
  roadmaps: Roadmap[];
  currentRoadmapId: string | null;
  projectInfo: ProjectInfo;
}