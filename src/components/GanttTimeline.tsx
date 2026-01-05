import { BusinessDay, Week } from '../utils/businessDays';

interface GanttTimelineProps {
  weeks: Week[];
  projectStartDate: Date;
  sprintDurationWeeks: number;
  cellWidth: number;
}

export const GanttTimeline = ({ weeks, projectStartDate, sprintDurationWeeks, cellWidth }: GanttTimelineProps) => {
  const getSprintForWeek = (weekNumber: number): number => {
    return Math.ceil(weekNumber / sprintDurationWeeks);
  };

  const sprints: Array<{ number: number; weekCount: number }> = [];
  weeks.forEach((week) => {
    const sprintNumber = getSprintForWeek(week.weekNumber);
    const existing = sprints.find((s) => s.number === sprintNumber);
    if (existing) {
      existing.weekCount++;
    } else {
      sprints.push({ number: sprintNumber, weekCount: 1 });
    }
  });

  return (
    <div className="border-b-2 border-black bg-gray-50">
      <div className="flex border-b-2 border-gray-300">
        {sprints.map((sprint) => (
          <div
            key={sprint.number}
            className="border-r-2 border-gray-300 last:border-r-0"
            style={{ width: `${sprint.weekCount * 5 * cellWidth}px` }}
          >
            <div className="text-center py-2 px-4 font-bold text-sm bg-gray-100">
              Sprint {sprint.number}
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        {weeks.map((week, index) => {
          const startDate = week.startDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          });
          const endDate = week.endDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          });

          return (
            <div
              key={index}
              className="border-r-2 border-gray-300 last:border-r-0"
              style={{ width: `${5 * cellWidth}px` }}
            >
              <div className="text-center py-2 px-2 border-b-2 border-gray-300">
                <div className="font-bold text-xs text-gray-700">
                  Semana {week.weekNumber}
                </div>
                <div className="text-xs text-gray-600">
                  {startDate} - {endDate}
                </div>
              </div>

              <div className="flex">
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`flex-1 text-center py-2 px-1 border-r border-gray-200 last:border-r-0 ${
                      day.isToday ? 'bg-yellow-100' : ''
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-700">
                      {day.dayName}
                    </div>
                    <div className="text-xs text-gray-600">{day.dayNumber}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
