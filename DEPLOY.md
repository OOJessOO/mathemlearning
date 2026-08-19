# Déploiement gratuit — Render + Neon + Vercel

Guide pas à pas pour déployer MathemLearning en production gratuitement.

| Service | Rôle | Free tier |
|---------|------|-----------|
| **Render** | Backend (API Node.js/Express) | 750 h/mois, spin-down après 15 min d'inactivité |
| **Neon** | Base de données PostgreSQL | 0.5 GB stockage, compute 24/7 |
| **Vercel** | Frontend (React/Vite) | Illimité pour projets perso |

> **Note Render** : Le service gratuit se met en veille après 15 min sans requête.
> Au premier accès, le démarrage prend ~30-60 s (cold start). C'est normal.

---

## Étape 0 — Préparer le repository

Assurez-vous que tout est pushé sur GitHub/GitLab :

```bash
git add .
git commit -m "preparation deploiement"
git push
```

---

## Étape 1 — Neon (base de données PostgreSQL)

1. Aller sur [neon.tech](https://neon.tech) et créer un compte gratuit
2. Cliquer **Create a project**
   - Choisir une région proche de vos utilisateurs (ex: US East)
   - Nom du projet : `mathemlearning`
3. Une fois le projet créé, copier l'**Internal Database URL** (ou External)
   - Cela ressemble à :
     ```
     postgresql://mathemlearning:xxxx@ep-xxx.us-east-2.aws.neon.tech/mathemlearning?sslmode=require
     ```
4. **Sauvegarder cette URL** — elle sera nécessaire pour Render

> Sur Neon free, le compute se suspend après 5 min d'inactivité et redémarre
> automatiquement à la première requête. C'est transparent pour l'app.

---

## Étape 2 — Render (backend API)

### Option A — Blueprint (recommandé, automatique)

1. Aller sur [render.com](https://render.com) et créer un compte
2. Cliquer **New +** → **Blueprint**
3. Connecter votre repository GitHub/GitLab
4. Render détecte le `render.yaml` et configure tout :
   - Le service web `mathemlearning-api`
   - La base de données PostgreSQL `mathemlearning-db`
5. **Avant de finaliser**, modifier la variable `CLIENT_ORIGIN` :
   - Remplacer `https://<your-vercel-app>.vercel.app` par l'URL Vercel finale (voir Étape 3)
   - Ou laisser temporairement et la mettre à jour après
6. Cliquer **Apply**

> Render génère automatiquement le `JWT_SECRET` et la `DATABASE_URL`.

### Option B — Manuel

1. **Créer la base de données** :
   - **New +** → **PostgreSQL**
   - Nom : `mathemlearning`
   - Plan : Free
   - Copier le **Internal Database URL**

2. **Créer le service web** :
   - **New +** → **Web Service**
   - Connecter le repo
   - Configurer :
     - **Name** : `mathemlearning-api`
     - **Root Directory** : `backend`
     - **Runtime** : Node
     - **Build Command** : `npm install`
     - **Start Command** : `npm start`
     - **Health Check Path** : `/api/health`

3. **Ajouter les variables d'environnement** :

   | Clé | Valeur |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | *(URL copiée de Neon ou de Render)* |
   | `JWT_SECRET` | *(générer un secret fort, ex: `openssl rand -base64 32`)* |
   | `CLIENT_ORIGIN` | `https://<votre-app>.vercel.app` |

4. Cliquer **Create Web Service**

### Vérification

Une fois le déploiement terminé, tester :

```bash
curl https://mathemlearning-api.onrender.com/api/health
# → {"ok":true}
```

### Seeding des exercices

Le seed (12 branches + 72 exercices) s'exécute automatiquement au premier démarrage grâce à `npm start`. Si besoin de resséder manuellement :

```bash
# Via Render Shell (dashboard → Shell)
npx prisma db seed
```

---

## Étape 3 — Vercel (frontend React)

1. Aller sur [vercel.com](https://vercel.com) et créer un compte
2. Cliquer **Add New...** → **Project**
3. Connecter le même repository GitHub/GitLab
4. Configurer :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. Ajouter la variable d'environnement :

   | Clé | Valeur |
   |-----|--------|
   | `VITE_API_URL` | `https://mathemlearning-api.onrender.com` |

6. Cliquer **Deploy**

### Vérification

Une fois déployé, Vercel donne une URL comme :
`https://mathemlearning-xxxx.vercel.app`

Ouvrir cette URL → la page de login s'affiche → inscription → exercices.

---

## Étape 4 — Connecter les services

Mettre à jour la variable `CLIENT_ORIGIN` sur Render avec l'URL Vercel :

1. Dashboard Render → **Environment** → `CLIENT_ORIGIN`
2. Mettre : `https://mathemlearning-xxxx.vercel.app`
3. Le service redémarre automatiquement

---

## Étape 5 — Vérification finale

| Test | Résultat attendu |
|------|------------------|
| `GET /api/health` sur Render | `{"ok":true}` |
| Page d'inscription sur Vercel | Formulaire s'affiche |
| Inscription → Login | Token JWT reçu, redirection vers `/` |
| Sélection d'une branche | Branches affichées |
| Lancer un exercice | Timer démarre, énoncé affiché |
| Soumettre une réponse | Correction + note affichées |

---

## Structure des variables d'environnement

### Backend (Render)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NODE_ENV` | Environnement | `production` |
| `DATABASE_URL` | URL PostgreSQL (Neon) | `postgresql://...?sslmode=require` |
| `JWT_SECRET` | Secret pour les tokens JWT | *(généré aléatoirement)* |
| `CLIENT_ORIGIN` | URL du frontend (CORS) | `https://mathemlearning-xxx.vercel.app` |
| `PORT` | Port du serveur | *(automatique sur Render)* |

### Frontend (Vercel)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL absolue de l'API backend | `https://mathemlearning-api.onrender.com` |

---

## Limitations du free tier

| Service | Limitation | Impact |
|---------|-----------|--------|
| **Render** | Spin-down après 15 min | Cold start de ~30-60 s au premier accès |
| **Neon** | 0.5 GB stockage | Suffisant pour des centaines d'utilisateurs |
| **Neon** | Compute suspendu après 5 min | Redémarrage automatique, transparent |
| **Vercel** | Limites de build | Suffisant pour un projet perso |

> Pour éviter le cold start Render, des services comme UptimeRobot peuvent
> ping l'endpoint `/api/health` toutes les 10 minutes (gratuit).

---

## Déploiements futurs

Tout push sur la branche `main` redéploye automatiquement :
- **Render** : redéploy le backend (npm start relance db push + seed)
- **Vercel** : redéploy le frontend (rebuild + upload)

Le seed est **idempotent** (utilise `upsert`) — il ne crée pas de doublons.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `JWT_SECRET manquant` | Ajouter la variable dans Render → Environment |
| `Can't reach database` | Vérifier `DATABASE_URL` dans Render (Neon actif ?) |
| Erreur CORS | Vérifier `CLIENT_ORIGIN` = URL exacte du frontend Vercel |
| Cold start lent | Normal sur Render free. Utiliser un ping régulier |
| Frontend affiche erreur réseau | Vérifier `VITE_API_URL` dans Vercel → Settings → Env |
| Seed non exécuté | Via Render Shell : `npx prisma db seed` |
