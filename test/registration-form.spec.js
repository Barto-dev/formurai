const {test, expect} = require('@playwright/test');

test.describe('Catalog', () => {
  test('Successfully form submit', async ({page}) => {
    await page.goto('http://localhost:8080/demo/registration-form/');
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="surname"]', 'Snow');
    await page.fill('[name="email"]', 'john@gmail.com');
    await page.fill('[name="phone"]', '12345678910');
    await page.fill('[name="password"]', '123123');
    await page.fill('[name="password2"]', '123123');
    await page.click('.submit');
    await expect(page).toHaveURL(/.*password2/);
  });

  test('Error form not submit', async ({page}) => {
    await page.goto('http://localhost:8080/demo/registration-form/');
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="surname"]', 'Snow');
    await page.click('.submit');

    // check correct error class
    const errorInput = page.locator('[name="email"]');
    expect(await errorInput.evaluate(node => node.closest('.formurai-error'))).toBeTruthy()

    // check correct error required message
    const requiredError = await page.innerText('.formurai-error .formurai-message');
    expect(requiredError).toBe('Email required');

    // check correct error email valid message
    await page.fill('[name="email"]', '23');
    await page.click('.submit');
    const emailError = await page.innerText('.formurai-error .formurai-message');
    expect(emailError).toBe('Email must be valid');

  });

  test('Add success class', async ({page}) => {
    await page.goto('http://localhost:8080/demo/registration-form/');
    await page.fill('[name="name"]', 'John');
    await page.fill('[name="surname"]', 'Snow');
    await page.click('.submit');
    const successInput = page.locator('[name="name"]');
    expect(await successInput.evaluate(node => node.closest('.formurai-success'))).toBeTruthy()
  });

});
