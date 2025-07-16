import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://127.0.0.1:8000", "http://localhost:8000", "'http://192.168.1.82:3000'"],
};

export default nextConfig;