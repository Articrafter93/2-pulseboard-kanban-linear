import { Priority, Role } from "@prisma/client";
import { prisma } from "./prisma";
import { boardStatusToDb, BoardStatus, dbStatusToBoard } from "./task-status";
import type { TaskDto } from "./task-dto";

type SeedTaskInput = {
  title: string;
  description: string;
  status: BoardStatus;
  priority: Priority;
  assigneeId?: string;
  labels?: string[];
};

function makeSeedTasks(assigneeIds: string[]): SeedTaskInput[] {
  const statuses: BoardStatus[] = ["backlog", "to_do", "in_progress", "done"];
  const priorities: Priority[] = ["HIGH", "NORMAL", "LOW", "URGENT"];
  const generated: SeedTaskInput[] = [];

  for (let index = 0; index < 240; index += 1) {
    const backlogBurst = index < 210 ? "backlog" : statuses[index % statuses.length];
    generated.push({
      title: `Pulse task ${index + 1}`,
      description: "Task generated for baseline realtime and virtualization verification.",
      status: backlogBurst,
      priority: priorities[index % priorities.length],
      assigneeId: assigneeIds[index % assigneeIds.length],
      labels: index % 3 === 0 ? ["realtime", "kanban"] : ["kanban"],
    });
  }

  return generated;
}

export async function ensureWorkspaceSeed(workspaceSlug = "default") {
  const organization = await prisma.organization.upsert({
    where: { slug: workspaceSlug },
    update: {},
    create: {
      slug: workspaceSlug,
      name: workspaceSlug === "default" ? "Pulseboard Workspace" : workspaceSlug,
    },
  });

  const project = await prisma.project.upsert({
    where: {
      organizationId_key: {
        organizationId: organization.id,
        key: "CORE",
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: "Core Board",
      key: "CORE",
    },
  });

  const members = await prisma.member.findMany({
    where: { organizationId: organization.id },
    select: { id: true, displayName: true },
  });

  let memberIds = members.map((member) => member.id);

  if (memberIds.length === 0) {
    await prisma.member.createMany({
      data: [
        { organizationId: organization.id, userExternalId: "seed-owner", displayName: "Ana", role: Role.OWNER },
        { organizationId: organization.id, userExternalId: "seed-admin", displayName: "Leo", role: Role.ADMIN },
        { organizationId: organization.id, userExternalId: "seed-member-1", displayName: "Sam", role: Role.MEMBER },
        { organizationId: organization.id, userExternalId: "seed-member-2", displayName: "Nia", role: Role.MEMBER },
      ],
    });

    const createdMembers = await prisma.member.findMany({
      where: { organizationId: organization.id },
      select: { id: true },
    });
    memberIds = createdMembers.map((member) => member.id);
  }

  const taskCount = await prisma.task.count({
    where: { organizationId: organization.id, projectId: project.id },
  });

  if (taskCount === 0) {
    const taskData = makeSeedTasks(memberIds).map((task, index) => ({
      organizationId: organization.id,
      projectId: project.id,
      assigneeId: task.assigneeId,
      title: task.title,
      description: task.description,
      status: boardStatusToDb(task.status),
      priority: task.priority,
      labels: task.labels ?? [],
      dueDate: new Date(Date.now() + (index % 21) * 86400000),
    }));

    await prisma.task.createMany({ data: taskData });
  }

  return { organization, project };
}

export function priorityToUi(priority: Priority): TaskDto["priority"] {
  switch (priority) {
    case "URGENT":
      return "urgent";
    case "HIGH":
      return "high";
    case "NORMAL":
      return "normal";
    case "LOW":
      return "low";
    default:
      return "normal";
  }
}

export function priorityFromUi(priority: TaskDto["priority"]): Priority {
  switch (priority) {
    case "urgent":
      return "URGENT";
    case "high":
      return "HIGH";
    case "normal":
      return "NORMAL";
    case "low":
      return "LOW";
    default:
      return "NORMAL";
  }
}

export function mapTaskToDto(task: {
  id: string;
  title: string;
  description: string;
  status: import("@prisma/client").TaskStatus;
  priority: Priority;
  labels: string[];
  dueDate: Date | null;
  assignee: { displayName: string } | null;
}): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: dbStatusToBoard(task.status),
    priority: priorityToUi(task.priority),
    labels: task.labels,
    assignee: task.assignee?.displayName ?? "Unassigned",
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "-",
  };
}
