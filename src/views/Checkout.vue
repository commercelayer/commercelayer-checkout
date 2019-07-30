<template>
  <v-stepper v-model="currentStep" vertical>

    <CheckoutCustomerStep :step=1 />
    <CheckoutAddressesStep :step=2 />
    <CheckoutDeliveryStep :step=3 />
    <CheckoutPaymentStep :step=4 />

  </v-stepper>
</template>

<script>
import CheckoutCustomerStep from '@/components/CheckoutCustomerStep'
import CheckoutAddressesStep from '@/components/CheckoutAddressesStep'
import CheckoutDeliveryStep from '@/components/CheckoutDeliveryStep'
import CheckoutPaymentStep from '@/components/CheckoutPaymentStep'

export default {
  components: {
    CheckoutCustomerStep,
    CheckoutAddressesStep,
    CheckoutDeliveryStep,
    CheckoutPaymentStep
  },
  computed: {
    currentStep: {
      get () {
        return this.$store.state.currentStep
      },
      set (value) {
        this.$store.dispatch('setCurrentStep', value)
      }
    }
  }
}
</script>

<style>
</style>
