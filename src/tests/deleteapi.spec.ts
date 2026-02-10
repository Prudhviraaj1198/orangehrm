import { test, expect } from '../fixtures/auth.fixture';
import { request as apiRequest } from '@playwright/test';
import { env } from '../../src/config/env';
import * as fs from 'fs';
import * as path from 'path';

const dataFilePath = path.resolve(__dirname, '../../test-data/empData.json');

const getempID = (): string => {
  if (!fs.existsSync(dataFilePath)) {
    throw new Error('Employee ID not found. Ensure create test ran first.');
  }
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  return data.empID;
};


test.skip('API | Delete employee using created employee ID', async ({ authenticatedPage }) => {
    const empID = Number(getempID()); // must be number
    const apiBaseUrl = `${env.baseUrl}/web/index.php/api/v2`;
  
    console.log(`Deleting employee via API: ${empID}`);
  
    // Reuse authenticated session cookies
    const storageState = await authenticatedPage.context().storageState();
  
    const api = await apiRequest.newContext({
      baseURL: apiBaseUrl,
      storageState,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  
    const response = await api.delete('/pim/employees', {
      data: { ids: [empID] },
    });
  
    const status = response.status();
    const body = await response.json();
  
    expect([200, 404]).toContain(status); // idempotent delete
    if (status === 200) {
      expect(body.data).toContain(String(empID));
    }
  
    console.log('Employee delete API validated successfully');
    await api.dispose();
  });
  
  
  
  