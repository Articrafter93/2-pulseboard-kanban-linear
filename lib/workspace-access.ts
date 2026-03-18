import { Role, type Prisma } from "@prisma/client";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isClerkAuthEnabled } from "@/lib/auth-runtime";

type WorkspaceContext = {
  organization: {
    id: string;
    slug: string;
    name: string;
    externalId?: string | null;
  };
  member: {
    id: string;
    displayName: string;
    role: Role;
  };
  project: {
    id: string;
    key: string;
    name: string;
  };
};

type ActiveOrgContext = {
  userId: string;
  orgId: string;
  orgSlug: string;
  orgName: string;
  orgRole: string | null;
  displayName: string;
};

export class WorkspaceAccessError extends Error {
  constructor(
    message: string,
    readonly status: 401 | 403 | 404 | 409,
  ) {
    super(message);
    this.name = "WorkspaceAccessError";
  }
}

function mapClerkRoleToDb(role: string | null | undefined): Role {
  switch (role) {
    case "org:admin":
      return Role.ADMIN;
    case "org:member":
      return Role.MEMBER;
    case "org:guest":
      return Role.GUEST;
    default:
      return Role.OWNER;
  }
}

async function ensurePrimaryProject(
  client: Prisma.TransactionClient | typeof prisma,
  organizationId: string,
) {
  const existingProject = await client.project.findFirst({
    where: { organizationId },
    select: { id: true, key: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  if (existingProject) {
    return existingProject;
  }

  return client.project.create({
    data: {
      organizationId,
      key: "CORE",
      name: "Core Board",
    },
    select: { id: true, key: true, name: true },
  });
}

async function getActiveClerkContext(): Promise<ActiveOrgContext> {
  const { userId, orgId, orgSlug, orgRole } = await auth();

  if (!userId) {
    throw new WorkspaceAccessError("Unauthorized", 401);
  }

  if (!isClerkAuthEnabled) {
    throw new WorkspaceAccessError("Clerk organizations are required", 409);
  }

  if (!orgId || !orgSlug) {
    throw new WorkspaceAccessError("No active organization selected", 409);
  }

  const [user, client] = await Promise.all([currentUser(), clerkClient()]);
  const org = await client.organizations.getOrganization({
    organizationId: orgId,
  });

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ")
    || user?.username
    || user?.primaryEmailAddress?.emailAddress
    || `User ${userId.slice(0, 8)}`;

  return {
    userId,
    orgId,
    orgSlug,
    orgName: org.name,
    orgRole: orgRole ?? null,
    displayName,
  };
}

async function syncWorkspaceToDatabase(
  client: Prisma.TransactionClient | typeof prisma,
  active: ActiveOrgContext,
): Promise<WorkspaceContext> {
  const organization = await client.organization.upsert({
    where: { slug: active.orgSlug },
    update: {
      name: active.orgName,
    },
    create: {
      slug: active.orgSlug,
      name: active.orgName,
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  const member = await client.member.upsert({
    where: {
      organizationId_userExternalId: {
        organizationId: organization.id,
        userExternalId: active.userId,
      },
    },
    update: {
      displayName: active.displayName,
      role: mapClerkRoleToDb(active.orgRole),
    },
    create: {
      organizationId: organization.id,
      userExternalId: active.userId,
      displayName: active.displayName,
      role: mapClerkRoleToDb(active.orgRole),
    },
    select: {
      id: true,
      displayName: true,
      role: true,
    },
  });

  const project = await ensurePrimaryProject(client, organization.id);

  return {
    organization: {
      ...organization,
      externalId: active.orgId,
    },
    member,
    project,
  };
}

export async function getDefaultWorkspaceSlug(userId: string) {
  const active = await getActiveClerkContext();
  if (active.userId !== userId) {
    throw new WorkspaceAccessError("User mismatch", 403);
  }
  return active.orgSlug;
}

export async function getWorkspaceContext(workspaceSlug: string, userId: string): Promise<WorkspaceContext> {
  const active = await getActiveClerkContext();

  if (active.userId !== userId) {
    throw new WorkspaceAccessError("Unauthorized", 401);
  }

  if (active.orgSlug !== workspaceSlug) {
    throw new WorkspaceAccessError("Requested workspace does not match the active organization", 403);
  }

  return prisma.$transaction((tx) => syncWorkspaceToDatabase(tx, active));
}

export async function getCurrentMemberProfile(userId: string, workspaceSlug: string) {
  const { member, organization } = await getWorkspaceContext(workspaceSlug, userId);
  return {
    workspace: organization,
    member,
  };
}
