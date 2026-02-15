import { test, expect } from '@playwright/test';

test.describe('Table Operations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 5000 });
    });

    test('03-01: Sort by Order No', async ({ page }) => {
        const tableHeaders = page.locator('table.data-table thead th.sortable');
        const orderNoHeader = tableHeaders.first(); // Order No

        // Click to sort ASC
        await orderNoHeader.click();
        // Verify first row order no starts with small number (or logic depending on data)
        // Here we just check if sort icon indicator changes or data reorders if possible.
        // Since data is random, strict value checking is hard without seed. 
        // We can check if attribute or class changes if implemented, or just check that click works without error.

        // As per implementation, we might not have visual indicator class on current implementation.
        // But we sort data. Let's check if first row changes after double click (DESC).
        const row1_text_asc = await page.locator('table.data-table tbody tr').first().innerText();

        await orderNoHeader.click(); // Sort DESC
        const row1_text_desc = await page.locator('table.data-table tbody tr').first().innerText();

        expect(row1_text_asc).not.toEqual(row1_text_desc);
    });

    test('03-03: Pagination', async ({ page }) => {
        const nextBtn = page.getByRole('button', { name: '次へ' });
        const prevBtn = page.getByRole('button', { name: '前へ' });

        // Go to page 2
        await nextBtn.click();
        await expect(page.locator('.page-num.active')).toHaveText('2');
        await expect(prevBtn).toBeEnabled();

        // Go back to page 1
        await prevBtn.click();
        await expect(page.locator('.page-num.active')).toHaveText('1');
        await expect(prevBtn).toBeDisabled();
    });

    test('03-04: Change Page Size', async ({ page }) => {
        // Select 10 items
        await page.selectOption('select.table-select', '10');

        // Check rows count
        await expect(page.locator('table.data-table tbody tr')).toHaveCount(10);
    });
});
