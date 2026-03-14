export default function BoardLoading() {
  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, columnIndex) => (
        <div key={columnIndex} className="rounded-xl border border-line bg-panel p-3">
          <div className="mb-3 h-5 w-24 animate-pulse rounded bg-panelAlt" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((__, rowIndex) => (
              <div key={rowIndex} className="h-24 animate-pulse rounded-lg border border-line bg-panelAlt" />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}