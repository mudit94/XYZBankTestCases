import { test, expect, Page } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { EmptyFields, SuccessMessages } from '../utils/testData';

/**
 * Test Suite: JIRA-3 - Make a Deposit
 * Epic: Bank Customer Operations
 * 
 * As a bank customer
 * I want to be able to make a deposit to one of my existing accounts
 * So that I can manage my finances
 * 
 * Acceptance Criteria:
 * - On successful deposit the following red message is displayed above the 'Amount to be Deposited' field: "Deposit Successful"
 * - The account balance is updated accordingly
 * - New record is added to the Transactions table with Transaction Type = Credit
 * - If an empty amount is submitted, the following tooltip is displayed: "Please fill in this field."
 */

test.describe('JIRA-3: Make a Deposit', () => {
    let pageManager: PageManager;

    test.beforeEach(async ({ browser, context, page }) => {
        context = await browser.newContext();
        page = await context.newPage();
        pageManager = new PageManager(page);

        // Login as customer    
        await pageManager.homePage.goto();
        await pageManager.homePage.clickCustomerLogin();
        await pageManager.customerLoginPage.login('Hermoine Granger');
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('TC-JIRA3-001: Verify "Deposit Successful" message is shown in "Red Color" "Above the" amount to be deposited label ', async () => {
        const depositAmount = 100;

        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.deposit(depositAmount);

        const message = await pageManager.depositPage.getDepositMessage();
        await expect(message).toBe(SuccessMessages.DEPOSIT_SUCCESS);

        // Get  color of the deposit message
        const color = await pageManager.depositPage.depositMessage.evaluate((el) => {
            return window.getComputedStyle(el).color;
        });
        // red is "rgb(255, 0, 0)"
        expect(color).toBe('rgb(255, 0, 0)');
        // Verify message is visible
        await expect(pageManager.depositPage.depositMessage).toBeVisible();
        // Verify message is above the amount field
        const messageBox = await pageManager.depositPage.depositMessage.boundingBox();
        const inputBox = await pageManager.depositPage.amountLabel.boundingBox();

        await expect(messageBox).not.toBeNull();
        await expect(inputBox).not.toBeNull();
        await expect(messageBox!.y).toBeLessThan(inputBox!.y);
    });

    test('TC-JIRA3-002: Verify account balance is updated after deposit', async ({ page }) => {
        const depositAmount = 500;
        const initialBalance = await pageManager.accountPage.getBalanceAsNumber();

        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.deposit(depositAmount);

        await page.waitForTimeout(1000); // Wait for balance to update
        const newBalance = await pageManager.accountPage.getBalanceAsNumber();
        await expect(newBalance).toBe(initialBalance + depositAmount);
    });

    test(`TC-JIRA3-003: Verify deposit transaction appears in Transactions table with type "Credit"`, async ({ page }) => {
        const depositAmount = 250;
        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.deposit(depositAmount);
        let result = await pageManager.depositPage.isDepositSuccessful();
        await expect(result).toBeTruthy();

        // Navigate to transactions
        await pageManager.accountPage.clickTransactions();
        await pageManager.transactionsPage.transactionsTable.waitFor({ state: 'visible', timeout: 5000 });

        // Click Date-Time header to sort transactions in reverse order (most recent first)
        await pageManager.transactionsPage.clickDateTimeHeaderLink();

        await page.waitForTimeout(1000); // Wait for sort to apply

        // Get all transactions after sorting
        const transactions = await pageManager.transactionsPage.getFirstElementOfTable();

        await expect(transactions.length).toBeGreaterThan(0);
        // After sorting by Date-Time in reverse, the first transaction should be our most recent deposit
        const firstTransaction = transactions[0];
        await expect(firstTransaction.amount).toContain(depositAmount.toString());
        await expect(firstTransaction.type).toBe('Credit');
    });

    test('TC-JIRA3-004: Verify empty amount shows validation tooltip', async ({ browserName }) => {

        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.amountInput.waitFor({ state: 'visible' });
        await pageManager.depositPage.clickDeposit(); // Click without entering amount
        const validationMessage = await pageManager.depositPage.getFieldValidationMessage();
        if (browserName === 'firefox') {
            await expect(validationMessage).toContain('Please enter a number');
        }
        else if (browserName === 'webkit') {
            await expect(validationMessage).toContain('Fill out this field');
        }
        else {
            await expect(validationMessage).toContain('fill');
        }
    });

    test('TC-JIRA3-005: Verify multiple deposits update balance correctly', async ({ page }) => {

        const deposits = [100, 200, 150];
        const initialBalance = await pageManager.accountPage.getBalanceAsNumber();
        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.depositAmountHeading.waitFor({ state: 'visible' });

        for (const amount of deposits) {
            await pageManager.depositPage.deposit(amount);
            await page.waitForTimeout(500);
        }
        const totalDeposited = deposits.reduce((sum, val) => sum + val, 0);
        const expectedBalance = initialBalance + totalDeposited;
        const finalBalance = await pageManager.accountPage.getBalanceAsNumber();
        await expect(finalBalance).toBe(expectedBalance);
    });

    test('TC-JIRA3-006: Verify deposit gets rejected with decimal amount', async ({ browserName }) => {

        const depositAmount = 123.45;
        const minRound = Math.floor(depositAmount);
        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.depositAmountHeading.waitFor({ state: 'visible' });
        await pageManager.depositPage.deposit(depositAmount);
        const validationMessage = await pageManager.depositPage.getFieldValidationMessage()

        if (browserName === 'webkit') {
            await expect(validationMessage).toContain(EmptyFields.ENTER);
        }
        else if (browserName === 'firefox') {
            await expect(validationMessage).toContain(EmptyFields.PLEASE_SELECT_VALID);
        }
        else {
            await expect(validationMessage).toContain(EmptyFields.PLEASE_ENTER_VALID + ' ' + minRound.toString() + ' and ' + (minRound + 1).toString() + '.');
        }

    });

    test('TC-JIRA3-007: Verify deposit with small amount', async () => {

        const depositAmount = 1;
        const initialBalance = await pageManager.accountPage.getBalanceAsNumber();

        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.depositAmountHeading.waitFor({ state: 'visible' });
        await pageManager.depositPage.deposit(depositAmount);

        const message = await pageManager.depositPage.getDepositMessage();
        expect(message).toBe(SuccessMessages.DEPOSIT_SUCCESS);

        const newBalance = await pageManager.accountPage.getBalanceAsNumber();
        await expect(newBalance).toBe(initialBalance + depositAmount);
    });


    test('TC-JIRA3-009: Verify deposit form elements are displayed correctly', async () => {
        // Act
        await pageManager.accountPage.clickDepositButtonTab();
        await expect(pageManager.depositPage.amountInput).toBeVisible();
        await expect(pageManager.depositPage.depositButton).toBeVisible();
        await expect(pageManager.depositPage.amountLabel).toBeVisible();
    });

    test('TC-JIRA3-010: Verify currency remains same after deposit', async () => {
        // Arrange
        const depositAmount = 300;
        const currency = await pageManager.accountPage.getCurrency();

        // Act
        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.deposit(depositAmount);

        // Assert
        // Wait for deposit message to confirm transaction completed
        await pageManager.depositPage.depositMessage.waitFor({ state: 'visible', timeout: 5000 });
        const newCurrency = await pageManager.accountPage.getCurrency();
        await expect(newCurrency).toBe(currency);
    });

    test('TC-JIRA3-011: Verify deposit clears input field after successful transaction', async () => {
        // Arrange
        const depositAmount = 100;

        // Act
        await pageManager.accountPage.clickDepositButtonTab();
        await pageManager.depositPage.deposit(depositAmount);
        await pageManager.depositPage.depositMessage.waitFor({ state: 'visible', timeout: 5000 });

        // Assert
        const inputValue = await pageManager.depositPage.amountInput.inputValue();
        await expect(inputValue).toBe('');
    });

    test('TC-JIRA3-012: Verify all deposits are recorded in transaction history', async ({ page }) => {
        // Arrange
        const deposits = [100, 200, 300];

        // Get initial transaction count
        await pageManager.accountPage.clickTransactions();
        await pageManager.transactionsPage.clickReset();
        const initialCount = await pageManager.transactionsPage.getTransactionCount();
        await pageManager.transactionsPage.clickBack();

        // Act
        await pageManager.accountPage.clickDepositButtonTab();
        for (const amount of deposits) {
            await pageManager.depositPage.deposit(amount);
            await page.waitForTimeout(500);
        }

        // Assert
        await pageManager.accountPage.clickTransactions();
        const finalCount = await pageManager.transactionsPage.getTransactionCount();
        await expect(finalCount).toBe(initialCount + deposits.length);

        // Verify all are Credit type
        const creditTransactions = await pageManager.transactionsPage.getTransactionsByType('Credit');
        await expect(creditTransactions.length).toBeGreaterThanOrEqual(deposits.length);
    });
});
