/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // proxies /next-api calls to next.js api routes to avoid conflicts with django backend
    return [{ source: '/next-api/:path*', destination: '/api/:path*' }];
  },
  env: {
    REACT_APP_GA_TRACKING_CODE: process.env.REACT_APP_GA_TRACKING_CODE,
  },
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  transpilePackages: [
    '@agorapp-dao/content-common',
    '@agorapp-dao/editor-common',
    '@agorapp-dao/editor-plugin-lisk',
    '@agorapp-dao/editor-plugin-motoko',
    '@agorapp-dao/editor-plugin-solidity',
    '@agorapp-dao/react-common',
  ],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Use the client static directory in the server bundle and prod mode
    // Fixes `Error occurred prerendering page "/"`
    config.output.webassemblyModuleFilename =
      isServer && !dev ? '../static/wasm/[modulehash].wasm' : 'static/wasm/[modulehash].wasm';

    // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    return config;
  },
};

module.exports = nextConfig;
