# 02-ALCANCE-MVP

- Proyecto: Pulseboard (provisional)
- Fecha: 2026-03-08
- Fase: Paso 2 - Alcance, MVP y criterios de exito

## Incluido en MVP
- Autenticacion segura con roles: Owner, Admin, Member, Guest.
- Workspaces multi-equipo.
- Proyectos con columnas, estados y ciclos.
- Tareas con titulo, descripcion, prioridad, etiquetas, responsable y fecha limite.
- Subtareas, comentarios e historial de actividad por tarea.
- Vistas de tablero y lista.
- Drag-and-drop entre columnas con feedback claro.
- Filtros por estado, prioridad, miembro, proyecto y fecha.
- Busqueda global rapida con atajos de teclado.
- Notificaciones dentro de la app.
- Dashboard ejecutivo base: vencidas, bloqueadas, completadas, workload por miembro.
- Registro de actividad por usuario (auditoria basica).
- Dark mode nativo.
- UI responsive real desktop/mobile.

## No incluido en MVP (pasa a fase posterior)
- Vista calendario completa (version avanzada con interacciones complejas).
- Exportacion avanzada de reportes (PDF con branding y plantillas complejas).
- Automatizaciones avanzadas de workflows.
- Integraciones externas (Slack, GitHub, Jira, etc.).
- Facturacion/pagos SaaS.
- Motor de IA para priorizacion o resumenes.

## Mapa preliminar de paginas
- `/login`
- `/signup`
- `/app` (dashboard principal)
- `/app/workspace/[workspaceId]/board`
- `/app/workspace/[workspaceId]/list`
- `/app/workspace/[workspaceId]/calendar` (base, limitada en MVP)
- `/app/settings/workspace`
- `/app/settings/members`
- `/app/settings/profile`

## Componentes clave por tipo de pagina
- App shell: sidebar limpia + topbar ligera + quick actions.
- Board: columnas, cards de tarea, drag-and-drop, filtros, quick add.
- List: tabla/listado con filtros y orden.
- Detalle tarea: descripcion, subtareas, comentarios, adjuntos, actividad.
- Dashboard: metricas operativas y carga por miembro.
- Settings: roles/permisos y gestion de miembros.

## Decision API (cerrada)
- API requerida: si.
- Alcance API: interna/BFF.
- Consumidores iniciales: web app.
- Integraciones externas en esta fase: no.

## KPIs y metas iniciales
- Tiempo de carga dashboard (P75): < 2.0s.
- Interaccion mover tarjeta (feedback visual): < 150ms.
- Tasa de exito en crear/editar tarea: > 99%.
- Uso de busqueda global semanal (usuarios activos): > 40%.
- Tareas completadas por ciclo: baseline + tendencia.
- Errores JS criticos en flujo core: 0 en release.

## Riesgos y dependencias
- Proveedor realtime pendiente puede afectar experiencia colaborativa en vivo.
- Falta de activos de marca finales puede requerir ajuste visual posterior.
- Sin DB real entregada, demo y QA correran en mock-first temporal.

