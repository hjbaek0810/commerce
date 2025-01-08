/** @type {import('next').NextConfig} */

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  experimental: {
    optimizeCss: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  compiler: {
    removeConsole: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_VERCEL_URL || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, X-CSRF-Token, X-Requested-With',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: process.env.APP_URL_NAME,
          },
        ],
        destination: `${process.env.NEXT_PUBLIC_VERCEL_URL}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `http://${process.env.APP_URL_NAME}`,
          },
        ],
        destination: `${process.env.NEXT_PUBLIC_VERCEL_URL}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `www.${process.env.APP_URL_NAME}`,
          },
        ],
        destination: `${process.env.NEXT_PUBLIC_VERCEL_URL}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `http://www.${process.env.APP_URL_NAME}`,
          },
        ],
        destination: `${process.env.NEXT_PUBLIC_VERCEL_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default withVanillaExtract(nextConfig);
