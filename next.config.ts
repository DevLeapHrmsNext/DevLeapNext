// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// // for map route tracker

// export default nextConfig;
// /** @type {import('next').NextConfig} */
// module.exports = {

//   reactStrictMode: true,
//   env: {
//     MAPBOX_ACCESS_TOKEN:
//       "[MAPBOX_TOKEN]",
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/uploads/:path*",
//         destination: "/uploads/:path*",
//       },
//     ];
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAPBOX_ACCESS_TOKEN: "[MAPBOX_TOKEN]",
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
