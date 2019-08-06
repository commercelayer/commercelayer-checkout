<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :rules="rules">
      {{ $t('steps.payment.title') | capitalize }}
      <small>{{ $t('steps.payment.hint') | capitalize }}</small>
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
        :block="isMobile"
        :disabled="disabled"
        min-width="50%"
        id="place-order-button"
        :loading="buttons.loading_payment">
          {{ $t('steps.payment.button') }}
      </v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import _ from 'lodash'
import { stepMixin } from '@/mixins/stepMixin'
import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'

import StripePayment from '@/components/payments/StripePayment'
import BraintreePayment from '@/components/payments/BraintreePayment'
import AdyenPayment from '@/components/payments/AdyenPayment'
import PaypalPayment from '@/components/payments/PaypalPayment'
import WireTransfer from '@/components/payments/WireTransfer'
import CreditCard from '@/components/payments/CreditCard'

export default {
  components: {
    StripePayment,
    BraintreePayment,
    AdyenPayment,
    PaypalPayment,
    WireTransfer,
    CreditCard
  },
  mixins: [stepMixin],
  computed: {
    rules () {
      return [() => {
        return !_.isEmpty(this.order.available_payment_methods)
      }]
    },
    disabled () {
      return this.invalid_payment_method
    },
    ...mapState(['buttons']),
    ...mapFields([
      'validations.invalid_payment_method',
      'order',
      'order.payment_method'
    ])
  },
  methods: {
    componentType (paymentMethod) {
      let result = _.startCase(paymentMethod.payment_source_type)
      result = _.replace(result, ' ', '')
      result = _.trimEnd(result, 's')
      return result
    }
  }
}
</script>

<style lang="scss">
  .payment-method {
    margin-bottom: 1rem;

    .payment-method-fields {
      margin: 1rem 0rem;
      padding: 1rem 0;
      border-top: 1px solid $v-border;

      .payment-error {
        color: $ERROR_COLOR;
        margin-top: 1rem;
      }

    }

  }

  .v-input--selection-controls {
    .v-input__control {
      width: 100%;
    }
  }

  .sm-and-up {
    .payment-method {
      .payment-method-fields {
        padding: 2rem;
      }
    }
  }
</style>
