"use client";

import { WorkspaceRouteError } from "@/components/workspace-route-error";

export default function TaskDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <WorkspaceRouteError title="Error al cargar el detalle de tarea" error={error} reset={reset} />;
}
