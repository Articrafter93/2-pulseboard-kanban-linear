import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-runtime";
import { getDemoActivity, isDemoWorkspaceId } from "@/lib/demo-workspace";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";

export default async function ActivityPage({
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

  const events = isDemoWorkspace
    ? getDemoActivity(workspaceId)
    : await prisma.activity.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-3 font-[var(--font-display)] text-xl">Activity Log</h2>
      {events.length === 0 ? (
        <p className="text-sm text-muted">Todavía no hay actividad registrada en este workspace.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="rounded-lg border border-line bg-panelAlt p-3 text-sm">
              <p>
                <span className="font-medium">{event.actor}</span>
                {" · "}
                {event.eventType}
              </p>
              <p className="mt-1 text-xs text-muted">{event.createdAt.toISOString()}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
