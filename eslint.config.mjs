import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/**", ".next/**", ".vercel/**", "out/**", "build/**", "dist/**", "public/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "react": reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "quotes": ["error", "double", { avoidEscape: true }],
      "semi": ["error", "always"],
      "indent": ["error", 2, { SwitchCase: 1 }],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "brace-style": ["error", "1tbs", { "allowSingleLine": false }],
      "arrow-body-style": ["error", "always"],
      "implicit-arrow-linebreak": ["error", "beside"],
      "react/jsx-closing-bracket-location": ["error", "line-aligned"],
      "react/jsx-indent": ["error", 2],
      "react/jsx-max-props-per-line": ["error", { "maximum": 1, "when": "multiline" }],
      "jsx-quotes": ["error", "prefer-double"],
      // Custom rule for JSX arrow functions in attributes like onClick
      "react/jsx-no-bind": ["error", {
        "allowArrowFunctions": true,
        "allowFunctions": false,
        "allowBind": false,
        "ignoreDOMComponents": false,
      }],
    },
  }
];
