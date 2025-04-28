import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src")],
    prependData: `@import "css/_variables.scss";`,
  },
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
  output: "export", // 👉 추가
  exportPathMap: async (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) => {
    const paths = { ...defaultPathMap }
    delete paths["/success"] // 👉 success 페이지 빌드에서 제외
    return paths
  },
}

export default nextConfig
