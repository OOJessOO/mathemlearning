import { ExerciseModel } from '../models/exercise.model.js';
import { AttemptModel } from '../models/attempt.model.js';

export async function listExercises(req, res) {
  const { branch } = req.query;
  const categorie = req.user.role === 'LYCEE' ? 'LYCEE' : 'UNIVERSITAIRE';

  const [exercises, pointsAgg] = await Promise.all([
    ExerciseModel.findMany({
      niveau: req.user.niveau,
      branchSlug: branch,
      categorie,
    }),
    AttemptModel.totalPoints(req.user.id),
  ]);
  const totalPoints = pointsAgg._sum.note ?? 0;

  return res.json({
    exercises: exercises.map((e) => ({
      id: e.id,
      title: e.title,
      enonce: e.enonce,
      dureeSecondes: e.dureeSecondes,
      points: e.points,
      niveau: e.niveau,
      branch: e.branch.name,
      done: e.attempts.length,
      unlockPoints: e.unlockPoints,
      unlocked: totalPoints >= e.unlockPoints,
    })),
  });
}

export async function getExercise(req, res) {
  const id = Number(req.params.id);
  const [exercise, pointsAgg] = await Promise.all([
    ExerciseModel.findById(id),
    AttemptModel.totalPoints(req.user.id),
  ]);
  if (!exercise) return res.status(404).json({ error: 'Exercice introuvable' });
  const totalPoints = pointsAgg._sum.note ?? 0;

  return res.json({
    id: exercise.id,
    title: exercise.title,
    enonce: exercise.enonce,
    dureeSecondes: exercise.dureeSecondes,
    points: exercise.points,
    niveau: exercise.niveau,
    branch: exercise.branch.name,
    unlockPoints: exercise.unlockPoints,
    unlocked: totalPoints >= exercise.unlockPoints,
  });
}
