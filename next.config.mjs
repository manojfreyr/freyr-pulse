/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the app can be hosted anywhere (GitHub Pages, Vercel, S3,
  // or any static file host) with no backend. Phase 1 has no server logic.
  output: "export",

  // Required for static export — Next's image optimizer needs a server.
  images: { unoptimized: true },

  // Cleaner URLs as static files (/company/pfizer/index.html).
  trailingSlash: true,

  // If you deploy to a GitHub *project* page (https://user.github.io/repo),
  // uncomment and set this to "/repo". For Vercel / user pages / local, leave it off.
  // basePath: "/freyr-sales-intelligence",

  reactStrictMode: true,

  // Fonts are loaded via a <link> in the browser at runtime, so we don't want
  // Next to fetch/inline Google Fonts during the build. This keeps `npm run
  // build` fully offline and hermetic.
  optimizeFonts: false,
};

export default nextConfig;
