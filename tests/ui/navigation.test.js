const { test, expect } = require('@playwright/test');

test.describe('Navigation Flows', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to Welcome page before each test
        await page.goto('http://localhost:5000/welcome.html');
    });

    test('TC1: Verify page links as unsigned user', async ({ page }) => {
        // Verify title and link to Gear page
        const deepDiveLink = page.locator('a[href="welcome.html"]');
        await expect(deepDiveLink).toContainText('Deep Dive');

        // Verify navigation links in the header (5 links)
        const navLinks = page.locator('nav a');
       await expect(navLinks).toHaveCount(5);

        // Verify text and visibility of each link (as unsigned user)
        await expect(navLinks.nth(0)).toBeVisible();
        await expect(navLinks.nth(0)).toContainText('Our Gear');

        await expect(navLinks.nth(1)).toBeVisible();
        await expect(navLinks.nth(1)).toContainText('About');

        await expect(navLinks.nth(2)).toBeVisible();
        await expect(navLinks.nth(2)).toContainText('Login');

        // Verify Logout button is not visible as unsigned user
        await expect(navLinks.nth(3)).not.toBeVisible();

        // Verify text and visibility of Cart link (as unsigned user)
        await expect(navLinks.nth(4)).toBeVisible();
        await expect(navLinks.nth(4)).toContainText('Cart');

        // Verify Browse Our Gear link in body
        const browseGearLink = page.locator('.browse-gear-link');
        await expect(browseGearLink).toBeVisible();
        await expect(browseGearLink).toContainText('Browse Our Gear');
    });

    test('TC2: Verify navigation to Gear page when clicking link', async ({ page }) => {
        // Navigate to the Welcome Page
        await page.goto('/welcome.html');

        // Click the "Our Gear" link
        await page.locator('nav a:has-text("Our Gear")').click();
 
        // Verify URL contains the Gear page
        await expect(page).toHaveURL(/\/gear\.html/);
 
        // Verify header and footer are visible
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('TC3: Verify navigation to About page when clicking link', async ({ page }) => {
        // Navigate to the Welcome Page
        await page.goto('/welcome.html');

        // Click the "About" link
        await page.locator('nav a:has-text("About")').click();
 
        // Verify URL contains the About page
        await expect(page).toHaveURL(/\/about\.html/);
 
        // Verify header and footer are visible
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('TC4: Verify navigation to Login page when clicking link', async ({ page }) => {
        // Navigate to the Welcome Page
        await page.goto('/welcome.html');

        // Click the "Login" link
        await page.locator('nav a:has-text("Login")').click();
 
        // Verify URL contains the Login page
        await expect(page).toHaveURL(/\/login\.html/);
 
        // Verify header and footer are visible
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('TC5: Verify navigation to Cart page when clicking link', async ({ page }) => {
        // Navigate to the Welcome Page
        await page.goto('/welcome.html');

        // Click the "Cart" link
        await page.locator('nav a:has-text("Cart")').click();
 
        // Verify URL contains the Cart page
        await expect(page).toHaveURL(/\/basket\.html/);
 
        // Verify header and footer are visible
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('TC6: Verify redirect link from Login page to Signup page for unsigned user', async ({ page }) => {
        // Navigate to the Welcome Page
        await page.goto('/welcome.html');

        // Click the "Login" link
        await page.locator('nav a:has-text("Login")').click();
 
        // Verify URL contains the Login page
        await expect(page).toHaveURL(/\/login\.html/);
 
        // Assert the presence of the redirect CTA
        await expect(page.locator('text=Not a member? Register here')).toBeVisible();
    
        // Click on the "Register here" link
        await page.locator('a[href="signup.html"]').click();

        // Verify that the user is redirected to the signup page
        await expect(page).toHaveURL(/\/signup\.html/);

        // Verify the signup page content
        await expect(page.locator('h2')).toContainText('Sign Up'); 
        await expect(page.locator('form')).toBeVisible(); 
    });

    test('TC7: Verify Checkout page CTA redirects to Login page as unsigned user', async ({ page }) => {
        // Navigate to the Cart Page
        await page.goto('/basket.html');

        // Click "Proceed to Checkout"
        await page.locator('.checkout-button').click();

        // Alert alert window click "OK" on the alert
        page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('You must be logged in to access the checkout page.');
        await dialog.accept(); 
        });
 
        // Verify link redirects to the Login page
        await expect(page).toHaveURL(/\/login\.html/);
    });
});