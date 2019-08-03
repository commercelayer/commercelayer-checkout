module.exports = {
  devServer: {
    disableHostCheck: true,
    public: 'https://checkout.commercelayer.dev'
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          $PRIMARY_COLOR: ${process.env.PRIMARY_COLOR};
          $SECONDARY_COLOR: ${process.env.SECONDARY_COLOR};
          $ACCENT_COLOR: ${process.env.ACCENT_COLOR};
          $ERROR_COLOR: ${process.env.ERROR_COLOR};
          $INFO_COLOR: ${process.env.INFO_COLOR};
          $SUCCESS_COLOR: ${process.env.SUCCESS_COLOR};
          $WARNING_COLOR: ${process.env.WARNING_COLOR};
          @import "@/scss/_global.scss";
        `
      }
    }
  }
}
