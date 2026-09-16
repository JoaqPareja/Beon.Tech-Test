
import { test, expect } from '@playwright/test';
import Login from '../../../POM/UI/Login';

test('Automate Login',async ({page})=>{
    
    const loging = new Login(page);
    await test.step('Visit Url',async ()=>{
        await loging.visitSauceDemo(process.env.UI_BASE_URL as string);
         expect(page.url()).toContain(process.env.UI_BASE_URL);
    })
    await test.step('Check Top header text',async ()=>{
        await expect(loging.loginText).toContainText('Swag Labs')
    })
    await test.step('Log in',async()=>{

       await loging.fillLogin(process.env.TEST_USER_UI as string);
        await expect(loging.userName).toHaveValue(process.env.TEST_USER_UI as string);

       await loging.fillPassword(process.env.TEST_PASSWORD_UI as string)
        await expect(loging.userPassword).toHaveValue(process.env.TEST_PASSWORD_UI as string);

        await loging.clickLoginButton();

        expect(page.url()).toContain('/inventory.html');
        await expect(loging.Swag_Labs).toBeVisible()
    })
})
