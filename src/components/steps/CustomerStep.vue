<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" edit-icon="done">
      <div>
        {{ $t('steps.customer.title') | capitalize }}
        <span v-if="complete">
          &mdash;
          <a>{{ $t('generic.edit') }}</a>
        </span>
      </div>
      <small>{{ $t('steps.customer.hint') | capitalize }}</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <v-container>
        <CustomerFields />
        <BillingAddressFields />
        <ShippingAddressFields v-if="requires_delivery" />
      </v-container>
      <v-btn
        id="customer-step-submit"
        color="primary"
        @click="submit()"
        :block="isMobile"
        :disabled="disabled"
        :loading="loading_customer"
      >{{ submitLabel }}</v-btn>

      <div
        class="order-error"
        id="set-addresses-error"
        v-show="errors.set_addresses"
      >{{ errors.set_addresses }}</div>
    </v-stepper-content>

    <div class="step-summary" v-if="complete">
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <div class="header">{{ order.customer_email }}</div>
            <div class="billing-address-summary">
              <AddressSummary :address="order.billing_address" />
            </div>
          </v-flex>
          <v-flex xs12 sm6>
            <div class="header">{{ $t('generic.ship_to') | capitalize }}:</div>
            <div class="shipping-address-summary">
              <AddressSummary :address="order.shipping_address" :billing="false" />
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import { stepMixin } from '@/mixins/stepMixin'

import CustomerFields from '@/components/fields/CustomerFields'
import BillingAddressFields from '@/components/fields/BillingAddressFields'
import ShippingAddressFields from '@/components/fields/ShippingAddressFields'
import AddressSummary from '@/components/summaries/AddressSummary'

import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  components: {
    CustomerFields,
    BillingAddressFields,
    ShippingAddressFields,
    AddressSummary
  },
  mixins: [stepMixin],
  computed: {
    disabled () {
      return (
        this.validations.invalid_customer ||
        (!this._billing_address_clone_id &&
          this.validations.invalid_billing_address) ||
        (!this._shipping_address_clone_id &&
          this.validations.invalid_shipping_address)
      )
    },
    submitLabel () {
      return this.requires_delivery
        ? this.$t('buttons.continue_to_delivery')
        : this.$t('buttons.continue_to_payment')
    },
    ...mapState(['order', 'errors', 'requires_delivery']),
    ...mapFields([
      'buttons.loading_customer',
      'customer.payment_sources',
      'order._billing_address_clone_id',
      'order._shipping_address_clone_id'
    ])
  },
  methods: {
    submit () {
      this.loading_customer = true
      this.$store.dispatch('setOrderAddresses').then(() => {
        if (!this.errors.set_addresses) this.nextStep()
      })
    }
  },
  mounted () {
    this.trackCheckoutStep('1')
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-weight: bolder;
  margin-bottom: 0.5rem;
}

.order-error {
  color: $ERROR_COLOR;
  margin-top: 1rem;
}
</style>
