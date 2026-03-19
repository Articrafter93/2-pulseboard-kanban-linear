import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-runtime";
import { getDemoMembers, isDemoWorkspaceId } from "@/lib/demo-workspace";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";

export default async function MembersSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const userId = await requireUserId();
  if (!userId) {
    notFound();
  }

  let organizationId = "";
  let isDemoWorkspace = false;
  try {
    const { organization } = await getWorkspaceContext(workspaceId, userId);
    organizationId = organization.id;
    isDemoWorkspace = isDemoWorkspaceId(organization.id);
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      notFound();
    }
    throw error;
  }

  const members = isDemoWorkspace
    ? getDemoMembers(workspaceId).map((member) => ({
        id: member.id,
        displayName: member.displayName,
        role: member.role,
      }))
    : await prisma.member.findMany({
        where: { organizationId },
        select: {
          id: true,
          displayName: true,
          role: true,
        },
        orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      });

  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-3 font-[var(--font-display)] text-xl">Members</h2>
      {members.length === 0 ? (
        <p className="text-sm text-muted">No hay miembros en este workspace todavía.</p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <article key={member.id} className="flex items-center justify-between rounded-lg border border-line bg-panelAlt p-3">
              <div>
                <p className="font-medium">{member.displayName}</p>
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
      )}
    </section>
  );
}
