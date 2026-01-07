import {Page, Locator, expect} from '@playwright/test';

export default class PaginaLanding{
    readonly page: Page;
    readonly botonderegistrarse: Locator;

    constructor(page:Page){
        this.page = page;
        this.botonderegistrarse = page.getByRole('link', { name: 'Registrarse' }).first()
    }

    async irARegistroDeCuenta(){
        this.botonderegistrarse.click({ force: true });
  expect(this.page).toHaveURL('https://qa.biosafeapp.com/signup')
    }
}