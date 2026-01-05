import { useState } from 'react';
import { StoryTask } from '../types/designStories';
import { supabase } from '../lib/supabase';
import { parseDate, isSameDay } from '../utils/businessDays';

interface TaskBarProps {
  task: StoryTask;
  position: {
    taskId: string;
    left: number;
    width: number;
    lane: number;
  };
  cellWidth: number;
  businessDays: { date: Date }[];
  laneHeight: number;
  phaseHeaderHeight: number;
  onTaskClick: (task: StoryTask) => void;
  onTaskUpdated: () => void;
}

export const TaskBar = ({
  task,
  position,
  cellWidth,
  businessDays,
  laneHeight,
  phaseHeaderHeight,
  onTaskClick,
  onTaskUpdated
}: TaskBarProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<'left' | 'right' | null>(null);
  const [tempLeft, setTempLeft] = useState<number | null>(null);
  const [tempWidth, setTempWidth] = useState<number | null>(null);

  const isActivity = task.type === 'activity';
  const bgColor = isActivity ? 'bg-blue-500' : 'bg-yellow-400';
  const hoverColor = isActivity ? 'hover:bg-blue-600' : 'hover:bg-yellow-500';

  const top = phaseHeaderHeight + (position.lane * laneHeight);
  const height = laneHeight - 4;

  const displayLeft = tempLeft !== null ? tempLeft : position.left;
  const displayWidth = tempWidth !== null ? tempWidth : position.width;

  const handleResizeStart = (edge: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startLeft = position.left;
    const startWidth = position.width;

    setIsResizing(true);
    setResizeEdge(edge);
    setTempLeft(startLeft);
    setTempWidth(startWidth);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const daysDelta = Math.round(deltaX / cellWidth);

      if (edge === 'right') {
        const newWidth = Math.max(cellWidth, startWidth + deltaX);
        setTempWidth(newWidth);
      } else {
        const newLeft = startLeft + deltaX;
        const newWidth = startWidth - deltaX;
        if (newWidth >= cellWidth) {
          setTempLeft(newLeft);
          setTempWidth(newWidth);
        }
      }
    };

    const handleMouseUp = async () => {
      if (tempLeft !== null && tempWidth !== null) {
        const startDayIndex = Math.round(tempLeft / cellWidth);
        const durationDays = Math.round(tempWidth / cellWidth);
        const endDayIndex = startDayIndex + durationDays - 1;

        if (startDayIndex >= 0 && endDayIndex < businessDays.length) {
          const newStartDate = businessDays[startDayIndex].date;
          const newEndDate = businessDays[endDayIndex].date;

          try {
            const { error } = await supabase
              .from('story_tasks')
              .update({
                start_date: newStartDate.toISOString().split('T')[0],
                end_date: newEndDate.toISOString().split('T')[0]
              })
              .eq('id', task.id);

            if (error) throw error;
            onTaskUpdated();
          } catch (error) {
            console.error('[TaskBar] Error updating task:', error);
          }
        }
      }

      setIsResizing(false);
      setResizeEdge(null);
      setTempLeft(null);
      setTempWidth(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`task-bar absolute ${bgColor} ${hoverColor} text-white px-2 py-1 border border-white flex items-center transition-colors z-10 rounded group`}
      style={{
        left: `${displayLeft}px`,
        width: `${displayWidth}px`,
        top: `${top}px`,
        height: `${height}px`,
        cursor: isResizing ? 'col-resize' : 'pointer'
      }}
      onClick={(e) => {
        if (!isResizing) {
          e.stopPropagation();
          onTaskClick(task);
        }
      }}
      title={task.name}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-white/30 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={(e) => handleResizeStart('left', e)}
      />

      <span className="text-xs font-medium truncate">{task.name}</span>

      <div
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-white/30 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={(e) => handleResizeStart('right', e)}
      />
    </div>
  );
};
