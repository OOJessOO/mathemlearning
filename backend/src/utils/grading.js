import { ComputeEngine } from '@cortex-js/compute-engine';

const ce = new ComputeEngine();

function normalizeLatex(latex) {
  return String(latex || '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function gradeAnswer(expectedLatex, answerLatex) {
  const expected = normalizeLatex(expectedLatex);
  const answer = normalizeLatex(answerLatex);

  if (!answer) {
    return { correct: false, reason: 'Aucune réponse fournie' };
  }

  if (/^DNE$/i.test(expected)) {
    const normalized = answer.replace(/\\/g, '').toLowerCase();
    const correct = /(dne|nexiste|indefinie|undefined)/i.test(normalized);
    return {
      correct,
      reason: correct ? 'Bonne réponse : la limite n\u2019existe pas.' : 'La limite existe.',
    };
  }

  try {
    const expE = ce.parse(expected).evaluate();
    const ansE = ce.parse(answer).evaluate();

    if (expE.isInfinity || ansE.isInfinity) {
      const correct =
        expE.isInfinity &&
        ansE.isInfinity &&
        Math.sign(Number(ansE.value)) === Math.sign(Number(expE.value));
      return {
        correct,
        reason: correct ? 'Bonne réponse : limite infinie.' : 'Mauvais signe ou valeur infinie.',
      };
    }

    const symbolic = expE.isEqual(ansE);
    if (symbolic === true) {
      return { correct: true, reason: 'Bonne réponse.' };
    }

    const a = expE.N();
    const b = ansE.N();
    if (a !== undefined && b !== undefined && !a.isNaN && !b.isNaN) {
      const av = Number(a);
      const bv = Number(b);
      const tol = 1e-6;
      const ok = Math.abs(av - bv) <= tol * Math.max(1, Math.abs(av), Math.abs(bv));
      return {
        correct: ok,
        reason: ok ? 'Bonne réponse.' : 'Résultat incorrect.',
      };
    }

    if (symbolic === false) {
      return { correct: false, reason: 'Résultat incorrect.' };
    }
  } catch (err) {
    return { correct: false, reason: 'Réponse invalide (expression non lisible).' };
  }

  return { correct: false, reason: 'Réponse invalide.' };
}
