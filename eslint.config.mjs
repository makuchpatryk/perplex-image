import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";

export default [
  {
    ignores: [".output/*", ".nuxt/*"],
  },
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    },
  }
];
