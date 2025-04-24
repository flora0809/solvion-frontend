// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] }, // JS/TS 파일에서 import할 때만 적용
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false }, // viewBox는 유지
                { name: "removeDimensions", active: true }, // width/height 속성 제거
              ],
            },
          },
        },
      ],
    })
    return config
  },
}

export default nextConfig
