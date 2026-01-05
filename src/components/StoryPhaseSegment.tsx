import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { StoryPhase } from '../types/designStories';

interface StoryPhaseSegmentProps {
  phase: StoryPhase;
  startDate: Date;
  endDate: Date;
  cellWidth: number;
  businessDays: Date[];
  storyColor: string;
  isLast: boolean;
  onResizePhase?: (phaseId: string, newDurationDays: number) => void;
}

export const StoryPhaseSegment = ({
  phase,
  startDate,
  endDate,
  cellWidth,
  businessDays,
  storyColor,
  isLast,
  onResizePhase
}: StoryPhaseSegmentProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartDuration, setDragStartDuration] = useState(phase.duration_days);

  const getPhaseStartIndex = () => {
    return businessDays.findIndex(day =>
      day.toDateString() === startDate.toDateString()
    );
  };

  const getPhaseEndIndex = () => {
    return businessDays.findIndex(day =>
      day.toDateString() === endDate.toDateString()
    );
  };

  const startIndex = getPhaseStartIndex();
  const endIndex = getPhaseEndIndex();
  const width = (endIndex - startIndex + 1) * cellWidth;
  const left = startIndex * cellWidth;

  const handleDividerMouseDown = (e: React.MouseEvent) => {
    if (!onResizePhase || isLast) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartDuration(phase.duration_days);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartX;
      const daysDelta = Math.round(deltaX / cellWidth);
      const newDuration = Math.max(1, dragStartDuration + daysDelta);

      if (newDuration !== phase.duration_days && onResizePhase) {
        onResizePhase(phase.id, newDuration);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const phaseColor = phase.color || storyColor;
  const lighterColor = `${phaseColor}15`;
  const borderColor = `${phaseColor}60`;

  return (
    <>
      <div
        className="absolute top-0 h-[24px] border transition-all"
        style={{
          left: `${left}px`,
          width: `${width}px`,
          backgroundColor: lighterColor,
          borderColor: borderColor,
          zIndex: isDragging ? 30 : 1
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center px-2">
          <span className="text-[10px] font-semibold truncate" style={{ color: phaseColor }}>
            {phase.name}
          </span>
        </div>
      </div>

      {!isLast && onResizePhase && (
        <div
          className={`absolute top-0 h-[24px] w-1 bg-gray-400 cursor-col-resize z-20 hover:bg-gray-600 hover:w-2 transition-all ${
            isDragging ? 'bg-blue-600 w-2' : ''
          }`}
          style={{
            left: `${left + width}px`
          }}
          onMouseDown={handleDividerMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 shadow-lg opacity-0 hover:opacity-100 transition-opacity">
            <GripVertical className="w-2.5 h-2.5 text-gray-600" />
          </div>
        </div>
      )}
    </>
  );
};
