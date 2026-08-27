import { fixupConfigRules } from "@eslint/compat";
import nextTypeScript from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";

const ignores = {
  ignores: [
    "**/.next/**",
    "**/node_modules/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "pnpm-lock.yaml",
    "apps/web/next-env.d.ts",
  ],
};

export default [
  ignores,
  ...fixupConfigRules(nextVitals),
  ...fixupConfigRules(nextTypeScript),
  {
    files: ["tests/**/*.ts", "*.config.ts"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
