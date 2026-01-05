export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function getNextBusinessDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);

  while (!isBusinessDay(next)) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

export function getPreviousBusinessDay(date: Date): Date {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);

  while (!isBusinessDay(prev)) {
    prev.setDate(prev.getDate() - 1);
  }

  return prev;
}

export function adjustToBusinessDay(date: Date): Date {
  if (isBusinessDay(date)) {
    return new Date(date);
  }
  return getNextBusinessDay(date);
}

export function getBusinessDaysBetween(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    if (isBusinessDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      daysAdded++;
    }
  }

  return result;
}

export interface BusinessDay {
  date: Date;
  dayOfWeek: number;
  dayName: string;
  dayNumber: number;
  month: string;
  weekNumber: number;
  isToday: boolean;
}

export function generateBusinessDaysRange(
  startDate: Date,
  numberOfWeeks: number
): BusinessDay[] {
  const days: BusinessDay[] = [];
  const current = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  current.setHours(0, 0, 0, 0);
  if (!isBusinessDay(current)) {
    current.setTime(getNextBusinessDay(current).getTime());
  }

  const totalBusinessDays = numberOfWeeks * 5;
  let weekNumber = 1;
  let businessDaysInWeek = 0;

  for (let i = 0; i < totalBusinessDays; i++) {
    const dayOfWeek = current.getDay();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    days.push({
      date: new Date(current),
      dayOfWeek,
      dayName: dayNames[dayOfWeek],
      dayNumber: current.getDate(),
      month: monthNames[current.getMonth()],
      weekNumber,
      isToday: current.getTime() === today.getTime()
    });

    businessDaysInWeek++;

    if (businessDaysInWeek === 5) {
      weekNumber++;
      businessDaysInWeek = 0;
    }

    current.setTime(getNextBusinessDay(current).getTime());
  }

  return days;
}

export interface Week {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: BusinessDay[];
}

export function groupBusinessDaysByWeek(days: BusinessDay[]): Week[] {
  const weeks: Week[] = [];
  let currentWeek: BusinessDay[] = [];
  let weekNumber = 1;

  days.forEach((day, index) => {
    if (currentWeek.length === 0 || day.weekNumber === weekNumber) {
      currentWeek.push(day);
    }

    if (currentWeek.length === 5 || index === days.length - 1) {
      if (currentWeek.length > 0) {
        weeks.push({
          weekNumber,
          startDate: currentWeek[0].date,
          endDate: currentWeek[currentWeek.length - 1].date,
          days: [...currentWeek]
        });
        weekNumber++;
        currentWeek = [];
      }
    }
  });

  return weeks;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function calculateSprintInfo(
  projectStartDate: Date,
  sprintDurationWeeks: number,
  currentDate: Date
): { sprintNumber: number; dayInSprint: number } {
  const businessDaysPassed = getBusinessDaysBetween(projectStartDate, currentDate);
  const businessDaysPerSprint = sprintDurationWeeks * 5;

  const sprintNumber = Math.floor(businessDaysPassed / businessDaysPerSprint) + 1;
  const dayInSprint = (businessDaysPassed % businessDaysPerSprint) + 1;

  return { sprintNumber, dayInSprint };
}
