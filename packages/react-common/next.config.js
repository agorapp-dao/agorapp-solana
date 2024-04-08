/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_GA_TRACKING_CODE: process.env.REACT_APP_GA_TRACKING_CODE,
  },
};

module.exports = nextConfig;
