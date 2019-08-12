module.exports = {
  devServer: {
    disableHostCheck: true,
    public: 'https://checkout.commercelayer.dev'
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          $PRIMARY_COLOR: ${process.env.VUE_APP_BRAND_COLOR};
          $ERROR_COLOR: ${process.env.VUE_APP_ERROR_COLOR};
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
  }
}
