const { test, expect } = require('@playwright/test');

test.describe('Purchase Flows - Checkout Form Validations', () => {
    const userEmail = 'testuser@example.com';
    const userPassword = 'ValidPass123';

    test.beforeEach(async ({ page }) => {
        // Seed user and log in before tests
        await page.request.post('/api/signup', {
            data: {
                email: userEmail,
                password: userPassword,
            },
        });

        await page.goto('/login.html');
        await page.fill('#email', userEmail);
        await page.fill('#password', userPassword);
        await page.click('button[type="submit"]');
        await expect(page.locator('#logged-in-user')).toContainText(userEmail);

        // Add items to cart and navigate to checkout
        await page.goto('/gear.html');
        await page.locator('.add-to-basket').nth(0).click();
        await page.locator('.add-to-basket').nth(1).click();
        await page.goto('/checkout.html');
    });

    test('TC1: Error message should display for missing email', async ({ page }) => {
        await page.fill('#email', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('#email-error')).toContainText('Please enter a valid email address.');
    });

    test('TC2: Error message should display for invalid email format', async ({ page }) => {
        await page.fill('#email', 'invalid-email');
        await page.click('button[type="submit"]');
        await expect(page.locator('#email-error')).toContainText('Please enter a valid email address.');
    });

    test('TC3: Error message should display for numbers in first name field', async ({ page }) => {
        await page.fill('#first-name', '123');
        await page.click('button[type="submit"]');
        await expect(page.locator('#first-name-error')).toContainText('Please enter a valid first name (letters only).');
    });

    test('TC4: Error message should display for missing first name', async ({ page }) => {
        await page.fill('#first-name', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('#first-name-error')).toContainText('Please enter a valid first name (letters only).');
    });

    test('TC5: Error message should display for numbers in last name field', async ({ page }) => {
        await page.fill('#last-name', '123');
        await page.click('button[type="submit"]');
        await expect(page.locator('#last-name-error')).toContainText('Please enter a valid last name (letters only).');
    });

    test('TC6: Error message should display for missing last name', async ({ page }) => {
        await page.fill('#last-name', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('#last-name-error')).toContainText('Please enter a valid last name (letters only).');
    });

    test('TC7: Error message should display for too short address', async ({ page }) => {
        await page.fill('#address', 'abcd');
        await page.click('button[type="submit"]');
        await expect(page.locator('#address-error')).toContainText('Address must be at least 5 characters long.');
    });

    test('TC8: Error message should display for missing address field', async ({ page }) => {
        await page.fill('#address', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('#address-error')).toContainText('Address must be at least 5 characters long.');
    });

    test('TC9: Error message should display for missing country', async ({ page }) => {
        await page.click('button[type="submit"]');
        await expect(page.locator('#country-error')).toContainText('Please select your country.');
    });

    test('TC10: Error message should display for missing city field', async ({ page }) => {
        await page.fill('#city', '');
        await page.click('button[type="submit"]');
        await expect(page.locator('#city-error')).toContainText('City cannot be empty.');
    });

    test('TC11: Error message should display for too short postcode', async ({ page }) => {
        await page.fill('#postcode', '123');
        await page.click('button[type="submit"]');
        await expect(page.locator('#postcode-error')).toContainText('Postcode must be 4-6 digits.');
    });

    test('TC12: Error message should display for too long postcode', async ({ page }) => {
        await page.fill('#postcode', '1234567');
        await page.click('button[type="submit"]');
        await expect(page.locator('#postcode-error')).toContainText('Postcode must be 4-6 digits.');
    });

    test('TC13: Error message should display for numbers in cardholder name', async ({ page }) => {
        await page.fill('#card-name', '1234567');
        await page.click('button[type="submit"]');
        await expect(page.locator('#card-name-error')).toContainText('Cardholder name must contain letters only.');
    });

    test('TC14: Error message should display for invalid card number', async ({ page }) => {
        await page.fill('#card-number', '1234567891011');
        await page.click('button[type="submit"]');
        await expect(page.locator('#card-number-error')).toContainText('Card number must be 16 digits.');
    });

    test('TC15: Error message should display for past expiry date', async ({ page }) => {
        await page.fill('#expiry-date', '2024-01'); // Example: MM/YY format
        await page.click('button[type="submit"]');
        await expect(page.locator('#expiry-date-error')).toContainText('Expiry date must be in the future.');
    });

    test('TC16: Error message should display for invalid CVV', async ({ page }) => {
        await page.fill('#cvv', '1');
        await page.click('button[type="submit"]');
        await expect(page.locator('#cvv-error')).toContainText('CVV must be 3 digits.');
    });
});