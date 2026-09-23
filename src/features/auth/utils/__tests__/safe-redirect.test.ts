import { getSafeRedirect } from '../safe-redirect';

describe('getSafeRedirect', () => {
  it.each(['/home', '/stocks/AAPL?invest=1', '/profile#section'])(
    'allows same-site path %s',
    (path) => {
      expect(getSafeRedirect(path)).toBe(path);
    },
  );

  it.each([
    'https://evil.example',
    'http://evil.example/login',
    '//evil.example',
    '/\\evil.example',
    'javascript:alert(1)',
    'evil.example',
    '',
    null,
    undefined,
  ])('rejects %s', (value) => {
    expect(getSafeRedirect(value)).toBeNull();
  });
});
