const {test, expect} = require('@playwright/test');

test.describe('Catalog', () => {
  test('formValid method work correctly', async ({page}) => {
    await page.goto('http://localhost:8080/demo/ajax-form/');
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="email"]', 'john@gmail.com');
    await page.fill('[name="feedback"]', 'Hello, my friends');
    await page.click('.submit');
    await page.waitForSelector('.send-success');
    const isVisible = await page.isVisible('.send-success');
    expect(isVisible).toBeTruthy();
  });
});

