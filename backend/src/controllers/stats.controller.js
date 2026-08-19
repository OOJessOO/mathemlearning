import { AttemptModel } from '../models/attempt.model.js';
import { levelFromPoints, streakFromDates } from '../utils/progress.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getStats = catchAsync(async (req, res) => {
  const attempts = await AttemptModel.listForStats(req.user.id);

  const totalPoints = attempts.reduce((sum, a) => sum + (a.note ?? 0), 0);
  const maxPoints = attempts.reduce((sum, a) => sum + a.exercise.points, 0);
  const correct = attempts.filter((a) => a.note != null && a.note > 0).length;
  const completed = attempts.length;
  const successRate = completed ? Math.round((correct / completed) * 100) : 0;

  const level = levelFromPoints(totalPoints);
  const streak = streakFromDates(attempts.map((a) => a.submittedAt));

  return res.json({
    stats: {
      completed,
      correct,
      totalPoints,
      maxPoints,
      successRate,
      streak,
      level: level.level,
      pointsInLevel: level.pointsInLevel,
      pointsForLevel: level.pointsForLevel,
      levelProgress: level.progress,
    },
  });
});
