import type { NextConfig } from "next";
import { allowedImageHosts } from "./src/lib/image-hosts";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: allowedImageHosts().map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
