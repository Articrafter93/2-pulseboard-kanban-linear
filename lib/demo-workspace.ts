import { Role } from "@prisma/client";
import type { BoardStatus } from "@/lib/task-status";
import type { TaskDto } from "@/lib/task-dto";

type DemoMember = {
  id: string;
  userExternalId: string;
  displayName: string;
  role: Role;
};

type DemoActivity = {
  id: string;
  actor: string;
  eventType: string;
  createdAt: Date;
};

type DemoTask = TaskDto & {
  assigneeId: string;
};

type DemoState = {
  members: DemoMember[];
  tasks: DemoTask[];
  activities: DemoActivity[];
};

const DAY_MS = 86400000;
const DEMO_OWNER_ID = "demo-member-owner";

const globalForDemo = globalThis as unknown as {
  demoWorkspaceStore?: Map<string, DemoState>;
};

function getStore() {
  if (!globalForDemo.demoWorkspaceStore) {
    globalForDemo.demoWorkspaceStore = new Map<string, DemoState>();
  }

  return globalForDemo.demoWorkspaceStore;
}

function titleizeWorkspaceSlug(workspaceSlug: string) {
  if (workspaceSlug === "default") {
    return "Pulseboard Workspace";
  }

  return workspaceSlug
    .split(/[-_]/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function buildMembers(): DemoMember[] {
  return [
    { id: DEMO_OWNER_ID, userExternalId: "mock-user", displayName: "Demo User", role: Role.OWNER },
    { id: "demo-member-ana", userExternalId: "demo-ana", displayName: "Ana", role: Role.ADMIN },
    { id: "demo-member-leo", userExternalId: "demo-leo", displayName: "Leo", role: Role.MEMBER },
    { id: "demo-member-nia", userExternalId: "demo-nia", displayName: "Nia", role: Role.MEMBER },
  ];
}

function buildTasks(workspaceSlug: string): DemoTask[] {
  const members = buildMembers();
  const today = Date.now();
  const assignees = members.map((member) => member.displayName);

  const seeds: Array<{
    suffix: string;
    title: string;
    description: string;
    status: BoardStatus;
    priority: TaskDto["priority"];
    labels: string[];
    assigneeIndex: number;
    dueOffsetDays: number;
  }> = [
    {
      suffix: "001",
      title: "Close production runtime gap",
      description: "Replace local-only deployment values with stable hosted services.",
      status: "backlog",
      priority: "urgent",
      labels: ["ops", "infra"],
      assigneeIndex: 0,
      dueOffsetDays: 1,
    },
    {
      suffix: "002",
      title: "Refine activity feed cards",
      description: "Improve hierarchy and readability for timeline events.",
      status: "backlog",
      priority: "normal",
      labels: ["ux"],
      assigneeIndex: 1,
      dueOffsetDays: 3,
    },
    {
      suffix: "003",
      title: "Audit board keyboard shortcuts",
      description: "Validate command palette and workspace route shortcuts.",
      status: "to_do",
      priority: "high",
      labels: ["qa", "accessibility"],
      assigneeIndex: 2,
      dueOffsetDays: 2,
    },
    {
      suffix: "004",
      title: "Ship executive reports view",
      description: "Lock workload, overdue and completed metrics for stakeholders.",
      status: "to_do",
      priority: "high",
      labels: ["reports"],
      assigneeIndex: 3,
      dueOffsetDays: 4,
    },
    {
      suffix: "005",
      title: "Tune drag and drop feedback",
      description: "Reduce friction in card movement and syncing states.",
      status: "in_progress",
      priority: "normal",
      labels: ["board", "frontend"],
      assigneeIndex: 0,
      dueOffsetDays: 0,
    },
    {
      suffix: "006",
      title: "Harden workspace permissions",
      description: "Validate role-aware UI and server checks across settings pages.",
      status: "in_progress",
      priority: "urgent",
      labels: ["security", "roles"],
      assigneeIndex: 1,
      dueOffsetDays: 1,
    },
    {
      suffix: "007",
      title: "Publish client handover notes",
      description: "Summarize deploy, QA evidence and follow-up actions.",
      status: "done",
      priority: "low",
      labels: ["docs"],
      assigneeIndex: 2,
      dueOffsetDays: -1,
    },
    {
      suffix: "008",
      title: "Verify realtime presence layer",
      description: "Confirm connection states degrade gracefully when sockets are offline.",
      status: "done",
      priority: "normal",
      labels: ["realtime"],
      assigneeIndex: 3,
      dueOffsetDays: -2,
    },
  ];

  return seeds.map((seed) => ({
    id: `demo-${workspaceSlug}-${seed.suffix}`,
    title: seed.title,
    description: seed.description,
    status: seed.status,
    priority: seed.priority,
    labels: seed.labels,
    assignee: assignees[seed.assigneeIndex],
    assigneeId: members[seed.assigneeIndex]?.id ?? DEMO_OWNER_ID,
    dueDate: new Date(today + seed.dueOffsetDays * DAY_MS).toISOString().slice(0, 10),
  }));
}

function buildActivities(workspaceSlug: string, members: DemoMember[], tasks: DemoTask[]): DemoActivity[] {
  const today = Date.now();

  return [
    {
      id: `demo-activity-${workspaceSlug}-001`,
      actor: members[0]?.displayName ?? "Demo User",
      eventType: `workspace.ready:${tasks.length}`,
      createdAt: new Date(today - 45 * 60000),
    },
    {
      id: `demo-activity-${workspaceSlug}-002`,
      actor: members[1]?.displayName ?? "Ana",
      eventType: `task.moved:${tasks[4]?.id ?? "demo-task"}`,
      createdAt: new Date(today - 20 * 60000),
    },
    {
      id: `demo-activity-${workspaceSlug}-003`,
      actor: members[2]?.displayName ?? "Leo",
      eventType: `report.reviewed:${workspaceSlug}`,
      createdAt: new Date(today - 5 * 60000),
    },
  ];
}

function createInitialState(workspaceSlug: string): DemoState {
  const members = buildMembers();
  const tasks = buildTasks(workspaceSlug);
  const activities = buildActivities(workspaceSlug, members, tasks);

  return {
    members,
    tasks,
    activities,
  };
}

function getState(workspaceSlug: string) {
  const store = getStore();
  const existing = store.get(workspaceSlug);
  if (existing) {
    return existing;
  }

  const created = createInitialState(workspaceSlug);
  store.set(workspaceSlug, created);
  return created;
}

export function isDemoWorkspaceId(organizationId: string) {
  return organizationId.startsWith("demo-org-");
}

export function getDemoWorkspaceContext(workspaceSlug: string) {
  const state = getState(workspaceSlug);
  const owner = state.members.find((member) => member.id === DEMO_OWNER_ID) ?? state.members[0];

  return {
    organization: {
      id: `demo-org-${workspaceSlug}`,
      slug: workspaceSlug,
      name: titleizeWorkspaceSlug(workspaceSlug),
      externalId: null,
    },
    member: {
      id: owner?.id ?? DEMO_OWNER_ID,
      displayName: owner?.displayName ?? "Demo User",
      role: owner?.role ?? Role.OWNER,
    },
    project: {
      id: `demo-project-${workspaceSlug}`,
      key: "CORE",
      name: "Core Board",
    },
  };
}

export function listDemoTasks(workspaceSlug: string, status?: BoardStatus, page = 1, pageSize = 50) {
  const state = getState(workspaceSlug);
  const filtered = status ? state.tasks.filter((task) => task.status === status) : state.tasks;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
    },
  };
}

