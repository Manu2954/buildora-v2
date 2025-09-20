Mono Backend (Modular Monolith)

Overview
- Express app with modular routers: core (auth) and cta (public)
- Zod for validation, centralized error handler
- Prisma + PostgreSQL (schema in `server/prisma/schema.prisma`)
- Auth (core only): email/password, Argon2, JWT access + refresh, RBAC
- Security: helmet, CORS allowlist, rate limiting for public endpoints
- Logging: pino-http with request id
- Health: `/healthz`, `/readyz`; Metrics: `/metrics` (prom-client)

Env Vars (validated via Zod)
- `NODE_ENV` (development|test|production) default development
- `PORT` default 8080
- `DATABASE_URL` required
- `CORS_ORIGINS` comma-separated list, e.g. `http://localhost:8080,http://localhost:5173`
- `PING_MESSAGE` optional
- `JWT_ACCESS_SECRET` required, min 16 chars
- `JWT_REFRESH_SECRET` required, min 16 chars
- `JWT_ACCESS_EXPIRES_IN` default `15m`
- `JWT_REFRESH_EXPIRES_IN` default `7d`
- `API_KEY` optional (used for CTA admin endpoints)

Commands
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate` — run dev migration
- `npm run db:push` — push schema (alternative to migrate)

Dev
1. Set env in root `.env` (see above)
2. Install deps: `npm i` (or `pnpm i`)
3. Generate client: `npm run prisma:generate`
4. Start: `npm run dev` (Vite + Express on 8080)

Routes
- Core: `/api/core/auth/register|login|refresh|logout|me`
- CTA: `/api/cta/submit` (public), `/api/cta/config` (GET public, PUT admin via `x-api-key`), `/api/cta/analytics` (admin via `x-api-key`)

Interior Workflow (New)
- Designs (public): `GET /api/designs`, `GET /api/designs/:id`
- Designs (admin): `GET/POST/PUT/DELETE /api/admin/designs`
- Interior Orders (customer):
  - `POST /api/interior/orders` create draft
  - `GET /api/interior/orders` list my orders
  - `GET /api/interior/orders/:id` get my order
  - `POST /api/interior/orders/:orderId/items` add item
  - `PUT /api/interior/orders/:orderId/items/:itemId` update item
  - `DELETE /api/interior/orders/:orderId/items/:itemId` remove item
  - `POST /api/interior/orders/:orderId/submit` request consultation
- Interior Orders (admin): `GET /api/admin/interior/orders`, `GET/PUT /api/admin/interior/orders/:id`
- Projects: `GET/POST/PUT /api/interior/projects[/:id]` (customer), admin list/get: `/api/admin/interior/projects`
- Media upload: `POST /api/interior/projects/:id/uploads` (multipart/form-data) -> `{ id, url, ... }`

Seed
- `npm run db:push` then `npm run db:seed` to create an admin user and sample designs.
