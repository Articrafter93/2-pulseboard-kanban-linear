# INSTRUCCIONES DEL CLIENTE - KANBAN-LINEAR

## Brief consolidado
- Contexto: construir el producto central de startup llamado provisionalmente `Pulseboard`.
- Posicionamiento: competir en percepcion con Linear, Height y Jira simplificado.
- Arquitectura base: SaaS escalable con API interna/BFF, auth segura, roles y DB bien modelada.
- Modo de datos: mock-first hasta recibir DB/credenciales reales del cliente.
- Entregables exigidos: responsive real, Docker local, README excelente, deploy limpio y demo usable con datos convincentes.

## Ajuste tecnico oficial (correo cliente 2026-03-08)
- Definicion final de stack:
  - Next.js App Router + TypeScript.
  - PostgreSQL.
  - Prisma.
  - Servicio separado de tiempo real con Socket.IO.
  - Redis Pub/Sub para escalar WebSockets.
  - Clerk Organizations (preferido) o Auth.js reforzado (fallback).
  - Docker obligatorio.
- Regla operativa: toda decision tecnica y de implementacion se alinea a esta base oficial.

## Requerimientos funcionales exactos (correo cliente)
- Workspaces para multiples equipos o empresas.
- Proyectos, columnas, estados y ciclos.
- Tareas con titulo, descripcion, prioridad, etiquetas, fecha limite y responsable.
- Subtareas, comentarios, historial de actividad y adjuntos.
- Vistas: tablero, lista y calendario.
- Busqueda global rapida con atajos de teclado.
- Filtros por estado, prioridad, miembro, proyecto y fecha.
- Roles: Owner, Admin, Member, Guest.
- Colaboracion: drag-and-drop impecable, realtime, presencia/edicion, notificaciones in-app, estados optimistas.
- Capa ejecutiva: dashboard productividad, workload por miembro, vencidas/bloqueadas/completadas, reportes exportables, log de actividad por usuario.

## Requerimientos de UX/UI exactos (correo cliente)
- Dark mode nativo.
- Minimalismo fuerte, alto orden visual y espacio negativo.
- Jerarquia visual clara.
- Colores medidos con acentos para prioridades/estados/acciones.
- Animaciones cortas, suaves y utiles (no decorativas).
- Navegacion lateral limpia y topbar ligera.
- Atajos de teclado visibles para usuarios avanzados.
- Meta perceptual: "esto se siente caro".

