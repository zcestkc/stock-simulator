import { AuthResponse, User } from '@/types/api';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';
import { api, isUnauthorized } from './api-client';

// null = not logged in. Pages are public, so that's a normal state, not an error.
export const getUser = async (): Promise<User | null> => {
  try {
    return await api.get<User>('/auth/me');
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
  password: z.string().min(3, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithUsernameAndPassword = (
  data: LoginInput,
): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const registerInputSchema = z.object({
  register: z.string().min(1, 'Required'),
  password: z.string().min(5, 'Required'),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithUsernameAndPassword = (
  data: RegisterInput,
): Promise<AuthResponse> => {
  return api.post('/auth/register', data);
};
