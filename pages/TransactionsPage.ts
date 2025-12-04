import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Transaction {
    date: string;
    amount: string;
    type: string;
}


export class TransactionsPage extends BasePage {
    // Locators
    transactionsTable: Locator;
    transactionRows: Locator;
    backButton: Locator;
    resetButton: Locator;
    DateTimeHeaderLink: Locator;
    firstRow: Locator;
    constructor(page: Page) {
        super(page);
        this.transactionsTable = page.locator('table.table');
        this.firstRow = page.locator('tr#anchor0');
        this.transactionRows = page.locator('table.table tbody tr');
        this.backButton = page.locator('button[ng-click="back()"]');
        this.resetButton = page.locator('button[ng-click="reset()"]');
        this.DateTimeHeaderLink = page.getByRole('link').filter({ hasText: 'Date-Time' });
    }

    /**
     * Click back button to return to account page
     */
    async clickBack(): Promise<void> {
        await this.backButton.click({ force: true });
        await this.waitForPageLoad();
    }

    /**
     * Click reset button to clear date filters
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click({ force: true });
        await this.page.waitForTimeout(500);
    }
    async clickDateTimeHeaderLink(): Promise<void> {
        await this.DateTimeHeaderLink.click({ force: true });
        await this.page.waitForTimeout(500);
    }
    /**
     * Get all transactions
     */
    async getAllTransactions(): Promise<Transaction[]> {
        const transactions: Transaction[] = [];
        // await this.page.waitForSelector('table.table tbody tr#anchor0', { state: 'visible', timeout: 10000 });
        // await this.page.waitForFunction(
        //     `document.querySelectorAll('table.table tbody tr').length >= 0`,
        //     { timeout: 10000 }
        // );
        //await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await expect(this.firstRow).toBeVisible({ timeout: 15000 });
        const rows = await this.transactionRows.all();
        await expect(rows.length).toBeGreaterThan(0);
        if (rows.length > 0) {
            for (const row of rows) {
                const cells = await row.locator('td').all();
                if (cells.length >= 3) {
                    const date = await cells[0].textContent() || '';
                    const amount = await cells[1].textContent() || '';
                    const type = await cells[2].textContent() || '';
                    await transactions.push({ date, amount, type });
                }
            }
        }
        return transactions;
    }
    async getFirstElementOfTable(): Promise<Transaction[]> {
        await this.page.waitForTimeout(1000);
        await expect(this.firstRow).toBeVisible({ timeout: 15000 });
        const row1 = await this.transactionRows.first();
        const cells = await row1.locator('td').all();
        const transaction: Transaction[] = [];
        if (cells.length >= 3) {
            const date = await cells[0].textContent() || '';
            const amount = await cells[1].textContent() || '';
            const type = await cells[2].textContent() || '';
            await transaction.push({ date, amount, type });
        }
        return transaction;
    }
    async getFirstColumnOfTable(): Promise<string[]> {
        const rows = await this.transactionRows.all();
        const dates: string[] = [];
        for (const row of rows) {
            const cells = await row.locator('td:nth-of-type(1)').all();
            if (cells.length >= 1) {
                const date = await cells[0].textContent() || '';
                await dates.push(date);
            }
        }
        return dates;
    }
    /**
     * Get transaction count
     */
    async getTransactionCount(): Promise<number> {
        return await this.transactionRows.count();
    }


    async isLoaded(): Promise<boolean> {
        return await this.isElementVisible(this.backButton) &&
            await this.isElementVisible(this.resetButton);
    }
    /**
     * Get transactions by type (Credit/Debit)
     */
    async getTransactionsByType(type: 'Credit' | 'Debit'): Promise<Transaction[]> {
        const allTransactions = await this.getAllTransactions();
        return allTransactions.filter(t => t.type.toLowerCase() === type.toLowerCase());
    }
}
