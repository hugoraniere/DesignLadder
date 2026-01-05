import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronRight, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DesignStoryWithPhases, StoryTask } from '../types/designStories';
import { StoryPhaseSegment } from './StoryPhaseSegment';
import { TaskBar } from './TaskBar';
import { parseDate, isSameDay, formatDate } from '../utils/businessDays';
import { ContextMenu } from './ContextMenu';
import { supabase } from '../lib/supabase';
import { calculateTaskLanes } from '../utils/taskStacking';

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
  refreshTrigger?: number;
  showLeftColumn?: boolean;
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
  onTaskClick,
  refreshTrigger,
  showLeftColumn = true
}: StoryRowProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [tasks, setTasks] = useState<StoryTask[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<number | null>(null);
  const [drawEnd, setDrawEnd] = useState<number | null>(null);
  const [drawPhaseId, setDrawPhaseId] = useState<string | null>(null);
  const [drawLane, setDrawLane] = useState<number>(0);
  const [isResizingStory, setIsResizingStory] = useState(false);
  const [tempStoryEndIndex, setTempStoryEndIndex] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const storyStartDate = parseDate(story.start_date);

  useEffect(() => {
    loadTasks();
  }, [story.id, story.phases, refreshTrigger]);

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

    const target = e.target as HTMLElement;
    if (target.closest('.task-bar') || target.closest('.phase-segment')) {
      return;
    }

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellIndex = Math.floor(x / cellWidth);

    const phaseId = getPhaseAtPosition(cellIndex);
    if (!phaseId) return;

    const yAfterHeader = y - PHASE_HEADER_HEIGHT;
    if (yAfterHeader < 0) return;

    const lane = Math.max(0, Math.floor(yAfterHeader / LANE_HEIGHT));

    const clickedTask = taskLayout.positions.find(pos => {
      const taskLeft = pos.left;
      const taskRight = pos.left + pos.width;
      const taskTop = PHASE_HEADER_HEIGHT + (pos.lane * LANE_HEIGHT);
      const taskBottom = taskTop + LANE_HEIGHT;

      return x >= taskLeft && x <= taskRight && y >= taskTop && y <= taskBottom;
    });

    if (clickedTask) {
      return;
    }

    setIsDrawing(true);
    setDrawStart(cellIndex);
    setDrawEnd(cellIndex);
    setDrawPhaseId(phaseId);
    setDrawLane(lane);
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
      setDrawLane(0);
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
    setDrawLane(0);
  };

  const handleStoryResizeStart = (e: React.MouseEvent, currentEndIndex: number) => {
    e.stopPropagation();
    e.preventDefault();

    setIsResizingStory(true);
    setTempStoryEndIndex(currentEndIndex);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const newEndIndex = Math.max(0, Math.min(businessDays.length - 1, Math.floor(x / cellWidth)));
      setTempStoryEndIndex(newEndIndex);
    };

    const handleMouseUp = async () => {
      if (tempStoryEndIndex !== null && tempStoryEndIndex !== currentEndIndex) {
        const storyStartIndex = businessDays.findIndex(day =>
          isSameDay(day.date, storyStartDate)
        );

        if (storyStartIndex === -1) return;

        const newStoryDurationDays = tempStoryEndIndex - storyStartIndex + 1;
        const currentTotalDays = story.phases.reduce((sum, p) => sum + p.duration_days, 0);
        const durationDelta = newStoryDurationDays - currentTotalDays;

        if (durationDelta !== 0 && story.phases.length > 0) {
          const lastPhase = story.phases[story.phases.length - 1];
          const newLastPhaseDuration = lastPhase.duration_days + durationDelta;

          if (newLastPhaseDuration < 1) {
            alert('A última fase precisa ter pelo menos 1 dia de duração.');
          } else {
            try {
              const { error } = await supabase
                .from('story_phases')
                .update({ duration_days: newLastPhaseDuration })
                .eq('id', lastPhase.id);

              if (error) throw error;

              const newEndDate = businessDays[tempStoryEndIndex].date.toISOString().split('T')[0];
              const { error: storyError } = await supabase
                .from('design_stories')
                .update({ end_date: newEndDate })
                .eq('id', story.id);

              if (storyError) throw storyError;

              loadTasks();
            } catch (error) {
              console.error('[StoryRow] Error resizing story:', error);
            }
          }
        }
      }

      setIsResizingStory(false);
      setTempStoryEndIndex(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getDrawingOverlay = () => {
    if (!isDrawing || drawStart === null || drawEnd === null) return null;

    const startIndex = Math.min(drawStart, drawEnd);
    const endIndex = Math.max(drawStart, drawEnd);

    return {
      left: startIndex * cellWidth,
      width: (endIndex - startIndex + 1) * cellWidth,
      lane: drawLane,
    };
  };

  const taskLayout = useMemo(() => {
    return calculateTaskLanes(tasks, businessDays, cellWidth);
  }, [tasks, businessDays, cellWidth]);

  const LANE_HEIGHT = 32;
  const PHASE_HEADER_HEIGHT = 24;
  const BOTTOM_PADDING = 4;
  const rowHeight = Math.max(80, PHASE_HEADER_HEIGHT + ((taskLayout.totalLanes + 1) * LANE_HEIGHT) + BOTTOM_PADDING);

  const drawingOverlay = getDrawingOverlay();

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors group">
      {showLeftColumn && (
        <div className="w-48 flex-shrink-0 border-r-2 border-gray-200 px-2 py-2 bg-white sticky left-0 z-20">
          <div className="flex items-start gap-1.5">
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
              <div className="flex items-center gap-1.5 mb-0.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: story.color }}
                />
                <h4 className="font-semibold text-sm truncate">{story.name}</h4>
              </div>
              <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(story.start_date).toLocaleDateString('pt-BR')} →{' '}
                {new Date(story.end_date).toLocaleDateString('pt-BR')}
              </div>
              {story.handoff_date && (
                <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
      )}

      <div
        ref={timelineRef}
        className={`flex-1 relative ${!story.collapsed ? 'cursor-crosshair' : ''}`}
        style={{ height: `${rowHeight}px` }}
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

            {(() => {
              const storyStartIndex = businessDays.findIndex(day =>
                isSameDay(day.date, storyStartDate)
              );
              const storyEndDate = parseDate(story.end_date);
              let storyEndIndex = businessDays.findIndex(day =>
                isSameDay(day.date, storyEndDate)
              );

              if (tempStoryEndIndex !== null) {
                storyEndIndex = tempStoryEndIndex;
              }

              if (storyStartIndex === -1 || storyEndIndex === -1) return null;

              const storyLeft = storyStartIndex * cellWidth;
              const storyWidth = (storyEndIndex - storyStartIndex + 1) * cellWidth;

              return (
                <>
                  <div
                    className="absolute border border-gray-300"
                    style={{
                      left: `${storyLeft}px`,
                      width: `${storyWidth}px`,
                      top: 0,
                      height: '100%',
                      backgroundColor: `${story.color}15`,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:opacity-50 transition-opacity group"
                    style={{
                      left: `${storyLeft + storyWidth - 4}px`,
                      zIndex: 50,
                      pointerEvents: 'auto'
                    }}
                    onMouseDown={(e) => handleStoryResizeStart(e, storyEndIndex)}
                    title="Arrastar para ajustar o período da história"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 group-hover:bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </>
              );
            })()}

            <div
              className="absolute left-0 right-0 border-t border-gray-300"
              style={{ top: `${PHASE_HEADER_HEIGHT}px` }}
            />

            {Array.from({ length: taskLayout.totalLanes }).map((_, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ top: `${PHASE_HEADER_HEIGHT + (index + 1) * LANE_HEIGHT}px` }}
              />
            ))}

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

            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const todayIndex = businessDays.findIndex(day => {
                const checkDate = new Date(day.date);
                checkDate.setHours(0, 0, 0, 0);
                return checkDate.getTime() === today.getTime();
              });

              if (todayIndex === -1) return null;

              return (
                <div
                  className="absolute top-0 bottom-0 bg-red-100 pointer-events-none"
                  style={{
                    left: `${todayIndex * cellWidth}px`,
                    width: `${cellWidth}px`,
                    opacity: 0.4,
                    zIndex: 100
                  }}
                />
              );
            })()}

            {taskLayout.positions.map((position) => {
              const task = tasks.find(t => t.id === position.taskId);
              if (!task) return null;

              return (
                <TaskBar
                  key={task.id}
                  task={task}
                  position={position}
                  cellWidth={cellWidth}
                  businessDays={businessDays}
                  laneHeight={LANE_HEIGHT}
                  phaseHeaderHeight={PHASE_HEADER_HEIGHT}
                  onTaskClick={onTaskClick}
                  onTaskUpdated={loadTasks}
                />
              );
            })}

            {drawingOverlay && (
              <div
                className="absolute bg-gray-400 opacity-50 border-2 border-dashed border-gray-600 pointer-events-none z-15 rounded"
                style={{
                  left: `${drawingOverlay.left}px`,
                  width: `${drawingOverlay.width}px`,
                  top: `${PHASE_HEADER_HEIGHT + (drawingOverlay.lane * LANE_HEIGHT)}px`,
                  height: `${LANE_HEIGHT - 4}px`,
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
