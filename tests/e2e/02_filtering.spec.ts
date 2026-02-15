import { test, expect } from '@playwright/test';

test.describe('Filtering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 5000 });
    });

    test('02-01: Order No Search (Exact)', async ({ page }) => {
        // Pick an order no from the table
        const firstOrderNoText = await page.locator('table.data-table tbody tr').first().locator('td').nth(1).innerText();
        const firstOrderNo = firstOrderNoText.trim();

        await page.fill('input[placeholder="例: ORD-2026-0001"]', firstOrderNo);
        await page.getByRole('button', { name: '検索' }).click();

        // Check toast (use last() because initial load toast might still be there)
        const toast = page.locator('.toast.success').last();
        await expect(toast).toBeVisible();
        await expect(toast).toContainText('件の受注データが見つかりました');

        // Check table
        await expect(page.locator('table.data-table tbody tr')).toHaveCount(1);

        const rowText = await page.locator('table.data-table tbody tr').first().innerText();
        expect(rowText).toContain(firstOrderNo);
    });

    test('02-06: No Results', async ({ page }) => {
        await page.fill('input[placeholder="例: ORD-2026-0001"]', 'INVALID-ORDER-NO');
        await page.getByRole('button', { name: '検索' }).click();

        // Toast check (0 results)
        const toast = page.locator('.toast').last();
        await expect(toast).toBeVisible();

        // Table check
        await expect(page.locator('table.data-table tbody tr')).toHaveCount(1); // The "No data" row
        await expect(page.locator('table.data-table tbody tr td')).toHaveText('該当するデータがありません');
    });

    test('02-07: Filter Clear', async ({ page }) => {
        // Filter first
        await page.selectOption('select.filter-select', { index: 1 }); // Select a customer
        await page.getByRole('button', { name: '検索' }).click();
        await expect(page.locator('table.data-table tbody tr')).not.toHaveCount(25); // Should be filtered

        // Clear
        await page.getByRole('button', { name: 'クリア' }).click();

        const toast = page.locator('.toast').last();
        await expect(toast).toContainText('フィルターをクリアしました');

        // Wait for table to reload initial data
        await expect(page.locator('table.data-table tbody tr')).toHaveCount(25); // Back to default
    });
});
