import { test, expect } from '@playwright/test';

test.describe('E2E Test: Complete happy flow with signup, login, and purchase', () => {
  test('Full E2E Happy Flow: browse gear, add items, register, login, checkout, and complete order', async ({ page }) => {
    const uniqueEmail = `user${Date.now()}@example.com`;
    const userPassword = 'ValidPass123';

    // Step 1: Browse welcome page and add items to cart
    await page.goto('http://localhost:5000');
    await page.locator('.featured-items .add-to-basket').nth(0).click(); // Add Mask & Snorkel Set to cart
    await page.locator('.featured-items .add-to-basket').nth(1).click(); // Add Full Body Wetsuit to Cart
    await expect(page.locator('#basket-counter')).toHaveText('2'); // Verify cart counter updates

    // Step 2: Browse gear page and add items to cart
    await page.goto('/gear.html');
    await page.locator('.add-to-basket').nth(2).click(); // Add Diving Fins to Cart
    await page.locator('.add-to-basket').nth(6).click(); // Add Diving boots to Cart
    await page.locator('.add-to-basket').nth(9).click(); // Add Gear Bag to Cart
    await page.locator('.add-to-basket').nth(10).click(); // Add Underwater Camera to Cart
    await expect(page.locator('#basket-counter')).toHaveText('6'); // Verify cart counter updates

    // Step 3: Navigate to cart and proceed to checkout
    await page.locator('nav a', { hasText: 'Cart' }).click();
    await page.locator('.checkout-button').click();
    await expect(page).toHaveURL('/login.html');

    // Step 4: Redirect to signup page and register
    await page.locator('a[href="signup.html"]').click();
    await page.fill('#email', uniqueEmail);
    await page.fill('#password', userPassword);
    await page.fill('#confirm-password', userPassword);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#signup-message')).toHaveText('User registered successfully!');

    // Step 5: Log in as the registered user
    await page.locator('nav a', { hasText: 'Login' }).click();
    await page.fill('#email', uniqueEmail);
    await page.fill('#password', userPassword);
    await page.locator('#login-form button[type="submit"]').click();
    await expect(page.locator('#logged-in-user')).toContainText(uniqueEmail);

    // Step 6: Navigate to cart and proceed to checkout
    await page.locator('nav a', { hasText: 'Cart' }).click();
    await page.locator('.checkout-button').click();

    // Step 7: Fill out checkout form
    await page.fill('#email', uniqueEmail);
    await page.fill('#first-name', 'Test');
    await page.fill('#last-name', 'User');
    await page.fill('#address', '123 Test Street');
    await page.fill('#city', 'Test City');
    await page.fill('#postcode', '12345');
    await page.selectOption('#country', 'United States');
    await page.fill('#card-name', 'Test User');
    await page.fill('#card-number', '4111111111111111');
    await page.fill('#expiry-date', '2025-12');
    await page.fill('#cvv', '123');

    // Step 8: Submit the form and verify alert
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Thank you for your order!');
      await dialog.accept();
    });

    await page.locator('button[type="submit"]').click();

    // Step 9: Verify redirect to welcome page
    await expect(page).toHaveURL('/welcome.html');
  });
});