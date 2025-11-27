import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerLoginPage extends BasePage {
    // Locators
     userSelectDropdown: Locator;
     loginButton: Locator;
     yourNameLabel: Locator;

    constructor(page: Page) {
        super(page);
        this.userSelectDropdown = page.locator('#userSelect');
        this.loginButton = page.locator('button[type="submit"]');
        this.yourNameLabel = page.locator('label:has-text("Your Name")');
    }

    /**
     * Select a customer from the dropdown by name
     */
    async selectCustomer(customerName: string): Promise<void> {
        await this.userSelectDropdown.selectOption({ label: customerName });
    }

    /**
     * Click on Login button
     */
    async clickLogin(): Promise<void> {
        await this.loginButton.click({ force: true });
        await this.waitForPageLoad();
    }

    /**
     * Complete login flow - select customer and login
     */
    async login(customerName: string): Promise<void> {
        await this.selectCustomer(customerName);
        await this.clickLogin();
    }

    /**
     * Get all available customers from dropdown
     */
    async getAvailableCustomers(): Promise<string[]> {
        const options = await this.userSelectDropdown.locator('option').allTextContents();
        return options.filter(option => option.trim() !== '---Your Name---');
    }

    /**
     * Verify customer login page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.userSelectDropdown.isVisible() &&
            await this.loginButton.isVisible();
    }
}
