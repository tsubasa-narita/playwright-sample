import { test, expect } from '@playwright/test';

test.describe('Initial Load & Display', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Loading overlay
        await expect(page.locator('.loading-overlay')).toBeVisible();
        await expect(page.locator('.loading-text')).toHaveText('データを読み込み中...');

        // Wait for data load
        await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 5000 });
    });

    test('01-02: Initial Data Display', async ({ page }) => {
        // Toast notification
        await expect(page.locator('.toast.success')).toContainText('受注データを読み込みました');

        // Title
        await expect(page.locator('.page-title')).toHaveText('受注一覧');

        // Table rows (default 25)
        const rows = page.locator('table.data-table tbody tr');
        await expect(rows).toHaveCount(25);
    });

    test('01-03: Summary Cards', async ({ page }) => {
        const cards = page.locator('.summary-card');
        await expect(cards).toHaveCount(4);

        // Check if values are populated (not empty)
        await expect(cards.nth(0).locator('.summary-value')).not.toBeEmpty();
        await expect(cards.nth(1).locator('.summary-value')).toContainText('¥');
    });

    test('01-04: Pagination State', async ({ page }) => {
        const prevBtn = page.getByRole('button', { name: '前へ' });
        const nextBtn = page.getByRole('button', { name: '次へ' });
        const page1 = page.locator('.page-num.active');

        await expect(prevBtn).toBeDisabled();
        await expect(nextBtn).toBeEnabled();
        await expect(page1).toHaveText('1');
    });
});
