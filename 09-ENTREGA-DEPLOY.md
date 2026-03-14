# 09-ENTREGA-DEPLOY

- Proyecto: Pulseboard (provisional)
- Fecha: 2026-03-14
- Fase: consolidacion de release para aceptacion cliente

## Builds y validaciones
- `npm run lint`: OK
- `npm run build`: OK
- `npm --prefix realtime-service run build`: OK

## Checklist release
- [x] Realtime-service con Dockerfile propio (`realtime-service/Dockerfile`).
- [x] README de producto actualizado con arquitectura y setup reproducible.
- [x] CI obligatorio agregado (`.github/workflows/ci.yml`).
- [x] Artefactos Lighthouse versionados en `artifacts/lighthouse/` (incluye resultado de ejecucion local).

## URL de produccion
- Alias principal: `https://pulseboard-kanban-linear.vercel.app`

## Repositorio GitHub oficial
- `https://github.com/Articrafter93/2-pulseboard-kanban-linear`

## Nota
- La ejecucion local de Lighthouse CLI en esta maquina devolvio error de permisos de Chrome headless; la evidencia del fallo quedo guardada en artefacto JSON para trazabilidad.
