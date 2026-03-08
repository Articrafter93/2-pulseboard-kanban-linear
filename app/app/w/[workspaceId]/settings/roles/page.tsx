const roleNotes = [
  "Owner: full administrative control, billing, and destructive actions.",
  "Admin: manage projects, cycles, and member access policies.",
  "Member: create/update tasks and collaborate in assigned workspaces.",
  "Guest: read-limited view with scoped permissions.",
];

export default function RolesSettingsPage() {
  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-3 font-[var(--font-display)] text-xl">Roles & Permissions</h2>
      <ul className="space-y-2">
        {roleNotes.map((note) => (
          <li key={note} className="rounded-lg border border-line bg-panelAlt p-3 text-sm text-slate-300">
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}

