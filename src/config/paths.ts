export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    root: {
      getHref: () => '/home',
    },
    home: {
      getHref: () => '/home',
    },
    stocks: {
      getHref: () => '/stocks',
    },
    cryptos: {
      getHref: () => '/cryptos',
    },
    users: {
      getHref: () => '/users',
    },
    profile: {
      getHref: () => '/profile',
    },
  },
  public: {},
} as const;
