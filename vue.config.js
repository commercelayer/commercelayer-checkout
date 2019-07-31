module.exports = {
  devServer: {
    disableHostCheck: true,
    public: 'https://checkout.commercelayer.dev'
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          $PRIMARY_COLOR: ${process.env.PRIMARY_COLOR || '#000000' };
          $SECONDARY_COLOR: ${process.env.SECONDARY_COLOR || '#000000'};
          $ACCENT_COLOR: ${process.env.ACCENT_COLOR || '#000000'};
          $ERROR_COLOR: ${process.env.ERROR_COLOR || '#000000'};
          $INFO_COLOR: ${process.env.INFO_COLOR || '#000000'};
          $SUCCESS_COLOR: ${process.env.SUCCESS_COLOR || '#000000'};
          $WARNING_COLOR: ${process.env.WARNING_COLOR || '#000000'};
          @import "@/scss/_global.scss";
        `
      }
    }
  }
}
