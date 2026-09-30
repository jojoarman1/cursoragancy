import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Barrel-file packages: only the modules actually imported get bundled
    optimizePackageImports: ['@siberiacancode/reactuse', '@react-three/drei']
  }
}

export default nextConfig
