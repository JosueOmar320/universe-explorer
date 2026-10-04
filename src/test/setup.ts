import '@testing-library/jest-dom/vitest';
import { onlineManager } from '@tanstack/react-query';
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
  onlineManager.setOnline(true);
});

afterAll(() => server.close());

// jsdom doesn't implement layout/scrolling APIs.
Element.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};

// …nor modal dialogs: enough of <dialog> for components that open and close one.
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  if (!this.open) return;
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};
