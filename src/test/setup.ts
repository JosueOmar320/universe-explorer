import '@testing-library/jest-dom/vitest';
import { onlineManager } from '@tanstack/react-query';
import { cleanup, configure } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { i18n } from '@/i18n/i18n';
import { server } from './server';

// `findBy*`/`waitFor` give up after 1 s by default. A debounced search (400 ms) plus a mocked
// request and a render fits easily on its own, but not on a loaded CI runner with coverage
// instrumentation, where those tests took 1.6-1.8 s and failed at random. Waits still end as
// soon as the element shows up, so passing tests don't get slower.
configure({ asyncUtilTimeout: 3000 });

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
