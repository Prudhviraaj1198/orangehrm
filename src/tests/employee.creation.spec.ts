import { test, expect } from '../fixtures/auth.fixture';
import { EmployeePage } from '../pages/employee';
import { generateEmployee } from '../utils/testdata';
import * as fs from 'fs';
import * as path from 'path';

const dataFilePath = path.resolve(__dirname, '../../test-data/empData.json');

const saveempID = (empID: string) => {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify({ empID }, null, 2));
  console.log(`Saved Emp name: ${empID}`);
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

  // Step 1: Navigate and create employee with firstName + lastName only
  await employeePage.navigateToAddEmployee();
  await employeePage.createEmployee(employee.firstName, employee.lastName);
  
  // Step 2: Read the auto-generated Employee ID from the pre-filled form field
  // (The save button redirects to the employee details page with the ID field pre-filled)
  const generatedEmpID = await employeePage.getPrefilledEmployeeIdFromForm();
  console.log(`✅ Employee Created with ID: ${generatedEmpID}`);
  
  // Step 3: Persist the Employee ID for reuse in the next test
  saveempID(generatedEmpID);

  // Post-condition: Verify we're on the PIM page
  await expect(authenticatedPage).toHaveURL(/pim/i);
});

test('@regression Update employee', async ({ authenticatedPage }) => {
  const pimPage = new EmployeePage(authenticatedPage);

  const empID = getempID();
  console.log(`🔍 Opening employee with ID: ${empID}`);
  
  const updatedFirstName = `Updated${Date.now()}`;
  
  await pimPage.openEmployeeFromList(empID);
  
  await pimPage.updateFirstName(updatedFirstName);
  console.log(`✅ Updated first name to: ${updatedFirstName}`);

  await expect(authenticatedPage).toHaveURL(/pim\/viewPersonalDetails/i);
});
