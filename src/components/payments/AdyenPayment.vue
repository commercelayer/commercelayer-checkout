<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('adyen')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="adyen_payments_radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div id="adyen-card"></div>
      <div class="payment-error" id="adyen-card-error"></div>
      <div id="adyen-action"></div>
    </div>
  </div>
</template>

<script>
import { paymentMixin } from '@/mixins/paymentMixin'

export default {
  computed: {
    scriptSrc () {
      return `https://checkoutshopper-${process.env.VUE_APP_ADYEN_ENV}.adyen.com/checkoutshopper/sdk/3.1.0/adyen.js`
    },
    styleHref () {
      return `https://checkoutshopper-${process.env.VUE_APP_ADYEN_ENV}.adyen.com/checkoutshopper/sdk/3.1.0/adyen.css`
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
    }
  },
  mixins: [paymentMixin],
  methods: {
    setupPayment () {
      let script = this.getScript()
      script.addEventListener('load', () => {
        this.setPaymentSource()
          .then(paymentSource => {
            let checkout = new AdyenCheckout(this.configuration(paymentSource))

            let card = checkout.create("card", {
              styles: this.styleObj
            }).mount("#adyen-card")

            let btn = document.getElementById('place-order-button')
            btn.onclick = () => {
              this.handlePayment(checkout)
            }

          })
      })
    },
    configuration (paymentSource) {
      return {
        locale: this.$i18n.locale,
        environment: process.env.VUE_APP_ADYEN_ENV,
        originKey: process.env.VUE_APP_ADYEN_ORIGIN_KEY,
        paymentMethodsResponse: paymentSource.payment_methods,
        onChange: this.handleOnChange,
        onAdditionalDetails:this.handleOnAdditionalDetails
      }
    },
    collectBrowserInfo () {
      const screenWidth = window && window.screen ? window.screen.width : ''
      const screenHeight = window && window.screen ? window.screen.height : ''
      const colorDepth = window && window.screen ? window.screen.colorDepth : ''
      const userAgent = window && window.navigator ? window.navigator.userAgent : ''
      const javaEnabled = window && window.navigator ? navigator.javaEnabled() : false

      let language = ''
      if (window && window.navigator) {
          language = window.navigator.language
              ? window.navigator.language
              : window.navigator.browserLanguage // Else is for IE <+ 10
      }

      const d = new Date()
      const timeZoneOffset = d.getTimezoneOffset()

      const browserInfo = {
          screenWidth,
          screenHeight,
          colorDepth,
          userAgent,
          timeZoneOffset,
          language,
          javaEnabled,
      };

      return browserInfo
    },
    handleOnChange (state, component) {
      let browserInfo = this.collectBrowserInfo()

      if (state.isValid) {
        this.$store.dispatch('updateOrderPaymentSource', {
          payment_request_data: {
            payment_method: state.data.paymentMethod,
            origin: window.location.origin,
            return_url: window.location.href,
            browser_info: {
              acceptHeader: "text\/html,application\/xhtml+xml,application\/xml;q=0.9,image\/webp,image\/apng,*\/*;q=0.8",
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
      this.$store.dispatch('updateOrderPaymentSource', {
        payment_request_details: state.data,
        _details: 1
      })
      .then(paymentSource => {
        let checkout = new AdyenCheckout(this.configuration(paymentSource))
        this.handlePaymentResponse(paymentSource.payment_response, checkout)
      })
    },
    handlePayment (checkout) {
      this.$store.dispatch('updateOrderPaymentSource', {
        _authorize: 1
      })
      .then(paymentSource => {
        this.handlePaymentResponse(paymentSource.payment_response, checkout)
      })
    },
    handlePaymentResponse (paymentResponse, checkout) {
      if (paymentResponse.action != undefined) {
        // https://docs.adyen.com/checkout/components-web#step-4-additional-front-end
        checkout.createFromAction(paymentResponse.action).mount('#adyen-action')
      } else {
        // https://docs.adyen.com/checkout/components-web#step-6-present-payment-result
        switch(paymentResponse.resultCode) {
          case "Authorised":
          case "Pending":
          case "Received":
            this.$store.dispatch('placeOrder')
              .then(order => {
                this.$router.push({ name: 'confirmation' })
              })
            break      
          case "Error":
          case "Refused":
            let cardError = document.getElementById('adyen-card-error')
            cardError.innerHTML = _.capitalize(this.$t('errors.unauthorized_card')) + ` (${paymentResponse.refusalReason})`
            this.loading_payment = false
            break  
        }
      }
    },
    getScript () {
      let scripts = document.getElementsByTagName('script')
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === this.scriptSrc) return scripts[i]
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = this.scriptSrc
      document.body.insertBefore(script, document.body.firstChild)
      return script      
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
</style>