## Matriz de cumplimiento
| ID | Exigencia | Estado | Evidencia |
|---|---|---|---|
| C-01 | Crear proyecto desde cero en carpeta destino aprobada | Cumple | `C:\Users\g-cub\Antigravity projects\proyectos\2- Kanban colaborativo estilo Linear` |
| C-02 | Briefing inicial completo | Cumple | `01-BRIEFING.md` |
| C-03 | Matriz backend por rubro con decision inicial API | Cumple | `MATRIZ-BACKEND.md` |
| C-04 | Modo de datos mock-first documentado | Cumple (temporal) | `01-BRIEFING.md`, `MATRIZ-BACKEND.md` |
| C-05 | Funcionalidades core (workspaces, proyectos, tareas, vistas, filtros) definidas | Cumple | Seccion `Requerimientos funcionales exactos` |
| C-06 | Requisitos colaborativos realtime definidos | Cumple | Seccion `Requerimientos funcionales exactos` |
| C-07 | Capa ejecutiva definida | Cumple | Seccion `Requerimientos funcionales exactos` |
| C-08 | Requisitos UX/UI premium definidos | Cumple | Seccion `Requerimientos de UX/UI exactos` |
| C-09 | Docker local obligatorio | Cumple | Correo cliente + `01-BRIEFING.md` |
| C-10 | Deploy limpio y demo usable exigidos | Cumple | Correo cliente + `01-BRIEFING.md` |
| C-11 | Referencias visuales oficiales en formato Figma/URL/imagenes | Pendiente | Cliente no envio enlace especifico aun |
| C-12 | Activos de marca oficiales (logo/paleta/tipografia final) | Pendiente | Pendiente entrega del cliente |
| C-13 | Redes sociales oficiales para footer con iconos | Pendiente | Pendiente entrega del cliente |
| C-14 | Aprobacion GATE 1 | Cumple | Aprobacion explicita del developer (2026-03-08) + `CHECKLIST-CONTROL.md` |
| C-15 | Alcance MVP definido (incluye/no incluye + mapa + KPIs) | Cumple | `02-ALCANCE-MVP.md` |
| C-16 | Decision API cerrada a `si/no` sin ambiguedad | Cumple | `02-ALCANCE-MVP.md`, `MATRIZ-BACKEND.md` |
| C-17 | Aprobacion GATE 2 | Cumple | Aprobacion explicita del developer (2026-03-08) + `CHECKLIST-CONTROL.md` |
| C-18 | Arquitectura tecnica pre-scaffold definida | Cumple | `00-ARQUITECTURA-PROYECTO.md` |
| C-19 | Arquitectura del sitio (sitemap + componentes + SEO) definida | Cumple | `02-ARQUITECTURA-SITIO.md` |
| C-20 | Decision CMS cerrada | Cumple | `00-ARQUITECTURA-PROYECTO.md` (CMS: no aplica) |
| C-21 | Decision Docker cerrada | Cumple | `00-ARQUITECTURA-PROYECTO.md` (Docker: obligatorio) |
| C-22 | Aprobacion GATE 3 | Cumple | Revalidado tras cambio de stack + `CHECKLIST-CONTROL.md` |
| C-23 | Direccion visual generada (5 propuestas landing + expansion) | Cumple | `04-DIRECCION-VISUAL.md` + carpeta central de propuestas `.html` |
| C-24 | Evidencia visual disponible para implementacion | Cumple | `proposal-03` (`landing`, `dashboard`, `board`, `task-detail`, `reports`) |
| C-25 | Uso de Stitch en esta ejecucion | Parcial | Intentos con timeout; fallback documentado en `04-DIRECCION-VISUAL.md` |
| C-26 | Aprobacion GATE 4 | Cumple | Aprobacion explicita del developer (2026-03-08) + `CHECKLIST-CONTROL.md` |
| C-27 | Realtime definido con Socket.IO en servicio separado | Cumple | `00-ARQUITECTURA-PROYECTO.md`, `MATRIZ-BACKEND.md` |
| C-28 | Escalado realtime definido con Redis Pub/Sub | Cumple | `00-ARQUITECTURA-PROYECTO.md`, `MATRIZ-BACKEND.md` |
| C-29 | Autenticacion con Clerk Organizations como preferencia | Cumple | `00-ARQUITECTURA-PROYECTO.md`, `MATRIZ-BACKEND.md` |
| C-30 | Alineacion oficial a stack final del nuevo correo | Cumple | Seccion `Ajuste tecnico oficial` + docs de arquitectura actualizadas |
| C-31 | Scaffold tecnico ejecutado bajo stack final | Cumple | `05-SETUP-SCAFFOLD.md` |
| C-32 | Implementacion MVP base en app y APIs mock | Cumple | `06-IMPLEMENTACION-MVP.md` |
| C-33 | Validaciones tecnicas (`lint`, `build`) | Cumple | `05-SETUP-SCAFFOLD.md` |
| C-34 | Revalidacion de GATE 3 tras cambio de stack | Cumple | `CHECKLIST-CONTROL.md`, `REDO-TRACKING.md` |
| C-35 | QA funcional `rotos` ejecutada con reporte limpio | Cumple | `ROTOS_REPORT.md`, `ROTOS_REPORT.json`, `07-QA-AUDITORIA.md` |
| C-36 | Auditoria global de cumplimiento ejecutada | Cumple | `07-QA-AUDITORIA.md` (PASS 33/33) |
| C-37 | Seguridad pre-deploy documentada | Cumple | `08-SEGURIDAD-PREDEPLOY.md` |
| C-38 | GATE 7 aprobado | Cumple | `CHECKLIST-CONTROL.md` |
| C-39 | GATE 8 aprobado | Cumple | `CHECKLIST-CONTROL.md` |
| C-40 | Sincronizacion GitHub completada | Cumple | `09-ENTREGA-DEPLOY.md` |
| C-41 | Deploy productivo en Vercel completado | Cumple | `09-ENTREGA-DEPLOY.md` |
| C-42 | Cierre y handover tecnico documentados | Cumple | `10-CIERRE-HANDOVER.md` |
| C-43 | Aprobacion GATE 9 | Cumple | `CHECKLIST-CONTROL.md`, `09-ENTREGA-DEPLOY.md` |
| C-44 | Aprobacion GATE 10 | Cumple | `CHECKLIST-CONTROL.md`, `10-CIERRE-HANDOVER.md` |

## Condiciones de cierre
- [ ] GATE 9 cerrado
- [ ] GATE 10 cerrado

## Plan de migracion mock a real (borrador)
1. Confirmar proveedor real de DB, auth y realtime.
2. Entregar secretos en `.env.local` (sin exponer en git).
3. Ejecutar migracion de modelo de datos y adaptadores.
4. Re-ejecutar QA y seguridad antes de go-live definitivo.

