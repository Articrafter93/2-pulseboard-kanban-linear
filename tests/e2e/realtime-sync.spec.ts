import { expect, test } from "@playwright/test";
import { signInWithClerk } from "./helpers/auth";

test.describe("Realtime sync", () => {
  test("syncs task movement and collaborator presence across two clients", async ({ browser }) => {
    const emailA = process.env.E2E_CLERK_EMAIL;
    const passwordA = process.env.E2E_CLERK_PASSWORD;
    const emailB = process.env.E2E_CLERK_EMAIL_2;
    const passwordB = process.env.E2E_CLERK_PASSWORD_2;

    test.skip(
      !emailA || !passwordA || !emailB || !passwordB,
      "Define E2E_CLERK_EMAIL/_PASSWORD y E2E_CLERK_EMAIL_2/_PASSWORD_2",
    );

    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await signInWithClerk(pageA, emailA!, passwordA!);
    await signInWithClerk(pageB, emailB!, passwordB!);

    await expect(pageA.getByTestId("presence-user").first()).toBeVisible();
    await expect(pageB.getByTestId("presence-user").first()).toBeVisible();

    const taskTitle = `Realtime Task ${Date.now()}`;
    await pageA.getByTestId("create-task-input").fill(taskTitle);
    await pageA.getByTestId("create-task-status").selectOption("backlog");
    await pageA.getByTestId("create-task-button").click();

    await expect(pageB.getByText(taskTitle).first()).toBeVisible({ timeout: 20_000 });

    const taskOnA = pageA.locator(`[data-task-title="${taskTitle}"]`).first();
    await taskOnA.dragTo(pageA.getByTestId("column-in_progress"));

    await expect(pageB.getByTestId("column-in_progress").getByText(taskTitle).first()).toBeVisible({ timeout: 20_000 });

    await pageA.mouse.move(200, 250);
    await expect(pageB.getByTestId("presence-cursor").first()).toBeVisible({ timeout: 10_000 });

    await contextA.close();
    await contextB.close();
  });

  test("shows reconnecting state when network drops", async ({ page }) => {
    const email = process.env.E2E_CLERK_EMAIL;
    const password = process.env.E2E_CLERK_PASSWORD;
    test.skip(!email || !password, "E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD are required");

    await signInWithClerk(page, email!, password!);

    await page.context().setOffline(true);
    await expect(page.getByTestId("connection-state")).toContainText(/Sin conexión|Reconectando/);

    await page.context().setOffline(false);
    await expect(page.getByTestId("connection-state")).toContainText("Conectado", { timeout: 15_000 });
  });
});