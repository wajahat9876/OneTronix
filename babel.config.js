// @ts-nocheck
module.exports = api => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@src': './src',
            '@utils': './utils',
            '@assets': './assets',
            '@hooks': './src/hooks',
            '@/': './',
            '@components': './src/components',
            '@globals': './src/components/globals',
            '@steps': './src/components/steps',
            '@commons': './src/components/commons',
            '@lib': './src/libraries',


            // STORE
            '@store': './store',
            '@reducers': './store/reducers',
            '@api': './store/api',
            '@types': './store/types',
            '@selectors': './store/selectors',
          },

          extensions: ['.js', '.jsx', '.es', '.es6', '.mjs', '.ts', '.tsx'],
        },
      ],
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
