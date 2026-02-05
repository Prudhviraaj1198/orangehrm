import { Page, Locator, expect } from '@playwright/test';

export class EmployeePage {
  private readonly page: Page;

  // Navigation
  private readonly PIMMenu: Locator;
  private readonly addEmployeeButton: Locator;

  // Form fields
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly saveButton: Locator;

  // Toast
  private readonly successToast: Locator;

  // Employee list
  private readonly employeeTable: Locator;
  private readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.PIMMenu = page.getByRole('link', { name: 'PIM' });
    this.addEmployeeButton = page.getByRole('button', { name: /Add/i });

    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.saveButton = page.locator('button[type="submit"]');

    this.successToast = page.locator('.oxd-toast-content');

    this.employeeTable = page.locator('.oxd-table-body');
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
  }

  /* ---------- CREATE ---------- */

  async navigateToAddEmployee() {
    await this.PIMMenu.click();
    await this.page.waitForURL(/pim/i);
    await this.addEmployeeButton.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async createEmployee(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async getPrefilledEmployeeIdFromForm(): Promise<string> {
    const employeeIdInput = this.page.locator(
      '.oxd-input-group:has(label:has-text("Employee Id")) input'
    );
    await expect(employeeIdInput).toBeVisible();
    return (await employeeIdInput.inputValue()).trim();
  }

  /* ---------- COMMON LIST LOGIC ---------- */

  private async navigateToEmployeeList() {
    await this.PIMMenu.click();
    await this.page.getByRole('link', { name: 'Employee List' }).click();
    await expect(this.employeeTable).toBeVisible();
  }

  private async getEmployeeRowById(empID: string): Promise<Locator> {
    await this.navigateToEmployeeList();

    let pageCount = 0;
    const maxPages = 10;

    while (pageCount < maxPages) {
      const row = this.employeeTable.locator('.oxd-table-row').filter({
        has: this.page.locator('.oxd-table-cell:nth-child(2)', {
          hasText: empID,
        }),
      });

      if (await row.count() > 0) {
        await expect(row.first()).toBeVisible();
        return row.first();
      }

      const nextBtn = this.page.locator('button[aria-label*="Next"]');
      if (!(await nextBtn.isVisible()) || (await nextBtn.isDisabled())) break;

      await nextBtn.click();
      await this.page.waitForLoadState('domcontentloaded');
      pageCount++;
    }

    throw new Error(`Employee ID ${empID} not found in employee list`);
  }

  /* ---------- UPDATE ---------- */

  async openEmployeeForEdit(empID: string) {
    const row = await this.getEmployeeRowById(empID);
    await row.locator('i.bi-pencil-fill').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async updateFirstName(newFirstName: string) {
    await expect(this.firstNameInput).toBeVisible();
    await this.firstNameInput.fill('');
    await this.firstNameInput.fill(newFirstName);
    await this.saveButton.click();
    await expect(this.successToast).toBeVisible();
  }

  /* ---------- DELETE ---------- */

  async deleteEmployeeById(empID: string) {
    const row = await this.getEmployeeRowById(empID);

    await row.locator('i.bi-trash').click();
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();

    await expect(this.successToast).toHaveText(/Successfully Deleted/i);
  }
}
