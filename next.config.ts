import type { NextConfig } from "next";
import withTM from 'next-transpile-modules';

const nextConfig: NextConfig = withTM(['@simplewebauthn/browser'])({
  reactStrictMode: true,
});

export default nextConfig;
// const nextConfig: NextConfig = {
//    eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
//   /* config options here */
// };

// export default nextConfig;
