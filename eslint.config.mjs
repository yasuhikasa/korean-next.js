import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect", // React のバージョンを自動検出
      },
    },
  },
  pluginReact.configs.flat.recommended, // 推奨設定を先に適用
  {
    rules: {
      "react/prop-types": "off", // PropTypes の警告を無効化
      "react/react-in-jsx-scope": "off", // React 17+ では不要
    },
  },
];
