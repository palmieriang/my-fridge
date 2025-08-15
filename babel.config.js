module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module:react-native-dotenv"],
      [
        "module-resolver",
        {
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
