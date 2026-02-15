import { test, expect } from '@playwright/test';

test.describe('Modals', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 5000 });
    });

    test('04-01: Detail Modal', async ({ page }) => {
        // Click first order detail
        await page.locator('.action-group button[title="詳細"]').first().click();

        // Modal should appear
        const modal = page.locator('.modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('.modal-title')).toHaveText('受注詳細');

        // Close
        await modal.locator('.modal-close').click();
        await expect(modal).toBeHidden();
    });

    test('04-03: New Order Modal', async ({ page }) => {
        // Open modal
        await page.getByRole('button', { name: '新規受注' }).click();

        const modal = page.locator('.modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('.modal-title')).toHaveText('新規受注登録');

        // Check basic inputs
        await expect(modal.locator('text=取引先')).toBeVisible();
        await expect(modal.locator('text=商品')).toBeVisible();

        // Cancel
        await modal.getByRole('button', { name: '閉じる' }).click();
        await expect(modal).toBeHidden();
    });
});
