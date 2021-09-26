module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/main/preload.ts",
      // Use this to change the entry point of your app's main process
      mainProcessFile: "src/main/background.ts",
      // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
      rendererProcessFile: "src/renderer/main.ts",
      removeElectronJunk: false,
    },
  },
};
