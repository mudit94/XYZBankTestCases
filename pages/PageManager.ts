import { Page } from "@playwright/test";
import { CustomersTablePage } from "./CustomersTablePage";
import { HomePage } from "./HomePage";
import { CustomerLoginPage } from "./CustomerLoginPage";
import { AccountPage } from "./AccountPage";
import { DepositPage } from "./DepositPage";
import { TransactionsPage } from "./TransactionsPage";
import { OpenAccountPage } from "./OpenAccountPage";
import { BankManagerPage } from "./BankManagerPage";
import { AddCustomerPage } from "./AddCustomerPage";
import { WithdrawalPage } from "./WithdrawalPage";

/**
 * PageManager - Centralized page object management
 * Initializes and provides access to all page objects used in tests
 */
export class PageManager {
    private readonly page: Page;
    private readonly _homePage: HomePage;
    private readonly _customerLoginPage: CustomerLoginPage;
    private readonly _accountPage: AccountPage;
    private readonly _depositPage: DepositPage;
    private readonly _transactionsPage: TransactionsPage;
    private readonly _openAccountPage: OpenAccountPage;
    private readonly _bankManagerPage: BankManagerPage;
    private readonly _addCustomerPage: AddCustomerPage;
    private readonly _customersTablePage: CustomersTablePage;
    private readonly _withdrawalPage: WithdrawalPage;

    constructor(page: Page) {
        this.page = page;
        this._homePage = new HomePage(this.page);
        this._customerLoginPage = new CustomerLoginPage(this.page);
        this._accountPage = new AccountPage(this.page);
        this._depositPage = new DepositPage(this.page);
        this._transactionsPage = new TransactionsPage(this.page);
        this._openAccountPage = new OpenAccountPage(this.page);
        this._bankManagerPage = new BankManagerPage(this.page);
        this._addCustomerPage = new AddCustomerPage(this.page);
        this._customersTablePage = new CustomersTablePage(this.page);
        this._withdrawalPage = new WithdrawalPage(this.page);
    }

    get homePage(): HomePage {
        return this._homePage;
    }

    get customerLoginPage(): CustomerLoginPage {
        return this._customerLoginPage;
    }

    get accountPage(): AccountPage {
        return this._accountPage;
    }

    get depositPage(): DepositPage {
        return this._depositPage;
    }

    get transactionsPage(): TransactionsPage {
        return this._transactionsPage;
    }

    get openAccountPage(): OpenAccountPage {
        return this._openAccountPage;
    }

    get bankManagerPage(): BankManagerPage {
        return this._bankManagerPage;
    }

    get addCustomerPage(): AddCustomerPage {
        return this._addCustomerPage;
    }

    get customersTablePage(): CustomersTablePage {
        return this._customersTablePage;
    }

    get withdrawalPage(): WithdrawalPage {
        return this._withdrawalPage;
    }
}