<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :rules="rules">
      Payment
      <small>Add a payment method and place the order.</small>
    </v-stepper-step>
    <v-stepper-content :step="step">
      <v-radio-group v-model="payment_method" class="payment-methods">
        <component
          v-for="available_payment_method in order.available_payment_methods"
          :is="componentType(available_payment_method)"
          :key="available_payment_method.id"
          :payment_method="available_payment_method"
          />
      </v-radio-group>
      <v-btn
        color="primary"
        @click="placeOrder"
        :block="isMobile"
        min-width="50%"
        class="place-order">
          Place order
      </v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import _ from 'lodash'
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import stripePayments from '@/components/payment_methods/stripePayments'
import braintreePayments from '@/components/payment_methods/braintreePayments'
import adyenPayments from '@/components/payment_methods/adyenPayments'
import paypalPayments from '@/components/payment_methods/paypalPayments'
import wireTransfers from '@/components/payment_methods/wireTransfers'
import creditCards from '@/components/payment_methods/creditCards'

export default {
  components: {
    stripePayments,
    braintreePayments,
    adyenPayments,
    paypalPayments,
    wireTransfers,
    creditCards
  },
  mixins: [checkoutStepMixin],
  computed: {
    rules () {
      return [() => {
        return !_.isEmpty(this.order.available_payment_methods)
      }]
    },
    ...mapState([
      'order'
    ]),
    ...mapFields([
      'order.payment_method'
    ])
  },
  methods: {
    componentType (paymentMethod) {
      return _.camelCase(paymentMethod.payment_source_type)
    },
    placeOrder () {
      this.$store.dispatch('setCurrentStep', 1)
    }
  }
}
</script>

<style lang="scss">
  .payment-method {
    margin-bottom: 1rem;

    .payment-method-fields {
      margin: 1rem 0rem;
      padding-top: 1rem;
      border-top: 1px solid $v-border;
    }
  }

  .v-input--selection-controls {
    .v-input__control {
      width: 100%;
    }
  }
</style>
