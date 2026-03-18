import Link from "next/link";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { env } from "@/lib/env";

type AppShellProps = {
  workspaceId: string;
  title: string;
  children: React.ReactNode;
};

export function AppShell({ workspaceId, title, children }: AppShellProps) {
  const base = `/app/w/${workspaceId}`;
  const notifications = [
    "Realtime sync and rate limiting are active.",
    "Activity feed now persists workspace events.",
    "Use Create Workspace flow to provision your first board.",
  ];

  return (
    <div className="min-h-screen text-text">
      <div className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-line bg-panel/90 px-5 py-4 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center justify-between">
            <strong className="font-[var(--font-display)] text-lg tracking-tight">Pulseboard</strong>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-line px-2 py-1 text-[10px] text-muted">dark</span>
              {env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk" ? (
                <>
                  <OrganizationSwitcher
                    hidePersonal
                    afterSelectOrganizationUrl="/app"
                    afterCreateOrganizationUrl="/app"
                    appearance={{
                      elements: {
                        organizationSwitcherTrigger: "rounded-full border border-line bg-panelAlt px-2 py-1 text-[10px] text-slate-200",
                      },
                    }}
                  />
                  <UserButton />
                </>
              ) : (
                <span className="rounded-full border border-line px-2 py-1 text-[10px] text-amber-300">auth pending</span>
              )}
            </div>
          </div>
          <nav className="space-y-2 text-sm">
            <NavItem href={`${base}/board`} label="Board" />
            <NavItem href={`${base}/list`} label="List" />
            <NavItem href={`${base}/calendar`} label="Calendar" />
            <NavItem href={`${base}/reports`} label="Reports" />
            <NavItem href={`${base}/activity`} label="Activity" />
            <NavItem href={`${base}/settings/members`} label="Members" />
            <NavItem href={`${base}/settings/roles`} label="Roles" />
            <NavItem href={`${base}/settings/profile`} label="Profile" />
          </nav>
          <div className="mt-8 rounded-xl border border-line bg-panelAlt p-3">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Shortcuts</p>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>
                <kbd className="rounded border border-line px-1">Cmd/Ctrl</kbd> +{" "}
                <kbd className="rounded border border-line px-1">K</kbd> command palette
              </li>
              <li>
                <kbd className="rounded border border-line px-1">G</kbd> +{" "}
                <kbd className="rounded border border-line px-1">B</kbd> board
              </li>
              <li>
                <kbd className="rounded border border-line px-1">G</kbd> +{" "}
                <kbd className="rounded border border-line px-1">R</kbd> reports
              </li>
            </ul>
          </div>
        </aside>

        <main className="px-4 py-4 md:px-7 md:py-6">
          <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-line bg-panel/80 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Workspace: {workspaceId}</p>
              <h1 className="font-[var(--font-display)] text-2xl tracking-tight">{title}</h1>
            </div>
            <div className="min-w-[280px] rounded-xl border border-line bg-panelAlt p-3">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Notifications</p>
              <ul className="space-y-1 text-xs text-slate-300">
                {notifications.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-transparent px-3 py-2 text-slate-300 transition hover:border-line hover:bg-panelAlt hover:text-white"
    >
      {label}
    </Link>
  );
}
