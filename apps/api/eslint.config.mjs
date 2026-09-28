import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default defineConfig([
  // typescript-eslint recommended rules with type-aware linting.
  ...tseslint.configs.recommended,

  // Project-specific settings.
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Disallow console — use the logger instead.
      "no-console": "warn",

      // TypeScript-specific rules.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Allow void returns in Express middleware callbacks.
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },

  // Disable ESLint formatting rules that conflict with Prettier.
  prettier,

  // Ignore patterns.
  {
    ignores: ["dist/**", "node_modules/**"],
  },
]);
