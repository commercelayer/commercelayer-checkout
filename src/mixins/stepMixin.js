import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'
import { gtmProducts } from '@/utils/gtm'

export const stepMixin = {
  props: {
    step: {
      type: Number,
      required: false
    }
  },
  computed: {
    complete () {
      return this.current_step > this.step
    },
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    ...mapState(['order', 'validations']),
    ...mapFields(['current_step'])
  },
  methods: {
    nextStep () {
      this.current_step = this.step + 1
      this.trackCheckoutStep()
    },
    trackCheckoutStep () {
      this.$gtm.trackEvent({
        event: 'checkout',
        ecommerce: {
          currencyCode: this.order.currency_code,
          checkout: {
            actionField: {
              step: this.current_step
            },
            products: gtmProducts(this.order)
          }
        }
      })
    },
    trackDeliveryOption (option) {
      this.$gtm.trackEvent({
        event: 'checkout_option',
        ecommerce: {
          currencyCode: this.order.currency_code,
          checkout_option: {
            actionField: {
              step: this.current_step,
              option: option
            }
          }
        }
      })
    }
  }
}
