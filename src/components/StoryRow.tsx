import { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DesignStoryWithPhases } from '../types/designStories';
import { StoryPhaseSegment } from './StoryPhaseSegment';
import { parseDate, isSameDay } from '../utils/businessDays';

interface StoryRowProps {
  story: DesignStoryWithPhases;
  cellWidth: number;
  businessDays: { date: Date }[];
  onToggleCollapse: (storyId: string) => void;
  onEditStory: (story: DesignStoryWithPhases) => void;
  onDeleteStory: (storyId: string) => void;
  onResizePhase: (phaseId: string, newDurationDays: number) => void;
}

export const StoryRow = ({
  story,
  cellWidth,
  businessDays,
  onToggleCollapse,
  onEditStory,
  onDeleteStory,
  onResizePhase
}: StoryRowProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const storyStartDate = parseDate(story.start_date);
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

  return (
    <div className="flex border-b-2 border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="w-64 flex-shrink-0 border-r-2 border-gray-200 p-4 bg-white sticky left-0 z-20">
        <div className="flex items-start gap-2">
          <button
            onClick={() => onToggleCollapse(story.id)}
            className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
          >
            {story.collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: story.color }}
              />
              <h4 className="font-bold text-sm truncate">{story.name}</h4>
            </div>
            <div className="text-xs text-gray-600">
              {new Date(story.start_date).toLocaleDateString('pt-BR')} →{' '}
              {new Date(story.end_date).toLocaleDateString('pt-BR')}
            </div>
            {story.handoff_date && (
              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                <Calendar className="w-3 h-3" />
                <span>Handoff: {new Date(story.handoff_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-white border-2 border-black shadow-lg z-40">
                  <button
                    onClick={() => {
                      onEditStory(story);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b border-gray-200"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar história
                  </button>
                  <button
                    onClick={() => {
                      onDeleteStory(story.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir história
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative h-20">
        {!story.collapsed && (
          <>
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
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            História recolhida
          </div>
        )}
      </div>
    </div>
  );
};
