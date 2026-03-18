import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SelectOrganizationPanel } from "@/components/select-organization-panel";

export default async function SelectOrgPage() {
  const { userId, orgSlug } = await auth();

  if (!userId) {
    redirect("/signin");
  }

  if (orgSlug) {
    redirect(`/app/w/${orgSlug}/board`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
      <SelectOrganizationPanel />
    </main>
  );
}
