import { TaskStatus } from "@prisma/client";

export const boardStatuses = ["backlog", "to_do", "in_progress", "done"] as const;
export type BoardStatus = (typeof boardStatuses)[number];

const toDbMap: Record<BoardStatus, TaskStatus> = {
  backlog: "BACKLOG",
  to_do: "TODO",
  in_progress: "IN_PROGRESS",
  done: "DONE",
};

const toUiMap: Record<TaskStatus, BoardStatus> = {
  BACKLOG: "backlog",
  TODO: "to_do",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export function boardStatusToDb(status: BoardStatus): TaskStatus {
  return toDbMap[status];
}

export function dbStatusToBoard(status: TaskStatus): BoardStatus {
  return toUiMap[status];
}