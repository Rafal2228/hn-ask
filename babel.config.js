const plugins = ['@babel/plugin-transform-runtime'];

if (process.env.ENV === 'prod') {
  plugins.push('babel-plugin-jsx-remove-data-test-id');
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { browsers: ['last 2 versions', 'IE >= 9'] } },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins,
};
