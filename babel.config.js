module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      // [
      //   "expo-media-library",
      //   {
      //     "photosPermission": "Allow recorder to access your photos.",
      //     "savePhotosPermission": "Allow recorder to save photos.",
      //     "isAccessMediaLocationEnabled": true
      //   },
      // ],
    ],
  };
};
