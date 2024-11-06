/** @type {import('next').NextConfig} */

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'picsum.photos'],
  },
};

export default withVanillaExtract(nextConfig);
