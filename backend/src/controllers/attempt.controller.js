import { ExerciseModel } from '../models/exercise.model.js';
import { AttemptModel } from '../models/attempt.model.js';
import { gradeAnswer } from '../utils/grading.js';
import { catchAsync } from '../utils/catchAsync.js';

function parseId(value) {
  const id = Number(value);
  return Number.isFinite(id) && Number.isInteger(id) ? id : null;
}

export const startAttempt = catchAsync(async (req, res) => {
  const exerciseId = parseId(req.params.exerciseId);
  if (exerciseId === null) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  const [exercise, pointsAgg] = await Promise.all([
    ExerciseModel.findById(exerciseId),
    AttemptModel.totalPoints(req.user.id),
  ]);
  if (!exercise) return res.status(404).json({ error: 'Exercice introuvable' });

  const totalPoints = pointsAgg._sum.note ?? 0;
  if (totalPoints < exercise.unlockPoints) {
    return res.status(403).json({
      error: `Exercice verrouillé — requis : ${exercise.unlockPoints} points`,
    });
  }

  const { attempt } = await AttemptModel.findOrCreateActive(req.user.id, exerciseId);
  return res.json({ attempt: serializeAttempt(attempt, exercise) });
});

export const getAttempt = catchAsync(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  const attempt = await AttemptModel.findByIdWithExercise(id);
  if (!attempt) return res.status(404).json({ error: 'Tentative introuvable' });
  if (attempt.userId !== req.user.id) return res.status(403).json({ error: 'Accès refusé' });

  return res.json({ attempt: serializeAttempt(attempt, attempt.exercise) });
});

export const submitAttempt = catchAsync(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  const { demarche, reponse } = req.body;

  const attempt = await AttemptModel.findByIdWithExercise(id);
  if (!attempt) return res.status(404).json({ error: 'Tentative introuvable' });
  if (attempt.userId !== req.user.id) return res.status(403).json({ error: 'Accès refusé' });
  if (attempt.status !== 'EN_COURS') {
    return res.status(400).json({ error: 'Cette tentative est déjà terminée' });
  }

  const result = gradeAnswer(attempt.exercise.expectedAnswer, reponse);
  const note = result.correct ? attempt.exercise.points : 0;

  const updated = await AttemptModel.submit(id, { demarche, reponse, note });

  return res.json({
    attempt: serializeAttempt(updated, attempt.exercise),
    grade: { note, correct: result.correct, max: attempt.exercise.points, reason: result.reason },
  });
});

export const abandonAttempt = catchAsync(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  const attempt = await AttemptModel.findByIdWithExercise(id);
  if (!attempt) return res.status(404).json({ error: 'Tentative introuvable' });
  if (attempt.userId !== req.user.id) return res.status(403).json({ error: 'Accès refusé' });
  if (attempt.status !== 'EN_COURS') {
    return res.status(400).json({ error: 'Cette tentative est déjà terminée' });
  }

  const updated = await AttemptModel.abandon(id);
  return res.json({ attempt: serializeAttempt(updated, attempt.exercise) });
});

export const getResult = catchAsync(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  const attempt = await AttemptModel.findByIdWithExercise(id);
  if (!attempt) return res.status(404).json({ error: 'Tentative introuvable' });
  if (attempt.userId !== req.user.id) return res.status(403).json({ error: 'Accès refusé' });

  const correct =
    attempt.status === 'TERMINE' && attempt.note != null && attempt.note >= attempt.exercise.points;

  return res.json({
    attempt: serializeAttempt(attempt, attempt.exercise),
    grade: {
      note: attempt.note ?? 0,
      max: attempt.exercise.points,
      correct,
      status: attempt.status,
    },
    correction: attempt.exercise.correction,
  });
});

export const listHistory = catchAsync(async (req, res) => {
  const attempts = await AttemptModel.listForUser(req.user.id);
  return res.json({
    attempts: attempts.map((a) => ({
      id: a.id,
      status: a.status,
      note: a.note,
      max: a.exercise.points,
      title: a.exercise.title,
      branch: a.exercise.branch.name,
      startedAt: a.startedAt,
    })),
  });
});

function serializeAttempt(attempt, exercise = null) {
  return {
    id: attempt.id,
    status: attempt.status,
    demarche: attempt.demarche,
    reponse: attempt.reponse,
    note: attempt.note,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    ...(exercise
      ? {
          exercise: {
            id: exercise.id,
            title: exercise.title,
            enonce: exercise.enonce,
            dureeSecondes: exercise.dureeSecondes,
            points: exercise.points,
          },
          deadline: new Date(attempt.startedAt.getTime() + exercise.dureeSecondes * 1000).toISOString(),
        }
      : {}),
  };
}
