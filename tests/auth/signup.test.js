const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow - Signup Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the sign-up page before each test
        await page.goto('/signup.html');
    });

    test('TC1: Verify successful sign up with valid credentials', async ({ page }) => {
        const uniqueEmail = `user_${Date.now()}@example.com`;
        // Fill in valid user details
        await page.fill('#email', uniqueEmail);
        await page.fill('#password', 'SecurePassword123');
        await page.fill('#confirm-password', 'SecurePassword123');
        await page.click('button[type="submit"]');

        // Verify success message is visible and contains correct text
        await expect(page.locator('#signup-message')).toBeVisible();
        await expect(page.locator('#signup-message')).toHaveText('User registered successfully!');
        // Verify redirect to Gear page
        await expect(page).toHaveURL('/gear.html'); 
    });

    test('TC2: Verify error should display for invalid email format', async ({ page }) => {
        // Fill in invalid email format
        await page.fill('#email', 'invalidemail');
        await page.fill('#password', 'SecurePassword123');
        await page.fill('#confirm-password', 'SecurePassword123');
        await page.click('button[type="submit"]');

        // Verify error message is visible and contains correct text
        await expect(page.locator('#email-error')).toBeVisible();
        await expect(page.locator('#email-error')).toHaveText('Please enter a valid email address.');
    });

    test('TC3: Verify error should display for invalid password: No uppercase letters', async ({ page }) => {
        const uniqueEmail = `user_${Date.now()}@example.com`;
        await page.fill('#email', uniqueEmail);
        // Fill in password with no uppercase
        await page.fill('#password', 'password123');
        // Confirm password
        await page.fill('#confirm-password', 'password123');
        await page.click('button[type="submit"]');

        // Verify error message is visible and contains correct text
        await expect(page.locator('#password-error')).toBeVisible();
        await expect(page.locator('#password-error')).toHaveText('Password must be at least 8 characters long, include an uppercase letter, and a number.');

    });

    test('TC4: Verify error should display for invalid password: No numbers', async ({ page }) => {
        const uniqueEmail = `user_${Date.now()}@example.com`;
        await page.fill('#email', uniqueEmail);
        // Fill in password with no numbers
        await page.fill('#password', 'Password');
        // Confirm password
        await page.fill('#confirm-password', 'Password');
        await page.click('button[type="submit"]');

        // Verify error message is visible and contains correct text
        await expect(page.locator('#password-error')).toBeVisible();
        await expect(page.locator('#password-error')).toHaveText('Password must be at least 8 characters long, include an uppercase letter, and a number.');
    });

    test('TC5: Verify error should display for invalid password: No letters', async ({ page }) => {
        const uniqueEmail = `user_${Date.now()}@example.com`;
        await page.fill('#email', uniqueEmail);
        // Fill in password with no letters
        await page.fill('#password', '12345678');
        // Confirm password
        await page.fill('#confirm-password', '12345678');
        await page.click('button[type="submit"]');

        // Verify error message is visible and contains correct text
        await expect(page.locator('#password-error')).toBeVisible();
        await expect(page.locator('#password-error')).toHaveText('Password must be at least 8 characters long, include an uppercase letter, and a number.');
    });

    test('TC6: Verify error should display for invalid password: Less than 8 characters', async ({ page }) => {
        const uniqueEmail = `user_${Date.now()}@example.com`;
        await page.fill('#email', uniqueEmail);
        // Fill in password with less than 8 characters
        await page.fill('#password', 'Pass123');
        // Confirm password
        await page.fill('#confirm-password', 'Pass123');
        await page.click('button[type="submit"]');

        // Verify error message is visible and contains correct text
        await expect(page.locator('#password-error')).toBeVisible();
        await expect(page.locator('#password-error')).toHaveText('Password must be at least 8 characters long, include an uppercase letter, and a number.');
    });

    test('TC7: Verify error should display should display for mismatched passwords', async ({ page }) => {
        const uniqueEmail = `user_${Date.now()}@example.com`;
        await page.fill('#email', uniqueEmail);
        // Fill in password 
        await page.fill('#password', 'SecurePassword123');
        // Enter missmatching password
        await page.fill('#confirm-password', 'Password123');
        await page.click('button[type="submit"]');

        // Verify error message is visible and contains correct text
        await expect(page.locator('#confirm-password-error')).toBeVisible();
        await expect(page.locator('#confirm-password-error')).toHaveText('Passwords do not match!');
    });

    test('TC8: Verify multiple submissions should be prevented', async ({ page }) => {
        const uniqueEmail = `user_${Date.now()}@example.com`;
    
        // Fill in valid user details
        await page.fill('#email', uniqueEmail);
        await page.fill('#password', 'SecurePassword123');
        await page.fill('#confirm-password', 'SecurePassword123');
    
        // Simulate a single click first to ensure stability
        const submitButton = page.locator('button[type="submit"]');
    
        // Simulate multiple rapid clicks
        await Promise.all([
            submitButton.click(), // First click
            submitButton.click(), // Second click
            submitButton.click()  // Third click
        ]);
    
        // Ensure the button becomes disabled after the first click
        await expect(submitButton).toBeDisabled();
    
        // Verify success message is visible
        await expect(page.locator('#signup-message')).toBeVisible();
        await expect(page.locator('#signup-message')).toHaveText('User registered successfully!');
    
        // Verify redirection to Gear page
        await expect(page).toHaveURL('/gear.html');
    });

    test('TC9: Verify error message should display for email already in use', async ({ page }) => {
        const existingEmail = 'existinguser@example.com'; // This email should already exist in your system
    
        // Navigate to the sign-up page
        await page.goto('/signup.html');
    
        // Fill in an email that is already in use
        await page.fill('#email', existingEmail);
        await page.fill('#password', 'SecurePassword123');
        await page.fill('#confirm-password', 'SecurePassword123');
        await page.click('button[type="submit"]');
    
        // Verify error message for duplicate email
        const emailError = page.locator('#signup-message');
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Email already in use.');
    });

    test('TC10: Verify error message when only the password field is filled', async ({ page }) => {
        // Fill in only the password field
        await page.fill('#password', 'SecurePassword123');
        // Click the Sign-Up button
        await page.click('button[type="submit"]');

        // Verify the error message
        const errorMessage = page.locator('#confirm-password-error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Passwords do not match!');
    });

    test('TC11: Verify error message when only the confirm password field is filled', async ({ page }) => {
        // Fill in only the confirm password field
        await page.fill('#confirm-password', 'SecurePassword123');
        // Click the Sign-Up button
        await page.click('button[type="submit"]');

        // Verify the error message
        const errorMessage = page.locator('#password-error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Password must be at least 8 characters long, include an uppercase letter, and a number.');
    });

    test('TC12: Verify error should display for email exceeding 254 characters', async ({ page }) => {
        // Fill in email with 255 characters
        await page.fill('#email', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com');
        await page.fill('#password', 'SecurePassword123');
        await page.fill('#confirm-password', 'SecurePassword123');
        await page.click('button[type="submit"]');

        // Verify error message is visible and contains correct text
        await expect(page.locator('#email-error')).toBeVisible();
        await expect(page.locator('#email-error')).toHaveText('Email must not exceed 254 characters.');
    });

    test('TC13: Verify the password in password field is not visible while typing', async ({ page }) => {
        // Navigate to the sign-up page
        await page.goto('/signup.html');

        // Type a password into the password field
        const passwordField = page.locator('#password');
        await passwordField.fill('SecurePassword123');

        // Verify the input type is 'password' (for masking)
        const inputType = await passwordField.getAttribute('type');
        expect(inputType).toBe('password');
    });

    test('TC14: Verify the password in password confirm password field is not visible while typing', async ({ page }) => {
        // Navigate to the sign-up page
        await page.goto('/signup.html');

        // Type a password into the password field
        const passwordField = page.locator('#confirm-password');
        await passwordField.fill('SecurePassword123');

        // Verify the input type is 'password' (for masking)
        const inputType = await passwordField.getAttribute('type');
        expect(inputType).toBe('password');
    });

});