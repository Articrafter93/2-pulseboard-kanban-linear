"use client";

import { WorkspaceRouteError } from "@/components/workspace-route-error";

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <WorkspaceRouteError title="Error al cargar reportes" error={error} reset={reset} />;
}
