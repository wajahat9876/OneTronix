// eslint-disable-next-line @typescript-eslint/no-var-requires, prettier/prettier
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { transformer, resolver } = config;
  config.transformer = {
    ...transformer,
    // eslint-disable-next-line prettier/prettier
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    // eslint-disable-next-line prettier/prettier
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    // eslint-disable-next-line prettier/prettier
    sourceExts: [...resolver.sourceExts, "svg"],
  };
  return config;
})();
