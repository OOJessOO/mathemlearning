# MathemLearning

Plateforme fullstack d'entraînement aux mathématiques pour lycéens et universitaires.
L'utilisateur choisit une branche (limites, dérivées, intégrales…), résout un exercice dans
un temps limité en rédigeant ses démarches dans un éditeur mathématique, puis reçoit une
**correction automatique notée** — comme avec un professeur, mais en génération automatique.

## Fonctionnalités

- **Deux catégories d'utilisateurs** :
  - Lycéen : 1ère Scientifique (Série C) et Terminale Scientifique (Série C)
  - Universitaire : L1 → L5 (du 1er au 5ème degré)
- **Choix d'une branche** des mathématiques (chaque branche est filtrée selon la catégorie)
- **Exercices ciblés par niveau** (chaque exercice appartient à un niveau précis)
- **Flux d'entraînement** :
  1. L'énoncé est affiché
  2. L'utilisateur rédige ses démarches étape par étape dans une zone d'édition
  3. Il saisit son **résultat final** dans un éditeur mathématique WYSIWYG
  4. Un **compte à rebours** limite le temps (soumission automatique à l'expiration)
  5. Bouton **Abandonner** (avec confirmation) → correction visible, note 0
  6. Après le délai : **correction** + **note automatique**
- **Correction automatique** par moteur de calcul symbolique :
  - comparaison exacte des expressions (LaTeX) : `\frac{1}{2}` = `0.5`, `e`, `\infty`, `-\infty`, `DNE` (limite n'existant pas)
- **Historique** des tentatives avec notes
- **Progression gamifiée** :
  - Chaque exercice rapporte des points sur réussite
  - Les exercices sont débloqués progressivement (`unlockPoints` — points cumulés requis)
  - Niveau calculé à partir des points (niveau = `1 + points/100`), série (streak) de jours consécutifs
  - Dashboard personnel : niveau, série, taux de réussite et barre de progression vers le niveau suivant
- **Interface type app** : design soigné (thème sombre à damier façon app d'échecs), entièrement responsive (Android/mobile)
- **Profil personnel** : page de profil avec photo de profil (recadrage/redimensionnement automatique côté client), affichée dans la barre de navigation

## Stack technique

| Couche | Technologie |
| --- | --- |
| Frontend (View) | React 18 + Vite, React Router |
| Édition mathématique | MathLive (éditeur WYSIWYG type MathEditor, sortie LaTeX) |
| Rendu mathématique | KaTeX |
| Backend (Controller/Model) | Node.js + Express (architecture MVC) |
| ORM / Modèles | Prisma |
| Base de données | PostgreSQL |
| Correction automatique | @cortex-js/compute-engine (calcul symbolique) |
| Authentification | JWT + bcrypt |

## Architecture MVC

```
backend/src/
├── routes/          → Dispatcher (URL → controller)
├── controllers/     → Couche C : requête/réponse, validation, sérialisation
├── models/          → Couche M : accès aux données (encapsule Prisma)
│   ├── user.model.js
│   ├── branch.model.js
│   ├── exercise.model.js
│   └── attempt.model.js
├── middleware/      → Auth JWT
├── utils/           → grading.js (moteur de correction), progress.js (niveau + streak)
└── config/          → Prisma Client

frontend/src/        → Couche V : React (pages, composants, contexte auth)
```

## Modèle de données

- `User` : email, mot de passe (hashé), rôle (`LYCEE` | `UNIVERSITAIRE`), niveau (`PREMIERE_C`, `TERMINALE_C`, `L1`…`L5`), `avatarUrl` (photo de profil)
- `Branch` : branche des mathématiques, liée à une catégorie (slug unique par catégorie)
- `Exercise` : titre, énoncé (LaTeX `$...$`), durée (secondes), points, réponse attendue (LaTeX), correction, niveau ciblé, `unlockPoints` (déblocage)
- `Attempt` : tentative d'un utilisateur — statut (`EN_COURS` | `TERMINE` | `ABANDONNE`), démarches, réponse, note, horodatage

> Le seed insère **93 exercices** répartis sur **12 branches** avec des `unlockPoints` de 0 à 400,
> couvrant tous les niveaux (Première C → L5).

## Prérequis

- Node.js ≥ 20
- PostgreSQL (ce projet utilise un cluster local sur le port **5433**, voir ci-dessous)

## Installation et démarrage

### 1. Base de données (cluster local dédié)

Le cluster PostgreSQL vit à la racine du projet (dossiers `.pgdata/` et `.pgsocket/`,
déjà initialisés sur cette machine). Pour le démarrer :

```bash
# à la racine du projet mathemlearning/
/usr/lib/postgresql/18/bin/pg_ctl -D .pgdata \
  -o "-p 5433 -k $PWD/.pgsocket -c listen_addresses=localhost" \
  -l .pgdata/server.log start
```

Pour recréer le cluster depuis zéro :

```bash
mkdir -p .pgdata .pgsocket
/usr/lib/postgresql/18/bin/initdb -D .pgdata -U mathemlearning -A scram-sha-256 \
  --pwfile=<(echo "mathemlearning_dev") -E UTF8
/usr/lib/postgresql/18/bin/pg_ctl -D .pgdata \
  -o "-p 5433 -k $PWD/.pgsocket -c listen_addresses=localhost" \
  -l .pgdata/server.log start
PGPASSWORD=mathemlearning_dev psql -h $PWD/.pgsocket -p 5433 -U mathemlearning \
  -d postgres -c "CREATE DATABASE mathemlearning;"
```

> L'URL de connexion est définie dans `backend/.env`.

### 2. Backend

```bash
cd backend
npm install
npx prisma db push     # synchronise le schéma + génère le client
npx prisma db seed     # branches + exercices
npm run dev            # API sur http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 (proxy /api vers le backend)
```

Ouvrez **http://localhost:5173** dans le navigateur.

## API (résumé)

| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Inscription (rôle + niveau validés) |
| POST | `/api/auth/login` | Connexion → JWT |
| GET | `/api/auth/me` | Profil connecté |
| PUT | `/api/auth/avatar` | Mettre à jour la photo de profil (data URL, ≤ 500 Ko) |
| GET | `/api/branches` | Branches selon la catégorie de l'utilisateur |
| GET | `/api/exercises?branch=slug` | Exercices selon le niveau (+ branche) |
| GET | `/api/exercises/:id` | Détail d'un exercice |
| POST | `/api/attempts/start/:exerciseId` | Démarrer/reprendre une tentative |
| GET | `/api/attempts/:id` | État d'une tentative (deadline incluse) |
| PUT | `/api/attempts/:id/submit` | Soumettre → correction + note |
| PUT | `/api/attempts/:id/abandon` | Abandonner |
| GET | `/api/attempts/:id/result` | Résultat + correction |
| GET | `/api/attempts/history` | Historique des tentatives |
| GET | `/api/stats` | Progression : niveau, points, série (streak), taux de réussite |

## Formats de réponse attendus

La réponse finale est saisie dans l'éditeur MathLive et comparée à la réponse attendue
(stockée en LaTeX dans la colonne `expectedAnswer` de l'exercice). Valeurs spéciales :

- `\infty` et `-\infty` pour les limites infinies
- `DNE` lorsque la limite n'existe pas
- toute expression LaTeX évaluable (nombres, `e`, fractions, racines…)

## Prochaines étapes envisagées

- Correction partielle des démarches (note sur le raisonnement, pas seulement le résultat)
- Générateur d'exercices aléatoires
- Dashboard d'administration pour créer les exercices en ligne
