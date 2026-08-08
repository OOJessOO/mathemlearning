import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const branches = [
  { name: 'Limites de fonctions', slug: 'limites', categorie: 'LYCEE', order: 1 },
  { name: 'Dérivation', slug: 'derivation', categorie: 'LYCEE', order: 2 },
  { name: 'Suites numériques', slug: 'suites', categorie: 'LYCEE', order: 3 },
  { name: 'Intégrales', slug: 'integrales', categorie: 'LYCEE', order: 4 },
  { name: 'Étude de fonctions', slug: 'fonctions', categorie: 'LYCEE', order: 5 },
  { name: 'Limites', slug: 'limites', categorie: 'UNIVERSITAIRE', order: 1 },
  { name: 'Dérivabilité', slug: 'derivabilite', categorie: 'UNIVERSITAIRE', order: 2 },
  { name: 'Intégrales', slug: 'integrales', categorie: 'UNIVERSITAIRE', order: 3 },
  { name: 'Suites', slug: 'suites', categorie: 'UNIVERSITAIRE', order: 4 },
  { name: 'Séries numériques', slug: 'series', categorie: 'UNIVERSITAIRE', order: 5 },
  { name: 'Équations différentielles', slug: 'equations-differentielles', categorie: 'UNIVERSITAIRE', order: 6 },
  { name: 'Algèbre linéaire', slug: 'algebre-lineaire', categorie: 'UNIVERSITAIRE', order: 7 },
];

const LYCEE = 'LYCEE';
const UNI = 'UNIVERSITAIRE';

function ex(title, enonce, expectedAnswer, correction, niveau, categorie, branchSlug, unlock) {
  return { title, enonce, expectedAnswer, correction, niveau, categorie, branchSlug, unlock };
}

