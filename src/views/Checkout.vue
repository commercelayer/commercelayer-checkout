<template>
  <v-stepper v-model="currentStep" vertical>
    <CheckoutCustomerStep :step=1 />
    <CheckoutDeliveryStep :step=2 />
    <CheckoutPaymentStep :step=3 :order="order" />
  </v-stepper>
</template>

<script>
import CheckoutCustomerStep from '@/components/CheckoutCustomerStep'
import CheckoutDeliveryStep from '@/components/CheckoutDeliveryStep'
import CheckoutPaymentStep from '@/components/CheckoutPaymentStep'

export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  components: {
    CheckoutCustomerStep,
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
