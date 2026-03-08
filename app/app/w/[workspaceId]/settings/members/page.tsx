import Link from "next/link";
import { members } from "@/components/mock-data";

export default async function MembersSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-3 font-[var(--font-display)] text-xl">Members</h2>
      <div className="space-y-2">
        {members.map((member) => (
          <article key={member.id} className="flex items-center justify-between rounded-lg border border-line bg-panelAlt p-3">
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-xs uppercase tracking-wide text-muted">{member.role}</p>
            </div>
            <Link
              href={`/app/w/${workspaceId}/settings/members/${member.id}`}
              className="rounded-lg border border-line px-3 py-1 text-sm hover:bg-panel"
            >
              Manage
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