const exercises = [
  // ===================== LYCÉE : LIMITES =====================
  // ---- 1ère C ----
  ex('Limite d’une fonction rationnelle', 'Déterminer $\\displaystyle\\lim_{x\\to 2}\\frac{x^2-4}{x-2}$.', '4',
    'On factorise : $\\frac{x^2-4}{x-2} = \\frac{(x-2)(x+2)}{x-2} = x+2$. Donc $\\lim_{x\\to 2}\\frac{x^2-4}{x-2} = 4$.',
    'PREMIERE_C', LYCEE, 'limites', 0),
  ex('Limite trigonométrique fondamentale', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\sin x}{x}$.', '1',
    'Limite fondamentale : $\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1$.',
    'PREMIERE_C', LYCEE, 'limites', 100),
  ex('Limite et opérations', 'Déterminer $\\displaystyle\\lim_{x\\to 3}\\frac{x^2-9}{x-3}$.', '6',
    'On factorise : $\\frac{x^2-9}{x-3} = \\frac{(x-3)(x+3)}{x-3} = x+3$, donc la limite vaut $3+3 = 6$.',
    'PREMIERE_C', LYCEE, 'limites', 200),
  // ---- Terminale C ----
  ex('Limite à l’infini', 'Déterminer $\\displaystyle\\lim_{x\\to +\\infty}\\frac{3x^2+2}{x^2-1}$.', '3',
    'On factorise par le terme dominant : $\\frac{3x^2+2}{x^2-1} = \\frac{3+\\frac{2}{x^2}}{1-\\frac{1}{x^2}} \\to 3$.',
    'TERMINALE_C', LYCEE, 'limites', 0),
  ex('Limite et racines', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\sqrt{1+x}-1}{x}$.', '\\frac{1}{2}',
    'On multiplie par la quantité conjuguée : $\\frac{(\\sqrt{1+x}-1)(\\sqrt{1+x}+1)}{x(\\sqrt{1+x}+1)} = \\frac{x}{x(\\sqrt{1+x}+1)} \\to \\frac{1}{2}$.',
    'TERMINALE_C', LYCEE, 'limites', 100),
  ex('Limite avec changement de variable', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\sin(3x)}{x}$.', '3',
    'On écrit $\\frac{\\sin(3x)}{x} = 3\\cdot\\frac{\\sin(3x)}{3x} \\to 3\\times 1 = 3$.',
    'TERMINALE_C', LYCEE, 'limites', 200),

  // ===================== LYCÉE : DÉRIVATION =====================
  // ---- 1ère C ----
  ex('Nombre dérivé — fonction carré', 'Déterminer $\\displaystyle\\lim_{h\\to 0}\\frac{(1+h)^2-1}{h}$.', '2',
    'C’est le nombre dérivé de $x\\mapsto x^2$ en $1$, soit $2\\times 1 = 2$.',
    'PREMIERE_C', LYCEE, 'derivation', 0),
  ex('Nombre dérivé — fonction inverse', 'Déterminer $\\displaystyle\\lim_{h\\to 0}\\frac{\\frac{1}{1+h}-1}{h}$.', '-1',
    'C’est le nombre dérivé de $x\\mapsto \\frac{1}{x}$ en $1$, soit $-\\frac{1}{1^2} = -1$.',
    'PREMIERE_C', LYCEE, 'derivation', 100),
  ex('Nombre dérivé — racine carrée', 'Déterminer $\\displaystyle\\lim_{h\\to 0}\\frac{\\sqrt{4+h}-2}{h}$.', '\\frac{1}{4}',
    'C’est le nombre dérivé de $\\sqrt{x}$ en $4$, soit $\\frac{1}{2\\sqrt{4}} = \\frac{1}{4}$.',
    'PREMIERE_C', LYCEE, 'derivation', 200),
  // ---- Terminale C ----
  ex('Dérivée d’un produit', 'Soit $f(x)=x e^x$. Déterminer $f\'(0)$.', '1',
    '$f\'(x) = e^x + x e^x$, donc $f\'(0) = 1 + 0 = 1$.',
    'TERMINALE_C', LYCEE, 'derivation', 0),
  ex('Dérivée d’un quotient', 'Soit $f(x)=\\frac{x}{x+1}$. Déterminer $f\'(1)$.', '\\frac{1}{4}',
    '$f\'(x) = \\frac{(x+1)-x}{(x+1)^2} = \\frac{1}{(x+1)^2}$, donc $f\'(1) = \\frac{1}{4}$.',
    'TERMINALE_C', LYCEE, 'derivation', 100),
  ex('Dérivée d’une fonction composée', 'Soit $f(x)=\\sin(2x)$. Déterminer $f\'(0)$.', '2',
    '$f\'(x) = 2\\cos(2x)$, donc $f\'(0) = 2\\cos 0 = 2$.',
    'TERMINALE_C', LYCEE, 'derivation', 200),

  // ===================== LYCÉE : SUITES NUMÉRIQUES =====================
  // ---- 1ère C ----
  ex('Suite arithmétique', 'Soit $(u_n)$ la suite arithmétique définie par $u_0=1$ et $u_{n+1}=u_n+3$. Déterminer $u_{10}$.', '31',
    'Une suite arithmétique de raison $3$ vérifie $u_n = u_0 + 3n$, donc $u_{10} = 1 + 30 = 31$.',
    'PREMIERE_C', LYCEE, 'suites', 0),
  ex('Suite géométrique', 'Soit $(u_n)$ la suite géométrique définie par $u_0=3$ et $u_{n+1}=2u_n$. Déterminer $u_5$.', '96',
    'Une suite géométrique de raison $2$ vérifie $u_n = u_0\\times 2^n$, donc $u_5 = 3\\times 32 = 96$.',
    'PREMIERE_C', LYCEE, 'suites', 100),
  ex('Limite d’une suite géométrique', 'Déterminer $\\displaystyle\\lim_{n\\to +\\infty}\\left(\\frac{1}{2}\\right)^n$.', '0',
    'Comme $\\frac{1}{2} \\in ]-1;1[$, la suite géométrique de raison $\\frac{1}{2}$ converge vers $0$.',
    'PREMIERE_C', LYCEE, 'suites', 200),
  // ---- Terminale C ----
  ex('Somme géométrique', 'Déterminer $\\displaystyle\\lim_{n\\to +\\infty}\\left(1+\\frac{1}{2}+\\frac{1}{4}+\\cdots+\\frac{1}{2^n}\\right)$.', '2',
    'La somme vaut $\\frac{1-(1/2)^{n+1}}{1-1/2}$, dont la limite est $\\frac{1}{1/2} = 2$.',
    'TERMINALE_C', LYCEE, 'suites', 0),
  ex('Limite d’une suite rationnelle', 'Déterminer $\\displaystyle\\lim_{n\\to +\\infty}\\frac{2n+1}{n-1}$.', '2',
    'Le rapport des termes dominants donne $\\frac{2n}{n} \\to 2$.',
    'TERMINALE_C', LYCEE, 'suites', 100),
  ex('Suite récurrente', 'Soit $(u_n)$ définie par $u_0=0$ et $u_{n+1}=\\frac{1}{2}u_n+1$. Déterminer sa limite. On supposera qu’elle converge vers $l$.', '2',
    'À la limite, $l = \\frac{1}{2}l + 1$, donc $l = 2$.',
    'TERMINALE_C', LYCEE, 'suites', 200),

  // ===================== LYCÉE : INTÉGRALES =====================
  // ---- Terminale C ----
  ex('Intégrale d’un polynôme', 'Déterminer $\\displaystyle\\int_0^1 x^2\\,dx$.', '\\frac{1}{3}',
    'Une primitive de $x^2$ est $\\frac{x^3}{3}$, donc $\\int_0^1 x^2\\,dx = \\frac{1}{3}$.',
    'TERMINALE_C', LYCEE, 'integrales', 0),
  ex('Intégrale du sinus', 'Déterminer $\\displaystyle\\int_0^{\\pi} \\sin x\\,dx$.', '2',
    'Une primitive de $\\sin x$ est $-\\cos x$, donc $\\int_0^{\\pi}\\sin x\\,dx = [-\\cos x]_0^{\\pi} = 1+1 = 2$.',
    'TERMINALE_C', LYCEE, 'integrales', 100),
  ex('Intégrale du logarithme', 'Déterminer $\\displaystyle\\int_1^2 \\frac{1}{x}\\,dx$.', '\\ln(2)',
    'Une primitive de $\\frac{1}{x}$ est $\\ln x$, donc $\\int_1^2 \\frac{1}{x}\\,dx = \\ln 2$.',
    'TERMINALE_C', LYCEE, 'integrales', 200),

  // ===================== LYCÉE : ÉTUDE DE FONCTIONS =====================
  // ---- 1ère C ----
  ex('Extremum d’un trinôme', 'Soit $f(x)=x^2-4x+3$. Déterminer la valeur minimale de $f$ sur $\\mathbb{R}$.', '-1',
    'Le trinôme a un minimum en $x=2$ (sommet), et $f(2) = 4-8+3 = -1$.',
    'PREMIERE_C', LYCEE, 'fonctions', 0),
  ex('Maximum d’une fonction', 'Soit $f(x)=-x^2+4$. Déterminer la valeur maximale de $f$ sur $\\mathbb{R}$.', '4',
    'Le maximum est atteint en $x=0$ et vaut $f(0) = 4$.',
    'PREMIERE_C', LYCEE, 'fonctions', 100),
  ex('Limite d’un polynôme', 'Déterminer $\\displaystyle\\lim_{x\\to +\\infty}(x^3-2x)$.', '\\infty',
    'Le terme dominant est $x^3$, donc $x^3-2x \\sim x^3 \\to +\\infty$.',
    'PREMIERE_C', LYCEE, 'fonctions', 200),
  // ---- Terminale C ----
  ex('Extremum local', 'Soit $f(x)=x^3-3x$. Déterminer le minimum local de $f$ (sur $\\mathbb{R}$).', '-2',
    '$f\'(x)=3x^2-3$ s’annule en $x=1$ (minimum local) et $f(1) = 1-3 = -2$.',
    'TERMINALE_C', LYCEE, 'fonctions', 0),
  ex('Asymptote horizontale', 'Soit $f(x)=\\frac{2x-1}{x+1}$. Déterminer la limite de $f$ en $+\\infty$ (équation de l’asymptote horizontale).', '2',
    'Le rapport des termes dominants donne $\\frac{2x}{x} \\to 2$ : asymptote horizontale $y=2$.',
    'TERMINALE_C', LYCEE, 'fonctions', 100),
  ex('Dérivée seconde', 'Soit $f(x)=x^3$. En quel point $f\'\'(x)$ s’annule-t-elle ?', '0',
    '$f\'\'(x) = 6x$, donc $f\'\'$ s’annule en $x=0$ (point d’inflexion).',
    'TERMINALE_C', LYCEE, 'fonctions', 200),

  // ===================== UNIVERSITÉ : LIMITES =====================
  // ---- L1 ----
  ex('Limite avec cosinus', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{1-\\cos x}{x^2}$.', '\\frac{1}{2}',
    'Développement limité : $1-\\cos x = \\frac{x^2}{2} + o(x^2)$, donc le rapport tend vers $\\frac{1}{2}$.',
    'L1', UNI, 'limites', 0),
  ex('Limite de fonction rationnelle à l’infini', 'Déterminer $\\displaystyle\\lim_{x\\to +\\infty}\\frac{x^3 - 2x}{x^3 + 1}$.', '1',
    'Le rapport des termes dominants donne $\\frac{x^3}{x^3} \\to 1$.',
    'L1', UNI, 'limites', 100),
  ex('Limite avec un coefficient', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\sin(2x)}{x}$.', '2',
    'On écrit $\\frac{\\sin(2x)}{x} = 2\\cdot\\frac{\\sin(2x)}{2x} \\to 2$.',
    'L1', UNI, 'limites', 200),
  // ---- L2 ----
  ex('Limite logarithmique', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\ln(1+x)}{x}$.', '1',
    'On reconnaît la dérivée de $\\ln$ en $1$ : $\\lim_{x\\to 0}\\frac{\\ln(1+x)}{x} = 1$.',
    'L2', UNI, 'limites', 0),
  ex('Croissance comparée', 'Déterminer $\\displaystyle\\lim_{x\\to +\\infty} x e^{-x}$.', '0',
    'L’exponentielle l’emporte sur toute puissance : $x e^{-x} = \\frac{x}{e^x} \\to 0$.',
    'L2', UNI, 'limites', 100),
  ex('Limite exponentielle', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{e^{2x}-1}{x}$.', '2',
    'C’est la dérivée de $e^{2x}$ en $0$ : $2e^{0} = 2$.',
    'L2', UNI, 'limites', 200),
  // ---- L3 ----
  ex('Développement limité', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{e^x - 1 - x}{x^2}$.', '\\frac{1}{2}',
    'DL : $e^x = 1 + x + \\frac{x^2}{2} + o(x^2)$, donc $\\frac{e^x-1-x}{x^2} \\to \\frac{1}{2}$.',
    'L3', UNI, 'limites', 0),
  ex('Limite logarithmique à l’infini', 'Déterminer $\\displaystyle\\lim_{x\\to +\\infty}\\frac{\\ln x}{x}$.', '0',
    'Croissance comparée : $\\frac{\\ln x}{x} \\to 0$.',
    'L3', UNI, 'limites', 100),
  ex('Limite de la tangente', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\tan x}{x}$.', '1',
    'On écrit $\\frac{\\tan x}{x} = \\frac{\\sin x}{x}\\cdot\\frac{1}{\\cos x} \\to 1$.',
    'L3', UNI, 'limites', 200),
  // ---- L4 ----
  ex('Limite avec logarithme et produit', 'Déterminer $\\displaystyle\\lim_{x\\to 0^+} x\\ln x$.', '0',
    'Croissance comparée : $x\\ln x \\to 0$ quand $x\\to 0^+$.',
    'L4', UNI, 'limites', 100),
  ex('Limite de suite', 'Déterminer $\\displaystyle\\lim_{n\\to +\\infty}\\left(1+\\frac{1}{n}\\right)^n$.', 'e',
    'Par définition, cette limite est le nombre $e$.',
    'L4', UNI, 'limites', 200),
  ex('Exponentielle contre polynôme', 'Déterminer $\\displaystyle\\lim_{x\\to +\\infty} x^2 e^{-x}$.', '0',
    'Croissance comparée : $x^2 e^{-x} = \\frac{x^2}{e^x} \\to 0$.',
    'L4', UNI, 'limites', 300),
  // ---- L5 ----
  ex('Limite arctangente', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\arctan x}{x}$.', '1',
    '$\\arctan x \\sim x$ en $0$, donc le rapport tend vers $1$.',
    'L5', UNI, 'limites', 200),
  ex('Limite d’ordre supérieur', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\sin x - x}{x^3}$.', '-\\frac{1}{6}',
    'DL : $\\sin x = x - \\frac{x^3}{6} + o(x^3)$, donc $\\frac{\\sin x - x}{x^3} \\to -\\frac{1}{6}$.',
    'L5', UNI, 'limites', 300),
  ex('DL d’ordre 3', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{e^x - 1 - x - \\frac{x^2}{2}}{x^3}$.', '\\frac{1}{6}',
    'DL : $e^x = 1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+o(x^3)$, donc la limite vaut $\\frac{1}{6}$.',
    'L5', UNI, 'limites', 400),

  // ===================== UNIVERSITÉ : DÉRIVABILITÉ =====================
  // ---- L1 ----
  ex('Taux d’accroissement de l’exponentielle', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{e^x-1}{x}$.', '1',
    'C’est le nombre dérivé de $e^x$ en $0$ : $e^0 = 1$.',
    'L1', UNI, 'derivabilite', 0),
  ex('Taux d’accroissement du cosinus', 'Déterminer $\\displaystyle\\lim_{x\\to 0}\\frac{\\cos x - 1}{x}$.', '0',
    'C’est le nombre dérivé de $\\cos x$ en $0$ : $-\\sin 0 = 0$.',
    'L1', UNI, 'derivabilite', 100),
  ex('Dérivabilité en 0', 'Soit $f(0)=0$ et $f(x)=x^2\\sin\\left(\\frac{1}{x}\\right)$ pour $x\\ne 0$. Déterminer $f\'(0)$.', '0',
    'Le taux d’accroissement vaut $\\frac{f(h)-f(0)}{h} = h\\sin\\left(\\frac{1}{h}\\right) \\to 0$. Donc $f\'(0)=0$.',
    'L1', UNI, 'derivabilite', 200),
  // ---- L2 ----
  ex('Dérivée du logarithme en 1', 'Soit $f(x)=\\ln(1+x)$. Déterminer $f\'(0)$.', '1',
    '$f\'(x) = \\frac{1}{1+x}$, donc $f\'(0) = 1$.',
    'L2', UNI, 'derivabilite', 0),
  ex('Dérivée de la racine', 'Soit $f(x)=\\sqrt{1+x}$. Déterminer $f\'(0)$.', '\\frac{1}{2}',
    '$f\'(x) = \\frac{1}{2\\sqrt{1+x}}$, donc $f\'(0) = \\frac{1}{2}$.',
    'L2', UNI, 'derivabilite', 100),
  ex('Dérivée d’un produit', 'Soit $f(x)=x\\ln x - x$. Déterminer $f\'(e)$.', '1',
    '$f\'(x) = \\ln x$, donc $f\'(e) = \\ln e = 1$.',
    'L2', UNI, 'derivabilite', 200),
  // ---- L3 ----
  ex('Dérivée seconde', 'Soit $f(x)=x e^x$. Déterminer $f\'\'(0)$.', '2',
    '$f\'(x) = e^x(1+x)$ et $f\'\'(x) = e^x(x+2)$, donc $f\'\'(0) = 2$.',
    'L3', UNI, 'derivabilite', 0),
  ex('Théorème des accroissements finis', 'Soit $f(x)=x^2$ sur $[0;1]$. Trouver $c\\in]0;1[$ tel que $f(1)-f(0)=f\'(c)$.', '\\frac{1}{2}',
    '$f(1)-f(0)=1$ et $f\'(c)=2c$. On résout $2c=1$, donc $c=\\frac{1}{2}$.',
    'L3', UNI, 'derivabilite', 100),
  ex('Dérivée d’un produit trigonométrique', 'Soit $f(x)=x\\sin x$. Déterminer $f\'(\\pi)$.', '-\\pi',
    '$f\'(x) = \\sin x + x\\cos x$, donc $f\'(\\pi) = 0 + \\pi\\times(-1) = -\\pi$.',
    'L3', UNI, 'derivabilite', 200),

  // ===================== UNIVERSITÉ : INTÉGRALES =====================
  // ---- L1 ----
  ex('Intégrale de l’exponentielle', 'Déterminer $\\displaystyle\\int_0^1 e^x\\,dx$.', 'e-1',
    '$\\int_0^1 e^x\\,dx = [e^x]_0^1 = e - 1$.',
    'L1', UNI, 'integrales', 0),
  ex('Intégrale du sinus', 'Déterminer $\\displaystyle\\int_0^{\\pi}\\sin x\\,dx$.', '2',
    '$\\int_0^{\\pi}\\sin x\\,dx = [-\\cos x]_0^{\\pi} = 2$.',
    'L1', UNI, 'integrales', 100),
  ex('Intégration par parties', 'Déterminer $\\displaystyle\\int_0^1 x e^x\\,dx$.', '1',
    'IPP : $[x e^x]_0^1 - \\int_0^1 e^x\\,dx = e - (e-1) = 1$.',
    'L1', UNI, 'integrales', 200),
  // ---- L2 ----
  ex('Intégrale généralisée du logarithme', 'Déterminer $\\displaystyle\\int_0^1 \\ln x\\,dx$.', '-1',
    'Une primitive de $\\ln x$ est $x\\ln x - x$, donc $\\int_0^1\\ln x\\,dx = [-1] = -1$.',
    'L2', UNI, 'integrales', 0),
  ex('Intégrale par changement de variable', 'Déterminer $\\displaystyle\\int_0^1 \\frac{x}{x^2+1}\\,dx$.', '\\frac{1}{2}\\ln 2',
    'Avec $u=x^2+1$, $\\frac{x}{x^2+1}\\,dx = \\frac{1}{2}\\frac{du}{u}$, d’où $\\frac{1}{2}[\\ln u]_1^2 = \\frac{1}{2}\\ln 2$.',
    'L2', UNI, 'integrales', 100),
  ex('Intégration par parties trigonométrique', 'Déterminer $\\displaystyle\\int_0^{\\pi} x\\sin x\\,dx$.', '\\pi',
    'IPP : $[-x\\cos x]_0^{\\pi} + \\int_0^{\\pi}\\cos x\\,dx = \\pi + 0 = \\pi$.',
    'L2', UNI, 'integrales', 200),
  // ---- L3 ----
  ex('Intégrale de la fonction arctangente', 'Déterminer $\\displaystyle\\int_0^1 \\frac{1}{1+x^2}\\,dx$.', '\\frac{\\pi}{4}',
    'Une primitive de $\\frac{1}{1+x^2}$ est $\\arctan x$, donc $\\int_0^1\\frac{1}{1+x^2}\\,dx = \\arctan 1 = \\frac{\\pi}{4}$.',
    'L3', UNI, 'integrales', 0),
  ex('Intégrale généralisée convergente', 'Déterminer $\\displaystyle\\int_0^{+\\infty} e^{-x}\\,dx$.', '1',
    'L’intégrale converge et $\\int_0^{+\\infty} e^{-x}\\,dx = \\lim_{A\\to+\\infty}[-e^{-x}]_0^A = 1$.',
    'L3', UNI, 'integrales', 100),
  ex('Intégrale avec arctangente', 'Déterminer $\\displaystyle\\int_0^1 x\\arctan x\\,dx$.', '\\frac{\\pi}{4}-\\frac{1}{2}',
    'IPP : $\\left[\\frac{x^2}{2}\\arctan x\\right]_0^1 - \\frac{1}{2}\\int_0^1\\left(1-\\frac{1}{1+x^2}\\right)dx = \\frac{\\pi}{8} - \\frac{1}{2} + \\frac{\\pi}{8} = \\frac{\\pi}{4}-\\frac{1}{2}$.',
    'L3', UNI, 'integrales', 200),

  // ===================== UNIVERSITÉ : SUITES =====================
  // ---- L1 ----
  ex('Terme général', 'Soit $u_n = n^2+3n+1$. Déterminer $u_{10}$.', '131',
    '$u_{10} = 100 + 30 + 1 = 131$.',
    'L1', UNI, 'suites', 0),
  ex('Suite géométrique convergente', 'Déterminer $\\displaystyle\\lim_{n\\to+\\infty} 3\\times\\left(\\frac{1}{3}\\right)^n$.', '0',
    'Comme $\\frac{1}{3} \\in ]-1;1[$, la limite est $0$.',
    'L1', UNI, 'suites', 100),
  ex('Suite rationnelle', 'Déterminer $\\displaystyle\\lim_{n\\to+\\infty}\\frac{2n+1}{3n-1}$.', '\\frac{2}{3}',
    'Le rapport des termes dominants donne $\\frac{2n}{3n} \\to \\frac{2}{3}$.',
    'L1', UNI, 'suites', 200),
  // ---- L2 ----
  ex('Suite récurrente affine', 'Soit $(u_n)$ définie par $u_0=0$ et $u_{n+1}=\\frac{1}{2}u_n+1$. Déterminer sa limite. On supposera qu’elle converge vers $l$.', '2',
    'À la limite, $l = \\frac{1}{2}l + 1$, donc $l = 2$.',
    'L2', UNI, 'suites', 0),
  ex('Croissance comparée', 'Déterminer $\\displaystyle\\lim_{n\\to+\\infty}\\frac{n}{2^n}$.', '0',
    'L’exponentielle (de base $2^n = e^{n\\ln 2}$) l’emporte sur la puissance : la limite est $0$.',
    'L2', UNI, 'suites', 100),
  ex('Suite récurrente homographique', 'Soit $(u_n)$ définie par $u_0=1$ et $u_{n+1}=\\frac{u_n}{u_n+1}$. Déterminer sa limite.', '0',
    'On montre par récurrence que $u_n = \\frac{1}{n+1}$, donc la limite est $0$.',
    'L2', UNI, 'suites', 200),

  // ===================== UNIVERSITÉ : SÉRIES NUMÉRIQUES =====================
  // ---- L2 ----
  ex('Série géométrique', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 0}\\left(\\frac{1}{2}\\right)^n$.', '2',
    'Série géométrique de raison $\\frac{1}{2}$ : somme $= \\frac{1}{1-1/2} = 2$.',
    'L2', UNI, 'series', 0),
  ex('Série télescopique', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 1}\\frac{1}{n(n+1)}$.', '1',
    'On a $\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$, somme télescopique $= 1$.',
    'L2', UNI, 'series', 100),
  ex('Série géométrique (raison 1/3)', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 0}\\left(\\frac{1}{3}\\right)^n$.', '\\frac{3}{2}',
    'Série géométrique : $\\frac{1}{1-1/3} = \\frac{3}{2}$.',
    'L2', UNI, 'series', 200),
  // ---- L3 ----
  ex('Série géométrique (raison 2/3)', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 0}\\left(\\frac{2}{3}\\right)^n$.', '3',
    'Série géométrique : $\\frac{1}{1-2/3} = 3$.',
    'L3', UNI, 'series', 0),
  ex('Série géométrique alternée', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 0}\\frac{(-1)^n}{3^n}$.', '\\frac{3}{4}',
    'Série géométrique de raison $-\\frac{1}{3}$ : $\\frac{1}{1+1/3} = \\frac{3}{4}$.',
    'L3', UNI, 'series', 100),
  ex('Série dérivée', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 1}\\frac{n}{2^n}$.', '2',
    'Rappel : $\\sum_{n\\ge 1} n x^n = \\frac{x}{(1-x)^2}$ pour $|x|<1$. En $x=\\frac{1}{2}$, la somme vaut $2$.',
    'L3', UNI, 'series', 200),
  // ---- L4 ----
  ex('Série télescopique d’ordre 3', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 1}\\frac{1}{n(n+1)(n+2)}$.', '\\frac{1}{4}',
    'On décompose : $\\frac{1}{n(n+1)(n+2)} = \\frac{1}{2}\\left(\\frac{1}{n(n+1)}-\\frac{1}{(n+1)(n+2)}\\right)$, somme $= \\frac{1}{4}$.',
    'L4', UNI, 'series', 100),
  ex('Série géométrique dérivée', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 1}\\frac{n}{3^n}$.', '\\frac{3}{4}',
    'En $x=\\frac{1}{3}$ dans $\\sum n x^n = \\frac{x}{(1-x)^2}$, on obtient $\\frac{1/3}{4/9} = \\frac{3}{4}$.',
    'L4', UNI, 'series', 200),
  ex('Série combinée', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 0}\\frac{2n+1}{2^n}$.', '6',
    'On sépare : $2\\sum\\frac{n}{2^n} + \\sum\\frac{1}{2^n} = 2\\times 2 + 2 = 6$.',
    'L4', UNI, 'series', 300),
  // ---- L5 ----
  ex('Série des carrés', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 0}\\frac{n^2}{2^n}$.', '6',
    'Rappel : $\\sum_{n\\ge 0} n^2 x^n = \\frac{x(1+x)}{(1-x)^3}$. En $x=\\frac{1}{2}$ : $\\frac{3/4}{1/8} = 6$.',
    'L5', UNI, 'series', 200),
  ex('Série des inverses impairs', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 1}\\frac{1}{(2n-1)(2n+1)}$.', '\\frac{1}{2}',
    'On décompose : $\\frac{1}{(2n-1)(2n+1)} = \\frac{1}{2}\\left(\\frac{1}{2n-1}-\\frac{1}{2n+1}\\right)$, somme $= \\frac{1}{2}$.',
    'L5', UNI, 'series', 300),
  ex('Série télescopique simple', 'Déterminer la somme de la série $\\displaystyle\\sum_{n\\ge 0}\\frac{1}{(n+1)(n+2)}$.', '1',
    'On a $\\frac{1}{(n+1)(n+2)} = \\frac{1}{n+1} - \\frac{1}{n+2}$, somme télescopique $= 1$.',
    'L5', UNI, 'series', 400),

  // ===================== UNIVERSITÉ : ÉQUATIONS DIFFÉRENTIELLES =====================
  // ---- L2 ----
  ex('Équation y\'=y', 'Résoudre $y\'=y$ avec $y(0)=1$. Déterminer $y(1)$.', 'e',
    'La solution est $y(x)=e^x$, donc $y(1) = e$.',
    'L2', UNI, 'equations-differentielles', 0),
  ex('Équation y\'+y=0', 'Résoudre $y\'+y=0$ avec $y(0)=2$. Déterminer $y(1)$.', '\\frac{2}{e}',
    'La solution est $y(x)=2e^{-x}$, donc $y(1) = \\frac{2}{e}$.',
    'L2', UNI, 'equations-differentielles', 100),
  ex('Primitive simple', 'Résoudre $y\'=2x$ avec $y(0)=3$. Déterminer $y(1)$.', '4',
    '$y(x) = x^2 + 3$, donc $y(1) = 4$.',
    'L2', UNI, 'equations-differentielles', 200),
  // ---- L3 ----
  ex('Équation y\'\'+y=0', 'Résoudre $y\'\'+y=0$ avec $y(0)=1$ et $y\'(0)=0$. Déterminer $y(\\pi)$.', '-1',
    'La solution est $y(x)=\\cos x$, donc $y(\\pi) = -1$.',
    'L3', UNI, 'equations-differentielles', 0),
  ex('Équation y\'\'-y=0', 'Résoudre $y\'\'-y=0$ avec $y(0)=1$ et $y\'(0)=1$. Déterminer $y(1)$.', 'e',
    'La solution est $y(x)=e^x$, donc $y(1) = e$.',
    'L3', UNI, 'equations-differentielles', 100),
  ex('Équation y\'\'-4y=0', 'Résoudre $y\'\'-4y=0$ avec $y(0)=1$ et $y\'(0)=2$. Déterminer $y(1)$.', 'e^{2}',
    'La solution est $y(x)=e^{2x}$, donc $y(1) = e^2$.',
    'L3', UNI, 'equations-differentielles', 200),

  // ===================== UNIVERSITÉ : ALGÈBRE LINÉAIRE =====================
  // ---- L1 ----
  ex('Déterminant 2×2', 'Déterminer le déterminant de la matrice $A=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$.', '-2',
    'Le déterminant vaut $1\\times 4 - 2\\times 3 = 4 - 6 = -2$.',
    'L1', UNI, 'algebre-lineaire', 0),
  ex('Déterminant d’une matrice diagonale', 'Déterminer le déterminant de $A=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$.', '6',
    'Le déterminant d’une matrice diagonale est le produit des termes : $2\\times 3 = 6$.',
    'L1', UNI, 'algebre-lineaire', 100),
  ex('Système linéaire', 'Résoudre le système $\\begin{cases}x+y=3\\\\x-y=1\\end{cases}$. Donner la valeur de $x$.', '2',
    'En additionnant les deux équations : $2x = 4$, donc $x = 2$ (et $y=1$).',
    'L1', UNI, 'algebre-lineaire', 200),
  // ---- L2 ----
  ex('Déterminant triangulaire', 'Déterminer le déterminant de $A=\\begin{pmatrix}1&2&3\\\\0&1&2\\\\0&0&1\\end{pmatrix}$.', '1',
    'Le déterminant d’une matrice triangulaire est le produit des termes diagonaux : $1$.',
    'L2', UNI, 'algebre-lineaire', 0),
  ex('Rang d’une matrice', 'Déterminer le rang de $A=\\begin{pmatrix}1&2\\\\2&4\\end{pmatrix}$.', '1',
    'Les deux lignes sont proportionnelles, donc le rang est $1$.',
    'L2', UNI, 'algebre-lineaire', 100),
  ex('Trace d’une matrice', 'Déterminer la trace de $A=\\begin{pmatrix}2&1\\\\3&4\\end{pmatrix}$.', '6',
    'La trace est la somme des termes diagonaux : $2+4 = 6$.',
    'L2', UNI, 'algebre-lineaire', 200),
  // ---- L3 ----
  ex('Déterminant nul', 'Déterminer le déterminant de $A=\\begin{pmatrix}1&2\\\\2&4\\end{pmatrix}$.', '0',
    'Les colonnes sont liées (lignes proportionnelles), donc le déterminant est $0$.',
    'L3', UNI, 'algebre-lineaire', 0),
  ex('Somme des valeurs propres', 'Déterminer la somme des valeurs propres de $A=\\begin{pmatrix}1&1\\\\0&2\\end{pmatrix}$.', '3',
    'La somme des valeurs propres égale la trace : $1+2 = 3$.',
    'L3', UNI, 'algebre-lineaire', 100),
  ex('Déterminant d’un carré', 'Soit $A$ une matrice telle que $\\det(A)=3$. Déterminer $\\det(A^2)$.', '9',
    'On a $\\det(A^2) = \\det(A)^2 = 3^2 = 9$.',
    'L3', UNI, 'algebre-lineaire', 200),
];

async function main() {
  await prisma.exercise.deleteMany();
  await prisma.branch.deleteMany();

  for (const b of branches) {
    await prisma.branch.upsert({
      where: { slug_categorie: { slug: b.slug, categorie: b.categorie } },
      update: b,
      create: b,
    });
  }
  console.log(`Branches : ${branches.length} insérées`);

  for (const e of exercises) {
    const branch = await prisma.branch.findFirst({
      where: { slug: e.branchSlug, categorie: e.categorie },
    });
    if (!branch) {
      console.warn(`Branche introuvable pour ${e.title}`);
      continue;
    }
    await prisma.exercise.create({
      data: {
        title: e.title,
        enonce: e.enonce,
        expectedAnswer: e.expectedAnswer,
        correction: e.correction,
        niveau: e.niveau,
        dureeSecondes: 300,
        points: 20,
        unlockPoints: e.unlock,
        branchId: branch.id,
      },
    });
  }
  console.log(`Exercices : ${exercises.length} insérés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
