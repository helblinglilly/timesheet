import { FlatCompat } from "@eslint/eslintrc";
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
		ignores: ['.next']
	},
  ...compat.extends("next/core-web-vitals"),
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@stylistic': stylistic },
		extends: [
			...tseslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked
		],
		...stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: true,
    }),
    rules: {
      "@stylistic/indent": ["error", 2],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error", {
          argsIgnorePattern: "^_",
          varsIgnorePattern: '^_'
        }
      ],
      "@typescript-eslint/require-await": "off",
      "no-console": "warn",
      "no-restricted-syntax": [
        "warn",
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "Do not use process.env directly. Use ~/env instead"
        }
      ],
      '@/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: false,
          avoidEscape: true,
        },
      ],
    },
  },
  {
		linterOptions: {
			reportUnusedDisableDirectives: true
		},
		languageOptions: {
			parserOptions: {
				projectService: true
			}
		}
	},
)
