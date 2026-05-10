# Ody — Restaurant SaaS Dashboard

Test technique fullstack : un produit SaaS complet pour restaurateurs (multi-restaurants, multi-organisations) avec design system, dashboard interactif, vue 3D des salles, et une API typée OpenAPI.

## Stack

**Frontend** — React 19 · TypeScript strict · Vite · TanStack Router/Query · Tailwind v4 · shadcn/ui · Zustand · React Hook Form + Zod · react-i18next · Motion · Three.js · Storybook

**Backend** — Bun · Hono · `@hono/zod-openapi` · Scalar API reference · Drizzle ORM · PostgreSQL 18 · Better Auth

**Tooling** — Turborepo · oxlint + ESLint (custom plugin) · Vitest + Testing Library · Docker Compose

## Architecture

Monorepo Turborepo structuré en Clean Architecture / DDD :

```
apps/
  web/                # Frontend React (Vite + TanStack Router)
  api/                # Backend Hono + OpenAPI

packages/
  domain/             # Entities, value objects, domain services, repository interfaces
  application/        # Use cases, DTOs, mappers (orchestre le domain)
  database/           # Drizzle schemas, migrations, repository implementations
  client/             # SDK frontend (hooks TanStack Query, stores Zustand)
  ui/                 # Design system + Storybook (atoms / molecules / organisms / layouts)
  threejs/            # Scènes 3D (vue salle, top-down, mini-preview)
  shared/             # Types et utilitaires partagés
  lint-plugin-custom/ # Règles ESLint maison (atomic design, i18n, naming)
```

## Design System

Présenté dans **Storybook** :

- **Tokens** : couleurs, spacing, radius, shadows, motion, typographie, glass effects
- **Foundations** : principes, accessibilité, theming, getting started
- **Atomic Design** strict : `atoms/`, `molecules/`, `organisms/`, `layouts/`, `ui/` (shadcn)
- **Composants** : 10+ dialogs, data-table, sidebar, kpi-card, sparkline, heatmap, bar-chart, sheet-tab-bar, search-input, customers-table, orders-table, top-dishes-table, etc.

```bash
bun run storybook
```

## Prérequis

- [Bun](https://bun.sh) ≥ 1.2
- Node.js ≥ 20
- Docker + Docker Compose (pour PostgreSQL)

## Installation

```bash
# 1. Cloner et installer les dépendances
bun install

# 2. Configurer les variables d'environnement
cp .env.example .env
# (éditer .env si besoin — les valeurs par défaut fonctionnent pour le dev local)

# 3. Démarrer PostgreSQL
docker compose up -d postgres

# 4. Appliquer les migrations
bun --filter @workspace/database db:migrate
```

## Lancer le projet

```bash
# Tout démarrer en parallèle (web + api)
bun run dev

# Ou séparément
bun --filter web dev      # http://localhost:3000
bun --filter api dev      # http://localhost:3001
```

- **Frontend** : http://localhost:3000
- **API** : http://localhost:3001
- **API docs (Scalar)** : http://localhost:3001/reference
- **Storybook** : http://localhost:6006 (`bun run storybook`)
- **Drizzle Studio** : `bun --filter @workspace/database db:studio`

## Scripts

| Commande | Effet |
|----------|-------|
| `bun run dev` | Lance web + api en parallèle (Turbo) |
| `bun run build` | Build production de tous les packages |
| `bun run lint` | oxlint + ESLint sur tout le monorepo |
| `bun run lint:fix` | Auto-fix des erreurs lint |
| `bun run typecheck` | `tsc --noEmit` sur tout le monorepo |
| `bun run test` | Vitest sur tout le monorepo |
| `bun run test:coverage` | Tests avec couverture |
| `bun run storybook` | Storybook UI |
| `bun run storybook:build` | Build statique Storybook |

### Database

```bash
bun --filter @workspace/database db:generate   # Générer une migration
bun --filter @workspace/database db:migrate    # Appliquer les migrations
bun --filter @workspace/database db:studio     # GUI Drizzle Studio
```

## Variables d'environnement

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@postgres:5432/ody` |
| `API_PORT` | Port API | `3001` |
| `WEB_PORT` | Port web | `3000` |
| `VITE_API_URL` | URL API (côté client) | `http://localhost:3001` |
| `BETTER_AUTH_SECRET` | Secret 32-byte pour Better Auth | — |
| `BETTER_AUTH_URL` | URL de base auth | `http://localhost:3001` |

## Pages applicatives

- **Home** — Vue d'ensemble multi-restaurants (revenue grid, KPIs, sparklines, heatmap)
- **Stats** — Statistiques détaillées par restaurant (charts, top dishes, trends)
- **CRM** — Gestion clients (table, tags, dialogs création/édition)
- **Orders** — Commandes (table, dialog création, filtres)
- **Menu** — Gestion menu (plats, sections)
- **Settings** — Paramètres restaurant et organisation

Chaque restaurant est représenté en 3D (vue salle interactive + top-down).

## Tests

```bash
bun run test                              # Tous les tests
bun --filter @workspace/ui test           # UI uniquement
bun --filter api test                     # API uniquement
bun run test:coverage                     # Avec couverture
```

## Conventions

Le projet impose des conventions strictes via un **plugin ESLint custom** (`packages/lint-plugin-custom`) :

- Naming kebab-case + suffixes atomiques (`.atom.tsx`, `.molecule.tsx`, `.organism.tsx`, `.layout.tsx`, `.hook.ts`, `.service.ts`, `.store.ts`)
- Stories obligatoires pour atoms / molecules / organisms / layouts
- Tests obligatoires pour hooks / services / stores / utils
- i18n forcée (pas de strings hardcodées user-facing)
- Design tokens uniquement (pas de couleurs raw Tailwind)
- Imports ordonnés et explicites (pas de barrel imports, pas de `../`)
- Pas de `any`, pas de `enum`, return types explicites

## Livrables

- ✅ Repo GitHub
- ✅ Instructions de lancement (ce README)
- ✅ Design system documenté (Storybook + foundations stories)
- ✅ Frontend complet (Home, Stats, CRM, Orders, Menu, Settings)
- ✅ Backend OpenAPI typé (clients, orders, menus, restaurants, stats…)
- ✅ Docker Compose pour PostgreSQL
- ⏳ Démo en ligne (config Docker prête)
