import _ from 'lodash'
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export const paymentMixin = {
  props: {
    payment_method: {
      type: Object,
      required: true
    }
  },
  methods: {
    inputLabel (paymentSourceType) {
      return _.capitalize(this.$t(`payment_methods.${paymentSourceType}.title`))
    },
    updateValidations () {
      this.invalid_payment_method = _.isEmpty(this.order.payment_method)
    },
    paymentSourceAttributes () {
      return {}
    },
    setPaymentMethod () {
      let payload = {
        order: this.order,
        paymentMethod: this.payment_method
      }
      this.$store.dispatch('setOrderPaymentMethod', payload)
        .then(() => {
          this.updateValidations()
          this.setupPayment()
        })
    },
    setPaymentSource () {
      let payload = {
        order: this.order,
        paymentMethod: this.payment_method,
        paymentSourceAttributes: this.paymentSourceAttributes()
      }
      return this.$store.dispatch('setOrderPaymentSource', payload)
    }
  },
  computed: {
    selected () {
      return _.isEqual(this.payment_method, this.order.payment_method)
    },
    ...mapState(['order']),
    ...mapFields([
      'validations.invalid_payment_method',
      'buttons.loading_payment'
    ])
  },
  mounted () {
    this.updateValidations()
    if (this.selected) this.setPaymentMethod()
  }
}
