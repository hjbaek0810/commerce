/** @type {import('next').NextConfig} */

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const withVanillaExtract = createVanillaExtractPlugin({});

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        experimentalUseImportModule: true,
        filename: 'static/css/[contenthash].css',
        chunkFilename: 'static/css/[contenthash].css',
      }),
    );

    config.module.rules.push({
      test: /\.vanilla\.css$/i,
      use: isServer
        ? [MiniCssExtractPlugin.loader, 'css-loader']
        : ['style-loader', 'css-loader'],
    });

    return config;
  },
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
    removeConsole: process.env.NODE_ENV === 'production',
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
};

export default withVanillaExtract(nextConfig);
