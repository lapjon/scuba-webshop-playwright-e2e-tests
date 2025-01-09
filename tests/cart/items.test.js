const { test, expect } = require('@playwright/test');

test.describe('Items - Unsigned Users', () => {
    test('TC1: Add items from the Welcome Page as unsigned user', async ({ page }) => {
        await page.goto('/welcome.html');
        // Add items to cart
        await page.locator('.featured-items .add-to-basket').nth(0).click();
        await page.locator('.featured-items .add-to-basket').nth(1).click();
        await page.locator('.featured-items .add-to-basket').nth(2).click();
        // Assert correct number of items
        await expect(page.locator('#basket-counter')).toHaveText('3');
    });

    test('TC2: Add items from Gear Page as unsigned user', async ({ page }) => {
        await page.goto('/gear.html');
        // Add items to cart
        await page.locator('.add-to-basket').nth(0).click();
        await page.locator('.add-to-basket').nth(1).click();
        await page.locator('.add-to-basket').nth(2).click();
        // Assert correct number of items
        await expect(page.locator('#basket-counter')).toHaveText('3');
    });

    test('TC3: Add and remove items from Gear Page as unsigned user', async ({ page }) => {
        // Handle the alerts
        page.on('dialog', async (dialog) => {
        await dialog.accept(); // Click OK on the alert
        });
        await page.goto('/gear.html');
        // Add items to cart
        await page.locator('.add-to-basket').nth(3).click();
        await page.locator('.add-to-basket').nth(4).click();
        // Verify basket counter after adding items
        await expect(page.locator('#basket-counter')).toHaveText('2');
        // Navigate to the Cart
        await page.goto('/basket.html');
        // Remove items from cart
        await page.locator('.remove-item').nth(0).click();
        await expect(page.locator('#basket-counter')).toHaveText('1'); // Verify counter updates

        await page.locator('.remove-item').nth(0).click(); // Remove next item
        await expect(page.locator('#basket-counter')).toHaveText('0');
    });

    test('TC4: Add multiple items from Welcome and Gear Page as unsigned user', async ({ page }) => {
        await page.goto('/welcome.html');
        // Add items to cart from Welcome Page
        await page.locator('.featured-items .add-to-basket').nth(0).click();
        await page.locator('.featured-items .add-to-basket').nth(1).click();
        await page.locator('.featured-items .add-to-basket').nth(2).click();
        // Assert correct number of items
        await expect(page.locator('#basket-counter')).toHaveText('3');
        // Go to Gear page
        await page.goto('/gear.html');
        // Add items to cart
        await page.locator('.add-to-basket').nth(3).click();
        await page.locator('.add-to-basket').nth(4).click();
        await page.locator('.add-to-basket').nth(8).click();
        await page.locator('.add-to-basket').nth(9).click();

         // Assert correct number of items
         await expect(page.locator('#basket-counter')).toHaveText('7');
    });

    test('TC5: Verify item count on the Gear page', async ({ page }) => {
        // Navigate to Gear page
        await page.goto('/gear.html');
        // Verify the Gear page has 12 items 
        const items = page.locator('.items-container .item');
        await expect(items).toHaveCount(12);
        // Verify each item has required details
        for (let i = 0; i <await items.count(); i++) {
            const item = items.nth(i); 
        // Verify image is visible
        await expect(item.locator('img')).toBeVisible();
        // Verify item title is not empty
        await expect(item.locator('h3')).not.toHaveText('');
        // Verify price is displayed
        await expect(item.locator('p')).toContainText('Price');
        // Verify Add to Basket button is visible
        await expect(item.locator('.add-to-basket')).toBeVisible();
        }
    });

    test('TC6: Verify item count on the Welcome page', async ({ page }) => {
        // Navigate to Welcome page
        await page.goto('/welcome.html');
        // Verify the Welcome page has 4 items 
        const items = page.locator('.items-container .item');
        await expect(items).toHaveCount(4);
        // Verify each item has required details
        for (let i = 0; i <await items.count(); i++) {
            const item = items.nth(i); 
        // Verify image is visible
        await expect(item.locator('img')).toBeVisible();
        // Verify item title is not empty
        await expect(item.locator('h3')).not.toHaveText('');
        // Verify price is displayed
        await expect(item.locator('p')).toContainText('Price');
        // Verify Add to Basket button is visible
        await expect(item.locator('.add-to-basket')).toBeVisible();
        }
    });

    test('TC7: Add multiples of the same item to cart and verify quantity and total amount', async ({ page }) => {
        await page.goto('/gear.html');
        // Add items to cart
        await page.locator('.add-to-basket').nth(1).click();
        await page.locator('.add-to-basket').nth(1).click();
        await page.locator('.add-to-basket').nth(1).click();

         // Navigate to Cart Page
        await page.goto('/basket.html');
        // Assert correct number of items
        await expect(page.locator('#basket-counter')).toHaveText('3');

        // Verify the number of items in the cart
        const totalItems = page.locator('#total-items');
        await expect(totalItems).toHaveText('3');

        // Verify the total price in the basket
        const totalPrice = page.locator('#total-price');
        await expect(totalPrice).toHaveText('449.97');
    });

    test('TC8: Add multiple items to cart and verify quantity and total amount', async ({ page }) => {
        await page.goto('/gear.html');
        // Add items to cart
        await page.locator('.add-to-basket').nth(0).click();
        await page.locator('.add-to-basket').nth(1).click();
        await page.locator('.add-to-basket').nth(2).click();
        await page.locator('.add-to-basket').nth(6).click();
        await page.locator('.add-to-basket').nth(9).click();
        await page.locator('.add-to-basket').nth(10).click();

         // Navigate to Cart Page
        await page.goto('/basket.html');
        // Assert correct number of items
        await expect(page.locator('#basket-counter')).toHaveText('6');

        // Remove items from cart
        await page.locator('.remove-item').nth(0).click();

        // Verify the number of items in the cart
        const totalItems = page.locator('#total-items');
        await expect(totalItems).toHaveText('6');

        // Verify the total price in the basket
        const totalPrice = page.locator('#total-price');
        await expect(totalPrice).toHaveText('922.94');
    });

    test('TC9: Remove items from cart and verify cart counter and total amount', async ({ page }) => {
        // Handle the alerts
        page.on('dialog', async (dialog) => {
            await dialog.accept(); // Click OK on the alert
            });
        await page.goto('/gear.html');
        // Add items to cart
        await page.locator('.add-to-basket').nth(0).click();
        await page.locator('.add-to-basket').nth(1).click();
        await page.locator('.add-to-basket').nth(2).click();
        await page.locator('.add-to-basket').nth(6).click();
        await page.locator('.add-to-basket').nth(9).click();
        await page.locator('.add-to-basket').nth(10).click();

         // Navigate to Cart Page
        await page.goto('/basket.html');
        // Assert correct number of items
        await expect(page.locator('#basket-counter')).toHaveText('6');

        // Remove items from cart
        await page.locator('.remove-item').nth(5).click();
        await page.locator('.remove-item').nth(4).click();
        await page.locator('.remove-item').nth(3).click();

        // Verify the number of items in the cart
        const totalItems = page.locator('#total-items');
        await expect(totalItems).toHaveText('3');

        // Verify the total price in the basket
        const totalPrice = page.locator('#total-price');
        await expect(totalPrice).toHaveText('249.97');
    });

    test('TC10: Empty cart and verify cart counter and total amount  ', async ({ page }) => {
        // Handle the alerts
        page.on('dialog', async (dialog) => {
            await dialog.accept(); // Click OK on the alert
            });
        await page.goto('/gear.html');
        // Add items to cart
        await page.locator('.add-to-basket').nth(3).click();

         // Navigate to Cart Page
        await page.goto('/basket.html');
        // Assert correct number of items
        await expect(page.locator('#basket-counter')).toHaveText('1');

        // Verify the cart contains the correct item
        const basketItem = page.locator('.basket-item');
        await expect(basketItem).toHaveCount(1);
        await expect(basketItem).toContainText('Dive Computer');
        await expect(basketItem).toContainText('$295.99');

        // Remove items from cart
        await page.locator('.remove-item').nth(0).click();

        // Verify the number of items in the cart
        const totalItems = page.locator('#total-items');
        await expect(totalItems).toHaveText('0');

        // Verify the total price in the basket
        const totalPrice = page.locator('#total-price');
        await expect(totalPrice).toHaveText('0.00');
    });

    test('TC11: Verify Cart persistence after page reload', async ({ page }) => {
        // Navigate to the Welcome Page
        await page.goto('/welcome.html');
    
        // Select the first Add to Basket button
        await page.locator('.featured-items .add-to-basket').nth(0).click();
    
        // Verify Cart counter updates to 1
        const basketCounter = page.locator('#basket-counter');
        await expect(basketCounter).toContainText('1');
    
        // Navigate to the Basket Page
        await page.goto('/basket.html');
    
        // Verify the cart contains the correct item
        const basketItem = page.locator('.basket-item');
        await expect(basketItem).toHaveCount(1);
        await expect(basketItem).toContainText('Mask & Snorkel Set');
        await expect(basketItem).toContainText('$29.99');
    
        // Reload the page
        await page.reload();
    
        // Verify the Cart counter still shows 1
        await expect(basketCounter).toContainText('1');
    
        // Verify the cart still contains the correct item
        await expect(basketItem).toHaveCount(1);
        await expect(basketItem).toContainText('Mask & Snorkel Set');
        await expect(basketItem).toContainText('$29.99');
    });  
});

test.describe('Items - Signed Users', () => {
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

    test('TC1: Add items from the Welcome Page as unsigned user', async ({ page }) => {
        
    });

});