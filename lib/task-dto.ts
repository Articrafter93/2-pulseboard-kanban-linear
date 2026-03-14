import { BoardStatus } from "@/lib/task-status";

export type TaskDto = {
  id: string;
  title: string;
  description: string;
  status: BoardStatus;
  priority: "urgent" | "high" | "normal" | "low";
  labels: string[];
  assignee: string;
  dueDate: string;
};