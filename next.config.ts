import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: 10485760, // 10MB
    },
  },
};

export default withNextIntl(nextConfig);
