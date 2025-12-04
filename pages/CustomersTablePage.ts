import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';


export interface Customer {
    firstName: string;
    lastName: string;
    postCode: string;
    accountNumbers: string;
}

export class CustomersTablePage extends BasePage {
    // Locators
    customersTable: Locator;
    customerRows: Locator;
    searchBox: Locator;

    constructor(page: Page) {
        super(page);
        this.customersTable = page.locator('table.table');
        this.customerRows = page.locator('table.table tbody tr');
        this.searchBox = page.getByPlaceholder('Search Customer');
    }

    /**
     * Search for a customer
     */
    async searchCustomer(searchTerm: string): Promise<void> {
        //await this.searchBox.clear();
        await this.searchBox.fill(searchTerm);
        //return await this.customerRows.count();
    }

    /**
     * Get all customers from the table
     */
    async getAllCustomers(): Promise<Customer[]> {
        const customers: Customer[] = [];
        const rows = await this.customerRows.all();

        for (const row of rows) {
            const cells = await row.locator('td').all();
            if (cells.length >= 4) {
                const firstName = await cells[0].textContent() || '';
                const lastName = await cells[1].textContent() || '';
                const postCode = await cells[2].textContent() || '';
                const accountNumbers = await cells[3].textContent() || '';
                customers.push({ firstName, lastName, postCode, accountNumbers });
            }
        }

        return customers;
    }

    async findCustomerByName(firstName: string, lastName: string): Promise<Customer | null> {
        const customers = await this.getAllCustomers();
        return customers.find(c =>
            c.firstName.trim() === firstName.trim() &&
            c.lastName.trim() === lastName.trim()
        ) || null;
    }

    async findCustomerBySearching(searchTerm: string): Promise<Customer[] | null> {
        await this.searchCustomer(searchTerm);

        // Wait for the table to update after search filter is applied
        await this.page.waitForTimeout(300);

        const customers: Customer[] = [];
        const rows = await this.customerRows.all();

        if (rows.length === 0) {
            return null;
        }

        // Iterate through each filtered row
        for (const row of rows) {
            const cells = await row.locator('td').all();
            if (cells.length >= 4) {
                const firstName = await cells[0].textContent() || '';
                const lastName = await cells[1].textContent() || '';
                const postCode = await cells[2].textContent() || '';
                const accountNumbers = await cells[3].textContent() || '';
                customers.push({ firstName, lastName, postCode, accountNumbers });
            }
        }

        return customers.length > 0 ? customers : null;
    }
    /**
     * Check if customer exists
     */
    async customerExists(firstName: string, lastName: string): Promise<boolean> {
        const customer = await this.findCustomerByName(firstName, lastName);
        return customer !== null;
    }

    /**
     * Get customer count
     */
    async getCustomerCount(): Promise<number> {
        return await this.customerRows.count();
    }


    /**
     * Get account numbers for a customer
     */
    async getCustomerAccountNumbers(firstName: string, lastName: string): Promise<string[]> {
        const customer = await this.findCustomerByName(firstName, lastName);
        if (!customer) return [];

        const accountNumbersText = customer.accountNumbers.trim();
        if (!accountNumbersText) return [];

        return accountNumbersText.split(/\s+/).filter(num => num.length > 0);
    }


    async isLoaded(): Promise<boolean> {
        return await this.customersTable.isVisible() &&
            await this.searchBox.isVisible();
    }
}
