<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" :edit-icon="editIcon">
      {{ $t('steps.customer.title') | capitalize }}
      <small>{{ $t('steps.customer.hint') | capitalize }}</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <OrderCustomer />
      <OrderBillingAddress />
      <OrderShippingAddress />
      <v-btn
        color="primary"
        @click="submit()"
        :block="isMobile"
        :disabled="disabled">
          {{ $t('steps.customer.button') }}
      </v-btn>
    </v-stepper-content>

    <div class="step-summary" v-if="complete">
      <v-layout row wrap>
        <v-flex xs12 md6>
          <div class="header">
            {{ order.customer_email }}
          </div>
          <div class="billing-address">
            <CustomerAddress :address="order.billing_address" />
          </div>
        </v-flex>
        <v-flex xs12 md4>
          <div class="header">
            {{ $t('generic.ship_to') | capitalize }}:
          </div>
          <div class="shipping-address">
            <CustomerAddress :address="order.shipping_address" />
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import OrderCustomer from '@/components/OrderCustomer'
import OrderBillingAddress from '@/components/OrderBillingAddress'
import OrderShippingAddress from '@/components/OrderShippingAddress'
import CustomerAddress from '@/components/CustomerAddress'

import { mapState } from 'vuex'

export default {
  components: {
    OrderCustomer,
    OrderBillingAddress,
    OrderShippingAddress,
    CustomerAddress
  },
  mixins: [checkoutStepMixin],
  computed: {
    disabled () {
      return this.validations.invalid_customer || this.validations.invalid_billing_address || this.validations.invalid_shipping_address
    },
    ...mapState(['order'])
  },
  methods: {
    submit () {
      this.$store.dispatch('setOrderAddresses')
        .then(() => {
          this.nextStep()
        })
    }
  }
}
</script>

<style scoped>
  .header {
    font-weight: bolder;
    margin-bottom: 0.5rem; 
  }
</style>
