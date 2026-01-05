export type ZoomLevel = 50 | 75 | 100 | 150 | 200;
export type SprintDuration = 1 | 2 | 3 | 4;

export interface DesignStory {
  id: string;
  project_id: string;
  name: string;
  color: string;
  start_date: string;
  end_date: string;
  handoff_date: string | null;
  position: number;
  collapsed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoryPhase {
  id: string;
  story_id: string;
  name: string;
  duration_days: number;
  order: number;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryTask {
  id: string;
  phase_id: string;
  name: string;
  type: 'activity' | 'meeting';
  start_date: string;
  end_date: string;
  status: 'planned' | 'in_progress' | 'completed';
  assignee: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryPhaseWithTasks extends StoryPhase {
  tasks: StoryTask[];
}

export interface DesignStoryWithPhases extends DesignStory {
  phases: StoryPhase[];
}

export interface PhaseTemplate {
  name: string;
  duration_days: number;
  color?: string;
}

export const DEFAULT_PHASE_TEMPLATES: PhaseTemplate[] = [
  { name: 'Discovery', duration_days: 10, color: '#60A5FA' },
  { name: 'Ideação', duration_days: 5, color: '#34D399' },
  { name: 'Prototipação', duration_days: 15, color: '#F59E0B' }
];

export const STORY_COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

export const ZOOM_LEVELS: ZoomLevel[] = [50, 75, 100, 150, 200];
export const SPRINT_DURATIONS: SprintDuration[] = [1, 2, 3, 4];
