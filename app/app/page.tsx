import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function AppRootPage() {
  const { userId, orgSlug } = await auth();
  if (!userId) {
    redirect("/signin");
  }

  if (!orgSlug) {
    redirect("/select-org");
  }

  redirect(`/app/w/${orgSlug}/board`);
}
