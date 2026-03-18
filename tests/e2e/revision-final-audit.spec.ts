import { expect, test } from "@playwright/test";

test.describe("Revision final audit", () => {
  test("validates critical navigation and board workflow in mock mode", async ({ page }) => {
    test.skip(process.env.NEXT_PUBLIC_AUTH_PROVIDER !== "mock", "Audit spec is intended for mock auth mode");

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Work management that feels fast, clean and expensive.");

    await page.goto("/privacidad");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Politica de Privacidad/i);

    await page.goto("/app/w/default/board");
    await expect(page).toHaveURL(/\/app\/w\/default\/board/);
    await expect(page.getByTestId("connection-state")).toContainText(/Conectado|Conectando/);
    await expect(page.getByTestId("presence-user").first()).toBeVisible();
    await expect(page.getByTestId("column-backlog")).toBeVisible();
    await expect(page.getByTestId("column-to_do")).toBeVisible();

    const taskTitle = `Audit Task ${Date.now()}`;
    await page.getByTestId("create-task-input").fill(taskTitle);
    await page.getByTestId("create-task-status").selectOption("backlog");
    await page.getByTestId("create-task-button").click();

    const createdTask = page.locator(`[data-task-title="${taskTitle}"]`).first();
    await expect(createdTask).toBeVisible();

    await page.getByRole("link", { name: taskTitle }).click();
    await expect(page).toHaveURL(/\/app\/w\/default\/task\//);

    await page.getByRole("link", { name: /Board/i }).click();
    await expect(page).toHaveURL(/\/app\/w\/default\/board/);
    await expect(page.locator(`[data-task-title="${taskTitle}"]`).first()).toBeVisible();
  });
});
