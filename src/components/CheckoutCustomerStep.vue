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
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import OrderCustomer from '@/components/OrderCustomer'
import OrderBillingAddress from '@/components/OrderBillingAddress'
import OrderShippingAddress from '@/components/OrderShippingAddress'

export default {
  components: {
    OrderCustomer,
    OrderBillingAddress,
    OrderShippingAddress
  },
  mixins: [checkoutStepMixin],
  computed: {
    disabled () {
      return this.validations.invalid_customer || this.validations.invalid_billing_address || this.validations.invalid_shipping_address
    }
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

<style>
</style>
