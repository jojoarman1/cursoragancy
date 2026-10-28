import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The server gets a self-contained build (server.js + traced node_modules): it only needs Node,
  // no bun install there
  output: 'standalone',
  poweredByHeader: false,
  reactCompiler: true,
  images: {
    unoptimized: true
  },
  experimental: {
    // Barrel-file packages: only the modules actually imported get bundled
    optimizePackageImports: ['@siberiacancode/reactuse']
  }
}

export default nextConfig
