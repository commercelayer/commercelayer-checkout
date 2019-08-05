<template>
  <v-stepper v-model="current_step" vertical>
    <CheckoutCustomerStep :step=1 />
    <CheckoutDeliveryStep :step=2 />
    <CheckoutPaymentStep :step=3 />
  </v-stepper>
</template>

<script>
import CheckoutCustomerStep from '@/components/CheckoutCustomerStep'
import CheckoutDeliveryStep from '@/components/CheckoutDeliveryStep'
import CheckoutPaymentStep from '@/components/CheckoutPaymentStep'
import { mapFields } from 'vuex-map-fields'

export default {
  components: {
    CheckoutCustomerStep,
    CheckoutDeliveryStep,
    CheckoutPaymentStep
  },
  computed: {
    ...mapFields([
      'current_step',
      'order'
    ])
  }
}
</script>

<style lang="scss">
  .v-subheader {
    padding: 0;
  }

  .step-summary {
    padding: 0 2rem;
  }

  .step-wrapper {
    .v-stepper__content {
      margin-left: 0;
    }
  }
  .sm-and-up {
    .step-summary {
      margin-top: 16px;
      margin-left: 36px;
      padding-left: 24px;
      padding-bottom: 16px;
      border-left: 1px solid $v-border;
    }

    .step-wrapper {
      .v-stepper__content {
        margin: 0px -36px -16px 36px;
        padding: 16px 60px 16px 23px;
      }
      &:not(:last-child) > .v-stepper__content {
        border-left: 1px solid $v-border;
      }
      button {
        margin: 1rem 0 0;
        min-width: 50%;

        &.place-order {
          margin-top: 0;
        }
      }
    }
  }
</style>
