<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step">
      {{ $t('steps.payment.title') | capitalize }}
      <small>{{ $t('steps.payment.hint') | capitalize }}</small>
    </v-stepper-step>
    <v-stepper-content :step="step">
      <v-radio-group v-model="selected_payment_option_component">
        <component
          v-for="payment_option in availablePaymentOptions"
          :is="payment_option.component"
          :key="payment_option.component"
          :payment_option="payment_option"
        />
      </v-radio-group>

      <v-btn
        color="primary"
        :block="isMobile"
        :disabled="disabled"
        min-width="50%"
        id="payment-step-submit"
        :loading="buttons.loading_payment"
      >{{ $t('buttons.place_order') }}</v-btn>

      <div
        class="order-error"
        id="place-order-error"
        v-show="errors.place_order"
      >{{ errors.place_order }}</div>
    </v-stepper-content>
  </div>
</template>

<script>
import _ from 'lodash'
import { stepMixin } from '@/mixins/stepMixin'
import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'

import AdyenCard from '@/components/payments/adyen/AdyenCard'
import BraintreeCard from '@/components/payments/braintree/BraintreeCard'
import StripeCard from '@/components/payments/stripe/StripeCard'
import PaypalPayment from '@/components/payments/PaypalPayment'
import WireTransfer from '@/components/payments/WireTransfer'

export default {
  components: {
    AdyenCard,
    BraintreeCard,
    StripeCard,
    PaypalPayment,
    WireTransfer
  },
  mixins: [stepMixin],
  computed: {
    disabled() {
      return this.invalid_payment_method
    },
    availablePaymentOptions() {
      let paymentOptions = []
      _.each(this.order.available_payment_methods, paymentMethod => {
        switch (paymentMethod.payment_source_type) {
          case 'adyen_payments':
            if (
              process.env.VUE_APP_ADYEN_ENV &&
              process.env.VUE_APP_ADYEN_ORIGIN_KEY
            ) {
              paymentOptions.push({
                payment_method: paymentMethod,
                component: 'AdyenCard',
                priority: 1
              })
              // More Adyen Payment Methods go here
            }
            break
          case 'braintree_payments':
            paymentOptions.push({
              payment_method: paymentMethod,
              component: 'BraintreeCard',
              priority: 1
            })
            // More Braintree Payment Methods go here
            break
          case 'stripe_payments':
            if (process.env.VUE_APP_STRIPE_PUBLIC_KEY) {
              paymentOptions.push({
                payment_method: paymentMethod,
                component: 'StripeCard',
                priority: 1
              })
              // More Stripe Payment Methods go here
            }
            break
          case 'paypal_payments':
            paymentOptions.push({
              payment_method: paymentMethod,
              component: 'PaypalPayment',
              priority: 2
            })
            break
          case 'wire_transfers':
            paymentOptions.push({
              payment_method: paymentMethod,
              component: 'WireTransfer',
              priority: 3
            })
            break
        }
      })
      return _.sortBy(paymentOptions, ['priority'])
    },
    ...mapState(['buttons', 'errors']),
    ...mapFields([
      'validations.invalid_payment_method',
      'order',
      'order.payment_method',
      'selected_payment_option_component'
    ])
  }
}
</script>

<style lang="scss">
.payment-method {
  margin-bottom: 1rem;

  .payment-method-fields {
    background-color: #fafafa;
    margin: 1rem 0;
    padding: 1rem 1rem 0;
    border: 1px solid $v-border;
    border-radius: 4px;

    .payment-error {
      color: $ERROR_COLOR;
      margin-top: 1rem;
    }
  }
}

.v-input--selection-controls {
  .v-input__control {
    width: 100% !important;
  }
}

.order-error {
  color: $ERROR_COLOR;
  margin-top: 1rem;
}

.sm-and-up {
  .payment-method-fields {
    padding: 2rem 2rem 1rem;
  }
}
</style>
