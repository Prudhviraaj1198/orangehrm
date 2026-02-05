import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string) {
  await this.usernameInput.click();
  await this.usernameInput.fill('');
  await this.usernameInput.type(username.trim(), { delay: 50 });

  await this.passwordInput.click();
  await this.passwordInput.fill('');
  await this.passwordInput.type(password.trim(), { delay: 50 });
  await expect(this.usernameInput).toHaveValue(username);
  await expect(this.passwordInput).toHaveValue(password);

  await this.loginButton.click();
}

}
