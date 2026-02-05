import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { env } from '../config/env';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    //const  username= "Admin";
   //const  password= "admin123"

    await loginPage.navigate();
    await loginPage.login(env.username, env.password);
  //  await loginPage.login(username, password);

    await page.waitForLoadState('domcontentloaded');
    //await expect(page).toHaveURL(/dashboard/);

    await use(page);
  },
});

export { expect };
