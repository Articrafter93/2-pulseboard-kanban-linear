export type UserRole = "owner" | "admin" | "member" | "guest";
export type TaskPriority = "urgent" | "high" | "normal" | "low";
export type TaskStatus = "backlog" | "to_do" | "in_progress" | "done";

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  labels: string[];
  assignee: string;
  dueDate: string;
  project: string;
};

export const WORKSPACE_ID = "default";

export const members = [
  { id: "U-1", name: "Ana", role: "owner" as UserRole, workload: 9 },
  { id: "U-2", name: "Leo", role: "admin" as UserRole, workload: 7 },
  { id: "U-3", name: "Sam", role: "member" as UserRole, workload: 11 },
  { id: "U-4", name: "Nia", role: "member" as UserRole, workload: 6 },
  { id: "U-5", name: "Jay", role: "guest" as UserRole, workload: 2 },
];

export const tasks: TaskItem[] = [
  {
    id: "T-1001",
    title: "Optimistic drag state",
    description: "Move cards instantly and rollback only on error.",
    priority: "urgent",
    status: "in_progress",
    labels: ["UX", "Realtime"],
    assignee: "Leo",
    dueDate: "2026-03-10",
    project: "Core Board",
  },
  {
    id: "T-1002",
    title: "Workspace RBAC guard",
    description: "Enforce Owner/Admin/Member/Guest permissions server-side.",
    priority: "high",
    status: "to_do",
    labels: ["Auth", "Security"],
    assignee: "Ana",
    dueDate: "2026-03-12",
    project: "Identity",
  },
  {
    id: "T-1003",
    title: "Activity timeline stream",
    description: "Show task-level events and user attribution.",
    priority: "normal",
    status: "backlog",
    labels: ["Audit", "Analytics"],
    assignee: "Sam",
    dueDate: "2026-03-15",
    project: "Insights",
  },
  {
    id: "T-1004",
    title: "Command palette shortcuts",
    description: "Add keyboard-first navigation and action palette.",
    priority: "high",
    status: "done",
    labels: ["Productivity", "UX"],
    assignee: "Nia",
    dueDate: "2026-03-09",
    project: "App Shell",
  },
  {
    id: "T-1005",
    title: "CSV export for reports",
    description: "Enable downloadable executive snapshots.",
    priority: "normal",
    status: "to_do",
    labels: ["Reporting"],
    assignee: "Jay",
    dueDate: "2026-03-14",
    project: "Insights",
  },
];

export const activityFeed = [
  "Ana changed role permissions in workspace.",
  "Leo moved T-1001 from To Do to In Progress.",
  "Sam added comment on T-1003.",
  "Nia completed keyboard shortcut map.",
  "Jay exported cycle report as CSV.",
];

export const notifications = [
  "Sam is editing T-1001",
  "Cycle 12 starts in 2 days",
  "3 tasks are overdue in Core Board",
];
