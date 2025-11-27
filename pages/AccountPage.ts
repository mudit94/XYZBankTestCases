import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
    // Locators
     welcomeMessage: Locator;
     accountNumberDropdown: Locator;
     accountNumber: Locator;
     balance: Locator;
     currency: Locator;
     transactionsButton: Locator;
     depositButtonTab: Locator;
     withdrawlButton: Locator;
     logoutButton: Locator;
     homeButton: Locator;
    balanceLabel: Locator;
    constructor(page: Page) {
        super(page);
        this.welcomeMessage = page.locator('.fontBig');
        this.balanceLabel = page.getByText('Balance :');
        this.accountNumberDropdown = page.locator('#accountSelect');
        this.accountNumber = page.locator('.center .ng-binding:nth-of-type(1)');
        this.balance = page.locator('.center .ng-binding:nth-of-type(2)');
        this.currency = page.locator('.center .ng-binding:nth-of-type(3)');
        this.transactionsButton = page.locator('button[ng-click="transactions()"]');
        this.depositButtonTab = page.locator('button[ng-click="deposit()"]');
        this.withdrawlButton = page.locator('button[ng-click="withdrawl()"]');
        this.logoutButton = page.locator('button[ng-click="byebye()"]');
        this.homeButton = page.locator('button[ng-click="home()"]');
    }

    /**
     * Get welcome message text
     */
    async getWelcomeMessage(): Promise<string> {
        return await this.welcomeMessage.textContent() || '';
    }

    /**
     * Get current account number
     */
    async getAccountNumber(): Promise<string> {
        return await this.accountNumber.textContent() || '';
    }

    /**
     * Get current balance
     */
    async getBalance(): Promise<string> {
        return await this.balance.textContent() || '';
    }

    /**
     * Get balance as number
     */
    async getBalanceAsNumber(): Promise<number> {
        const balanceText = await this.getBalance();
        return parseFloat(balanceText.replace(/[^0-9.-]/g, ''));
    }

    /**
     * Get currency
     */
    async getCurrency(): Promise<string> {
        return await this.currency.textContent() || '';
    }

    /**
     * Select an account from dropdown
     */
    async selectAccount(accountNumber: string): Promise<void> {
        await this.accountNumberDropdown.selectOption({ label: accountNumber });
        await this.page.waitForTimeout(500); // Wait for balance to update
    }

    /**
     * Click on Transactions button
     */
    async clickTransactions(): Promise<void> {
        await this.transactionsButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Click on Deposit button
     */
    async clickDepositButtonTab(): Promise<void> {
        await this.depositButtonTab.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Click on Withdrawl button
     */
    async clickWithdrawl(): Promise<void> {
        await this.withdrawlButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Click on Logout button
     */
    async clickLogout(): Promise<void> {
        await this.logoutButton.click({ force: true });
        await this.waitForPageLoad();
    }

    /**
     * Verify account page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.welcomeMessage.isVisible() &&
            await this.logoutButton.isVisible();
    }

    /**
     * Get all account numbers for the logged-in user
     */
    async getAvailableAccounts(): Promise<string[]> {
        const options = await this.accountNumberDropdown.locator('option').allTextContents();
        return options;
    }
}
