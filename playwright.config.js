const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests', // Path to tests folder
    use: {
        baseURL: 'http://localhost:5000', 
        headless: false, // Run tests in headless mode by default
        trace: 'on-first-retry', // Record trace on first retry
    },
    retries: 1, // Number of retries on failure
    reporter: [['html'], ['list']], // Generate an HTML report and list output
    projects: [
        { name: 'Chromium', use: { browserName: 'chromium' } },
        { name: 'Firefox', use: { browserName: 'firefox' } },
        { name: 'WebKit', use: { browserName: 'webkit' } }
    ],
});