import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import { EmptyFields, ErrorMessages, SuccessMessages, TestCustomers } from "../utils/testData";

test.describe('Withdraw Balance', () => {

    let pageManager: PageManager;

    test.beforeEach(async ({ page, browser, context }) => {
        context = await browser.newContext();
        page = await context.newPage();
        pageManager = new PageManager(page);

        // Navigate to Bank Manager dashboard
        await pageManager.homePage.goto();
        await pageManager.homePage.clickCustomerLogin();
        await pageManager.customerLoginPage.login(TestCustomers.HERMOINE_GRANGER);
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
    test('Verify customer can withdraw balance less than or equal to available', async () => {

        const withdrawalAmount = 5091;
        let availableBalance = await pageManager.accountPage.getBalanceAsNumber();
        await pageManager.accountPage.clickWithdrawl();
        await pageManager.withdrawalPage.withdraw(withdrawalAmount);
        let successMessage = await pageManager.withdrawalPage.getWithdrawalMessage();
        expect(successMessage).toContain(SuccessMessages.WITHDRAWAL_SUCCESS);
        let newAvailableBalance = await pageManager.accountPage.getBalanceAsNumber();
        expect(newAvailableBalance).toBe(availableBalance - withdrawalAmount);
    });
    test('Verify withdraw transaction appears as Debit Type in the transactions table', async ({ page }) => {
        const withdrawalAmount = 500;
        await pageManager.accountPage.clickWithdrawl();
        await pageManager.withdrawalPage.withdraw(withdrawalAmount);
        await pageManager.accountPage.clickTransactions();
        let isLoaded = await pageManager.transactionsPage.isLoaded();
        await expect(isLoaded).toBeTruthy();
        await pageManager.transactionsPage.transactionsTable.waitFor({ state: 'visible', timeout: 5000 });
        await pageManager.transactionsPage.DateTimeHeaderLink.click({ force: true });
        await page.waitForLoadState('domcontentloaded');
        const transactions = await pageManager.transactionsPage.getFirstElementOfTable();
        await expect(transactions.length).toBeGreaterThan(0);

        // After sorting by Date-Time in reverse, the first transaction should be our most recent deposit
        const firstTransaction = transactions[0];
        await expect(firstTransaction.amount).toContain(withdrawalAmount.toString());
        await expect(firstTransaction.type).toBe('Debit');

    })
    test('Verify customer cannot withdraw balance more than available', async ({ page }) => {
        // Test Data initialization
        const withdrawalAmount = 6000;
        //Act
        await pageManager.accountPage.clickTransactions();
        await page.waitForLoadState();
        await pageManager.transactionsPage.transactionsTable.waitFor({ state: 'visible', timeout: 7000 });
        let transactionsCount = await pageManager.transactionsPage.getTransactionCount();
        await pageManager.transactionsPage.clickBack();
        let availableBalance = await pageManager.accountPage.getBalanceAsNumber();
        await pageManager.accountPage.clickWithdrawl();
        await pageManager.withdrawalPage.withdraw(withdrawalAmount);
        let errorMessage = await pageManager.withdrawalPage.getWithdrawalMessage();
        await expect(errorMessage).toContain(ErrorMessages.INSUFFICIENT_FUNDS);
        await pageManager.accountPage.clickTransactions();
        await pageManager.transactionsPage.transactionsTable.waitFor({ state: 'visible', timeout: 5000 });
        let newTransactionsCount = await pageManager.transactionsPage.getTransactionCount();
        expect(newTransactionsCount).toBe(transactionsCount);
        await pageManager.transactionsPage.clickBack();
        let newAvailableBalance = await pageManager.accountPage.getBalanceAsNumber();
        await expect(newAvailableBalance).toBe(availableBalance);

    });
    test('Verify empty amount shows validation tooltip', async ({ browserName }) => {

        await pageManager.accountPage.clickWithdrawl();
        await pageManager.withdrawalPage.amountInput.waitFor({ state: 'visible' });
        await pageManager.withdrawalPage.clickWithdraw(); // Click without entering amount
        const validationMessage = await pageManager.withdrawalPage.getFieldValidationMessage();
        if (browserName === 'firefox') {
            await expect(validationMessage).toContain(EmptyFields.PLEASE_ENTER_NUMBER);
        }
        else if (browserName === 'webkit') {
            await expect(validationMessage).toContain(EmptyFields.FILL);
        }
        else {
            await expect(validationMessage).toContain(EmptyFields.PLEASE_FILL);
        }
    });
})