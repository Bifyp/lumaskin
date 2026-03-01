import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Здесь НЕТ turbo, потому что NextConfig его не поддерживает
  experimental: {}
};

export default withNextIntl(nextConfig);
