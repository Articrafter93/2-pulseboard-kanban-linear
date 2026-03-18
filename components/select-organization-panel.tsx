"use client";

import { useState } from "react";
import { OrganizationSwitcher, useOrganizationList } from "@clerk/nextjs";

export function SelectOrganizationPanel() {
  const { isLoaded, setActive, createOrganization, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const memberships = userMemberships?.data ?? [];

  async function handleCreateOrganization() {
    const name = newOrganizationName.trim();
    if (!name || !createOrganization) {
      return;
    }

    setIsCreating(true);
    try {
      const organization = await createOrganization({ name });
      await setActive({ organization: organization.id });
      window.location.assign(`/app/w/${organization.slug}/board`);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSelectOrganization(orgId: string, slug: string | null) {
    if (!setActive) {
      return;
    }
    await setActive({ organization: orgId });
    window.location.assign(slug ? `/app/w/${slug}/board` : "/app");
  }

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-line bg-panel p-6 shadow-soft">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl">Select Organization</h1>
          <p className="mt-2 text-sm text-muted">
            This app now uses Clerk organizations as the source of truth for workspaces.
          </p>
        </div>
        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/app"
          afterCreateOrganizationUrl="/app"
          createOrganizationMode="modal"
          appearance={{
            elements: {
              organizationSwitcherTrigger: "rounded-lg border border-line bg-panelAlt px-3 py-2 text-sm",
            },
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-line bg-panelAlt p-4">
          <h2 className="mb-3 font-semibold">Your organizations</h2>
          {!isLoaded ? (
            <p className="text-sm text-muted">Loading organizations...</p>
          ) : memberships.length === 0 ? (
            <p className="text-sm text-muted">You do not belong to any organization yet. Create one to continue.</p>
          ) : (
            <div className="space-y-2">
              {memberships.map((membership) => (
                <button
                  key={membership.id}
                  type="button"
                  onClick={() => void handleSelectOrganization(membership.organization.id, membership.organization.slug)}
                  className="flex w-full items-center justify-between rounded-lg border border-line bg-panel px-3 py-3 text-left hover:border-accent"
                >
                  <span>
                    <span className="block font-medium">{membership.organization.name}</span>
                    <span className="block text-xs uppercase tracking-wide text-muted">{membership.role}</span>
                  </span>
                  <span className="text-xs text-muted">{membership.organization.slug}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-panelAlt p-4">
          <h2 className="mb-3 font-semibold">Create organization</h2>
          <div className="space-y-3">
            <input
              value={newOrganizationName}
              onChange={(event) => setNewOrganizationName(event.target.value)}
              placeholder="Acme Product Team"
              className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
            />
            <button
              type="button"
              onClick={() => void handleCreateOrganization()}
              disabled={!isLoaded || isCreating}
              className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#111318] disabled:opacity-60"
            >
              {isCreating ? "Creating..." : "Create and continue"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
