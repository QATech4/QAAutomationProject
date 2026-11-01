
import { test, expect } from '@playwright/test';

test('Verify first 100 Hacker News articles are sorted newest to oldest', async ({ page }) => {

    // Step 1: Open Hacker News - Newest page
    await page.goto('https://news.ycombinator.com/newest');

    // Store all article timestamps in this array
    const articleTimestamps: number[] = [];

    // Step 2: Continue until we collect 100 articles
    while (articleTimestamps.length < 100) {
 
        // Find all articles on the current page
        const articles = page.locator('tr.athing');

        // Get the total number of articles on this page
        const articleCount = await articles.count();
        console.log(articleCount);

        // Step 3: Loop through each article
        for (let i = 0; i < articleCount; i++) {

            // Stop once we have collected 100 articles
            if (articleTimestamps.length === 100) {
                break;
            }

            // Get the current article
            const article = articles.nth(i);

            // Find the timestamp in the row immediately after the article
            const timestampElement = article
                .locator('xpath=following-sibling::tr[1]')
                .locator('span.age');

            // Get the actual date and time
            const timestampText = await timestampElement.getAttribute('title');

            // Check that timestamp exists
            expect(timestampText).not.toBeNull();

            // Convert timestamp into a number
            const timestamp = Date.parse(timestampText!);

            // Check that timestamp is valid
            expect(Number.isNaN(timestamp)).toBe(false);

            // Store timestamp in the array
            articleTimestamps.push(timestamp);
        }

        // Step 4: Go to the next page if we need more articles
        if (articleTimestamps.length < 100) {

            await page.waitForTimeout(2000);
            const nextPage = page.locator('a.morelink');

            // Check that next page link exists
            await expect(nextPage).toBeVisible();

            // Click next page
            await nextPage.click();
        }
    }

    // Step 5: Verify that we collected exactly 100 articles
    expect(articleTimestamps.length).toBe(100);

    // Step 6: Validate newest to oldest order
    for (let i = 0; i < articleTimestamps.length - 1; i++) {

        const currentArticle = articleTimestamps[i];
        const nextArticle = articleTimestamps[i + 1];

        // Next article should not be newer than the current article
        expect(
            nextArticle,
            `Article at position ${i + 2} is newer than article at position ${i + 1}`
        ).toBeLessThanOrEqual(currentArticle);
    }

    console.log('Successfully verified that the first 100 articles are sorted newest to oldest.');

});
