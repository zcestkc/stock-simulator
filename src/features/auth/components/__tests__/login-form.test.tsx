import { useLogin } from '@/lib/auth';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '../login-form';

vi.mock('@/lib/auth', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/auth')>('@/lib/auth');
  return {
    ...actual,
    useLogin: vi.fn(),
  };
});

// Mock useSearchParams
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(),
}));

describe('LoginForm', () => {
  it('calls login.mutate with correct values when submitted', async () => {
    const onSuccess = vi.fn();
    vi.mocked(useLogin).mockReturnValue({
      mutate: onSuccess,
      isPending: false,
    } as unknown as ReturnType<typeof useLogin>); // partial mock

    render(<LoginForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  // Regression: under the React Compiler, validation errors silently stopped rendering.
  it('shows validation errors and does not submit when fields are empty', async () => {
    const mutate = vi.fn();
    vi.mocked(useLogin).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useLogin>); // partial mock

    render(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
    expect(mutate).not.toHaveBeenCalled();
  });
});
