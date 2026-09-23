import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reuse visited pages from the client cache for 60s so moving back and forth
    // between views is instant. Server actions call revalidatePath, which clears it.
    staleTimes: {
      dynamic: 60,
    },
  },
};

export default nextConfig;
