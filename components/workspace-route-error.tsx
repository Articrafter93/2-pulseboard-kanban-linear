"use client";

type WorkspaceRouteErrorProps = {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
};

export function WorkspaceRouteError({ title, error, reset }: WorkspaceRouteErrorProps) {
  return (
    <section className="rounded-xl border border-red-700/70 bg-red-950/20 p-4">
      <h2 className="font-[var(--font-display)] text-xl text-red-200">{title}</h2>
      <p className="mt-2 text-sm text-red-100/90">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg border border-red-300/50 bg-red-500/10 px-3 py-2 text-sm text-red-100"
      >
        Reintentar
      </button>
    </section>
  );
}
