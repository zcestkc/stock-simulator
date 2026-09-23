import * as z from 'zod';
import 'dotenv/config';

const createEnv = () => {
  const EnvSchema = z.object({
    ALPHA_VANTAGE_API_KEY: z.string(),
    DEV: z.string(),
  });

  const envVars = {
    ALPHA_VANTAGE_API_KEY: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
    DEV: process.env.NEXT_PUBLIC_DEV,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v?.join(', ')}`)
    .join('\n')}
  `,
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();
