# 01-BRIEFING

- Proyecto: Pulseboard (nombre provisional)
- Ruta destino: C:\Users\g-cub\Antigravity projects\playground\2- Kanban colaborativo estilo Linear
- Cliente: Nuevo cliente (correo recibido, nombre legal pendiente)
- Responsable tecnico: Codex + developer
- Fecha inicio: 2026-03-08

## Objetivo principal (1-3 frases)
Construir el producto central de startup "Pulseboard": una plataforma de gestion de trabajo estilo Linear para equipos pequenos y medianos. Debe sentirse premium, rapida y visualmente impecable, con foco en orden operativo sin ruido.

## Audiencia objetivo
- Equipos creativos, agencias, startups y squads tecnicos.
- Equipos pequenos y medianos que necesitan velocidad, orden y colaboracion fluida.

## Propuesta de valor
- Competir en percepcion con Linear, Height y Jira simplificado.
- Experiencia mas elegante, mas rapida y mas agradable para trabajo colaborativo.
- Producto serio de software moderno: premium UX + base tecnica escalable.

## Alcance funcional solicitado (cliente)
- Workspaces para multiples equipos o empresas.
- Proyectos, columnas, estados y ciclos de trabajo.
- Tareas con titulo, descripcion, prioridad, etiquetas, fechas limite y responsable.
- Subtareas, comentarios, historial de actividad y archivos adjuntos.
- Vistas de tablero, lista y calendario.
- Busqueda global rapida con atajos de teclado.
- Filtros avanzados por estado, prioridad, miembro, proyecto y fecha.
- Roles: Owner, Admin, Member y Guest.

## Capa colaborativa solicitada
- Drag-and-drop impecable entre columnas.
- Actualizaciones en tiempo real cuando otros miembros editan o mueven tareas.
- Indicadores visuales de presencia/edicion.
- Notificaciones dentro de la app.
- Estados optimistas para sensacion de inmediatez.

## Capa ejecutiva solicitada
- Dashboard con metricas de productividad.
- Vista de workload por miembro.
- Resumen de tareas vencidas, bloqueadas y completadas.
- Reportes exportables.
- Registro de actividad por usuario para auditoria basica.

## Referencias visuales del cliente
- Referencias de percepcion mencionadas por cliente: Linear, Height, Jira simplificado.
- Activos visuales directos (Figma/URL/images): pendientes.

## Inventario de marca
- Nombre del producto: Pulseboard (provisional).
- Logo: pendiente.
- Paleta: pendiente.
- Tipografia: "elegante", con jerarquia visual clara.
- Tono visual: minimalismo fuerte, orden extremo, acentos de color medidos.
- Requisitos visuales clave: dark mode nativo, bordes sutiles, sombras controladas, animaciones cortas y utiles.

## Redes sociales oficiales (footer)
- Pendiente recibir URLs oficiales del cliente.
- Se confirma que el footer final usara iconos/logos enlazados (no texto plano).

## Backend por rubro (levantamiento inicial)
- api: si
- auth: si
- db: si
- storage: si (adjuntos)
- pagos: no (alcance actual)
- email: si (transaccional para auth/notificaciones, por confirmar prioridad MVP)
- crm: no (MVP)
- cms: no
- analitica: si
- otros: realtime multiusuario, exportacion de reportes, busqueda global con atajos

## Ajuste tecnico oficial (nuevo correo cliente - 2026-03-08)
- Stack final definido por cliente:
  - Next.js App Router + TypeScript (app principal).
  - PostgreSQL (DB principal).
  - Prisma ORM.
  - Servicio separado de tiempo real con Socket.IO.
  - Redis como capa Pub/Sub para escalar WebSockets.
  - Clerk Organizations preferido para auth/organizations/roles; fallback: Auth.js reforzado.
  - Docker obligatorio para entorno local y despliegues consistentes.
- Motivo del ajuste: asegurar base de plataforma colaborativa premium, rapida y escalable.
- Regla a partir de este punto: decisiones de implementacion alineadas a este stack como referencia definitiva.

## Decision inicial de API
- API requerida para operacion plena: si
- Tipo preliminar: interna/BFF para web app SaaS.

## Disponibilidad real de DB/datos del cliente
- Estado: no entregada.
- Modo inicial de datos: mock-first (obligatorio por guia).

## Sensibilidad de datos
- Clasificacion inicial: registrado (cuentas, tareas, actividad y archivos adjuntos).

## Riesgos iniciales
- Alcance amplio de MVP puede requerir recorte por fases para cumplir tiempos.
- Coordinacion entre app principal y servicio realtime separado puede introducir complejidad operativa.
- Sin DB real entregada, release inicial dependera de mock temporal.
- Sin lineamientos de marca completos, direccion visual premium puede requerir iteraciones.

## Supuestos aplicados
- Stack tecnico oficial: Next.js + PostgreSQL + Prisma + Socket.IO + Redis + Clerk/Auth.js.
- Docker local es obligatorio por solicitud del cliente.
- Deploy limpio y demo usable con datos convincentes son requisitos de entrega.
