import _ from 'lodash'
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export const paymentMethodMixin = {
  props: {
    payment_method: {
      type: Object,
      required: true
    }
  },
  methods: {
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
          this.setupPayment()
        })
    },
    setPaymentSource () {
      let payload = {
        order: this.order,
        paymentMethod: this.payment_method,
        paymentSourceAttributes: this.paymentSourceAttributes()
      }
      this.$store.dispatch('setOrderPaymentSource', payload)
    }
  },
  computed: {
    selected () {
      return _.isEqual(this.payment_method, this.order.payment_method)
    },
    ...mapState(['order']),
    ...mapFields(['validations.invalid_payment_method'])
  },
  mounted () {
    this.updateValidations()
  }
}
