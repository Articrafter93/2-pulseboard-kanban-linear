import { AppShell } from "@/components/app-shell";

export default async function WorkspaceLayout({
  params,
  children,
}: {
  params: Promise<{ workspaceId: string }>;
  children: React.ReactNode;
}) {
  const { workspaceId } = await params;
  return (
    <AppShell workspaceId={workspaceId} title="Pulseboard Workspace">
      {children}
    </AppShell>
  );
}

