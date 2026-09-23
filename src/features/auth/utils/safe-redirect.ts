/**
 * Validates a `?redirectTo=` value before navigating to it.
 *
 * Only same-site paths are allowed ("/stocks/AAPL?invest=1"). Anything else, such as
 * "https://evil.example" or protocol-relative "//evil.example", is rejected. Otherwise
 * a crafted login link could send users to another site after logging in (an open redirect).
 */
export const getSafeRedirect = (
  value: string | null | undefined,
): string | null => {
  if (!value) return null;
  // Must be a path on this site: starts with "/" but not "//" or "/\" (browsers treat both as a host).
  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/\\')
  )
    return null;
  return value;
};
