'use client';

import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getSafeRedirect } from '../utils/safe-redirect';

/** The validated `?redirectTo=` path, or null if missing/unsafe. */
export const useRedirectParam = () =>
  getSafeRedirect(useSearchParams().get('redirectTo'));

/**
 * For the login/register pages: once the user is logged in (already, or by submitting
 * the form) send them back to where they came from, or home. The only post-login redirect.
 */
export const useRedirectIfLoggedIn = () => {
  const user = useUser();
  const router = useRouter();
  const target = useRedirectParam() ?? paths.app.home.getHref();

  useEffect(() => {
    if (user.data) router.replace(target);
  }, [user.data, router, target]);
};
