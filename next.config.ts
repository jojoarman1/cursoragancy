import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The server gets a self-contained build (server.js + traced node_modules): it only needs Node,
  // no bun install there
  output: 'standalone',
  reactCompiler: true,
  images: {
    // AVIF keeps photo detail at a smaller size; WebP is the fallback
    formats: ['image/avif', 'image/webp'],
    // Next 16 only allows 75 unless listed; project covers use the high one
    qualities: [75, 90]
  },
  experimental: {
    // Barrel-file packages: only the modules actually imported get bundled
    optimizePackageImports: ['@siberiacancode/reactuse']
  }
}

export default nextConfig
