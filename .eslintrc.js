module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    globals: {
        __BUILD_TIME__: false,
        __APP_DATA__: false,
        defineProps: false,
        defineEmits: false,
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/vue3-recommended",
        // "@vue/eslint-config-prettier",
        "plugin:prettier-vue/recommended",
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "indent": "off",
        "linebreak-style": 0,
        "vue/no-undef-components": ["error"],
        "vue/no-undef-properties": ["error"],
        "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    overrides: [
        {
            files: ["./**/*.{js,ts,jsx,tsx,vue}"],
            excludedFiles: ["./**/index.d.ts"],
        },
    ],
}
