import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';


export class WithdrawalPage extends BasePage {
    // Locators
     amountInput: Locator;
     withdrawButton: Locator;
     withdrawalMessage: Locator;
     amountLabel: Locator;

    constructor(page: Page) {
        super(page);
        this.amountInput = page.locator('input[ng-model="amount"]');
        this.withdrawButton = page.locator('button[type="submit"]').filter({ hasText: 'Withdraw' });
        this.withdrawalMessage = page.locator('[ng-show="message"]');
        this.amountLabel = page.locator('label:has-text("Amount to be Withdrawn")');
    }

    /**
     * Enter withdrawal amount
     */
    async enterAmount(amount: number): Promise<void> {
        await this.amountInput.clear();
        await this.amountInput.fill(amount.toString());
    }

    /**
     * Click withdraw button
     */
    async clickWithdraw(): Promise<void> {
        await this.withdrawButton.click({ force: true });
        await this.page.waitForTimeout(500); 
    }

    /**
     * Complete withdrawal transaction
     */
    async withdraw(amount: number): Promise<void> {
        await this.enterAmount(amount);
        await this.clickWithdraw();
    }

    /**
     * Get withdrawal message (success or error)
     */
    async getWithdrawalMessage(): Promise<string> {
        try {
            await this.withdrawalMessage.waitFor({ state: 'visible', timeout: 2000 });
            return await this.withdrawalMessage.textContent() || '';
        } catch {
            return '';
        }
    }

    /**
     * Verify withdrawal page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.amountInput.isVisible() &&
            await this.withdrawButton.isVisible();
    }

    /**
     * Check if withdrawal was successful
     */
    async isWithdrawalSuccessful(): Promise<boolean> {
        const message = await this.getWithdrawalMessage();
        return message.toLowerCase().includes('success') ||
            message.toLowerCase().includes('transaction successful');
    }

    /**
     * Get validation message for empty field
     */
    async getFieldValidationMessage(): Promise<string> {
        return await this.amountInput.evaluate((el: any) => el.validationMessage);
    }
}
