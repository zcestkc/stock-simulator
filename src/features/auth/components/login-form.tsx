'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import { paths } from '@/lib/paths';
import { loginInputSchema, useLogin } from '@/lib/auth';
import NextLink from 'next/link';
import { useRedirectParam } from '../hooks/use-redirect-if-logged-in';

type LoginFormProps = {
  // Navigation after login is handled by useRedirectIfLoggedIn on the page.
  onSuccess?: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess });
  const redirectTo = useRedirectParam();

  return (
    <div>
      <Form
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={loginInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              type="text"
              label="Username"
              autoComplete="username"
              error={formState.errors['username']}
              registration={register('username')}
            />
            <Input
              type="password"
              label="Password"
              autoComplete="current-password"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <div>
              <Button
                isLoading={login.isPending}
                type="submit"
                className="w-full"
              >
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <NextLink
          href={paths.auth.register.getHref(redirectTo)}
          className="font-medium text-link hover:text-link/80"
        >
          Register
        </NextLink>
      </p>
    </div>
  );
};
