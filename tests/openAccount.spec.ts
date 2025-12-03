import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BankManagerPage } from '../pages/BankManagerPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { CustomersTablePage } from '../pages/CustomersTablePage';
import { TestCurrencies, TestCustomers, SuccessMessages } from '../utils/testData';

/**
 * Test Suite: JIRA-2 - Open an Account
 * Epic: Bank Manager Operations
 * 
 * As a bank manager
 * I want to be able to open new accounts for existing customers
 * So that I can provide quality services to our customers
 * 
 * Acceptance Criteria:
 * - Available currencies: Dollar, Pound, Rupee
 * - If operation is successful: "Account created successfully with account Number :X"
 * - The customer's record in the Customers table is updated with the new account number
 */

test.describe('JIRA-2: Open an Account', () => {
    let homePage: HomePage;
    let bankManagerPage: BankManagerPage;
    let openAccountPage: OpenAccountPage;
    let customersTablePage: CustomersTablePage;

    test.beforeEach(async ({ browser ,context,page }) => {
        context = await browser.newContext();
        page = await context.newPage();
        homePage = new HomePage(page);
        bankManagerPage = new BankManagerPage(page);
        openAccountPage = new OpenAccountPage(page);
        customersTablePage = new CustomersTablePage(page);

        // Navigate to Bank Manager dashboard
        await homePage.goto();
        await homePage.clickBankManagerLogin();
    });

    test.afterEach(async ({ page }) => {
        await page.close();
     //   await context.close();
        //await browser.close();
    });

    test('TC-JIRA2-001: Verify account can be opened successfully with Dollar currency', async () => {
        // Test Data initialization
        const customerName = TestCustomers.HERMOINE_GRANGER
        const currency = TestCurrencies.DOLLARS

        await bankManagerPage.clickCustomers();
        await expect(customersTablePage.customersTable).toBeVisible();
        const initialAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Hermoine', 'Granger');

        //Open Bank account
        await bankManagerPage.clickOpenAccount();
        const alertPromise = openAccountPage.handleAlert();
        await openAccountPage.openAccount(customerName, currency);
        const alertMessage = await alertPromise;

        //Check account opened successfully
        expect(alertMessage).toContain(SuccessMessages.ACCOUNT_CREATED_SUCCESS);
        expect(alertMessage).toMatch(new RegExp(`${SuccessMessages.ACCOUNT_CREATED_SUCCESS}\\s*\\d+`));

        // Extract account number from message
        const accountNumberMatch = alertMessage.match(/:(\d+)/);
        await expect(accountNumberMatch).not.toBeNull();
        const newAccountNumber = accountNumberMatch![1];

        // Verify customer record is updated
        await bankManagerPage.clickCustomers();
        const updatedAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Hermoine', 'Granger');
        await expect(updatedAccountNumbers.length).toBe(initialAccountNumbers.length + 1);
        await expect(updatedAccountNumbers).toContain(newAccountNumber);
    });

    test('TC-JIRA2-002: Verify account can be opened successfully with Pound currency', async () => {
        // Test Data initialization
        const customerName = TestCustomers.HARRY_POTTER;
        const currency = TestCurrencies.POUND;

        await bankManagerPage.clickCustomers();
        const initialAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Harry', 'Potter');

        //Open Bank account
        await bankManagerPage.clickOpenAccount();
        const alertPromise = openAccountPage.handleAlert();
        await openAccountPage.openAccount(customerName, currency);
        const alertMessage = await alertPromise;

        //Check account opened successfully
        expect(alertMessage).toContain(SuccessMessages.ACCOUNT_CREATED_SUCCESS);

        // Verify customer record is updated
        await bankManagerPage.clickCustomers();
        const updatedAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Harry', 'Potter');
        await expect(updatedAccountNumbers.length).toBe(initialAccountNumbers.length + 1);
    });

    test('TC-JIRA2-003: Verify account can be opened successfully with Rupee currency', async () => {
        // Test Data initialization
        const customerName = TestCustomers.RON_WEASLEY;
        const currency = TestCurrencies.RUPEE;
        await bankManagerPage.clickCustomers();
        const initialAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Ron', 'Weasly');

        // Open bank account
        await bankManagerPage.clickOpenAccount();
        const alertPromise = openAccountPage.handleAlert();
        await openAccountPage.openAccount(customerName, currency);
        const alertMessage = await alertPromise;

        // Check account opened successfully
        expect(alertMessage).toContain('Account created successfully with account Number');

        // Verify customer record is updated
        await bankManagerPage.clickCustomers();
        const updatedAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Ron', 'Weasly');
        expect(updatedAccountNumbers.length).toBeGreaterThan(initialAccountNumbers.length);
    });

    test('TC-JIRA2-004: Verify all three currencies are available', async () => {
        // Act
        await bankManagerPage.clickOpenAccount();
        expect(openAccountPage.currencyDropdown).toBeVisible();
        const availableCurrencies = await openAccountPage.getAvailableCurrencies();

        // Assert
        expect(availableCurrencies).toContain('Dollar');
        expect(availableCurrencies).toContain('Pound');
        expect(availableCurrencies).toContain('Rupee');
        expect(availableCurrencies.length).toBe(3);
    });

    test('TC-JIRA2-005: Verify existing customers are available in dropdown', async () => {
        // Act
        await bankManagerPage.clickOpenAccount();
        const availableCustomers = await openAccountPage.getAvailableCustomers();

        // Assert
        expect(availableCustomers.length).toBeGreaterThan(0);
        expect(availableCustomers).toContain(TestCustomers.HERMOINE_GRANGER);
        expect(availableCustomers).toContain(TestCustomers.HARRY_POTTER);
        expect(availableCustomers).toContain(TestCustomers.RON_WEASLEY);
    });

    test('TC-JIRA2-006: Verify Open Account form is displayed correctly', async () => {
        // Act
        await bankManagerPage.clickOpenAccount();

        // Assert
        const isLoaded = await openAccountPage.isLoaded();
        await expect(isLoaded).toBeTruthy();

        await expect(openAccountPage.customerDropdown).toBeVisible();
        await expect(openAccountPage.currencyDropdown).toBeVisible();
        await expect(openAccountPage.processButton).toBeVisible();
    });

    test('TC-JIRA2-007: Verify customer can have multiple accounts', async () => {
        // Test Data initialization
        const customerName = TestCustomers.ALBUS_DUMBLEDORE;

        // Get initial account count
        await bankManagerPage.clickCustomers();
        const initialAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Albus', 'Dumbledore');
        const initialCount = initialAccountNumbers.length;
        await expect(initialCount).toBe(3);

        // Open fourth account
        await bankManagerPage.clickOpenAccount();
        let alertPromise = openAccountPage.handleAlert();
        await openAccountPage.openAccount(customerName, 'Dollar');
        await alertPromise;

        // Act - Open fifth account
        await bankManagerPage.clickOpenAccount();
        alertPromise = openAccountPage.handleAlert();
        await openAccountPage.openAccount(customerName, 'Pound');
        await alertPromise;

        // Assert
        await bankManagerPage.clickCustomers();
        const finalAccountNumbers = await customersTablePage.getCustomerAccountNumbers('Albus', 'Dumbledore');
        await expect(finalAccountNumbers.length).toBe(initialCount + 2);
    });

    test('TC-JIRA2-008: Verify account number is unique', async () => {
        // Arrange
        const customerName = 'Neville Longbottom';
        const accountNumbers: string[] = [];

        // Act - Create multiple accounts
        for (let i = 0; i < 3; i++) {
            await bankManagerPage.clickOpenAccount();
            const alertPromise = openAccountPage.handleAlert();
            await openAccountPage.openAccount(customerName, TestCurrencies.DOLLAR);
            const alertMessage = await alertPromise;

            const accountNumberMatch = alertMessage.match(/:(\d+)/);
            if (accountNumberMatch) {
                accountNumbers.push(accountNumberMatch[1]);
            }
        }

        // Assert - All account numbers should be unique
        const uniqueAccountNumbers = new Set(accountNumbers);
        await expect(uniqueAccountNumbers.size).toBe(accountNumbers.length);
    });

    test('TC-JIRA2-009: Verify account creation updates customer table immediately', async () => {

        const customerName = TestCustomers.HERMOINE_GRANGER;
        const currency = TestCurrencies.DOLLAR;

        await bankManagerPage.clickOpenAccount();
        const alertPromise = openAccountPage.handleAlert();
        await openAccountPage.openAccount(customerName, currency);
        const alertMessage = await alertPromise;

        // Get account number
        const accountNumberMatch = alertMessage.match(/:(\d+)/);
        const newAccountNumber = accountNumberMatch![1];

        //Verify immediately in customers table
        await bankManagerPage.clickCustomers();
        await expect(customersTablePage.customersTable).toBeVisible();
        const accountNumbers = await customersTablePage.getCustomerAccountNumbers('Hermoine', 'Granger');
        await expect(accountNumbers).toContain(newAccountNumber);
    });
});
