import { SprintDuration } from '../types/designStories';

interface Week {
  weekNumber: number;
  days: { date: Date; dayOfWeek: number }[];
}

interface StoriesTimelineProps {
  weeks: Week[];
  projectStartDate: Date;
  sprintDuration: SprintDuration;
  cellWidth: number;
}

export const StoriesTimeline = ({
  weeks,
  projectStartDate,
  sprintDuration,
  cellWidth
}: StoriesTimelineProps) => {
  const getSprintNumber = (weekNumber: number): number => {
    return Math.floor((weekNumber - 1) / sprintDuration) + 1;
  };

  const isFirstWeekOfSprint = (weekNumber: number): boolean => {
    return (weekNumber - 1) % sprintDuration === 0;
  };

  const renderSprints = () => {
    const sprints: { number: number; startWeek: number; weekCount: number }[] = [];
    let currentSprint = 1;
    let weekCount = 0;

    weeks.forEach((week, index) => {
      if (isFirstWeekOfSprint(week.weekNumber)) {
        if (weekCount > 0) {
          sprints.push({ number: currentSprint, startWeek: index - weekCount, weekCount });
          currentSprint++;
        }
        weekCount = 1;
      } else {
        weekCount++;
      }
    });

    if (weekCount > 0) {
      sprints.push({ number: currentSprint, startWeek: weeks.length - weekCount, weekCount });
    }

    return sprints.map((sprint) => {
      const width = sprint.weekCount * 5 * cellWidth;
      const left = sprint.startWeek * 5 * cellWidth;

      return (
        <div
          key={sprint.number}
          className="absolute top-0 bottom-0 border-r border-gray-300"
          style={{ left: `${left}px`, width: `${width}px` }}
        >
          <div className="absolute top-1.5 left-2 bg-gray-700 text-white px-2 py-0.5 text-xs font-medium rounded">
            Sprint {sprint.number}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="relative bg-gray-100 border-b border-gray-300" style={{ height: '50px' }}>
        {renderSprints()}
      </div>

      <div className="flex border-b-2 border-black bg-gray-50">
        {weeks.map((week) => (
          <div
            key={week.weekNumber}
            className="flex border-r border-gray-200"
          >
            {week.days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="border-r border-gray-200 flex flex-col items-center justify-center py-1.5"
                style={{ width: `${cellWidth}px`, minHeight: '45px' }}
              >
                <div className="text-xs font-medium text-gray-700">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'][day.dayOfWeek]}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {day.date.getDate()}/{day.date.getMonth() + 1}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
