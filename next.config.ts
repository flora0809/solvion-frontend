// next.config.ts
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
}

export default nextConfig
