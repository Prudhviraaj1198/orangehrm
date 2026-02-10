import { test, expect } from '../fixtures/auth.fixture';
import { EmployeePage } from '../pages/employee';
import { generateEmployee } from '../utils/testdata';
import * as fs from 'fs';
import * as path from 'path';

const dataFilePath = path.resolve(__dirname, '../../test-data/empData.json');

const saveempID = (empID: string) => {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify({ empID }, null, 2));
};

const getempID = (): string => {
  if (!fs.existsSync(dataFilePath)) {
    throw new Error('Emp data file not found!');
  }
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  return data.empID;
};

test('@regression Create employee', async ({ authenticatedPage }) => {
  const employeePage = new EmployeePage(authenticatedPage);
  const employee = generateEmployee();

  await employeePage.navigateToAddEmployee();
  await employeePage.createEmployee(employee.firstName, employee.lastName);

  const generatedEmpID = await employeePage.getPrefilledEmployeeIdFromForm();
  saveempID(generatedEmpID);

  await expect(authenticatedPage).toHaveURL(/pim/i);
});

test('@regression Update employee', async ({ authenticatedPage }) => {
  const employeePage = new EmployeePage(authenticatedPage);

  const empID = getempID();
  const updatedFirstName = `Updated${Date.now()}`;

  await employeePage.openEmployeeForEdit(empID);
  await employeePage.updateFirstName(updatedFirstName);

  await expect(authenticatedPage).toHaveURL(/pim\/viewPersonalDetails/i);
});

test('@regression Delete employee', async ({ authenticatedPage }) => {
  const employeePage = new EmployeePage(authenticatedPage);

  const empID = getempID();
  await employeePage.deleteEmployeeById(empID);

  const deletedRow = authenticatedPage.locator('.oxd-table-row', {
    has: authenticatedPage.locator('.oxd-table-cell:nth-child(2)', {
      hasText: empID,
    }),
  });
  await expect(deletedRow).toHaveCount(0);
});
