/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phase 2A.0a: this is now a server application (Next.js on Vercel), not a
  // static export. It has API routes backed by Supabase (with an in-memory
  // fallback when Supabase env vars are absent). Do NOT re-add output:"export".
  reactStrictMode: true,

  // Fonts are loaded via a <link> at runtime, so Next shouldn't fetch/inline
  // Google Fonts during the build (keeps builds offline/hermetic).
  optimizeFonts: false,

  // Phase 2C export engine: pdfkit reads its built-in .afm font-metric files
  // from disk at runtime, and pptxgenjs ships its own assets — bundling them
  // via webpack breaks those reads. Keep them external so they load from
  // node_modules (and ship intact in the Vercel serverless function).
  experimental: {
    serverComponentsExternalPackages: ["pdfkit", "pptxgenjs"],
  },
};

export default nextConfig;
