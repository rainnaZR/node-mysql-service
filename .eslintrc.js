// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // indent set to 4
    'indent': [2, 4, {
        'SwitchCase': 1
    }],
    'semi': [2, 'always'],
    "space-before-function-paren": ["error", "never"],
    'comma-dangle': [2, 'never']
  }
}
