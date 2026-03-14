type WorkspaceRouteLoadingProps = {
  title: string;
  rows?: number;
};

export function WorkspaceRouteLoading({ title, rows = 6 }: WorkspaceRouteLoadingProps) {
  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <div className="mb-4 h-6 w-56 animate-pulse rounded bg-panelAlt" aria-label={title} />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-lg border border-line bg-panelAlt" />
        ))}
      </div>
    </section>
  );
}
