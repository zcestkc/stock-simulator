import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // React Compiler (stable in Next 16): auto-memoises components and hooks at build time,
  // so manual useMemo/useCallback/memo aren't needed.
  reactCompiler: true,
};

export default nextConfig;
