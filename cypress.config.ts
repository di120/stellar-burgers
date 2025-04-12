import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.CI
      ? 'https://norma.nomoreparties.space/api'
      : 'http://localhost:4000'
  }
});
