import { expect, test } from "@playwright/test";
import { signInWithClerk } from "./helpers/auth";

test("creates, moves and persists a Kanban card", async ({ page }) => {
  const email = process.env.E2E_CLERK_EMAIL;
  const password = process.env.E2E_CLERK_PASSWORD;
  test.skip(!email || !password, "E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD are required");

  await signInWithClerk(page, email!, password!);

  const taskTitle = `E2E Task ${Date.now()}`;

  await page.getByTestId("create-task-input").fill(taskTitle);
  await page.getByTestId("create-task-status").selectOption("backlog");
  await page.getByTestId("create-task-button").click();

  const createdTask = page.locator(`[data-task-title="${taskTitle}"]`).first();
  await expect(createdTask).toBeVisible();

  const targetColumn = page.getByTestId("column-to_do");
  await createdTask.dragTo(targetColumn);

  await expect(targetColumn.getByText(taskTitle).first()).toBeVisible({ timeout: 20_000 });

  await page.reload();
  await expect(page.getByTestId("column-to_do").getByText(taskTitle).first()).toBeVisible({ timeout: 20_000 });
});