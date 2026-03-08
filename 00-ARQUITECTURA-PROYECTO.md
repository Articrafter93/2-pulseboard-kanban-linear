# 00-ARQUITECTURA-PROYECTO

- Proyecto: Pulseboard (provisional)
- Fecha: 2026-03-08
- Fase: Paso 3 - Arquitectura y stack (pre-scaffold)

## Resumen ejecutivo
Pulseboard se implementara como SaaS web multi-workspace con arquitectura modular, enfoque mock-first y base escalable para colaboracion en tiempo real.

## Decisiones de stack (cerradas)
- Framework objetivo: Next.js 15 (App Router) + TypeScript.
- UI: Tailwind CSS + sistema de componentes reutilizables (shadcn/ui + primitives accesibles).
- Estado cliente: TanStack Query + estado local liviano (Zustand).
- API: interna/BFF via Route Handlers.
- Base de datos objetivo: PostgreSQL + Prisma ORM.
- Auth: Clerk Organizations (preferido) / Auth.js reforzado (fallback).
- Realtime: servicio separado Socket.IO.
- Escalado realtime: Redis Pub/Sub.
- Storage adjuntos: S3 compatible (R2/S3) con firma de subida.
- Analitica producto: PostHog.
- Busqueda global: PostgreSQL FTS (MVP).
- Exportables: CSV server-side (PDF avanzado fuera de MVP).
- CMS: no aplica.
- Deploy objetivo: Vercel.
- Docker: obligatorio (entorno local reproducible).

## Alcance de API (cerrado)
- Tipo: interna/BFF.
- Consumidor: web app de Pulseboard.
- Versionado: `v1` por namespace de rutas.
- Contrato minimo:
  - `auth/*`
  - `workspaces/*`
  - `projects/*`
  - `cycles/*`
  - `tasks/*`
  - `comments/*`
  - `activity/*`
  - `dashboard/*`
  - `reports/*`
  - `search/*`

## Arquitectura de tiempo real (definitiva)
- Proceso separado: `realtime-service` (Node + Socket.IO).
- Transporte:
  - Cliente Next.js -> WebSocket con Socket.IO.
  - API/BFF -> eventos al servicio realtime.
- Escalado horizontal:
  - Adapter Redis para Pub/Sub entre instancias Socket.IO.
- Eventos minimos:
  - `task.created`
  - `task.updated`
  - `task.moved`
  - `task.comment.added`
  - `presence.joined`
  - `presence.left`

## Modelo de dominios (alto nivel)
- Workspace
- MemberWorkspaceRole (Owner/Admin/Member/Guest)
- Project
- Cycle
- Column
- Task
- Subtask
- Comment
- Attachment
- ActivityLog
- Notification

## Estrategia de datos (cerrada)
- Modo inicial: mock-first.
- Bandera obligatoria: `MOCK_DB_ENABLED=true` en inicio.
- Mock tambien cubre realtime/logica de notificaciones si faltan credenciales reales.
- Cambio a real solo con accesos cliente + QA de regresion.

## Integraciones backend por rubro (confirmacion)
- API: si
- Auth: si
- DB: si
- Storage: si
- Pagos: no
- Email: no en MVP (solo si auth lo exige para recovery/invite)
- CRM: no
- CMS: no
- Analitica: si
- Otros: realtime, search, reportes CSV, auditoria por usuario

## Seguridad base planificada
- RBAC por workspace en servidor (no solo en UI).
- Validacion de input en APIs (Zod).
- Rate limiting en endpoints sensibles.
- Manejo de errores sin exponer internals.
- Adjuntos con URLs firmadas y restricciones de tipo/tamano.
- Secretos solo en `.env.local`; nunca en repo.

## SEO tecnico base
- Sitio marketing publico con metadata/canonical/robots/sitemap.
- Secciones autenticadas marcadas como `noindex`.
- Open Graph minimo para home publica.

## Variables inventariadas para `.env.example`
- `NODE_ENV=development`
- `NEXT_PUBLIC_APP_NAME=Pulseboard`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `MOCK_DB_ENABLED=true`
- `DATABASE_URL=`
- `DIRECT_URL=`
- `CLERK_SECRET_KEY=`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup`
- `AUTH_SECRET=`
- `AUTH_URL=`
- `REALTIME_SERVICE_URL=http://localhost:4001`
- `REDIS_URL=redis://redis:6379`
- `S3_ENDPOINT=`
- `S3_REGION=`
- `S3_BUCKET=`
- `S3_ACCESS_KEY_ID=`
- `S3_SECRET_ACCESS_KEY=`
- `POSTHOG_KEY=`
- `POSTHOG_HOST=`

## Docker (obligatorio)
- `docker-compose.yml` con servicios:
  - `app` (Next.js)
  - `realtime` (Socket.IO)
  - `redis` (Pub/Sub)
  - `db` (PostgreSQL)
- Comandos base:
  - `docker compose up --build`
  - `docker compose down`

## Riesgos y mitigaciones
- Complejidad operativa mayor por servicio realtime separado: usar contrato de eventos y healthchecks.
- Alcance funcional alto para MVP: priorizar vertical slice end-to-end en tablero.
- Falta de marca final: separar tokens de diseno para ajuste rapido.

## Estado GATE 3 (pre-validacion)
- API no esta en "por confirmar": cumple.
- Modo de datos no ambiguo: cumple (`mock-first`).
- Stack pre-scaffold definido: cumple.
- Pendiente: revalidacion humana de GATE 3 por ajuste de stack (correo cliente 2026-03-08).
