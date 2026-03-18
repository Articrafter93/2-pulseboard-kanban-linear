import { currentUser } from "@clerk/nextjs/server";

export default async function ProfileSettingsPage() {
  const user = await currentUser().catch(() => null);
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ")
    || user?.username
    || user?.primaryEmailAddress?.emailAddress
    || "Workspace User";

  return (
    <section className="max-w-xl rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-3 font-[var(--font-display)] text-xl">Profile</h2>
      <form className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Display name</span>
          <input
            defaultValue={displayName}
            className="w-full rounded-lg border border-line bg-panelAlt px-3 py-2 outline-none ring-accent focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Timezone</span>
          <input
            defaultValue="America/Bogota"
            className="w-full rounded-lg border border-line bg-panelAlt px-3 py-2 outline-none ring-accent focus:ring-2"
          />
        </label>
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 font-semibold text-[#2b1b00]">
          Save preferences
        </button>
      </form>
    </section>
  );
}
