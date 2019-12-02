module.exports = {
  testURL: 'http://localhost:8000',
  preset: 'jest-puppeteer',
  testEnvironment: 'jsdom',
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: false,
  },
};
