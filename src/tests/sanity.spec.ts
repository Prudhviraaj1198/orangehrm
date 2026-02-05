import { test, expect } from '../fixtures/auth.fixture';

test.skip('Admin user should land on dashboard after login', async ({ authenticatedPage }) => {
  await expect(authenticatedPage).toHaveURL(/dashboard/i);
});
