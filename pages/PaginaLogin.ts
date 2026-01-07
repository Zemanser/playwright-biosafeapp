import { Page, Locator, expect } from '@playwright/test';


export default class PaginaLogin {
readonly page: Page;
readonly emailInput: Locator;
readonly passwordInput: Locator;
readonly loginButton: Locator;


constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByTestId('email-Input');
        this.passwordInput = page.getByTestId('password-Input');
        this.loginButton = page.getByTestId('login-button');
        
    }
    
}