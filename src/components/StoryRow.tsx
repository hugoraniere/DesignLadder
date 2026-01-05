import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DesignStoryWithPhases, StoryTask } from '../types/designStories';
import { StoryPhaseSegment } from './StoryPhaseSegment';
import { parseDate, isSameDay, formatDate } from '../utils/businessDays';
import { ContextMenu } from './ContextMenu';
import { supabase } from '../lib/supabase';

interface StoryRowProps {
  story: DesignStoryWithPhases;
  cellWidth: number;
  businessDays: { date: Date }[];
  onToggleCollapse: (storyId: string) => void;
  onEditStory: (story: DesignStoryWithPhases) => void;
  onDeleteStory: (storyId: string) => void;
  onResizePhase: (phaseId: string, newDurationDays: number) => void;
  onCreateTask: (storyId: string, phaseId: string, startDate: Date, endDate: Date) => void;
  onTaskClick: (task: StoryTask) => void;
}

export const StoryRow = ({
  story,
  cellWidth,
  businessDays,
  onToggleCollapse,
  onEditStory,
  onDeleteStory,
  onResizePhase,
  onCreateTask,
  onTaskClick
}: StoryRowProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [tasks, setTasks] = useState<StoryTask[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<number | null>(null);
  const [drawEnd, setDrawEnd] = useState<number | null>(null);
  const [drawPhaseId, setDrawPhaseId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const storyStartDate = parseDate(story.start_date);

  useEffect(() => {
    loadTasks();
  }, [story.id]);

  const loadTasks = async () => {
    try {
      const phaseIds = story.phases.map(p => p.id);
      if (phaseIds.length === 0) {
        setTasks([]);
        return;
      }

      const { data, error } = await supabase
        .from('story_tasks')
        .select('*')
        .in('phase_id', phaseIds);

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('[StoryRow] Error loading tasks:', error);
    }
  };
  const handoffDateObj = story.handoff_date ? parseDate(story.handoff_date) : null;

  const getPhaseStartDate = (phaseIndex: number): Date => {
    let currentDate = new Date(storyStartDate);
    for (let i = 0; i < phaseIndex; i++) {
      const phase = story.phases[i];
      currentDate = new Date(currentDate.getTime() + phase.duration_days * 24 * 60 * 60 * 1000);
    }
    return currentDate;
  };

  const getPhaseEndDate = (phaseIndex: number): Date => {
    const startDate = getPhaseStartDate(phaseIndex);
    const phase = story.phases[phaseIndex];
    return new Date(startDate.getTime() + (phase.duration_days - 1) * 24 * 60 * 60 * 1000);
  };

  const handoffDayIndex = handoffDateObj
    ? businessDays.findIndex(day => isSameDay(day.date, handoffDateObj))
    : -1;

  const getPhaseAtPosition = (dayIndex: number): string | null => {
    if (dayIndex < 0 || dayIndex >= businessDays.length) return null;

    const clickedDate = businessDays[dayIndex].date;

    for (let i = 0; i < story.phases.length; i++) {
      const phaseStart = getPhaseStartDate(i);
      const phaseEnd = getPhaseEndDate(i);

      if (clickedDate >= phaseStart && clickedDate <= phaseEnd) {
        return story.phases[i].id;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current || story.collapsed) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cellIndex = Math.floor(x / cellWidth);

    const phaseId = getPhaseAtPosition(cellIndex);
    if (!phaseId) return;

    setIsDrawing(true);
    setDrawStart(cellIndex);
    setDrawEnd(cellIndex);
    setDrawPhaseId(phaseId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cellIndex = Math.floor(x / cellWidth);

    setDrawEnd(cellIndex);
  };

  const handleMouseUp = () => {
    if (!isDrawing || drawStart === null || drawEnd === null || !drawPhaseId) {
      setIsDrawing(false);
      setDrawStart(null);
      setDrawEnd(null);
      setDrawPhaseId(null);
      return;
    }

    const startIndex = Math.min(drawStart, drawEnd);
    const endIndex = Math.max(drawStart, drawEnd);

    if (startIndex < businessDays.length && endIndex < businessDays.length) {
      const startDate = businessDays[startIndex].date;
      const endDate = businessDays[endIndex].date;

      onCreateTask(story.id, drawPhaseId, startDate, endDate);
    }

    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
    setDrawPhaseId(null);
  };

  const getDrawingOverlay = () => {
    if (!isDrawing || drawStart === null || drawEnd === null) return null;

    const startIndex = Math.min(drawStart, drawEnd);
    const endIndex = Math.max(drawStart, drawEnd);

    return {
      left: startIndex * cellWidth,
      width: (endIndex - startIndex + 1) * cellWidth,
    };
  };

  const getTaskPosition = (task: StoryTask) => {
    const startDate = parseDate(task.start_date);
    const endDate = parseDate(task.end_date);

    const startIndex = businessDays.findIndex((day) =>
      isSameDay(day.date, startDate)
    );
    const endIndex = businessDays.findIndex((day) =>
      isSameDay(day.date, endDate)
    );

    if (startIndex === -1 || endIndex === -1) {
      return null;
    }

    return {
      left: startIndex * cellWidth,
      width: (endIndex - startIndex + 1) * cellWidth,
    };
  };

  const drawingOverlay = getDrawingOverlay();

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors group">
      <div className="w-64 flex-shrink-0 border-r-2 border-gray-200 px-3 py-2 bg-white sticky left-0 z-20">
        <div className="flex items-start gap-2">
          <button
            onClick={() => onToggleCollapse(story.id)}
            className="p-1 hover:bg-gray-200 rounded flex-shrink-0 transition-colors"
          >
            {story.collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: story.color }}
              />
              <h4 className="font-semibold text-sm truncate">{story.name}</h4>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(story.start_date).toLocaleDateString('pt-BR')} →{' '}
              {new Date(story.end_date).toLocaleDateString('pt-BR')}
            </div>
            {story.handoff_date && (
              <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>Handoff: {new Date(story.handoff_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              ref={menuButtonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <ContextMenu
              isOpen={showMenu}
              onClose={() => setShowMenu(false)}
              triggerRef={menuButtonRef}
            >
              <div className="w-48">
                <button
                  onClick={() => {
                    onEditStory(story);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-100 flex items-center gap-2 border-b border-gray-200"
                >
                  <Pencil className="w-4 h-4" />
                  Editar história
                </button>
                <button
                  onClick={() => {
                    onDeleteStory(story.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir história
                </button>
              </div>
            </ContextMenu>
          </div>
        </div>
      </div>

      <div
        ref={timelineRef}
        className={`flex-1 relative h-20 ${!story.collapsed ? 'cursor-crosshair' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDrawing) {
            handleMouseUp();
          }
        }}
      >
        {!story.collapsed && (
          <>
            <div className="absolute inset-0 flex">
              {businessDays.map((day, index) => (
                <div
                  key={index}
                  className="border-r border-gray-200"
                  style={{ width: `${cellWidth}px` }}
                />
              ))}
            </div>

            <div className="absolute top-[24px] left-0 right-0 border-t border-gray-300" />

            {story.phases.map((phase, index) => {
              const phaseStartDate = getPhaseStartDate(index);
              const phaseEndDate = getPhaseEndDate(index);

              return (
                <StoryPhaseSegment
                  key={phase.id}
                  phase={phase}
                  startDate={phaseStartDate}
                  endDate={phaseEndDate}
                  cellWidth={cellWidth}
                  businessDays={businessDays.map(d => d.date)}
                  storyColor={story.color}
                  isLast={index === story.phases.length - 1}
                  onResizePhase={onResizePhase}
                />
              );
            })}

            {tasks.map((task) => {
              const position = getTaskPosition(task);
              if (!position) return null;

              const isActivity = task.type === 'activity';
              const bgColor = isActivity ? 'bg-blue-500' : 'bg-yellow-400';
              const hoverColor = isActivity ? 'hover:bg-blue-600' : 'hover:bg-yellow-500';

              return (
                <div
                  key={task.id}
                  className={`absolute top-[28px] bottom-[4px] ${bgColor} ${hoverColor} text-white px-2 py-1 cursor-pointer border border-white flex items-center transition-colors z-10`}
                  style={{
                    left: `${position.left}px`,
                    width: `${position.width}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(task);
                  }}
                  title={task.name}
                >
                  <span className="text-xs font-medium truncate">{task.name}</span>
                </div>
              );
            })}

            {drawingOverlay && (
              <div
                className="absolute top-[28px] bottom-[4px] bg-gray-400 opacity-50 border-2 border-dashed border-gray-600 pointer-events-none z-15"
                style={{
                  left: `${drawingOverlay.left}px`,
                  width: `${drawingOverlay.width}px`,
                }}
              />
            )}

            {handoffDayIndex !== -1 && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-red-600 pointer-events-none z-30"
                style={{ left: `${handoffDayIndex * cellWidth + cellWidth / 2}px` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-2 py-0.5 text-xs font-bold whitespace-nowrap">
                  HANDOFF
                </div>
              </div>
            )}
          </>
        )}

        {story.collapsed && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 italic">
            Recolhida
          </div>
        )}
      </div>
    </div>
  );
};
