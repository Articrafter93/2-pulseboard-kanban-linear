import { BoardView } from "@/components/board-view";
import { tasks } from "@/components/mock-data";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return <BoardView workspaceId={workspaceId} initialTasks={tasks} />;
}

