import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Settings, PanelLeftClose, PanelLeftOpen, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project } from '../types/roadmap';
import {
  generateBusinessDaysRange,
  groupBusinessDaysByWeek,
  parseDate,
} from '../utils/businessDays';
import { Logo } from './Logo';
import { DesignStoryWithPhases, ZoomLevel, SprintDuration, DEFAULT_PHASE_TEMPLATES } from '../types/designStories';
import { StoriesTimeline } from './StoriesTimeline';
import { StoryRow } from './StoryRow';
import { StoryModal, StoryFormData } from './StoryModal';
import { FloatingZoomControls } from './FloatingZoomControls';
import { SettingsModal } from './SettingsModal';
import { StoryTaskModal } from './StoryTaskModal';
import { StoryTask } from '../types/designStories';
import { formatDate } from '../utils/businessDays';

interface RoadmapGanttProps {
  projectId: string;
  onBack: () => void;
}

const BASE_CELL_WIDTH = 60;
const NUMBER_OF_WEEKS = 12;

export const RoadmapGantt = ({ projectId, onBack }: RoadmapGanttProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<DesignStoryWithPhases[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<DesignStoryWithPhases | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(100);
  const [sprintDuration, setSprintDuration] = useState<SprintDuration>(2);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<StoryTask | null>(null);
  const [taskDraftStoryId, setTaskDraftStoryId] = useState<string | null>(null);
  const [taskDraftPhaseId, setTaskDraftPhaseId] = useState<string | null>(null);
  const [taskDraftStartDate, setTaskDraftStartDate] = useState<Date | null>(null);
  const [taskDraftEndDate, setTaskDraftEndDate] = useState<Date | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showLeftColumn, setShowLeftColumn] = useState(true);
  const [selectedDesignerId, setSelectedDesignerId] = useState<string | null>(null);

  const designers = React.useMemo(() => {
    const designerMap = new Map();
    stories.forEach(story => {
      if (story.designer_id && story.designer_name) {
        designerMap.set(story.designer_id, {
          id: story.designer_id,
          name: story.designer_name,
          avatar_url: story.designer_avatar_url
        });
      }
    });
    return Array.from(designerMap.values());
  }, [stories]);

  const filteredStories = React.useMemo(() => {
    if (!selectedDesignerId) return stories;
    return stories.filter(s => s.designer_id === selectedDesignerId);
  }, [stories, selectedDesignerId]);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      setProject(projectData);
      setZoomLevel((projectData.zoom_level as ZoomLevel) || 100);
      setSprintDuration((projectData.sprint_duration_weeks as SprintDuration) || 2);

      await loadStories();
    } catch (error) {
      console.error('[RoadmapGantt] Error loading project:', error);
      alert('Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  const loadStories = async () => {
    try {
      const { data: storiesData, error: storiesError } = await supabase
        .from('design_stories')
        .select('*')
        .eq('project_id', projectId)
        .order('position');

      if (storiesError) throw storiesError;

      if (!storiesData || storiesData.length === 0) {
        setStories([]);
        return;
      }

      const { data: phasesData, error: phasesError } = await supabase
        .from('story_phases')
        .select('*')
        .in('story_id', storiesData.map(s => s.id))
        .order('order');

      if (phasesError) throw phasesError;

      const storiesWithPhases: DesignStoryWithPhases[] = storiesData.map(story => ({
        ...story,
        phases: phasesData?.filter(phase => phase.story_id === story.id) || []
      }));

      setStories(storiesWithPhases);
    } catch (error) {
      console.error('[RoadmapGantt] Error loading stories:', error);
    }
  };

  const handleCreateStory = () => {
    setSelectedStory(null);
    setShowStoryModal(true);
  };

  const handleEditStory = (story: DesignStoryWithPhases) => {
    setSelectedStory(story);
    setShowStoryModal(true);
  };

  const handleSaveStory = async (data: StoryFormData) => {
    try {
      if (selectedStory) {
        const { error: storyError } = await supabase
          .from('design_stories')
          .update({
            name: data.name,
            color: data.color,
            start_date: data.start_date,
            handoff_date: data.handoff_date
          })
          .eq('id', selectedStory.id);

        if (storyError) throw storyError;

        const { error: deleteError } = await supabase
          .from('story_phases')
          .delete()
          .eq('story_id', selectedStory.id);

        if (deleteError) throw deleteError;

        const phases = data.phases.map((phase, index) => ({
          story_id: selectedStory.id,
          name: phase.name,
          duration_days: phase.duration_days,
          order: index + 1,
          color: phase.color || null
        }));

        const { error: phasesError } = await supabase
          .from('story_phases')
          .insert(phases);

        if (phasesError) throw phasesError;
      } else {
        const maxPosition = stories.length > 0
          ? Math.max(...stories.map(s => s.position))
          : 0;

        const { data: newStory, error: storyError } = await supabase
          .from('design_stories')
          .insert({
            project_id: projectId,
            name: data.name,
            color: data.color,
            start_date: data.start_date,
            end_date: data.start_date,
            handoff_date: data.handoff_date,
            position: maxPosition + 1
          })
          .select()
          .single();

        if (storyError) throw storyError;

        const phases = data.phases.map((phase, index) => ({
          story_id: newStory.id,
          name: phase.name,
          duration_days: phase.duration_days,
          order: index + 1,
          color: phase.color || null
        }));

        const { error: phasesError } = await supabase
          .from('story_phases')
          .insert(phases);

        if (phasesError) throw phasesError;
      }

      setShowStoryModal(false);
      setSelectedStory(null);
      loadStories();
    } catch (error) {
      console.error('[RoadmapGantt] Error saving story:', error);
      alert('Erro ao salvar história. Tente novamente.');
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta história? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('design_stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      loadStories();
    } catch (error) {
      console.error('[RoadmapGantt] Error deleting story:', error);
      alert('Erro ao excluir história. Tente novamente.');
    }
  };

  const handleToggleCollapse = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    try {
      const { error } = await supabase
        .from('design_stories')
        .update({ collapsed: !story.collapsed })
        .eq('id', storyId);

      if (error) throw error;

      setStories(stories.map(s =>
        s.id === storyId ? { ...s, collapsed: !s.collapsed } : s
      ));
    } catch (error) {
      console.error('[RoadmapGantt] Error toggling collapse:', error);
    }
  };

  const handleResizePhase = async (phaseId: string, newDurationDays: number) => {
    try {
      const story = stories.find(s => s.phases.some(p => p.id === phaseId));
      if (!story) return;

      const phaseIndex = story.phases.findIndex(p => p.id === phaseId);
      if (phaseIndex === -1) return;

      const currentPhase = story.phases[phaseIndex];
      if (newDurationDays < 1) return;

      const { error } = await supabase
        .from('story_phases')
        .update({ duration_days: newDurationDays })
        .eq('id', phaseId);

      if (error) throw error;

      const totalDays = story.phases.reduce((sum, p, i) => {
        if (i === phaseIndex) return sum + newDurationDays;
        return sum + p.duration_days;
      }, 0);

      let storyEndDate = new Date(story.start_date);
      for (let i = 0; i < totalDays; i++) {
        storyEndDate.setDate(storyEndDate.getDate() + 1);
        while (storyEndDate.getDay() === 0 || storyEndDate.getDay() === 6) {
          storyEndDate.setDate(storyEndDate.getDate() + 1);
        }
      }

      const { error: storyError } = await supabase
        .from('design_stories')
        .update({ end_date: storyEndDate.toISOString().split('T')[0] })
        .eq('id', story.id);

      if (storyError) throw storyError;

      loadStories();
    } catch (error) {
      console.error('[RoadmapGantt] Error resizing phase:', error);
    }
  };

  const handleZoomChange = async (newZoom: ZoomLevel) => {
    setZoomLevel(newZoom);
    try {
      await supabase
        .from('projects')
        .update({ zoom_level: newZoom })
        .eq('id', projectId);
    } catch (error) {
      console.error('[RoadmapGantt] Error saving zoom:', error);
    }
  };

  const handleSprintChange = async (newSprint: SprintDuration) => {
    setSprintDuration(newSprint);
    try {
      await supabase
        .from('projects')
        .update({ sprint_duration_weeks: newSprint })
        .eq('id', projectId);
    } catch (error) {
      console.error('[RoadmapGantt] Error saving sprint:', error);
    }
  };

  const handleCreateTask = (storyId: string, phaseId: string, startDate: Date, endDate: Date) => {
    setTaskDraftStoryId(storyId);
    setTaskDraftPhaseId(phaseId);
    setTaskDraftStartDate(startDate);
    setTaskDraftEndDate(endDate);
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleTaskClick = (task: StoryTask) => {
    setSelectedTask(task);
    setTaskDraftStoryId(null);
    setTaskDraftPhaseId(null);
    setTaskDraftStartDate(null);
    setTaskDraftEndDate(null);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: Partial<StoryTask>, storyId: string) => {
    try {
      if (selectedTask) {
        const { error } = await supabase
          .from('story_tasks')
          .update({
            name: taskData.name,
            type: taskData.type,
            start_date: taskData.start_date,
            end_date: taskData.end_date,
            status: taskData.status,
            notes: taskData.notes,
            phase_id: taskData.phase_id
          })
          .eq('id', selectedTask.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('story_tasks')
          .insert({
            phase_id: taskData.phase_id,
            name: taskData.name,
            type: taskData.type,
            start_date: taskData.start_date,
            end_date: taskData.end_date,
            status: taskData.status,
            notes: taskData.notes
          });

        if (error) throw error;
      }

      setShowTaskModal(false);
      setSelectedTask(null);
      setTaskDraftStoryId(null);
      setTaskDraftPhaseId(null);
      setTaskDraftStartDate(null);
      setTaskDraftEndDate(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('[RoadmapGantt] Error saving task:', error);
      alert('Erro ao salvar tarefa. Tente novamente.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('story_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setShowTaskModal(false);
      setSelectedTask(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('[RoadmapGantt] Error deleting task:', error);
      alert('Erro ao excluir tarefa. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
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
  const cellWidth = (BASE_CELL_WIDTH * zoomLevel) / 100;
  const businessDays = generateBusinessDaysRange(projectStartDate, NUMBER_OF_WEEKS);
  const weeks = groupBusinessDaysByWeek(businessDays);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black sticky top-0 bg-white z-40">
        <div className="max-w-full">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm"
                title="Ver todos os projetos"
              >
                <ArrowLeft className="w-4 h-4" />
                Meus Projetos
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <Logo showText={false} variant="dark" />
              <h1 className="text-lg font-bold">{project.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLeftColumn(!showLeftColumn)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title={showLeftColumn ? "Ocultar coluna lateral" : "Mostrar coluna lateral"}
              >
                {showLeftColumn ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Configurações"
              >
                <Settings className="w-5 h-5" />
              </button>

              {designers.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded border border-gray-200">
                  <span className="text-xs font-medium text-gray-600">Designers:</span>
                  <div className="flex items-center gap-1">
                    {designers.map((designer) => (
                      <button
                        key={designer.id}
                        onClick={() => setSelectedDesignerId(
                          selectedDesignerId === designer.id ? null : designer.id
                        )}
                        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                          selectedDesignerId === designer.id
                            ? 'ring-2 ring-blue-500 scale-110'
                            : 'hover:scale-105 hover:ring-2 hover:ring-gray-300'
                        }`}
                        title={designer.name}
                      >
                        {designer.avatar_url ? (
                          <img
                            src={designer.avatar_url}
                            alt={designer.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </button>
                    ))}
                    {selectedDesignerId && (
                      <button
                        onClick={() => setSelectedDesignerId(null)}
                        className="ml-1 p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Mostrar todos"
                      >
                        <X className="w-3 h-3 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateStory}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Nova História
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto">
          <div className="inline-block min-w-full relative">
            <div className="flex">
              {showLeftColumn && (
                <div className="w-48 flex-shrink-0 border-r-2 border-black bg-gray-50 sticky left-0 z-30">
                  <div className="px-3 py-3 border-b border-gray-300 bg-gray-100" style={{ height: '50px' }}>
                    <h3 className="font-medium text-xs text-gray-600 uppercase tracking-wide">Sprints</h3>
                  </div>
                  <div className="px-3 py-3 border-b-2 border-black bg-gray-50" style={{ height: '45px' }}>
                    <h3 className="font-medium text-xs text-gray-600 uppercase tracking-wide">Histórias</h3>
                  </div>
                </div>
              )}

              <div className="flex-1">
                <StoriesTimeline
                  weeks={weeks}
                  projectStartDate={projectStartDate}
                  sprintDuration={sprintDuration}
                  cellWidth={cellWidth}
                />
              </div>
            </div>

            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const todayIndex = businessDays.findIndex(d => {
                const checkDate = new Date(d);
                checkDate.setHours(0, 0, 0, 0);
                return checkDate.getTime() === today.getTime();
              });

              if (todayIndex !== -1) {
                const leftOffset = showLeftColumn ? 192 : 0;
                const linePosition = leftOffset + (todayIndex * cellWidth) + (cellWidth / 2);
                return (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
                    style={{
                      left: `${linePosition}px`,
                      zIndex: 1
                    }}
                  >
                    <div className="absolute top-24 -left-12 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Hoje
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {filteredStories.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <p className="text-sm">
                  {selectedDesignerId
                    ? 'Nenhuma história encontrada para este designer'
                    : 'Clique em "Nova História" para começar'}
                </p>
              </div>
            ) : (
              <>
                {filteredStories.map(story => (
                  <StoryRow
                    key={story.id}
                    story={story}
                    cellWidth={cellWidth}
                    businessDays={businessDays}
                    onToggleCollapse={handleToggleCollapse}
                    onEditStory={handleEditStory}
                    onDeleteStory={handleDeleteStory}
                    onResizePhase={handleResizePhase}
                    onCreateTask={handleCreateTask}
                    onTaskClick={handleTaskClick}
                    refreshTrigger={refreshTrigger}
                    showLeftColumn={showLeftColumn}
                  />
                ))}
                <div
                  className="flex border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={handleCreateStory}
                  style={{ minHeight: '60px' }}
                >
                  {showLeftColumn && (
                    <div className="w-48 flex-shrink-0 border-r-2 border-gray-200 px-2 py-2 bg-white sticky left-0 z-20">
                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Nova História</span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 relative flex items-center justify-center">
                    {!showLeftColumn && (
                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Nova História</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      <FloatingZoomControls
        zoomLevel={zoomLevel}
        onZoomChange={handleZoomChange}
      />

      {showStoryModal && (
        <StoryModal
          story={selectedStory}
          projectStartDate={project.start_date}
          onSave={handleSaveStory}
          onClose={() => {
            setShowStoryModal(false);
            setSelectedStory(null);
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          sprintDuration={sprintDuration}
          onSprintChange={handleSprintChange}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showTaskModal && (
        <StoryTaskModal
          task={selectedTask}
          stories={stories}
          defaultStoryId={taskDraftStoryId || undefined}
          defaultPhaseId={taskDraftPhaseId || undefined}
          defaultStartDate={taskDraftStartDate || undefined}
          defaultEndDate={taskDraftEndDate || undefined}
          onSave={handleSaveTask}
          onDelete={selectedTask ? handleDeleteTask : undefined}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
            setTaskDraftStoryId(null);
            setTaskDraftPhaseId(null);
            setTaskDraftStartDate(null);
            setTaskDraftEndDate(null);
          }}
        />
      )}
    </div>
  );
};
