/* eslint-disable prettier/prettier */
module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],

  root: true,

  parserOptions: {
    sourceType: 'module',

    ecmaVersion: 6,
  },

  rules: {
    'prettier/prettier': 'off',
    'linebreak-style': 'off',
  },
}
