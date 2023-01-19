/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/burn",
        destination: "/burn/xen",
        permanent: false,
      },
      {
        source: "/portfolio",
        destination: "/portfolio/active",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
