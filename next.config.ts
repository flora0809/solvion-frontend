import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // scss 전역 변수 경로
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src")],
    prependData: `@import "css/_variables.scss";`,
  },
  // SVG를 React 컴포넌트로 불러오기
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false },
                { name: "removeDimensions", active: true },
              ],
            },
          },
        },
      ],
    })
    return config
  },
  // 정적 내보내기 모드
  output: "export",
}

export default nextConfig
