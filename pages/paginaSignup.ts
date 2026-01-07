import { Page, Locator, expect } from '@playwright/test';

export default class paginaSignup {
    readonly page: Page;
    readonly nombreInput: Locator;
    readonly emailInput: Locator;
    readonly contrasenaInput: Locator;
    readonly confirmarContrasenaInput: Locator;
    readonly registroButton: Locator;
    readonly regitroExitosoAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nombreInput = page.getByTestId('nameInput');
        this.emailInput = page.getByTestId('emailInput');
        this.contrasenaInput = page.getByTestId('passwordInput');
        this.confirmarContrasenaInput = page.getByTestId('confirmPasswordInput');
        this.registroButton = page.getByTestId('botonRegistro');
        this.regitroExitosoAlert = page.getByText('registro exitoso!')
    }
    async completarRegistroExitoso(user: any): Promise<string> {
        const MailDeUsuarioUnico = user.email.replace('@', `+${Date.now()}@`)
        console.log(MailDeUsuarioUnico)
        await this.nombreInput.fill(user.nombre)
        await this.emailInput.fill(MailDeUsuarioUnico)
        await this.contrasenaInput.fill(user.contrasena)
        await this.confirmarContrasenaInput.fill(user.contrasena)
        await this.registroButton.click()
        await expect(this.regitroExitosoAlert).toBeVisible()
        await expect(this.regitroExitosoAlert).not.toBeVisible()
        return MailDeUsuarioUnico;

    }
}

