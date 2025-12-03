import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';


export class OpenAccountPage extends BasePage {
    // Locators
     customerDropdown: Locator;
     currencyDropdown: Locator;
     processButton: Locator;

    constructor(page: Page) {
        super(page);
        this.customerDropdown = page.locator('#userSelect');
        this.currencyDropdown = page.locator('#currency');
        this.processButton = page.locator('button[type="submit"]').filter({ hasText: 'Process' });
    }

    /**
     * Select customer by name
     */
    async selectCustomer(customerName: string): Promise<void> {
        await this.customerDropdown.selectOption({ label: customerName });
    }

    /**
     * Select currency
     */
    async selectCurrency(currency: 'Dollar' | 'Pound' | 'Rupee'): Promise<void> {
        await this.currencyDropdown.selectOption({ label: currency });
    }

    /**
     * Click Process button
     */
    async clickProcess(): Promise<void> {
        await this.processButton.click({ force: true });
    }

    /**
     * Complete open account flow
     */
    async openAccount(customerName: string, currency: 'Dollar' | 'Pound' | 'Rupee'): Promise<void> {
        await this.selectCustomer(customerName);
        await this.selectCurrency(currency);
        await this.clickProcess();
    }

  
    async handleAlert(): Promise<string> {
        return new Promise((resolve) => {
            this.page.once('dialog', async (dialog) => {
                const message = dialog.message();
                await dialog.accept();
                resolve(message);
            });
        });
    }

    /**
     * Get available customers from dropdown
     */
    async getAvailableCustomers(): Promise<string[]> {
        const options = await this.customerDropdown.locator('option').allTextContents();
        return options.filter(option => option.trim() !== '---Your Name---');
    }

    
    async getAvailableCurrencies(): Promise<string[]> {
        const options = await this.currencyDropdown.locator('option').allTextContents();
        return options.filter(option => option.trim() !== '---Currency---');
    }

    /**
     * Verify open account page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.isElementVisible(this.customerDropdown) &&
            await this.isElementVisible(this.currencyDropdown) &&
            await this.isElementVisible(this.processButton);
    }
}
