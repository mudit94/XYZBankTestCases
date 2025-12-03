import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


export class HomePage extends BasePage {
    // Locators
     customerLoginButton: Locator;
     bankManagerLoginButton: Locator;
     homeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.customerLoginButton = page.locator('button[ng-click="customer()"]');
        this.bankManagerLoginButton = page.locator('button[ng-click="manager()"]');
        this.homeButton = page.locator('button[ng-click="home()"]');
    }

    
    async goto(): Promise<void> {
        await this.navigate('/angularJs-protractor/BankingProject/');
        await this.waitForPageLoad();
       await expect(this.page.url()).toContain('/login');

    }

    /**
     * Click on Customer Login button
     */
    async clickCustomerLogin(): Promise<void> {
        await this.customerLoginButton.click({ force: true });
        await this.waitForPageLoad();
    }

 
    async clickBankManagerLogin(): Promise<void> {
        await this.bankManagerLoginButton.click({ force: true });
        await this.waitForPageLoad();
    }

    /**
     * Click on Home button
     */
    async clickHome(): Promise<void> {
        await this.homeButton.click({ force: true });
        await this.waitForPageLoad();
    }

    /**
     * Verify home page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.customerLoginButton.isVisible() &&
            await this.bankManagerLoginButton.isVisible();
    }
}
