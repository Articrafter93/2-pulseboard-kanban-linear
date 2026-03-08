# MATRIZ-BACKEND

- Proyecto: Pulseboard (nombre provisional)
- Fecha: 2026-03-08
- Modo de datos inicial: mock-first

| Rubro | Requerido | Proveedor/tecnologia (provisional) | Modo inicial | Owner | Estado | Notas |
|---|---|---|---|---|---|---|
| API | si | Route Handlers (BFF) + contrato versionado | mock | Pendiente | Provisional | Endpoints para workspaces, proyectos, tareas, ciclos, filtros, reportes |
| Auth | si | Clerk Organizations (preferido) / Auth.js reforzado (fallback) | mock | Pendiente | Definicion cliente cerrada | Roles Owner/Admin/Member/Guest + organizaciones |
| DB | si | PostgreSQL + Prisma | mock | Pendiente | Definicion cliente cerrada | Modelo relacional para multi-workspace y auditoria |
| Storage | si | S3 compatible/Cloudinary (a decidir) | mock | Pendiente | Provisional | Adjuntos en tareas |
| Pagos | no (alcance actual) | N/A | N/A | Pendiente | Cerrado MVP | Facturacion SaaS fuera del alcance actual |
| Email | si (por confirmar prioridad MVP) | Resend/Postmark (a decidir) | mock-compatible | Pendiente | Pendiente decision | Invitaciones, recuperacion y avisos transaccionales |
| CRM | no (MVP) | N/A | N/A | Pendiente | Cerrado MVP | Sin captura comercial en MVP |
| CMS | no | N/A | N/A | Pendiente | Cerrado | Contenido fijo en codigo |
| Analitica | si | PostHog/Plausible (a decidir) | mock-compatible | Pendiente | Provisional | Productividad, workload, uso por equipo |
| Otros (realtime) | si | Servicio separado Socket.IO + Redis Pub/Sub | mock | Pendiente | Definicion cliente cerrada | Presencia, updates en vivo, estados optimistas, notificaciones in-app |
| Otros (busqueda) | si | PostgreSQL FTS/Meilisearch (a decidir) | mock | Pendiente | Pendiente decision | Busqueda global rapida + atajos teclado |
| Otros (reportes) | si | Export CSV/PDF server-side (a decidir) | mock | Pendiente | Provisional | Reportes exportables ejecutivos |

## Decision API (bloqueante de arquitectura)
- Estado actual: si (cerrado a nivel inicial).
- Alcance preliminar: interna/BFF para frontend web SaaS multi-workspace.

## Plan mock-first a real
1. Definir contrato estable de API sobre datos mock, incluyendo realtime y roles.
2. Implementar servicio Socket.IO separado y adapter Redis en entorno local.
3. Conectar PostgreSQL real via Prisma cuando cliente entregue accesos/politicas.
4. Integrar Clerk Organizations; mantener Auth.js reforzado como fallback tecnico.
5. Ejecutar QA de regresion antes de cambiar `MOCK_DB_ENABLED=false`.
