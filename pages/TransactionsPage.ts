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
     startDateInput: Locator;
     endDateInput: Locator;
     noTransactionsMessage: Locator;
     DateTimeHeaderLink: Locator;
     firstRow: Locator;
    constructor(page: Page) {
        super(page);
        this.transactionsTable = page.locator('table.table');
        this.firstRow = page.locator('tr#anchor0');
        this.transactionRows = page.locator('table.table tbody tr');
        this.backButton = page.locator('button[ng-click="back()"]');
        this.resetButton = page.locator('button[ng-click="reset()"]');
        this.startDateInput = page.locator('#start');
        this.endDateInput = page.locator('#end');
        this.noTransactionsMessage = page.locator('text=No transactions');
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
     * Click reset button to clear filters
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
        this.page.waitForSelector('table.table tbody tr#anchor0', { state: 'visible', timeout: 10000 });
        this.page.waitForFunction(
            `document.querySelectorAll('table.table tbody tr').length >= 0`,
            { timeout: 10000 }
        );
        const rows = await this.transactionRows.all();
        expect(rows.length).toBeGreaterThan(0);
        if (rows.length > 0) {
            for (const row of rows) {
                const cells = await row.locator('td').all();
                if (cells.length >= 3) {
                    const date = await cells[0].textContent() || '';
                    const amount = await cells[1].textContent() || '';
                    const type = await cells[2].textContent() || '';
                    transactions.push({ date, amount, type });
                }
            }
        }
        return transactions;
    }

    /**
     * Get transaction count
     */
    async getTransactionCount(): Promise<number> {
        return await this.transactionRows.count();
    }

    /**
     * Filter transactions by date range
     */
    async filterByDateRange(startDate: string, endDate: string): Promise<void> {
        await this.startDateInput.fill(startDate);
        await this.endDateInput.fill(endDate);
        await this.page.waitForTimeout(500);
    }

    async isLoaded(): Promise<boolean> {
        return await this.backButton.isVisible() &&
            await this.resetButton.isVisible();
    }

    /**
     * Check if there are any transactions
     */
    async hasTransactions(): Promise<boolean> {
        const count = await this.getTransactionCount();
        return count > 0;
    }

    /**
     * Get transactions by type (Credit/Debit)
     */
    async getTransactionsByType(type: 'Credit' | 'Debit'): Promise<Transaction[]> {
        const allTransactions = await this.getAllTransactions();
        return allTransactions.filter(t => t.type.toLowerCase() === type.toLowerCase());
    }
}
