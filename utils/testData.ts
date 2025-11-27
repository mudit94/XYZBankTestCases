/**
 * Test data
 */

export const TestCustomers = {
    HERMOINE_GRANGER: 'Hermoine Granger',
    HARRY_POTTER: 'Harry Potter',
    RON_WEASLEY: 'Ron Weasly',
    ALBUS_DUMBLEDORE: 'Albus Dumbledore',
    NEVILLE_LONGBOTTOM: 'Neville Longbottom',
    TEST_CUSTOMER: `TestUser${Date.now()}`
}
export const TestCurrencies = {
    POUNDS: 'Pounds',
    POUND: 'Pound',
    DOLLAR: 'Dollar',
    DOLLARS: 'Dollar',
    RUPEE: 'Rupee'
} as const;

export const TestAmounts = {
    SMALL_DEPOSIT: 100,
    MEDIUM_DEPOSIT: 500,
    LARGE_DEPOSIT: 1000,
    SMALL_WITHDRAWAL: 50,
    MEDIUM_WITHDRAWAL: 200,
    LARGE_WITHDRAWAL: 500
} as const;

export const ErrorMessages = {
    INSUFFICIENT_FUNDS: 'Transaction Failed. You can not withdraw amount more than the balance.',

} as const;
export const SuccessMessages = {
    DEPOSIT_SUCCESS: 'Deposit Successful',
    WITHDRAWAL_SUCCESS: 'Transaction successful',
    ACCOUNT_CREATED_SUCCESS: 'Account created successfully with account Number :'
};
export const URLs = {
    BASE_URL: 'https://www.globalsqa.com/angularJs-protractor/BankingProject',
    HOME: '/#/login',
    CUSTOMER_LOGIN: '/#/customer',
    ACCOUNT: '/#/account'
} as const;

export const NewCustomerDetail = {
    firstName: `NewCustomer${Date.now()}`,
    lastName: 'TableTest',
    postCode: 'NW1 6XE'
}
export const TestPostcodes = 'SW1A 1AA'
export const EmptyFields = {
    PLEASE_FILL: 'Please fill out this field',
    FILL: 'Fill out this field',
    PLEASE_ENTER_NUMBER: 'Please enter a number',
    ENTER: 'Enter a valid value',
    PLEASE_ENTER_VALID: 'Please enter a valid value. The two nearest valid values are',
    PLEASE_SELECT_VALID: 'Please select a valid value'

}