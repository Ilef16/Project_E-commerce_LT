const API_URL = process.env.API_URL ?? "http://localhost:5175";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le navigateur parle uniquement à Next.js (/backend/...), qui relaie vers l'API .NET :
  // pas de CORS à gérer, l'URL de l'API reste privée, et les routes /api/admin ne sont PAS exposées.
  async rewrites() {
    return [
      { source: "/backend/reviews", destination: `${API_URL}/api/reviews` },
      { source: "/backend/requests", destination: `${API_URL}/api/requests` },
    ];
  },
};

export default nextConfig;
