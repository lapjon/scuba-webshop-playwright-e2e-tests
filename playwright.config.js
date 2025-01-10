const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests', // Path to tests folder
    use: {
        baseURL: 'http://localhost:5000', 
        timeout: 8000, // Increase timeout for individual actions
        navigationTimeout: 30000, // Adjust navigation timeout for slower pages
        trace: 'on-first-retry', // Record trace on first retry
        headless: true, // Ensure headless mode for CI
    },
    retries: process.env.CI ? 2 : 0, // Increase retries for CI environment
    reporter: [['html'], ['list']], // Generate HTML report and list output
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                viewport: { width: 1280, height: 720 }, // Default viewport for consistency
            },
        },
        {
            name: 'firefox',
            use: {
                browserName: 'firefox',
                viewport: { width: 1280, height: 720 }, // Adjust viewport for Firefox
                actionTimeout: 10000, // Adjust action timeout for slower interactions
                permissions: ['geolocation'], // Example for Firefox-specific permission
                trace: 'on-first-retry', // Enable tracing for Firefox
            },
        },
    ],
});