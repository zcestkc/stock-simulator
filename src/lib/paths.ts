export const paths = {
  landing: {
    getHref: () => '/',
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  // Pages in the app/(main) route group (sidebar layout).
  main: {
    home: {
      getHref: () => '/home',
    },
    stocks: {
      getHref: () => '/stocks',
    },
    cryptos: {
      getHref: () => '/cryptos',
    },
    profile: {
      getHref: () => '/profile',
    },
  },
} as const;
