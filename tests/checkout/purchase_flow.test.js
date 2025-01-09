const { test, expect } = require('@playwright/test');

test.describe('Purchase Flows', () => {
    const userEmail = 'testuser@example.com';
    const userPassword = 'ValidPass123';

    test.beforeAll(async ({ request }) => {
        // Seed the user before tests
        await request.post('/api/signup', {
            data: {
                email: userEmail,
                password: userPassword,
            },
        });
    });

    test.beforeEach(async ({ page }) => {
        // Log in before each test
        await page.goto('/login.html');
        await page.fill('#email', userEmail);
        await page.fill('#password', userPassword);
        await page.click('button[type="submit"]');
        await expect(page.locator('#logged-in-user')).toContainText(userEmail);
    });

    test('Test 1: Verify successful purchase flow for signed-in user', async ({ page }) => {
        const alertMessages = [];
        page.on('dialog', async (dialog) => {
            alertMessages.push(dialog.message());
            await dialog.accept();
        });

        // Add items to the basket
        await page.goto('/gear.html');
        await page.locator('.add-to-basket').nth(0).click(); // Add first item
        await expect(alertMessages).toContain('Mask & Snorkel Set has been added to your basket!');
        await page.locator('.add-to-basket').nth(1).click(); // Add second item
        await expect(alertMessages).toContain('Full Body Wetsuit has been added to your basket!');

        // Proceed to checkout
        await page.goto('/basket.html');
        await page.click('.checkout-button');

        // Fill out checkout form
        await page.fill('#email', userEmail);
        await page.fill('#first-name', 'Test');
        await page.fill('#last-name', 'User');
        await page.fill('#address', '123 Test Street');
        await page.fill('#city', 'Test City');
        await page.fill('#postcode', '12345');
        await page.selectOption('#country', 'United States');
        await page.fill('#card-name', 'Test User');
        await page.fill('#card-number', '4111111111111111');
        await page.fill('#expiry-date', '2025-12'); // Correct format
        await page.fill('#cvv', '123');

        // Submit the form
        await page.click('button[type="submit"]');
        await expect(alertMessages).toContain('Thank you for your order!');
        // Assert redirect back to Welcome page
        await expect(page).toHaveURL('/welcome.html');
    });

    test('Test 2: Verify cart summary on Checkout Page', async ({ page }) => {
        const expectedData = [
            ['Diving Fins', '2', '$139.98'],
            ['Dive Computer', '1', '$295.99'],
            ['Diving Boots', '1', '$26.99'],
            ['Dive Torch', '2', '$79.98'],
            ['Total', '', '$542.94'],
        ];
    
        // Add items to the cart
        await page.goto('/gear.html');
        await page.locator('.add-to-basket').nth(2).click(); // Diving Fins
        await page.locator('.add-to-basket').nth(2).click(); // Diving Fins again
        await page.locator('.add-to-basket').nth(6).click(); // Diving Boots
        await page.locator('.add-to-basket').nth(3).click(); // Dive Computer
        await page.locator('.add-to-basket').nth(11).click(); // Dive Torch
        await page.locator('.add-to-basket').nth(11).click(); // Dive Torch again
    
        // Proceed to checkout
        await page.goto('/basket.html');
        await page.click('.checkout-button');
    
        // Filter out unnecessary rows (e.g., headers, footers)
        const rows = page.locator('.basket-summary-table tbody tr').filter({
            hasNot: page.locator('th'), // Exclude header rows
        });
    
        // Adjust the count based on expected data
        await expect(rows).toHaveCount(expectedData.length);
    
        // Verify table data
        for (let i = 0; i < expectedData.length; i++) {
            const row = rows.nth(i);
            const [itemName, quantity, price] = expectedData[i];
    
            if (itemName === 'Total') {
                // Verify total row
                const totalRow = rows.last();
                await expect(totalRow.locator('td').nth(2)).toHaveText(price);
            } else {
                // Verify data rows
                await expect(row.locator('td').nth(0)).toHaveText(itemName);
                await expect(row.locator('td').nth(1)).toHaveText(quantity);
                await expect(row.locator('td').nth(2)).toHaveText(price);
            }
        }
    });
});