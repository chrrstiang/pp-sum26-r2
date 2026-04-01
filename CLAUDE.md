# CLAUDE.md

## Project Overview

Full-stack TypeScript monorepo with a Next.js frontend and NestJS backend.

## Structure

```
pp-sum26-r2/
├── frontend/   # Next.js 16 app (React 19, Tailwind CSS 4)
└── backend/    # NestJS 11 REST API
```

## Important Notes

- **Next.js 16 has breaking changes** from older versions — see `frontend/AGENTS.md` for details. Do not rely on pre-cutoff training data for Next.js APIs; prefer the official docs or reading the installed source.

## Dev Servers

| App      | Command                  | Default Port |
|----------|--------------------------|--------------|
| Frontend | `npm run dev`            | 3000         |
| Backend  | `npm run start:dev`      | 3000         |

Run each from their respective directory (`frontend/`, `backend/`). If running both simultaneously, set `PORT=3001` for the backend to avoid conflicts.

## Common Commands

### Frontend (`cd frontend`)
```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # ESLint check
```

### Backend (`cd backend`)
```bash
npm run start:dev   # start dev server with watch
npm run build       # compile TypeScript
npm run lint        # ESLint + auto-fix
npm run format      # Prettier
npm run test        # unit tests (Jest)
npm run test:e2e    # E2E tests (Supertest)
npm run test:cov    # coverage report
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: NestJS 11, TypeScript 5, RxJS 7, Jest 30
- **Linting**: ESLint 9 with TypeScript rules; Prettier on the backend

## Path Aliases

- Frontend: `@/*` maps to `./src/*`

## Environment Variables

- `PORT` — backend port (default: `3000`)
