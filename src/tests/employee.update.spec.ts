import { test, expect } from '../fixtures/auth.fixture';
import { EmployeePage } from '../pages/employee';

test.skip('@regression Update employee first name from list', async ({ authenticatedPage }) => {
  const pimPage = new EmployeePage(authenticatedPage);

  const employeeFullName = 'Test Auto User'; // from create test
  const updatedFirstName = `Updated${Date.now()}`;

  await pimPage.openEmployeeFromList(employeeFullName);
  await pimPage.updateFirstName(updatedFirstName);

  // Post-condition validation
  await expect(authenticatedPage).toHaveURL(/pim\/viewPersonalDetails/i);
});
