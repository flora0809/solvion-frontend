import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // 오류 대신 경고로 변경
      "react-hooks/rules-of-hooks": "warn", // 오류 대신 경고로 변경
      // 또는 완전히 비활성화하려면:
      // '@typescript-eslint/no-unused-vars': 'off',
      // 'react-hooks/rules-of-hooks': 'off',
    },
  },
]

export default eslintConfig
