import { Locator, Page } from "@playwright/test";

export default class Login{
    public readonly loginText: Locator;
    page: Page;
    userName: Locator;
    userPassword: Locator;
    loginButton: Locator;
    Swag_Labs: Locator;
    constructor(page:Page){
        this.page=page;
        this.loginText=page.locator('.login_logo')
               this. userName= page.locator('[data-test="username"]');
                this. userPassword=page.locator('[data-test="password"]')
                this. loginButton=page.locator('[data-test="login-button"]');
                this. Swag_Labs =page.getByText('Swag Labs')
    }

    public async visitSauceDemo(baseURLString:string){
            //baseURL
            await this.page.goto(baseURLString)
        }
        public async fillLogin(name:string){
            await this.userName.fill(name);
        }
        public async fillPassword(password:string){
            await this.userPassword.fill(password);
        }
        public async clickLoginButton(){
            await this.loginButton.click();
        }
}