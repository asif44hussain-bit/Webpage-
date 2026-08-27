/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local SVG placeholder art is served from /public — no remote domains required.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
