'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import { paths } from '@/config/paths';
import { loginInputSchema, useLogin } from '@/lib/auth';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({
    onSuccess,
  });

  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');

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
              error={formState.errors['username']}
              registration={register('username')}
            />
            <Input
              type="password"
              label="Password"
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
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <NextLink
            href={paths.auth.register.getHref(redirectTo)}
            className="font-medium text-link hover:text-link/80"
          >
            Register
          </NextLink>
        </div>
      </div>
    </div>
  );
};