export function createDemoTask(workspaceSlug: string, input: {
  title: string;
  description: string;
  status: BoardStatus;
  priority: TaskDto["priority"];
  labels: string[];
}) {
  const state = getState(workspaceSlug);
  const now = Date.now();
  const item: DemoTask = {
    id: `demo-${workspaceSlug}-${now.toString(36)}`,
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    labels: input.labels,
    assignee: "Demo User",
    assigneeId: DEMO_OWNER_ID,
    dueDate: new Date(now + 3 * DAY_MS).toISOString().slice(0, 10),
  };

  state.tasks.unshift(item);
  state.activities.unshift({
    id: `demo-activity-${workspaceSlug}-${now.toString(36)}`,
    actor: "Demo User",
    eventType: `task.created:${item.id}`,
    createdAt: new Date(now),
  });

  return item;
}

export function moveDemoTask(workspaceSlug: string, taskId: string, status: BoardStatus) {
  const state = getState(workspaceSlug);
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) {
    return null;
  }

  task.status = status;
  state.activities.unshift({
    id: `demo-activity-${workspaceSlug}-move-${Date.now().toString(36)}`,
    actor: "Demo User",
    eventType: `task.moved:${task.id}:${status}`,
    createdAt: new Date(),
  });

  return task;
}

export function getDemoTask(workspaceSlug: string, taskId: string) {
  const state = getState(workspaceSlug);
  return state.tasks.find((task) => task.id === taskId) ?? null;
}

export function getDemoMembers(workspaceSlug: string) {
  return getState(workspaceSlug).members;
}

export function getDemoMember(workspaceSlug: string, memberId: string) {
  return getState(workspaceSlug).members.find((member) => member.id === memberId) ?? null;
}

export function getDemoActivity(workspaceSlug: string) {
  return getState(workspaceSlug).activities;
}

export function getDemoReports(workspaceSlug: string) {
  const state = getState(workspaceSlug);
  const now = new Date().toISOString().slice(0, 10);

  const completed = state.tasks.filter((task) => task.status === "done").length;
  const blocked = state.tasks.filter((task) => task.status === "backlog").length;
  const overdue = state.tasks.filter((task) => task.status !== "done" && task.dueDate < now).length;
  const workload = state.members.map((member) => ({
    id: member.id,
    displayName: member.displayName,
    assignedTasks: state.tasks.filter((task) => task.assigneeId === member.id).length,
  }));

  return {
    completed,
    blocked,
    overdue,
    workload,
  };
}
