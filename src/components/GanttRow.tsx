import { useState, useRef, useEffect } from 'react';
import { Task, Phase } from '../types/roadmap';
import { BusinessDay, parseDate, isSameDay, formatDate } from '../utils/businessDays';

interface GanttRowProps {
  phase: Phase;
  tasks: Task[];
  businessDays: BusinessDay[];
  cellWidth: number;
  onTaskClick: (task: Task) => void;
  onCreateTask: (phaseId: string, startDate: Date, endDate: Date) => void;
}

export const GanttRow = ({
  phase,
  tasks,
  businessDays,
  cellWidth,
  onTaskClick,
  onCreateTask,
}: GanttRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<number | null>(null);
  const [drawEnd, setDrawEnd] = useState<number | null>(null);

  const getTaskPosition = (task: Task) => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;

    const rect = rowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cellIndex = Math.floor(x / cellWidth);

    setIsDrawing(true);
    setDrawStart(cellIndex);
    setDrawEnd(cellIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !rowRef.current) return;

    const rect = rowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cellIndex = Math.floor(x / cellWidth);

    setDrawEnd(cellIndex);
  };

  const handleMouseUp = () => {
    if (!isDrawing || drawStart === null || drawEnd === null) return;

    const startIndex = Math.min(drawStart, drawEnd);
    const endIndex = Math.max(drawStart, drawEnd);

    if (startIndex < businessDays.length && endIndex < businessDays.length) {
      const startDate = businessDays[startIndex].date;
      const endDate = businessDays[endIndex].date;

      onCreateTask(phase.id, startDate, endDate);
    }

    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
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

  const drawingOverlay = getDrawingOverlay();

  return (
    <div className="border-b-2 border-gray-300 last:border-b-0 relative group">
      <div className="flex">
        <div className="w-48 border-r-2 border-gray-300 p-4 bg-white flex-shrink-0">
          <h3 className="font-bold text-sm">{phase.name}</h3>
        </div>

        <div
          ref={rowRef}
          className="flex-1 relative cursor-crosshair bg-white hover:bg-gray-50"
          style={{
            height: '80px',
            width: `${businessDays.length * cellWidth}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (isDrawing) {
              handleMouseUp();
            }
          }}
        >
          {businessDays.map((day, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 border-r border-gray-200"
              style={{
                left: `${index * cellWidth}px`,
                width: `${cellWidth}px`,
              }}
            />
          ))}

          {tasks.map((task) => {
            const position = getTaskPosition(task);
            if (!position) return null;

            const isActivity = task.type === 'activity';
            const bgColor = isActivity ? 'bg-blue-500' : 'bg-yellow-400';
            const hoverColor = isActivity
              ? 'hover:bg-blue-600'
              : 'hover:bg-yellow-500';

            return (
              <div
                key={task.id}
                className={`absolute top-2 bottom-2 ${bgColor} ${hoverColor} text-white px-2 py-1 cursor-pointer border-2 border-black flex items-center transition-colors`}
                style={{
                  left: `${position.left}px`,
                  width: `${position.width}px`,
                }}
                onClick={() => onTaskClick(task)}
                title={task.name}
              >
                <span className="text-xs font-bold truncate">{task.name}</span>
              </div>
            );
          })}

          {drawingOverlay && (
            <div
              className="absolute top-2 bottom-2 bg-gray-400 opacity-50 border-2 border-dashed border-gray-600 pointer-events-none"
              style={{
                left: `${drawingOverlay.left}px`,
                width: `${drawingOverlay.width}px`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
