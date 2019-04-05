module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { browsers: ['last 2 versions', 'IE >= 9'] } },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
