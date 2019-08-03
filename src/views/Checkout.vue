<template>
  <v-stepper v-model="currentStep" vertical>
    <CheckoutCustomerStep :step=1 />
    <CheckoutDeliveryStep :step=2 />
    <CheckoutPaymentStep :step=3 />
  </v-stepper>
</template>

<script>
import CheckoutCustomerStep from '@/components/CheckoutCustomerStep'
import CheckoutDeliveryStep from '@/components/CheckoutDeliveryStep'
import CheckoutPaymentStep from '@/components/CheckoutPaymentStep'
import { mapState } from 'vuex'

export default {
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
    },
    ...mapState(['order'])
  }
}
</script>

<style lang="scss">
  .step-wrapper {
    &:not(:last-child) > .v-stepper__content {
      border-left: 1px solid $v-border;
    }
    button {
      margin: 2rem 0;
      min-width: 50%;
    }
    .v-subheader {
      padding: 0;
    }
    .payment-methods {
      margin-bottom: 1rem;
    }
  }
</style>
