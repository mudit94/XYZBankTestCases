import { test, Page, expect } from "@playwright/test";
import { AccountPage, AddCustomerPage, BankManagerPage, CustomerLoginPage, CustomersTablePage, HomePage, WithdrawalPage, TransactionsPage } from "../pages";
import { EmptyFields, ErrorMessages, SuccessMessages, TestCustomers } from "../utils/testData";


test.describe('JIRA-4: Withdraw Balance', () => {
    let page: Page;
    let homePage: HomePage;
    let bankManagerPage: BankManagerPage;
    let addCustomerPage: AddCustomerPage;
    let customerLoginPage: CustomerLoginPage;
    let customersTablePage: CustomersTablePage;
    let accountPage: AccountPage;
    let withdrawalPage: WithdrawalPage;
    let transactionsPage: TransactionsPage;
    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        homePage = new HomePage(page);
        bankManagerPage = new BankManagerPage(page);
        addCustomerPage = new AddCustomerPage(page);
        customersTablePage = new CustomersTablePage(page);
        customerLoginPage = new CustomerLoginPage(page);
        withdrawalPage = new WithdrawalPage(page);
        accountPage = new AccountPage(page);
        transactionsPage = new TransactionsPage(page);
        // Navigate to Bank Manager dashboard
        await homePage.goto();
        await homePage.clickCustomerLogin();
        await customerLoginPage.login(TestCustomers.HERMOINE_GRANGER);
    });

    test.afterEach(async () => {
        await page.close();
    });
    test('Verify customer can withdraw balance less than or equal to available', async ({ browser }) => {



        const withdrawalAmount = 5091;
        let availableBalance = await accountPage.getBalanceAsNumber();
        await accountPage.clickWithdrawl();
        await withdrawalPage.withdraw(withdrawalAmount);
        let successMessage = await withdrawalPage.getWithdrawalMessage();
        expect(successMessage).toContain(SuccessMessages.WITHDRAWAL_SUCCESS);
        let newAvailableBalance = await accountPage.getBalanceAsNumber();
        expect(newAvailableBalance).toBe(availableBalance - withdrawalAmount);
    });
    test('Verify withdraw transaction appears as Debit Type in the transactions table', async ({ browser }) => {


        const withdrawalAmount = 500;
        await accountPage.clickWithdrawl();
        await withdrawalPage.withdraw(withdrawalAmount);
        await accountPage.clickTransactions();
        let isLoaded = await transactionsPage.isLoaded();
        expect(isLoaded).toBeTruthy();
        await transactionsPage.transactionsTable.waitFor({ state: 'visible', timeout: 5000 });
        await transactionsPage.DateTimeHeaderLink.click({ force: true });
        await page.waitForTimeout(5000);
        const transactions = await transactionsPage.getAllTransactions();
        await page.waitForTimeout(5000);
        expect(transactions.length).toBeGreaterThan(0);

        // After sorting by Date-Time in reverse, the first transaction should be our most recent deposit
        const firstTransaction = transactions[0];
        expect(firstTransaction.amount).toContain(withdrawalAmount.toString());
        expect(firstTransaction.type).toBe('Debit');

    })
    test('Verify customer cannot withdraw balance more than available', async () => {
        // Test Data initialization
        const withdrawalAmount = 6000;

        await accountPage.clickTransactions();
        await page.waitForLoadState();
        await transactionsPage.transactionsTable.waitFor({ state: 'visible', timeout: 7000 });
        let transactionsCount = await transactionsPage.getTransactionCount();
        await transactionsPage.clickBack();
        let availableBalance = await accountPage.getBalanceAsNumber();
        await accountPage.clickWithdrawl();
        await withdrawalPage.withdraw(withdrawalAmount);
        let errorMessage = await withdrawalPage.getWithdrawalMessage();
        expect(errorMessage).toContain(ErrorMessages.INSUFFICIENT_FUNDS);
        await accountPage.clickTransactions();
        await transactionsPage.transactionsTable.waitFor({ state: 'visible', timeout: 5000 });
        let newTransactionsCount = await transactionsPage.getTransactionCount();
        expect(newTransactionsCount).toBe(transactionsCount);
        await transactionsPage.clickBack();;
        let newAvailableBalance = await accountPage.getBalanceAsNumber();
        expect(newAvailableBalance).toBe(availableBalance);

    });
    test('Verify empty amount shows validation tooltip', async ({ browserName }) => {

        await accountPage.clickWithdrawl();
        await withdrawalPage.amountInput.waitFor({ state: 'visible' });
        await withdrawalPage.clickWithdraw(); // Click without entering amount
        const validationMessage = await withdrawalPage.getFieldValidationMessage();
        if (browserName === 'firefox') {
            expect(validationMessage).toContain(EmptyFields.PLEASE_ENTER_NUMBER);
        }
        else if (browserName === 'webkit') {
            expect(validationMessage).toContain(EmptyFields.FILL);
        }
        else {
            expect(validationMessage).toContain(EmptyFields.PLEASE_FILL);
        }
    });
});
