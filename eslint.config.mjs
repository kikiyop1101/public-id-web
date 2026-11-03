import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 2026-11-04 — public/games 의 외부 라이브러리 압축본(three.min.js)이 린트 오류 25건으로 lint를 실패시켰다.
    "public/**/*.min.js",
  ]),
]);

export default eslintConfig;
