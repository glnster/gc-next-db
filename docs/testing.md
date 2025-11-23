# Testing Guide

## Overview

GC Next DB uses Playwright for end-to-end (E2E) testing. Playwright provides cross-browser testing capabilities and excellent developer experience.

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

This will:
- Start the development server
- Run all E2E tests
- Generate HTML reports

### Run Tests in UI Mode

For interactive test debugging:

```bash
npm run test:e2e:ui
```

This opens Playwright's UI mode where you can:
- See tests running in real-time
- Debug individual tests
- View test traces

### Run Tests in Headed Mode

To see the browser while tests run:

```bash
npm run test:e2e:headed
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/home.spec.ts
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

Tests are configured in `playwright.config.ts`:

- **Test Directory**: `./tests/e2e`
- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on first retry

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test code here
  });
});
```

### Common Patterns

**Navigate to a page:**
```typescript
await page.goto('/');
```

**Check element visibility:**
```typescript
await expect(page.getByRole('heading', { name: 'Title' })).toBeVisible();
```

**Check text content:**
```typescript
await expect(page.getByText('Some text')).toBeVisible();
```

**Interact with elements:**
```typescript
await page.getByRole('button', { name: 'Click me' }).click();
await page.getByLabel('Email').fill('test@example.com');
```

**Test responsive design:**
```typescript
await page.setViewportSize({ width: 375, height: 667 }); // Mobile
await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
```

## Test Examples

### Home Page Test

See `tests/e2e/home.spec.ts` for a complete example covering:
- Page loading
- Content visibility
- Responsive design
- Page title

## Running Tests in Docker

Tests can be run in the development container:

```bash
./dock shell
npm run test:e2e
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Use semantic selectors**: Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
2. **Test user flows**: Focus on what users do, not implementation details
3. **Keep tests independent**: Each test should be able to run in isolation
4. **Use test fixtures**: Share setup code between tests
5. **Test accessibility**: Use role-based selectors which also test accessibility
6. **Test responsive design**: Verify layouts work on different screen sizes
7. **Use meaningful test names**: Describe what the test verifies

## Debugging Tests

### Debug Mode

Run tests in debug mode:

```bash
npx playwright test --debug
```

### View Test Traces

After a test run, view traces:

```bash
npx playwright show-trace trace.zip
```

### Screenshots and Videos

- Screenshots are saved on failure in `test-results/`
- Videos are saved on failure in `test-results/`
- HTML reports are generated in `playwright-report/`

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report showing:
- Test results
- Screenshots
- Videos
- Traces
- Test timeline

