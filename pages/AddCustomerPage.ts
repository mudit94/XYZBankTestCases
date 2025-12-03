import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddCustomerPage extends BasePage {
    // Locators
     firstNameInput: Locator;
     lastNameInput: Locator;
     postCodeInput: Locator;
     addCustomerButton: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.locator('input[ng-model="fName"]');
        this.lastNameInput = page.locator('input[ng-model="lName"]');
        this.postCodeInput = page.locator('input[ng-model="postCd"]');
        this.addCustomerButton = page.locator('button[type="submit"]').filter({ hasText: 'Add Customer' });
    }

    /**
     * Enter first name
     */
    async enterFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.clear();
        await this.firstNameInput.fill(firstName);
    }

    /**
     * Enter last name
     */
    async enterLastName(lastName: string): Promise<void> {
        await this.lastNameInput.clear();
        await this.lastNameInput.fill(lastName);
    }

    /**
     * Enter post code
     */
    async enterPostCode(postCode: string): Promise<void> {
        await this.postCodeInput.clear();
        await this.postCodeInput.fill(postCode);
    }

    /**
     * Click Add Customer button
     */
    async clickAddCustomer(): Promise<void> {
        await this.addCustomerButton.click({ force: true });
    }

    /**
     *  add customer form
     */
    async addCustomer(firstName: string, lastName: string, postCode: string): Promise<void> {
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        await this.enterPostCode(postCode);
        await this.clickAddCustomer();
    }

    /**
     * Get alert message text
     */
    async getAlertMessage(): Promise<string> {
        return await this.page.on('dialog', dialog => dialog.message()).toString();
    }

    /**
     * Handle alert dialog and get message
     */
    async handleAlert(): Promise<string> {
        return new Promise((resolve) => {
            this.page.once('dialog', async (dialog) => {
                const message = dialog.message();
                await dialog.accept();
                resolve(message);
            });
        });
    }

    /**
     * Verify add customer page is loaded
     */
    async isLoaded(): Promise<boolean> {
        return await this.isElementVisible(this.firstNameInput) &&
            await this.isElementVisible(this.lastNameInput) &&
            await this.isElementVisible(this.postCodeInput) &&
            await this.isElementVisible(this.addCustomerButton);
    }

    /**
     * Get validation message for a field
     */
    async getFieldValidationMessage(field: 'firstName' | 'lastName' | 'postCode'): Promise<string> {
        let locator: Locator;
        switch (field) {
            case 'firstName':
                locator = this.firstNameInput;
                break;
            case 'lastName':
                locator = this.lastNameInput;
                break;
            case 'postCode':
                locator = this.postCodeInput;
                break;
        }
        return await locator.evaluate((el: HTMLInputElement) => el.validationMessage);
    }
}
