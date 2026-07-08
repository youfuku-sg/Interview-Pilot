import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "src-tauri"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // eslint-plugin-react-hooks の `recommended` は React Compiler 向けの
      // 追加ルール（refs/immutability/set-state-in-effect/purity/preserve-caught-error）
      // まで含む。React Compiler を使っていないため、古典的な2ルールのみ有効化する。
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // 既存コードに大量に存在するため、初回導入時点では warn に緩和する。
      // 新規コードでの是正は今後別途対応する（design.md Decision 6 参照）。
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-empty": "warn",
      "preserve-caught-error": "warn",
    },
  }
);
