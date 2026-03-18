import { notFound } from "next/navigation";
import { BoardView } from "@/components/board-view";
import { getRealtimeUser, requireUserId } from "@/lib/auth-runtime";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const userId = await requireUserId();
  if (!userId) {
    notFound();
  }

  try {
    await getWorkspaceContext(workspaceId, userId);
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      notFound();
    }
    throw error;
  }

  const currentUser = await getRealtimeUser();
  return <BoardView workspaceId={workspaceId} currentUser={currentUser} />;
}
