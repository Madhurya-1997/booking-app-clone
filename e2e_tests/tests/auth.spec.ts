import { test, expect } from '@playwright/test';

const UI_URL = `http://localhost:5173`

test('user should see the home page', async ({ page }) => {
  await page.goto(UI_URL);

  await expect(page.getByRole('link', { name: "Holidays.com" })).toBeVisible();
});

test('user should be allowed to register an account', async ({ page }) => {
  await page.goto(`${UI_URL}`);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole('heading', { name: "Login to your Account" })).toBeVisible();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(page.getByRole('heading', { name: "Create an Account" })).toBeVisible();

  await page.locator("[name=email]").fill("e2e_new_email@gmail.com")
  await page.locator("[name=password]").fill("e2e_new_password123")
  await page.locator("[name=firstName]").fill("e2e_new_firstName")
  await page.locator("[name=lastName]").fill("e2e_new_lastName")
  await page.locator("[name=confirmPassword]").fill("e2e_new_password123")

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Registration Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test('user should not be allowed to register an account if email already exist', async ({ page }) => {
  await page.goto(`${UI_URL}`);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole('heading', { name: "Login to your Account" })).toBeVisible();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(page.getByRole('heading', { name: "Create an Account" })).toBeVisible();

  await page.locator("[name=email]").fill("e2e_new_email@gmail.com")
  await page.locator("[name=password]").fill("e2e_new_password123")
  await page.locator("[name=firstName]").fill("e2e_new_firstName")
  await page.locator("[name=lastName]").fill("e2e_new_lastName")
  await page.locator("[name=confirmPassword]").fill("e2e_new_password123")

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("User already exists with same email")).toBeVisible();
});

test('user should be allowed to sign in', async ({ page }) => {
  await page.goto(`${UI_URL}`);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole('heading', { name: "Login to your Account" })).toBeVisible();

  await page.locator("[name=email]").fill("e2e_new_email@gmail.com")
  await page.locator("[name=password]").fill("e2e_new_password123")

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Login Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test('user should not be allowed to sign in', async ({ page }) => {
  await page.goto(`${UI_URL}`);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole('heading', { name: "Login to your Account" })).toBeVisible();

  await page.locator("[name=email]").fill(`e2e_new_email@gmail.com`)
  await page.locator("[name=password]").fill("e2e_wrong_password123")

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("User does not exist")).toBeVisible();
});

