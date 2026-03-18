# 07-QA-AUDITORIA

- Proyecto: Pulseboard (provisional)
- Fecha: 2026-03-14
- Fase: QA ampliada para cierre de aceptacion cliente

## Cobertura funcional automatizada
- Framework: Playwright (`playwright.config.ts`)
- Casos implementados:
  - `tests/e2e/auth.spec.ts`
    - redireccion de usuario no autenticado a `/signin`
    - login Clerk y acceso a `/app/w/default/board` (con credenciales E2E)
  - `tests/e2e/board-persistence.spec.ts`
    - creacion de tarjeta Kanban
    - movimiento de tarjeta entre columnas
    - persistencia tras recarga
  - `tests/e2e/realtime-sync.spec.ts`
    - sincronizacion entre dos clientes simultaneos
    - presencia y cursor colaborativo
    - estado de reconexion de socket

## Validaciones tecnicas ejecutadas
- `npm run lint`: OK
- `npm run build`: OK
- `npm --prefix realtime-service run build`: OK

## Estado actual de evidencia
- Suite E2E incluida y versionada.
- Ejecucion completa de E2E requiere secretos Clerk de prueba (`E2E_CLERK_*`) y daemon Docker activo para PostgreSQL/Redis.
- CI (`.github/workflows/ci.yml`) deja la ejecucion obligatoria de lint/build/e2e con servicios levantados.

## Actualizacion 2026-03-18 (revision final)
- `docker compose up -d --force-recreate db redis`: OK
- `npm run prisma:push`: OK
- `npm run prisma:seed`: OK
- `npm run lint`: OK
- `npm run build`: OK
- `npm --prefix realtime-service run build`: OK
- `npx playwright test tests/e2e/revision-final-audit.spec.ts`: PASS
- Pasada visual manual con Playwright MCP:
  - `/`: hero, CTA principal y footer visibles
  - `/privacidad`: contenido legal y `h1` verificados
  - `/signin`: acceso demo visible con credenciales mock
  - `/app/w/default/board`: tablero, presencia y shell operativos
  - `/app/w/default/reports` y `/app/w/default/activity`: navegacion principal resuelta
- Validacion de endpoints en UI real:
  - `/api/health`: 200
  - `/api/tasks` por status `backlog|to_do|in_progress|done`: 200

## Lighthouse en produccion
- Script: `npm run lighthouse:prod`
- Artefactos:
  - `artifacts/lighthouse/production-2026-03-14.report.html`
  - `artifacts/lighthouse/production-2026-03-14.report.json`
- Resultado de esta ejecucion local: fallo por permisos de Chrome headless en el entorno actual (evidencia registrada en artefacto JSON).

## Nota sobre Docker realtime
- Confirmado: existe Dockerfile propio en `realtime-service/Dockerfile` y se usa en `docker-compose.yml`.
