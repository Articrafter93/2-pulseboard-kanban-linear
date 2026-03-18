import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isClerkAuthEnabled } from "@/lib/auth-runtime";

export default async function AppRootPage() {
  if (!isClerkAuthEnabled) {
    redirect("/app/w/default/board");
  }

  const { userId, orgSlug } = await auth();
  if (!userId) {
    redirect("/signin");
  }

  if (!orgSlug) {
    redirect("/select-org");
  }

  redirect(`/app/w/${orgSlug}/board`);
}
