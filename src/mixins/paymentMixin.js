import _ from 'lodash'
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export const paymentMixin = {
  props: {
    payment_option: {
      type: Object,
      required: true
    }
  },
  methods: {
    inputLabel (paymentSourceType) {
      return _.capitalize(this.$t(`payment_methods.${paymentSourceType}.title`))
    },
    updateValidations () {
      this.invalid_payment_method =
        _.isEmpty(this.order.payment_method) ||
        _.isEmpty(this.order.payment_source)
    },
    paymentSourceAttributes () {
      return {}
    },
    setPaymentMethod () {
      let payload = {
        order: this.order,
        paymentMethod: this.payment_option.payment_method
      }
      this.loading_payment = true
      this.$store.dispatch('setOrderPaymentMethod', payload).then(() => {
        this.trackPaymentOption()
        this.setPaymentSource()
          .then(() => {
            this.updateValidations()
            this.loading_payment = false
            this.setupPayment()
          })
          .catch(error => {
            this.handlePaymentSourceError(error)
          })
      })
    },
    handlePaymentSourceError (error) {
      console.log(error)
    },
    setPaymentSource () {
      let payload = {
        order: this.order,
        paymentMethod: this.payment_option.payment_method,
        paymentSourceAttributes: this.paymentSourceAttributes()
      }
      return this.$store.dispatch('setOrderPaymentSource', payload)
    },
    getScript (scriptSrc) {
      let scripts = document.getElementsByTagName('script')
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === scriptSrc) return scripts[i]
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = scriptSrc
      script.className = 'payment-script'
      document.body.insertBefore(script, document.body.firstChild)
      return script
    },
    trackPaymentOption () {
      this.$gtm.trackEvent({
        event: 'checkout_option',
        ecommerce: {
          currencyCode: this.order.currency_code,
          checkout_option: {
            actionField: {
              step: this.current_step,
              option: this.order.payment_method.payment_source_type
            }
          }
        }
      })
    }
  },
  computed: {
    selected () {
      return _.isEqual(
        this.payment_option.component,
        this.selected_payment_option_component
      )
    },
    ...mapState(['order']),
    ...mapFields([
      'validations.invalid_payment_method',
      'buttons.loading_payment',
      'selected_payment_option_component'
    ])
  }
}
