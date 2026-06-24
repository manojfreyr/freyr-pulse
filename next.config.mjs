/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phase 2A.0a: this is now a server application (Next.js on Vercel), not a
  // static export. It has API routes backed by Supabase (with an in-memory
  // fallback when Supabase env vars are absent). Do NOT re-add output:"export".
  reactStrictMode: true,

  // Fonts are loaded via a <link> at runtime, so Next shouldn't fetch/inline
  // Google Fonts during the build (keeps builds offline/hermetic).
  optimizeFonts: false,
};

export default nextConfig;
