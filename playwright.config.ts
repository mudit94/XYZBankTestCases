import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 2,
    workers: process.env.CI ? 2 : undefined, 
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['list']
    ],
    timeout: 60000,
    use: {
        baseURL: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off',
        viewport: {
            width: 1920,
            height: 1080,
        },
        actionTimeout: 40000,
        navigationTimeout: 50000,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
    outputDir: 'test-results/',
});
