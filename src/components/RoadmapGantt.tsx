import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project, Phase, Task } from '../types/roadmap';
import {
  generateBusinessDaysRange,
  groupBusinessDaysByWeek,
  formatDate,
  parseDate,
  adjustToBusinessDay,
  isSameDay,
} from '../utils/businessDays';
import { GanttTimeline } from './GanttTimeline';
import { GanttRow } from './GanttRow';
import { TaskModal } from './TaskModal';
import { Logo } from './Logo';

interface RoadmapGanttProps {
  projectId: string;
  onBack: () => void;
}

const CELL_WIDTH = 60;
const NUMBER_OF_WEEKS = 12;

export const RoadmapGantt = ({ projectId, onBack }: RoadmapGanttProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskData, setNewTaskData] = useState<{
    phaseId: string;
    startDate: Date;
    endDate: Date;
  } | null>(null);
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [handoffDate, setHandoffDate] = useState('');

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      setProject(projectData);
      setHandoffDate(projectData.handoff_date || '');

      const { data: phasesData, error: phasesError } = await supabase
        .from('phases')
        .select('*')
        .eq('project_id', projectId)
        .order('order');

      if (phasesError) throw phasesError;

      setPhases(phasesData || []);

      const phaseIds = phasesData?.map((p) => p.id) || [];

      if (phaseIds.length > 0) {
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .in('phase_id', phaseIds)
          .order('start_date');

        if (tasksError) throw tasksError;

        setTasks(tasksData || []);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = (phaseId: string, startDate: Date, endDate: Date) => {
    setSelectedTask(null);
    setNewTaskData({ phaseId, startDate, endDate });
    setShowTaskModal(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setNewTaskData(null);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (selectedTask) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', selectedTask.id);

        if (error) throw error;

        setTasks((prev) =>
          prev.map((t) =>
            t.id === selectedTask.id ? { ...t, ...taskData } as Task : t
          )
        );
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .insert(taskData)
          .select()
          .single();

        if (error) throw error;

        setTasks((prev) => [...prev, data]);
      }

      setShowTaskModal(false);
      setSelectedTask(null);
      setNewTaskData(null);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Erro ao salvar tarefa');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) throw error;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Erro ao excluir tarefa');
    }
  };

  const handleSaveHandoff = async () => {
    if (!handoffDate) {
      alert('Por favor, selecione uma data');
      return;
    }

    try {
      const adjustedDate = formatDate(adjustToBusinessDay(parseDate(handoffDate)));

      const { error } = await supabase
        .from('projects')
        .update({ handoff_date: adjustedDate })
        .eq('id', projectId);

      if (error) throw error;

      setProject((prev) => (prev ? { ...prev, handoff_date: adjustedDate } : null));
      setHandoffDate(adjustedDate);
      setShowHandoffModal(false);

      const tasksAfterHandoff = tasks.filter((task) => {
        const taskEnd = parseDate(task.end_date);
        const handoff = parseDate(adjustedDate);
        return taskEnd > handoff;
      });

      if (tasksAfterHandoff.length > 0) {
        alert(
          `Atenção: ${tasksAfterHandoff.length} tarefa(s) terminam após a data de handoff. Revise seu planejamento.`
        );
      }
    } catch (error) {
      console.error('Error saving handoff:', error);
      alert('Erro ao salvar data de handoff');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          <p className="mt-4 text-gray-600">Carregando roadmap...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Projeto não encontrado</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-3 bg-black text-white font-bold hover:bg-gray-800"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const projectStartDate = parseDate(project.start_date);
  const businessDays = generateBusinessDaysRange(projectStartDate, NUMBER_OF_WEEKS);
  const weeks = groupBusinessDaysByWeek(businessDays);

  const handoffDateObj = project.handoff_date ? parseDate(project.handoff_date) : null;
  const handoffDayIndex = handoffDateObj
    ? businessDays.findIndex((day) => isSameDay(day.date, handoffDateObj))
    : -1;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black sticky top-0 bg-white z-40">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-bold">Voltar</span>
              </button>
              <Logo showText={false} variant="dark" />
              <h1 className="text-2xl font-bold">{project.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHandoffModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-bold">
                  Handoff: {project.handoff_date ? new Date(project.handoff_date).toLocaleDateString('pt-BR') : 'Não definido'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-48 flex-shrink-0 border-r-2 border-black bg-gray-100">
              <div className="p-4 border-b-2 border-black">
                <h3 className="font-bold text-sm">FASES</h3>
              </div>
            </div>

            <div className="flex-1">
              <GanttTimeline
                weeks={weeks}
                projectStartDate={projectStartDate}
                sprintDurationWeeks={project.sprint_duration_weeks}
                cellWidth={CELL_WIDTH}
              />
            </div>
          </div>

          <div className="flex border-t-2 border-black relative">
            <div className="relative">
              {phases.map((phase) => (
                <GanttRow
                  key={phase.id}
                  phase={phase}
                  tasks={tasks.filter((t) => t.phase_id === phase.id)}
                  businessDays={businessDays}
                  cellWidth={CELL_WIDTH}
                  onTaskClick={handleTaskClick}
                  onCreateTask={handleCreateTask}
                />
              ))}
            </div>

            {handoffDayIndex >= 0 && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-red-600 pointer-events-none z-10"
                style={{ left: `${48 * 4 + handoffDayIndex * CELL_WIDTH + CELL_WIDTH / 2}px` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-2 py-1 text-xs font-bold whitespace-nowrap">
                  HANDOFF
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          phases={phases}
          defaultPhaseId={newTaskData?.phaseId}
          defaultStartDate={newTaskData?.startDate}
          defaultEndDate={newTaskData?.endDate}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
            setNewTaskData(null);
          }}
        />
      )}

      {showHandoffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 max-w-md w-full border-4 border-black">
            <h2 className="text-2xl font-bold mb-6">Definir Data de Handoff</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Data de entrega
                </label>
                <input
                  type="date"
                  value={handoffDate}
                  onChange={(e) => setHandoffDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-600 mt-2">
                  A data será ajustada automaticamente para o próximo dia útil, se necessário.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowHandoffModal(false)}
                  className="flex-1 border-2 border-black py-3 px-6 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveHandoff}
                  className="flex-1 bg-black text-white py-3 px-6 font-bold hover:bg-gray-800 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
