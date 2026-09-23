// Mirrors UserInfoDTO (GET /auth/me, POST /auth/login, POST /auth/register).
export type UserResponse = {
  username: string;
  role: string;
};
