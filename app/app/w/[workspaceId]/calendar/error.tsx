"use client";

import { WorkspaceRouteError } from "@/components/workspace-route-error";

export default function CalendarError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <WorkspaceRouteError title="Error al cargar calendario" error={error} reset={reset} />;
}
