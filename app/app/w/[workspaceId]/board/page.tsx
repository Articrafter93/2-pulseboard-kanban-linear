import { BoardView } from "@/components/board-view";
import { getRealtimeUser } from "@/lib/auth-runtime";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const currentUser = await getRealtimeUser();
  return <BoardView workspaceId={workspaceId} currentUser={currentUser} />;
}
