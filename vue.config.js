module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "~@/scss/_variables.scss";
          @import "~@/scss/_mixins.scss";
        `,
      },
    },
  },
};
