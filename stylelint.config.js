export default {
  plugins: ['stylelint-prettier'],
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  ignoreFiles: ['node_modules/**', 'dist/**', 'src/components/Icon/iconfont/**'],
  rules: {
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
    'no-invalid-position-declaration': null,
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}
