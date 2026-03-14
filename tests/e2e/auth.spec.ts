import { expect, test } from "@playwright/test";
import { signInWithClerk } from "./helpers/auth";

test.describe("Authentication", () => {
  test("redirects unauthenticated users from board to signin", async ({ page }) => {
    test.skip(process.env.NEXT_PUBLIC_AUTH_PROVIDER !== "clerk", "Only applies when Clerk auth mode is enabled");
    await page.goto("/app/w/default/board");
    await expect(page).toHaveURL(/\/signin/);
  });

  test("allows a Clerk user to login and access board", async ({ page }) => {
    test.skip(process.env.NEXT_PUBLIC_AUTH_PROVIDER !== "clerk", "Only applies when Clerk auth mode is enabled");
    const email = process.env.E2E_CLERK_EMAIL;
    const password = process.env.E2E_CLERK_PASSWORD;
    test.skip(!email || !password, "E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD are required");

    await signInWithClerk(page, email!, password!);
    await expect(page).toHaveURL(/\/app\/w\/default\/board/);
  });
});
