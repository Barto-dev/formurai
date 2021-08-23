const {test, expect} = require('@playwright/test');

test.describe('Catalog', () => {
  test('Successfully form submit', async ({page}) => {
    await page.goto('http://localhost:8080/demo/registration-form/');
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="surname"]', 'Snow');
    await page.fill('[name="email"]', 'john@gmail.com');
    await page.fill('[name="phone"]', '99999999');
    await page.fill('[name="password"]', '123123');
    await page.fill('[name="password2"]', '123123');
    await page.click('.submit');
    await expect(page).toHaveURL(/.*password2/);
  });

  test('Error form submit', async ({page}) => {
    await page.goto('http://localhost:8080/demo/registration-form/');
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="surname"]', 'Snow');
    await page.click('.submit');
    await expect(page).toHaveURL(/.*password2/);
  });

});
