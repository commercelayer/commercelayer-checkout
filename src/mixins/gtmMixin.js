import { mapState } from 'vuex'
import _ from 'lodash'

export const gtmMixin = {
  computed: {
    skuLineItems () {
      return _.filter(this.order.line_items, { item_type: 'skus' })
    },
    gtmProducts () {
      _.map(this.skuLineItems, lineItem => {
        return {
          name: lineItem.name,
          id: lineItem.id,
          price: lineItem.unit_amount_float,
          quantity: lineItem.quantity
        }
      })
    },
    ...mapState(['order', 'current_step'])
  },
  methods: {
    trackCheckoutStep () {
      this.$gtm.trackEvent({
        event: 'checkout',
        ecommerce: {
          currencyCode: this.order.currency_code,
          checkout: {
            actionField: {
              step: this.current_step
            },
            products: this.gtmProducts
          }
        }
      })
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
    },
    trackPurchase () {
      this.$gtm.trackEvent({
        event: 'purchase',
        ecommerce: {
          currencyCode: this.order.currency_code,
          purchase: {
            actionField: {
              id: this.order.number,
              revenue: this.order.total_amount_with_taxes_float,
              shipping: this.order.shipping_amount_float,
              tax: this.order.total_tax_amount_float,
              coupon: this.order.coupon_code
            },
            products: this.gtmProducts
          }
        }
      })
    }
  }
}
