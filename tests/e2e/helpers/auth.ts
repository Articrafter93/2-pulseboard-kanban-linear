import { expect, Page } from "@playwright/test";

export async function signInWithClerk(page: Page, email: string, password: string) {
  await page.goto("/signin");

  const identifierInput = page.locator('input[name="identifier"], input[type="email"]').first();
  await identifierInput.waitFor({ state: "visible", timeout: 45_000 });
  await identifierInput.fill(email);

  const continueButton = page.getByRole("button", { name: /continue|sign in|continuar/i }).first();
  await continueButton.click();

  const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
  await passwordInput.waitFor({ state: "visible", timeout: 45_000 });
  await passwordInput.fill(password);

  const finalButton = page.getByRole("button", { name: /continue|sign in|iniciar/i }).first();
  await finalButton.click();

  await page.waitForURL(/\/app\/w\/default\/board/, { timeout: 60_000 });
  await expect(page.getByTestId("connection-state")).toBeVisible();
}