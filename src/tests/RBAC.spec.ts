import { test, expect } from '@playwright/test';
import { test as adminTest } from '../fixtures/auth.fixture';
import { LoginPage } from '../pages/login';

// -------- ADMIN ROLE --------
adminTest('Admin user should see Admin menu', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForURL(/dashboard|viewDashboard/i);
    const adminMenu = authenticatedPage.getByRole('link', { name: 'Admin' });
    await expect(adminMenu).toBeVisible();
});

// -------- ESS ROLE --------
test('ESS user should NOT see Admin menu', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('ESSuserPR', 'ESSuserPR1');

  // Assert Admin menu is NOT visible
  const adminMenu = page.getByRole('link', { name: 'Admin' });

  await expect(adminMenu).toHaveCount(0);
});
