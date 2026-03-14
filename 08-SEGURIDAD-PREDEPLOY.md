# 08-SEGURIDAD-PREDEPLOY

- Proyecto: Pulseboard (provisional)
- Fecha: 2026-03-14
- Fase: hardening final previo a aceptacion

## Checklist de seguridad
- [x] Variables de entorno validadas en runtime con Zod (`lib/env.ts`, `realtime-service/src/env.ts`).
- [x] Fallo explicito en build/start si faltan variables criticas (DB, Redis, Clerk, URLs publicas).
- [x] Rutas `/app/**` protegidas con Clerk middleware (`middleware.ts`).
- [x] Rate limiting en API Next.js (tasks/dashboard) con Redis (`lib/rate-limit.ts`).
- [x] Rate limiting en eventos Socket.IO (`workspace:join`, `task:moved`, `task:created`, `presence:cursor`).
- [x] Validacion de payloads realtime con Zod.
- [x] Security headers en `next.config.ts`.

## Riesgos remanentes
- La calidad de auth E2E depende de secretos Clerk de testing provistos en CI.
- Lighthouse CLI local puede fallar en entornos Windows con restriccion de Chrome headless (evidencia en `artifacts/lighthouse`).

## Estado
- Hardening de seguridad requerido por cliente: implementado.