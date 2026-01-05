export type CardPriority = 'low' | 'medium' | 'high';

export interface KanbanColumn {
  id: string;
  project_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanCard {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  priority: CardPriority;
  due_date: string | null;
  tags: string[] | null;
  position: number;
  linked_roadmap_task_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumnWithCards extends KanbanColumn {
  cards: KanbanCard[];
}

export type KanbanTemplate = 'classic' | 'timeline';

export interface KanbanTemplateConfig {
  id: KanbanTemplate;
  name: string;
  description: string;
  columns: string[];
}

export const KANBAN_TEMPLATES: KanbanTemplateConfig[] = [
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Estrutura tradicional de fluxo de trabalho',
    columns: ['Backlog', 'Em andamento', 'Concluído']
  },
  {
    id: 'timeline',
    name: 'Tempo',
    description: 'Organização temporal de tarefas',
    columns: ['Hoje', 'Amanhã', 'Essa semana', 'Em breve']
  }
];
