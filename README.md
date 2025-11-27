# Banking Application - Playwright Test Automation Framework
**Test Application**: https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login 
**Framework**: Playwright with TypeScript  
**Design Pattern**: Page Object Model (POM)  
**Assignment**: NatWest Quality Automation Specialist - Web UI

---


### JIRA-1: Create a Customer
**Epic**: Bank Manager Operations  
**User Story**: As a bank manager, I want to be able to add new bank customers so that I can provide quality services to our customers

**Acceptance Criteria**:
- First Name, Last Name and Post Code fields are required
- Success message: "Customer added successfully with customer id :X"
- Duplicate message: "Please check the details. Customer may be duplicate."
- New record is added to the Customers table

---

### JIRA-2: Open an Account
**Epic**: Bank Manager Operations  
**User Story**: As a bank manager, I want to be able to open new accounts for existing customers so that I can provide quality services to our customers

**Acceptance Criteria**:
- Available currencies: Dollar, Pound, Rupee
- Success message: "Account created successfully with account Number :X"
- Customer's record in Customers table is updated with new account number


---

### JIRA-3: Make a Deposit


**Epic**: Bank Customer Operations  
**User Story**: As a bank customer, I want to be able to withdraw balance less than or equal to the available balance from one of my existing accounts so that I am not showing some or 0 balance

**Acceptance Criteria**:
- Success message: "Transaction successful" (displayed above the amount field)
- Account balance is updated accordingly
- New record added to Transactions table with Transaction Type = Debit


**User Story**: As a bank customer, I want to be able to make a deposit to one of my existing accounts so that I can manage my finances

**Acceptance Criteria**:
- Error message: Transaction Failed. You can not withdraw amount more than the balance." (displayed above the amount field)
- Account balance is updated accordingly
- New record added to Transactions table with Transaction Type = Credit
- Empty amount validation: "Please fill in this field."

---

### Additional Test: Withdraw Balance
**Epic**: Bank Additional Operations  
**User Story**: As a bank customer, I do not want to be able to withdraw balance more than the available balance from one of my existing accounts so that I am not showing balance in negative

**Acceptance Criteria**:
- Success message: "Transaction Failed. You can not withdraw amount more than the balance." (displayed above the amount field)
- Account balance is not updated
- No New record added to Transactions table


--- 

## 📁 Project Structure

```
Natwest-assignment/
├── pages/                          # Page Object Models
│   ├── BasePage.ts                # Base class with common methods
│   ├── HomePage.ts                # Home page POM
│   ├── BankManagerPage.ts         # Bank Manager dashboard POM
│   ├── AddCustomerPage.ts         # Add Customer form POM
│   ├── OpenAccountPage.ts         # Open Account form POM
│   ├── CustomersTablePage.ts      # Customers table POM
│   ├── CustomerLoginPage.ts       # Customer login POM
│   ├── AccountPage.ts             # Account page POM
│   ├── DepositPage.ts             # Deposit functionality POM
│   ├── WithdrawalPage.ts          # Withdrawal functionality POM
│   ├── TransactionsPage.ts        # Transactions page POM
│
├── tests/                          # Test Specifications
│   ├── jira1-create-customer.spec.ts    # JIRA-1: Create Customer
│   ├── jira2-open-account.spec.ts       # JIRA-2: Open Account
│   └── jira3-make-deposit.spec.ts       # JIRA-3: Make Deposit
│
├── utils/                          # Utilities and Helpers
│   └── testData.ts               # Test data constants
│
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
|── index.ts                       # Common export file for all the pages
└── README.md                      # This file
```

## Quick Start

### Installation

```bash

#Install playwright using npm
npm init playwright@latest

# Install Playwright browsers
npx playwright install
```

### Run Tests

```bash
# Run all JIRA tests
npm test

# Run specific JIRA story tests
npm run test:jira1    # JIRA-1: Create Customer
npm run test:jira2    # JIRA-2: Open Account
npm run test:jira3    # JIRA-3: Make Deposit
npm run test:additional #Additional Tests
# Run in headed mode (browser in action)
npm run test:headed

# Run in UI mode (interactive)
npm run test:ui

```
### View Reports

```bash
# Run tests and view report
npm run test:report


### For running in different browsers
- Chrome/Chromium
npm run test:chrome
- Firefox
npm run test:firefox
- Safari/WebKit
npm run test:safari

### Run based on Interactive Mode
```bash
npm run test:headed      # Visual browser execution
npm run test:ui          # Interactive test explorer
```