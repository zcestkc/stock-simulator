import { api, isUnauthorized } from '../api-client';
import { UserResponse } from './model/user';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

// null = not logged in. Pages are public, so that's a normal state, not an error.
export const getUser = async (): Promise<UserResponse | null> => {
  try {
    return await api.get<UserResponse>('/auth/me');
  } catch (error) {
    if (isUnauthorized(error)) return null;
    throw error;
  }
};

const userQueryKey = ['user'];

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });
};

export const useUser = () => useQuery(getUserQueryOptions());

export const useLogin = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginWithUsernameAndPassword,
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data);
      onSuccess?.();
    },
  });
};

export const useRegister = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerWithUsernameAndPassword,
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data);
      onSuccess?.();
    },
  });
};

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(userQueryKey, null);
      queryClient.removeQueries({ queryKey: ['portfolio'] });
      onSuccess?.();
    },
  });
};

const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

export const loginInputSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithUsernameAndPassword = (
  data: LoginInput,
): Promise<UserResponse> => {
  return api.post('/auth/login', data);
};

// Mirrors RegisterRequestDTO in the API; keep the limits in sync.
export const registerInputSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'At least 3 characters')
      .max(32, 'At most 32 characters')
      .regex(/^[A-Za-z0-9_.-]+$/, "Only letters, numbers, '.', '_' and '-'"),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .max(128, 'At most 128 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerInputSchema>;

// Registering also logs the user in (the API sets the auth cookies).
const registerWithUsernameAndPassword = ({
  username,
  password,
}: RegisterInput): Promise<UserResponse> => {
  return api.post('/auth/register', { username, password });
};
