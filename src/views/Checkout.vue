<template>
  <v-stepper v-model="current_step" vertical>
    <CustomerStep :step="1" />
    <DeliveryStep :step="2" />
    <PaymentStep :step="3" />
  </v-stepper>
</template>

<script>
import CustomerStep from '@/components/steps/CustomerStep'
import DeliveryStep from '@/components/steps/DeliveryStep'
import PaymentStep from '@/components/steps/PaymentStep'
import { mapFields } from 'vuex-map-fields'

export default {
  components: {
    CustomerStep,
    DeliveryStep,
    PaymentStep
  },
  computed: {
    ...mapFields(['current_step', 'order'])
  }
}
</script>

<style lang="scss">
.v-subheader {
  padding: 0;
}

.step-summary {
  padding: 0 24px;
}

.step-wrapper {
  .v-stepper__label {
    small {
      margin-top: 0.5rem;
    }
  }

  .v-stepper__content {
    margin-left: -1px;
  }
}

.sm-and-up {
  .v-stepper {
    padding: 2rem;
  }

  .step-summary {
    margin-top: 16px;
    margin-left: 36px;
    padding-left: 24px;
    padding-bottom: 16px;
    border-left: 1px solid $v-border;
    border-bottom: 0;
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
      &.v-size--default {
        min-width: 50%;
        margin-bottom: 1rem;
      }
      &#payment-step-submit {
        margin-bottom: 0;
      }
    }
  }
}
</style>
