export function levelFromPoints(points) {
  const level = 1 + Math.floor(points / 100);
  const progressInLevel = points % 100;
  return { level, pointsInLevel: progressInLevel, pointsForLevel: 100, progress: progressInLevel / 100 };
}

export function streakFromDates(dates) {
  const days = new Set(dates.map((d) => dayKey(new Date(d))));
  if (days.size === 0) return 0;

  const today = dayKey(new Date());
  const yesterday = dayKey(addDays(new Date(), -1));

  let cursor;
  if (days.has(today)) cursor = today;
  else if (days.has(yesterday)) cursor = yesterday;
  else return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = dayKey(addDays(new Date(cursor), -1));
  }
  return streak;
}

function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
