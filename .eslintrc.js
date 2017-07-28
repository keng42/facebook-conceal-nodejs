module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
  ],
  env: {
    node: true,
  },
  globals: {
    describe: true,
    it: true,
    Erorr: true,
  },
  rules: {
    'import/no-unresolved': [2, {
      commonjs: false,
      amd: true,
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
    'no-console': 0,
    'no-param-reassign': ['error', {
      props: false,
    }],
  },
};
