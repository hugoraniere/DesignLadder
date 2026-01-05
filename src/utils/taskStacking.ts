import { StoryTask } from '../types/designStories';
import { parseDate, isSameDay } from './businessDays';

export interface TaskPosition {
  taskId: string;
  left: number;
  width: number;
  lane: number;
}

interface TaskInterval {
  taskId: string;
  startIndex: number;
  endIndex: number;
  left: number;
  width: number;
}

export const calculateTaskLanes = (
  tasks: StoryTask[],
  businessDays: { date: Date }[],
  cellWidth: number
): { positions: TaskPosition[]; totalLanes: number } => {
  const intervals: TaskInterval[] = [];

  for (const task of tasks) {
    const startDate = parseDate(task.start_date);
    const endDate = parseDate(task.end_date);

    const startIndex = businessDays.findIndex((day) =>
      isSameDay(day.date, startDate)
    );
    const endIndex = businessDays.findIndex((day) =>
      isSameDay(day.date, endDate)
    );

    if (startIndex === -1 || endIndex === -1) {
      continue;
    }

    intervals.push({
      taskId: task.id,
      startIndex,
      endIndex,
      left: startIndex * cellWidth,
      width: (endIndex - startIndex + 1) * cellWidth,
    });
  }

  intervals.sort((a, b) => {
    if (a.startIndex !== b.startIndex) {
      return a.startIndex - b.startIndex;
    }
    return a.endIndex - b.endIndex;
  });

  const lanes: Array<number | null> = [];
  const positions: TaskPosition[] = [];

  for (const interval of intervals) {
    let assignedLane = -1;

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
      const laneEnd = lanes[laneIndex];
      if (laneEnd === null || laneEnd < interval.startIndex) {
        assignedLane = laneIndex;
        break;
      }
    }

    if (assignedLane === -1) {
      assignedLane = lanes.length;
      lanes.push(interval.endIndex);
    } else {
      lanes[assignedLane] = interval.endIndex;
    }

    positions.push({
      taskId: interval.taskId,
      left: interval.left,
      width: interval.width,
      lane: assignedLane,
    });
  }

  return {
    positions,
    totalLanes: lanes.length,
  };
};
