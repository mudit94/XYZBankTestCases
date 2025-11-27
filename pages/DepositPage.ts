import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DepositPage extends BasePage {
    // Locators
     amountInput: Locator;
     depositButton: Locator;
     depositMessage: Locator;
     amountLabel: Locator;
    depositButtonTab: Locator;
    depositAmountHeading: Locator;
    constructor(page: Page) {
        super(page);
        this.depositAmountHeading = page.getByText('Amount to be Deposited :');
        this.depositButtonTab = page.locator('button[ng-click="deposit()"]').filter({ hasText: 'Deposit' });
        this.amountInput = page.locator('input[ng-model="amount"]');
        this.depositButton = page.locator('button[type="submit"]').filter({ hasText: 'Deposit' });
        this.depositMessage = page.locator('span[ng-show="message"]');
        this.amountLabel = page.locator('label:has-text("Amount to be Deposited")');
    }

    /**
     * Enter deposit amount
     */
    async enterAmount(amount: number): Promise<void> {
        await this.amountInput.clear();
        await this.amountInput.fill(amount.toString());
    }

    /**
     * Click deposit button
     */
    async clickDeposit(): Promise<void> {
        await this.depositButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Complete deposit transaction
     */
    async deposit(amount: number): Promise<void> {
        await this.enterAmount(amount);
        await this.clickDeposit();
    }

    
    async getDepositMessage(): Promise<string> {
        try {
            await this.depositMessage.waitFor({ state: 'visible', timeout: 2000 });
            return await this.depositMessage.textContent() || '';
        } catch {
            return '';
        }
    }

    /**
     * Verify deposit page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.amountInput.isVisible() &&
            await this.depositButton.isVisible();
    }

    
    async isDepositSuccessful(): Promise<boolean> {
        const message = await this.getDepositMessage();
        return message.toLowerCase().includes('success') ||
            message.toLowerCase().includes('deposit successful');
    }

    /**
     * Get validation message for empty field
     */
    async getFieldValidationMessage(): Promise<string> {
        return await this.amountInput.evaluate((el: any) => el.validationMessage);
    }
}
