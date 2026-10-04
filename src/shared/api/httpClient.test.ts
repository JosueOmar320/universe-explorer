import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { getApiErrorKind } from './errors';
import { buildUrl, createApiClient, HttpError } from './httpClient';

const BASE_URL = 'https://api.example.test/v1';

describe('buildUrl', () => {
  it('joins base URL and path and skips empty params', () => {
    const url = buildUrl(BASE_URL, '/items', {
      page: 2,
      name: 'rick',
      status: undefined,
      type: '',
    });
    expect(url.toString()).toBe(`${BASE_URL}/items?page=2&name=rick`);
  });
});

describe('createApiClient', () => {
  const client = createApiClient({ baseUrl: BASE_URL, timeoutMs: 50 });

  it('returns the parsed JSON body', async () => {
    server.use(http.get(`${BASE_URL}/items`, () => HttpResponse.json({ ok: true })));
    await expect(client.get('items')).resolves.toEqual({ ok: true });
  });

  it('throws an HttpError carrying the status for non-2xx responses', async () => {
    server.use(http.get(`${BASE_URL}/items`, () => new HttpResponse(null, { status: 503 })));

    const error = await client.get('items').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 503 });
  });

  it('aborts requests that exceed the configured timeout', async () => {
    server.use(
      http.get(`${BASE_URL}/slow`, async () => {
        await delay(500);
        return HttpResponse.json({});
      }),
    );

    const error = await client.get('slow').catch((caught: unknown) => caught);

    expect(getApiErrorKind(error)).toBe('timeout');
  });

  it('still honours the caller cancellation signal', async () => {
    server.use(
      http.get(`${BASE_URL}/slow`, async () => {
        await delay(500);
        return HttpResponse.json({});
      }),
    );
    const controller = new AbortController();

    const request = client.get('slow', { signal: controller.signal });
    controller.abort();

    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });
});
