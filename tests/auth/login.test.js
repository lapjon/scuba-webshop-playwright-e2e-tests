const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow - Login Page', () => {
    let uniqueEmail; // Declare at the describe block level

    test.beforeAll(async ({ request }) => {
        // Generate a unique email for the test
        uniqueEmail = `testuser${Date.now()}@example.com`;

        // Create a user via API
        const response = await request.post('http://localhost:5000/api/signup', {
            data: {
                name: 'Test User',
                email: uniqueEmail,
                password: 'Password123',
            },
        });

        // Ensure signup is successful
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        console.log('User seeded:', responseBody);
    });

    test.beforeEach(async ({ page }) => {
        // Navigate to the login page
        await page.goto('/login.html');
    });

    test('TC1: Verify successfull login with valid credentials', async ({ page }) => {
        // Fill in valid credentials
        await page.fill('#email', uniqueEmail); // Replace with actual valid email
        await page.fill('#password', 'Password123');   // Replace with actual valid password
        await page.click('button[type="submit"]');

        // Verify redirection
        await expect(page).toHaveURL('/gear.html'); 
        // Assert that the logged-in user element in header contains the expected email
        await expect(page.locator('#logged-in-user')).toContainText(uniqueEmail);
    });

    test('TC2: Verify Login should fail with invalid credentials', async ({ page }) => {
        // Fill in invalid credentials
        await page.fill('#email', uniqueEmail);
        await page.fill('#password', 'WrongPassword123');
        await page.click('button[type="submit"]');

        // Verify error message
        const errorMessage = page.locator('#error-message');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Invalid email or password.');
    });

    test('TC3: Verify user can logout successfully', async ({ page }) => {
        // Fill in invalid credentials
        await page.fill('#email', uniqueEmail);
        await page.fill('#password', 'Password123');
        await page.click('button[type="submit"]');
  
        // Assert that the logged-in user element in header contains the expected email
        await expect(page.locator('#logged-in-user')).toContainText(uniqueEmail);
        // Assert that logout link is visible
        await expect(page.locator('#logout-link')).toBeVisible();
        // Click the logout link
        await page.click('#logout-link');
        // Assert that the logged-in user element is no longer visible
        await expect(page.locator('#logged-in-user')).not.toBeVisible();
        // Assert that the login link is visible
        await expect(page.locator('#login-link')).toBeVisible(); 
        // Verify link redirects to the Welcome page
        await expect(page).toHaveURL(/\/welcome\.html/);
    });

    test('TC4: Verify Login should fail for non-existant user', async ({ page }) => {
        // Fill in non-existing email
        await page.fill('#email', 'nonexistinguser@email.com');
        await page.fill('#password', 'WrongPassword123');
        await page.click('button[type="submit"]');

        // Verify error message
        const errorMessage = page.locator('#error-message');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Invalid email or password.');
    });

    test('TC5: Verify error message for empty password field', async ({ page }) => {
        // Fill in email
        await page.fill('#email', 'nonexistinguser@email.com');
        // Submit without entering password
        await page.click('button[type="submit"]');

        // Verify the error message is visible and contains the expected text
        await expect(page.locator('#error-message')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('#error-message')).toContainText('Email and password are required.');
    });

    test('TC6: Verify error message for empty email field', async ({ page }) => {
        // Fill in password without entering email
        await page.fill('#password', 'Password123');
        // Submit without entering password
        await page.click('button[type="submit"]');

        // Verify the error message is visible and contains the expected text
        await expect(page.locator('#error-message')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('#error-message')).toContainText('Email and password are required.');
    });

    test('TC7: Verify error message for invalid email format', async ({ page }) => {
        // Fill in email with invalid format
        await page.fill('#email', 'invalid-email');
        await page.fill('#password', 'Password123');
        // Submit without entering password
        await page.click('button[type="submit"]');

        // Verify the error message is visible and contains the expected text
        await expect(page.locator('#error-message')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('#error-message')).toContainText('Invalid email or password.');
    });


});