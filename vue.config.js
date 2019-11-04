module.exports = {
  devServer: {
    disableHostCheck: true,
    public: process.env.VUE_APP_DEV_SERVER
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          $PRIMARY_COLOR: ${process.env.VUE_APP_BRAND_COLOR || '#000000'};
          $SUCCESS_COLOR: ${process.env.VUE_APP_SUCCESS_COLOR || '#000000'};
          $ERROR_COLOR: ${process.env.VUE_APP_ERROR_COLOR || '#000000'};
          @import "@/scss/_global.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    ;['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(match => {
      config.module
        .rule('sass')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt =>
          Object.assign(opt, { data: `@import '~@/scss/_global.scss'` })
        )
    })
  },
  transpileDependencies: ['vuetify']
}
