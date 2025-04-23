// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack(config) {
    // SVG 파일을 React 컴포넌트로 임포트할 수 있도록 설정
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })

    return config
  },
}

export default nextConfig
