import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { DuplicateCustomerMessages, EmptyFields, lastNameData, NewCustomerDetail, SuccessMessages, TestCustomers, TestPostcodes } from '../utils/testData';

/**
 * Test Suite: JIRA-1 - Create a Customer
 * Epic: Bank Manager Operations
 * 
 * As a bank manager
 * I want to be able to add new bank customers
 * So that I can provide quality services to our customers
 * 
 * Acceptance Criteria:
 * - First Name, Last Name and Post Code fields are required
 * - If operation is successful: "Customer added successfully with customer id :X"
 * - If customer already exists: "Please check the details. Customer may be duplicate."
 * - New record is added to the Customers table
 */

test.describe('JIRA-1: Create a Customer', () => {

    let pageManager: PageManager;

    test.beforeEach(async ({ page, context, browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        pageManager = new PageManager(page);

        // Navigate to Bank Manager dashboard
        await pageManager.homePage.goto();
        await pageManager.homePage.clickBankManagerLogin();
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
    test('TC-JIRA1-001: Verify First Name field is required', async ({ browserName }) => {
        // Arrange
        const lastName = 'TestLastName';
        const postCode = TestPostcodes;

        // Act
        await pageManager.bankManagerPage.clickAddCustomer();
        await pageManager.addCustomerPage.enterLastName(lastName);
        await pageManager.addCustomerPage.enterPostCode(postCode);
        await pageManager.addCustomerPage.clickAddCustomer();

        // Assert
        const validationMessage = await pageManager.addCustomerPage.getFieldValidationMessage('firstName');
        if (browserName === 'webkit') {
            expect(validationMessage).toContain(EmptyFields.FILL);
        } else {
            expect(validationMessage).toContain(EmptyFields.FILL_SMALL);
        }
    });

    test('TC-JIRA1-002: Verify Last Name field is required', async ({ browserName }) => {
        // Arrange
        const firstName = 'TestFirstName';
        const postCode = TestPostcodes;

        // Act
        await pageManager.bankManagerPage.clickAddCustomer();
        await pageManager.addCustomerPage.enterFirstName(firstName);
        await pageManager.addCustomerPage.enterPostCode(postCode);
        await pageManager.addCustomerPage.clickAddCustomer();

        // Assert
        const validationMessage = await pageManager.addCustomerPage.getFieldValidationMessage('lastName');
        if (browserName === 'webkit') {
            expect(validationMessage).toContain(EmptyFields.FILL);
        } else {
            expect(validationMessage).toContain(EmptyFields.FILL_SMALL);
        }
    });

    test('TC-JIRA1-003: Verify Post Code field is required', async ({ browserName }) => {
        // Test Data storage
        const firstName = 'TestFirstName';
        const lastName = 'TestLastName';


        await pageManager.bankManagerPage.clickAddCustomer();
        await pageManager.addCustomerPage.enterFirstName(firstName);
        await pageManager.addCustomerPage.enterLastName(lastName);
        await pageManager.addCustomerPage.clickAddCustomer();

        // Assert
        const validationMessage = await pageManager.addCustomerPage.getFieldValidationMessage('postCode');

        if (browserName === 'webkit') {
            await expect(validationMessage).toContain(EmptyFields.FILL);
        } else {
            await expect(validationMessage).toContain(EmptyFields.PLEASE_FILL);
        }
    });
    test('TC-JIRA1-004: Verify customer can be added successfully with valid details', async () => {
        // Arrange
        const firstName = TestCustomers.TEST_CUSTOMER;
        const lastName = lastNameData;
        const postCode = TestPostcodes;

        // Act
        await pageManager.bankManagerPage.clickAddCustomer();

        const alertPromise = pageManager.addCustomerPage.handleAlert();
        await pageManager.addCustomerPage.addCustomer(firstName, lastName, postCode);
        const alertMessage = await alertPromise;

        // Assert
        await expect(alertMessage).toContain(SuccessMessages.CUSTOMER_ADDED_SUCCESS);
        await expect(alertMessage).toMatch(new RegExp(`${SuccessMessages.CUSTOMER_ADDED_SUCCESS}:\\d+`));

        // Verify customer is added to the table
        await pageManager.bankManagerPage.clickCustomers();
        await expect(pageManager.customersTablePage.customersTable).toBeVisible();
        const customerExists = await pageManager.customersTablePage.customerExists(firstName, lastName);
        const customer = await pageManager.customersTablePage.findCustomerByName(firstName, lastName);
        await expect(customer).not.toBeNull();
        await expect(customer?.firstName).toBe(firstName);
        await expect(customer?.lastName).toBe(lastName);
        await expect(customer?.postCode).toBe(postCode);
    });

    test('TC-JIRA1-005: Verify duplicate customer shows appropriate message', async () => {
        // Arrange
        const firstName = 'Harry';
        const lastName = 'Potter';
        const postCode = 'E725JB';

        // Act
        await pageManager.bankManagerPage.clickAddCustomer();

        const alertPromise = pageManager.addCustomerPage.handleAlert();
        await pageManager.addCustomerPage.addCustomer(firstName, lastName, postCode);
        const alertMessage = await alertPromise;

        // Assert
        await expect(alertMessage).toContain(DuplicateCustomerMessages);
    });
    test('TC-JIRA1-006: Verify new customer appears in Customers table', async () => {

        const firstName = NewCustomerDetail.firstName;
        const lastName = NewCustomerDetail.lastName;
        const postCode = NewCustomerDetail.postCode;
        await pageManager.bankManagerPage.clickCustomers();
        const initialCount = await pageManager.customersTablePage.getCustomerCount();


        // Adding the new customer
        await pageManager.bankManagerPage.clickAddCustomer();
        const alertPromise = pageManager.addCustomerPage.handleAlert();
        await pageManager.addCustomerPage.addCustomer(firstName, lastName, postCode);
        await alertPromise;

        // Checking whether new customer is added in the table and the record size increases by 1
        await pageManager.bankManagerPage.clickCustomers();
        await pageManager.customersTablePage.customersTable.waitFor({ state: 'visible' });
        const newCount = await pageManager.customersTablePage.getCustomerCount();
        expect(newCount).toBe(initialCount + 1);

        const customer = await pageManager.customersTablePage.findCustomerByName(firstName, lastName);
        expect(customer).not.toBeNull();
    });

    test('TC-JIRA1-007: Verify Add Customer form is displayed correctly', async () => {
        await pageManager.bankManagerPage.clickAddCustomer();
        const isLoaded = await pageManager.addCustomerPage.isLoaded();
        expect(isLoaded).toBeTruthy();
        await expect(pageManager.addCustomerPage.firstNameInput).toBeVisible();
        await expect(pageManager.addCustomerPage.lastNameInput).toBeVisible();
        await expect(pageManager.addCustomerPage.postCodeInput).toBeVisible();
        await expect(pageManager.addCustomerPage.addCustomerButton).toBeVisible();
    });



    test('TC-JIRA1-008: Verify customer details can be added with special characters in Post Code and First name fields', async () => {
        const firstName = `$pecialchar${Date.now()}`;
        const lastName = 'PostCodeTest';
        const postCode = 'SW1A-1AA';

        await pageManager.bankManagerPage.clickAddCustomer();
        const alertPromise = pageManager.addCustomerPage.handleAlert();
        await pageManager.addCustomerPage.addCustomer(firstName, lastName, postCode);
        const alertMessage = await alertPromise;

        expect(alertMessage).toContain(SuccessMessages.CUSTOMER_ADDED_SUCCESS);

        await pageManager.bankManagerPage.clickCustomers();
        const customer = await pageManager.customersTablePage.findCustomerByName(firstName, lastName);
        expect(customer?.postCode).toBe(postCode);
    });
    test('TC:JIRA1-009: Verify customer search box is working correctly', async () => {
        await pageManager.bankManagerPage.clickCustomers();
        await pageManager.customersTablePage.customersTable.waitFor({ state: 'visible' });

        // Get  count of all customers before search
        const initialCount = await pageManager.customersTablePage.getCustomerCount();
        expect(initialCount).toBeGreaterThan(0);

        // Act - Search for a specific customer (using a known existing customer)
        const searchTerm = 'Ron';
        const searchResults = await pageManager.customersTablePage.findCustomerBySearching(searchTerm);

        // Assert - Verify search results
        expect(searchResults).not.toBeNull();
        expect(searchResults!.length).toBeGreaterThan(0);

        // Verify that search filtered the table (results should be less than or equal to initial count)
        expect(searchResults!.length).toBeLessThanOrEqual(initialCount);

        // Verify all returned customers contain the search term in at least one field
        for (const customer of searchResults!) {
            const matchesSearch =
                customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.postCode.toLowerCase().includes(searchTerm.toLowerCase());

            await expect(matchesSearch).toBeTruthy();
        }

        // Verify the customer count after search matches the search results
        const filteredCount = await pageManager.customersTablePage.getCustomerCount();
        await expect(filteredCount).toBe(searchResults!.length);
    });
});
