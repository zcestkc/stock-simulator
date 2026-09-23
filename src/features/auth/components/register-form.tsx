'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import { paths } from '@/config/paths';
import { registerInputSchema, useRegister } from '@/lib/auth';
import NextLink from 'next/link';
import { useRedirectParam } from '../hooks/use-redirect-if-logged-in';

type RegisterFormProps = {
  // Navigation after registering is handled by useRedirectIfLoggedIn on the page.
  onSuccess?: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registering = useRegister({ onSuccess });
  const redirectTo = useRedirectParam();

  return (
    <div>
      <Form
        onSubmit={(values) => {
          registering.mutate(values);
        }}
        schema={registerInputSchema}
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
              autoComplete="new-password"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <Input
              type="password"
              label="Confirm password"
              autoComplete="new-password"
              error={formState.errors['confirmPassword']}
              registration={register('confirmPassword')}
            />
            <div>
              <Button
                isLoading={registering.isPending}
                type="submit"
                className="w-full"
              >
                Create account
              </Button>
            </div>
          </>
        )}
      </Form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <NextLink
          href={paths.auth.login.getHref(redirectTo)}
          className="font-medium text-link hover:text-link/80"
        >
          Log in
        </NextLink>
      </p>
    </div>
  );
};
