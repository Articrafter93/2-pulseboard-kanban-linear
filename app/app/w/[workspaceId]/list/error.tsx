"use client";

import { WorkspaceRouteError } from "@/components/workspace-route-error";

export default function ListError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <WorkspaceRouteError title="Error al cargar la vista de lista" error={error} reset={reset} />;
}
