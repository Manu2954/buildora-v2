# CTA API

Production-ready Express + TypeScript + Prisma backend for a micro CTA app.

## Prerequisites
- Node 20+
- Postgres (local or via Docker)

## Environment
Copy `.env.example` to `.env` and adjust values as needed.

Key vars:
- `PORT=5055`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cta?schema=public`
- `API_KEY=change-me-at-deploy`
- `ALLOWED_ORIGINS=http://localhost:5173`

## Install & Setup
```bash
cd apps/cta-api
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed   # or: node --loader ts-node/esm prisma/seed.ts
```

## Develop
```bash
npm run dev
# http://localhost:5055/api/health -> {"status":"ok"}
```

## Build & Run
```bash
npm run build
npm start
```

## Scripts
- `dev`: Run with tsx
- `build`: TypeScript compile
- `start`: Run compiled server
- `test`: Vitest + Supertest
- `prisma:generate`: Generate Prisma client
- `prisma:migrate`: Run migrations (dev)
- `prisma:seed`: Seed database

## Smoke Tests (curl)
```bash
curl http://localhost:5055/api/health
curl "http://localhost:5055/api/cta/config?key=cta:homepage"
curl -X POST http://localhost:5055/api/cta/submit \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hi","page":"/","source":"web","variant":"A"}'
curl -X PUT http://localhost:5055/api/cta/config \
  -H "x-api-key: $API_KEY" -H 'Content-Type: application/json' \
  -d '{"key":"cta:homepage","config":{"headline":"Hello","ctaText":"Go","variant":"A"}}'
curl "http://localhost:5055/api/cta/analytics?from=2024-01-01&to=2024-12-31" \
  -H "x-api-key: $API_KEY"
```

## Docker
Build and run with Postgres using docker-compose:
```bash
docker-compose up -d --build
```
The API will listen on `http://localhost:5055` and Postgres on `localhost:5432`.

