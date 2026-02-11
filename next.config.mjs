/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    // dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
        port: "",
        pathname: "/**",
      },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      {
        protocol: "https",
        hostname: "owpfvbwbpxedmxvrbagm.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};
export default nextConfig;
