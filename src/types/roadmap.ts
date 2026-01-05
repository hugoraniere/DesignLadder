export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  handoff_date: string | null;
  sprint_duration_weeks: number;
  status: 'active' | 'archived' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Phase {
  id: string;
  project_id: string;
  name: string;
  order: number;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
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

export interface PhaseWithTasks extends Phase {
  tasks: Task[];
}

export interface ProjectWithPhases extends Project {
  phases: PhaseWithTasks[];
}
