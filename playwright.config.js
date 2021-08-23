const {devices} = require('@playwright/test');

const config = {
/*  use: {
    headless: false,
    launchOptions: {
      slowMo: 100
    }
  },*/
  projects: [
    {
      name: 'Desktop Chromium',
      use: {
        browserName: 'chromium',
        viewport: {width: 1366, height: 768},
        channel: 'chrome',
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        browserName: 'webkit',
        viewport: {width: 1366, height: 768},
      }
    },
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
        viewport: {width: 1366, height: 768},
      }
    },
  ],
};

module.exports = config;
