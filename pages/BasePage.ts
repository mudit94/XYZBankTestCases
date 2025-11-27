import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class for common functionality for all page objects
 */
export class BasePage {
     page: Page;

    constructor(page: Page) {
        this.page = page;
    }

  
    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    async getElementText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Take screenshot
     */
    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }
    
}
