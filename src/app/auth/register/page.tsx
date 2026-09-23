'use client';

import { RegisterForm } from '@/features/auth/components/register-form';
import { useRedirectIfLoggedIn } from '@/features/auth/hooks/use-redirect-if-logged-in';
import { AuthCard } from '../_components/auth-card';

const RegisterPage = () => {
  useRedirectIfLoggedIn();

  return (
    <AuthCard title="Create your account">
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
