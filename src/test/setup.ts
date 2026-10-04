import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { i18n } from '@/i18n/i18n';
import { server } from './server';

// Fail loudly if a test hits an endpoint without a mock.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Tests assert on English copy unless they switch language explicitly.
beforeEach(async () => {
  await i18n.changeLanguage('en');
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
});

afterAll(() => server.close());

// jsdom doesn't implement layout/scrolling APIs.
Element.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};
