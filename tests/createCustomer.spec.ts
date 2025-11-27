import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BankManagerPage } from '../pages/BankManagerPage';
import { AddCustomerPage } from '../pages/AddCustomerPage';
import { CustomersTablePage } from '../pages/CustomersTablePage';
import { NewCustomerDetail, TestCustomers, TestPostcodes } from '../utils/testData';

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
    let page: Page;
    let homePage: HomePage;
    let bankManagerPage: BankManagerPage;
    let addCustomerPage: AddCustomerPage;
    let customersTablePage: CustomersTablePage;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        homePage = new HomePage(page);
        bankManagerPage = new BankManagerPage(page);
        addCustomerPage = new AddCustomerPage(page);
        customersTablePage = new CustomersTablePage(page);

        // Navigate to Bank Manager dashboard
        await homePage.goto();
        await homePage.clickBankManagerLogin();
    });

    test.afterEach(async () => {
        await page.close();
    });
 test('TC-JIRA1-001: Verify First Name field is required', async ({ browserName }) => {
        // Arrange
        const lastName = 'TestLastName';
        const postCode = TestPostcodes;

        // Act
        await bankManagerPage.clickAddCustomer();
        await addCustomerPage.enterLastName(lastName);
        await addCustomerPage.enterPostCode(postCode);
        await addCustomerPage.clickAddCustomer();

        // Assert
        const validationMessage = await addCustomerPage.getFieldValidationMessage('firstName');
        if (browserName === 'webkit') {
            expect(validationMessage).toContain('Fill out this field');
        } else {
            expect(validationMessage).toContain('fill out this field');
        }
    });

    test('TC-JIRA1-002: Verify Last Name field is required', async ({ browserName }) => {
        // Arrange
        const firstName = 'TestFirstName';
        const postCode = TestPostcodes;

        // Act
        await bankManagerPage.clickAddCustomer();
        await addCustomerPage.enterFirstName(firstName);
        await addCustomerPage.enterPostCode(postCode);
        await addCustomerPage.clickAddCustomer();

        // Assert
        const validationMessage = await addCustomerPage.getFieldValidationMessage('lastName');
        if (browserName === 'webkit') {
            expect(validationMessage).toContain('Fill out this field');
        } else {
            expect(validationMessage).toContain('fill out this field');
        }
    });

    test('TC-JIRA1-003: Verify Post Code field is required', async ({ browserName }) => {
        // Test Data storage
        const firstName = 'TestFirstName';
        const lastName = 'TestLastName';


        await bankManagerPage.clickAddCustomer();
        await addCustomerPage.enterFirstName(firstName);
        await addCustomerPage.enterLastName(lastName);
        await addCustomerPage.clickAddCustomer();

        // Assert
        const validationMessage = await addCustomerPage.getFieldValidationMessage('postCode');

        if (browserName === 'webkit') {
            expect(validationMessage).toContain('Fill out this field');
        } else {
            expect(validationMessage).toContain('Please fill out this field');
        }
    });
    test('TC-JIRA1-004: Verify customer can be added successfully with valid details', async () => {
        // Arrange
        const firstName = TestCustomers.TEST_CUSTOMER;
        const lastName = 'Automation';
        const postCode = TestPostcodes;

        // Act
        await bankManagerPage.clickAddCustomer();

        const alertPromise = addCustomerPage.handleAlert();
        await addCustomerPage.addCustomer(firstName, lastName, postCode);
        const alertMessage = await alertPromise;

        // Assert
        expect(alertMessage).toContain('Customer added successfully with customer id');
        expect(alertMessage).toMatch(/Customer added successfully with customer id :\d+/);

        // Verify customer is added to the table
        await bankManagerPage.clickCustomers();
        expect(customersTablePage.customersTable).toBeVisible();
        const customerExists = await customersTablePage.customerExists(firstName, lastName);
        const customer = await customersTablePage.findCustomerByName(firstName, lastName);
        expect(customer).not.toBeNull();
        expect(customer?.firstName).toBe(firstName);
        expect(customer?.lastName).toBe(lastName);
        expect(customer?.postCode).toBe(postCode);
    });

    test('TC-JIRA1-005: Verify duplicate customer shows appropriate message', async () => {
        // Arrange
        const firstName = 'Harry';
        const lastName = 'Potter';
        const postCode = 'E725JB';

        // Act
        await bankManagerPage.clickAddCustomer();

        const alertPromise = addCustomerPage.handleAlert();
        await addCustomerPage.addCustomer(firstName, lastName, postCode);
        const alertMessage = await alertPromise;

        // Assert
        expect(alertMessage).toContain('Please check the details. Customer may be duplicate.');
    });
  test('TC-JIRA1-006: Verify new customer appears in Customers table', async () => {

        const firstName = NewCustomerDetail.firstName;
        const lastName = NewCustomerDetail.lastName;
        const postCode = NewCustomerDetail.postCode;
        await bankManagerPage.clickCustomers();
        const initialCount = await customersTablePage.getCustomerCount();


        // Adding the new customer
        await bankManagerPage.clickAddCustomer();
        const alertPromise = addCustomerPage.handleAlert();
        await addCustomerPage.addCustomer(firstName, lastName, postCode);
        await alertPromise;

        // Checking whether new customer is added in the table and the record size increases by 1
        await bankManagerPage.clickCustomers();
        await customersTablePage.customersTable.waitFor({ state: 'visible' });
        const newCount = await customersTablePage.getCustomerCount();
        expect(newCount).toBe(initialCount + 1);

        const customer = await customersTablePage.findCustomerByName(firstName, lastName);
        expect(customer).not.toBeNull();
    });
    test('TC-JIRA1-007: Verify Add Customer form is displayed correctly', async () => {
        await bankManagerPage.clickAddCustomer();
        const isLoaded = await addCustomerPage.isLoaded();
        expect(isLoaded).toBeTruthy();
        await expect(addCustomerPage.firstNameInput).toBeVisible();
        await expect(addCustomerPage.lastNameInput).toBeVisible();
        await expect(addCustomerPage.postCodeInput).toBeVisible();
        await expect(addCustomerPage.addCustomerButton).toBeVisible();
    });

  

    test('TC-JIRA1-008: Verify customer details can be added with special characters in Post Code and First name fields', async () => {
        const firstName = `$pecialchar${Date.now()}`;
        const lastName = 'PostCodeTest';
        const postCode = 'SW1A-1AA';

        await bankManagerPage.clickAddCustomer();
        const alertPromise = addCustomerPage.handleAlert();
        await addCustomerPage.addCustomer(firstName, lastName, postCode);
        const alertMessage = await alertPromise;

        expect(alertMessage).toContain('Customer added successfully with customer id');

        await bankManagerPage.clickCustomers();
        const customer = await customersTablePage.findCustomerByName(firstName, lastName);
        expect(customer?.postCode).toBe(postCode);
    });
});
