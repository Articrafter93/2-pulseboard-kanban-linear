"use client";

import { WorkspaceRouteError } from "@/components/workspace-route-error";

export default function ActivityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <WorkspaceRouteError title="Error al cargar actividad" error={error} reset={reset} />;
}
