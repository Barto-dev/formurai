const {test, expect} = require('@playwright/test');

test.describe('Catalog', () => {
  test('Multi-step validation work correctly', async ({page}) => {
    await page.goto('http://localhost:8080/demo/multistep-form/');
    // step 1
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="surname"]', 'Snow');
    await page.click('.js-next');

    // step 2
    await page.selectOption('[name="framework"]', 'react');
    await page.check('#rating-5');
    await page.click('.js-next');

    // back to step 2 and go to step 3 again (check change state method)
    await page.click('.js-prev');
    await page.click('.js-next');

    // step 3
    await page.fill('[name="feedback"]', 'Playwright better than a Puppeteer');
    await page.check('[name="license"]');

    // submit
    await page.click('.submit');
    await expect(page).toHaveURL(/.*feedback/);
  });

  test('Change state event work correctly', async ({page}) => {

    page.on('console', msg => {
      expect(msg.text()).toBe('step_2');
    });

    await page.goto('http://localhost:8080/demo/multistep-form/');
    // step 1
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="surname"]', 'Snow');
    await page.click('.js-next');
  });


});
