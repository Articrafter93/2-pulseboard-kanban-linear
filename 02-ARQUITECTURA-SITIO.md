# 02-ARQUITECTURA-SITIO

- Proyecto: Pulseboard (provisional)
- Fecha: 2026-03-08
- Fase: Paso 3 - Arquitectura del sitio

## Sitemap final (MVP)
- `/` (home publica de producto)
- `/signin`
- `/signup`
- `/app`
- `/app/w/[workspaceId]/board`
- `/app/w/[workspaceId]/list`
- `/app/w/[workspaceId]/calendar` (alcance base)
- `/app/w/[workspaceId]/task/[taskId]`
- `/app/w/[workspaceId]/settings/members`
- `/app/w/[workspaceId]/settings/roles`
- `/app/w/[workspaceId]/settings/profile`
- `/app/w/[workspaceId]/reports`
- `/app/w/[workspaceId]/activity`

## Objetivo por tipo de pagina
- Home publica: captacion y percepcion premium del producto.
- Auth: acceso seguro y rapido.
- Board/List/Calendar: gestion operativa de trabajo.
- Task detail: ejecucion y trazabilidad por tarea.
- Reports/Activity: capa ejecutiva y auditoria basica.
- Settings: administracion de workspace, roles y miembros.

## Componentes obligatorios por tipo de pagina
- Layout app:
  - Sidebar limpia (workspaces, proyectos, vistas, reportes).
  - Topbar ligera (busqueda, quick actions, perfil, tema).
  - Command palette con atajos visibles.
- Board:
  - Columnas reorderables.
  - Tarjetas con prioridad, etiquetas, responsable y fecha.
  - Drag-and-drop con estados optimistas.
- List:
  - Tabla filtrable y ordenable.
  - Bulk actions basicas.
- Calendar:
  - Vista mensual/semanal basica de due dates.
- Task detail panel:
  - Descripcion enriquecida.
  - Subtareas.
  - Comentarios.
  - Adjuntos.
  - Historial de actividad.
- Dashboard/reportes:
  - Productividad por ciclo.
  - Workload por miembro.
  - Resumen vencidas/bloqueadas/completadas.
  - Export CSV.

## Reglas UX/UI globales (alineadas a cliente)
- Dark mode nativo (default configurable por usuario).
- Minimalismo fuerte, alto espacio negativo y jerarquia clara.
- Colores medidos; acentos solo para estado/prioridad/acciones.
- Bordes sutiles y sombras controladas.
- Microanimaciones cortas y funcionales.
- Sensacion premium, sin apariencia de plantilla.

## Arquitectura de navegacion
- Navegacion primaria: sidebar izquierda.
- Navegacion contextual: topbar + breadcrumbs por workspace/proyecto.
- Navegacion rapida: command palette (`Ctrl/Cmd + K`) y shortcuts visibles.

## Arquitectura de estados
- Estado servidor: TanStack Query.
- Estado UI: Zustand (paneles, preferencias, shortcuts).
- Realtime:
  - Servicio separado Socket.IO.
  - Redis Pub/Sub para escalar multiples instancias.
  - Suscripcion por workspace/proyecto.
  - Eventos: task.created, task.updated, task.moved, comment.added.
  - Presencia basica para edicion/visualizacion.

## Identidad y acceso
- Proveedor principal: Clerk Organizations.
- Fallback permitido: Auth.js reforzado.
- Modelo de autorizacion: RBAC por workspace (Owner/Admin/Member/Guest).

## Reglas SEO por tipo de pagina
- Publicas (`/`): indexables con metadata completa.
- Privadas (`/app/**`): `noindex,nofollow`.
- Canonical en pagina publica principal.
- `robots.txt` y `sitemap.xml` generados en build.

## Accesibilidad minima planificada
- Navegacion por teclado en board/list/task panel.
- Contraste adecuado en dark mode.
- Foco visible consistente.
- Roles ARIA en drag-and-drop y comandos.

## Criterios de completitud para implementacion
- Todas las rutas del sitemap con layout funcional.
- Flujos core de crear/editar/mover tarea completos.
- Filtros, busqueda y atajos operativos.
- Reportes base y log de actividad visibles.
- Responsive validado en desktop y mobile.
