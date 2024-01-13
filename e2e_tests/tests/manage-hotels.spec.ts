import { test, expect } from '@playwright/test';
import path from "path";

const UI_URL = `http://localhost:5173`


test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByRole("link", { name: "Sign In" }).click();

    await expect(page.getByRole('heading', { name: "Login to your Account" })).toBeVisible();

    await page.locator("[name=email]").fill("e2e_new_email@gmail.com")
    await page.locator("[name=password]").fill("e2e_new_password123")

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Login Successful!")).toBeVisible();
});

test('user should be able to create new hotel', async ({ page }) => {
    await page.goto(`${UI_URL}/add-hotel`);
    await page.locator('[name="name"]').fill("Test Hotel name")
    await page.locator('[name="city"]').fill("Test Hotel city")
    await page.locator('[name="country"]').fill("Test Hotel country")
    await page.locator('[name="description"]').fill("Test Hotel description")
    await page.locator('[name="pricePerNight"]').fill("10")

    await page.selectOption('select[name="starRating"]', "4")

    await page.getByText("Budget").click()

    await page.getByLabel("Free WiFi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("3")
    await page.locator('[name="childCount"]').fill("2")

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "1.png"),
        path.join(__dirname, "files", "2.png"),
    ])

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Hotel saved!")).toBeVisible();
});


test('user should be able to see list of hotels', async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);

    await expect(page.getByText("Test Hotel name")).toBeVisible();
    await expect(page.getByText("Test Hotel description")).toBeVisible();
    await expect(page.getByText("Test Hotel city, Test Hotel country")).toBeVisible();
    await expect(page.getByText("Budget")).toBeVisible();
    await expect(page.getByText("3 adults, 2 children")).toBeVisible();
    await expect(page.getByText("4 stars")).toBeVisible();
    await expect(page.getByRole("link", { name: "View details" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

// test('user should be able to see list of hotels', async ({ page }) => {
//     await page.goto(`${UI_URL}/my-hotels`);

//     await expect(page.getByText("House of Comfort")).toBeVisible();
//     await expect(page.locator(':has-text("Featuring a garden and")')).toBeVisible();
//     await expect(page.getByText("Delhi, India")).toBeVisible();
//     await expect(page.getByText("Luxury")).toBeVisible();
//     await expect(page.getByText("5 adults, 5 children")).toBeVisible();
//     await expect(page.getByText("5 stars")).toBeVisible();
//     await expect(page.getByRole("link", { name: "View details" })).toBeVisible();
//     await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
// });