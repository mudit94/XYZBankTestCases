import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';


export class BankManagerPage extends BasePage {
    // Locators
     addCustomerButton: Locator;
     openAccountButton: Locator;
     customersButton: Locator;
     homeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.addCustomerButton = page.locator('button[ng-click="addCust()"]');
        this.openAccountButton = page.locator('button[ng-click="openAccount()"]');
        this.customersButton = page.locator('button[ng-click="showCust()"]');
        this.homeButton = page.locator('button[ng-click="home()"]');
    }

    /**
     * Click on Add Customer button
     */
    async clickAddCustomer(): Promise<void> {
        await this.addCustomerButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Click on Open Account button
     */
    async clickOpenAccount(): Promise<void> {
        await this.openAccountButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Click on Customers button
     */
    async clickCustomers(): Promise<void> {
        await this.customersButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Click on Home button
     */
    async clickHome(): Promise<void> {
        await this.homeButton.click({ force: true });
        await this.waitForPageLoad();
    }

    /**
     * Verify bank manager page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.isElementVisible(this.addCustomerButton) &&
            await this.isElementVisible(this.openAccountButton) &&
            await this.isElementVisible(this.customersButton);
    }
}
