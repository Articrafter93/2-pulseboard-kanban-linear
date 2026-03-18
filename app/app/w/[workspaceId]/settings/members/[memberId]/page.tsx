import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-runtime";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; memberId: string }>;
}) {
  const { workspaceId, memberId } = await params;
  const userId = await requireUserId();
  if (!userId) {
    notFound();
  }

  let organizationId = "";
  try {
    const { organization } = await getWorkspaceContext(workspaceId, userId);
    organizationId = organization.id;
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      notFound();
    }
    throw error;
  }

  const member = await prisma.member.findFirst({
    where: {
      id: memberId,
      organizationId,
    },
    select: {
      displayName: true,
      role: true,
      userExternalId: true,
      _count: {
        select: {
          assignedTasks: true,
        },
      },
    },
  });

  if (!member) {
    notFound();
  }

  return (
    <section className="max-w-xl rounded-xl border border-line bg-panel p-4">
      <h2 className="font-[var(--font-display)] text-xl">{member.displayName}</h2>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted">Role: {member.role}</p>
      <p className="mt-4 text-sm text-slate-300">
        External user id: {member.userExternalId}
      </p>
      <p className="mt-2 text-sm text-slate-300">
        Assigned tasks: {member._count.assignedTasks}
      </p>
    </section>
  );
}
