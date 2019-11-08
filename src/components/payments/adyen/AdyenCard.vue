<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('adyen')"
      :value="payment_option.component"
      color="primary"
      @change="setPaymentMethod"
      id="adyen-card-radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div id="adyen-card"></div>
      <div class="payment-error" id="adyen-card-error"></div>
    </div>
    <div id="adyen-action"></div>
  </div>
</template>

<script>
import { paymentMixin } from '@/mixins/paymentMixin'
import { collectBrowserInfo } from '@/utils/functions'

export default {
  computed: {
    scriptSrc () {
      return `https://checkoutshopper-${process.env.VUE_APP_ADYEN_ENV}.adyen.com/checkoutshopper/sdk/3.3.0/adyen.js`
    },
    styleHref () {
      return `https://checkoutshopper-${process.env.VUE_APP_ADYEN_ENV}.adyen.com/checkoutshopper/sdk/3.3.0/adyen.css`
    },
    styleObj () {
      return {
        base: {
          fontSize: '16px',
          fontFamily: 'Roboto, sans-serif'
        },
        error: {
          color: process.env.VUE_APP_ERROR_COLOR
        }
      }
    },
    checkoutConfig () {
      return {
        locale: this.$i18n.locale,
        environment: process.env.VUE_APP_ADYEN_ENV,
        originKey: process.env.VUE_APP_ADYEN_ORIGIN_KEY,
        paymentMethodsResponse: this.order.payment_source.payment_methods,
        onChange: this.handleOnChange,
        onAdditionalDetails: this.handleOnAdditionalDetails
      }
    }
  },
  mixins: [paymentMixin],
  methods: {
    setupPayment () {
      let script = this.getScript(this.scriptSrc)
      script.addEventListener('load', () => {
        // eslint-disable-next-line
        let checkout = new AdyenCheckout(this.checkoutConfig)

        checkout
          .create('card', {
            styles: this.styleObj
          })
          .mount('#adyen-card')

        let btn = document.getElementById('payment-step-submit')
        btn.onclick = () => {
          this.handlePayment(checkout)
        }
      })
    },
    handleOnChange (state, component) {
      if (state.isValid) {
        let browserInfo = collectBrowserInfo()

        this.$store.dispatch('updateOrderPaymentSource', {
          payment_request_data: {
            payment_method: state.data.paymentMethod,
            origin: window.location.origin,
            return_url: window.location.href,
            browser_info: {
              acceptHeader:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              colorDepth: browserInfo.colorDepth,
              javaEnabled: browserInfo.javaEnabled,
              language: browserInfo.language,
              screenHeight: browserInfo.screenHeight,
              screenWidth: browserInfo.screenWidth,
              timeZoneOffset: browserInfo.timeZoneOffset,
              userAgent: browserInfo.userAgent
            }
          }
        })
      }
    },
    handleOnAdditionalDetails (state, component) {
      this.$store
        .dispatch('updateOrderPaymentSource', {
          payment_request_details: state.data,
          _details: 1
        })
        .then(paymentSource => {
          // eslint-disable-next-line
          let checkout = new AdyenCheckout(this.checkoutConfig)
          this.handlePaymentResponse(paymentSource.payment_response, checkout)
        })
    },
    handlePayment (checkout) {
      this.loading_payment = true
      this.$store
        .dispatch('updateOrderPaymentSource', {
          _authorize: 1
        })
        .then(paymentSource => {
          this.handlePaymentResponse(paymentSource.payment_response, checkout)
        })
    },
    handlePaymentResponse (paymentResponse, checkout) {
      if (paymentResponse.action !== undefined) {
        // https://docs.adyen.com/checkout/components-web#step-4-additional-front-end
        checkout.createFromAction(paymentResponse.action).mount('#adyen-action')
      } else {
        // https://docs.adyen.com/checkout/components-web#step-6-present-payment-result
        switch (paymentResponse.resultCode) {
          case 'Authorised':
          case 'Pending':
          case 'Received':
            this.$store.dispatch('placeOrder')
            break
          case 'Error':
          case 'Refused':
            let cardError = document.getElementById('adyen-card-error')
            cardError.innerHTML = this.$t('errors.not_authorized')
            this.loading_payment = false
            break
        }
      }
    },
    checkStyle () {
      let links = document.getElementsByTagName('link')
      for (let i = 0; i < links.length; i++) {
        if (links[i].href === this.styleHref) return true
      }
      return false
    }
  },
  mounted () {
    // Add Adyen.css to document head
    if (!this.checkStyle()) {
      let style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = this.styleHref
      document.head.appendChild(style)
    }
  }
}
</script>

<style lang="scss">
.adyen-checkout__label__text {
  font-size: 1rem !important;
  margin-bottom: 0.5rem;
}
.adyen-checkout__input {
  @include hosted-field;
}
#adyen-action {
  .adyen-checkout__threeds2__challenge {
    border: 1px solid $v-border;
  }
  iframe[name='threeDSIframe'] {
    padding: 2rem;
  }
}
</style>
