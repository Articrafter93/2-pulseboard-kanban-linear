# Pulseboard MVP

Pulseboard is a premium-style collaborative work management app inspired by the speed and visual clarity of tools like Linear.

## Tech Stack
- Next.js 15 + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma schema
- Separate Socket.IO realtime service
- Redis Pub/Sub for WebSocket scale
- Clerk Organizations (preferred) / Auth.js fallback
- Mock-first data mode (`MOCK_DB_ENABLED=true`)
- Docker local setup (`app` + `realtime` + `redis` + `postgres`)

## Scripts
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`

## Quick Start
1. Install dependencies:
```bash
npm install
```
2. Verify `.env.local` exists (already included with mock-first defaults).
3. Start development:
```bash
npm run dev
```
4. Open `http://localhost:3000`.

## Docker Local
```bash
docker compose up --build
```

## Realtime Service
- Source: `realtime-service/src/server.ts`
- Default URL: `http://localhost:4001`
- Uses Redis adapter for cross-instance event propagation.

## Core Routes
- `/` marketing + product positioning
- `/signin` and `/signup`
- `/app/w/default/board`
- `/app/w/default/list`
- `/app/w/default/calendar`
- `/app/w/default/task/T-1001`
- `/app/w/default/reports`
- `/app/w/default/activity`

## API Mock Endpoints
- `GET /api/health`
- `GET /api/tasks`
- `GET /api/dashboard`

## Prisma
- Schema file: `prisma/schema.prisma`
- Generate client:
```bash
npm run prisma:generate
```
- Push schema to DB:
```bash
npm run prisma:push
```

## Notes
- Current build is mock-first and intended as a usable demo baseline.
- Real auth, DB persistence, realtime provider wiring, and storage adapters are planned in the migration phase.
