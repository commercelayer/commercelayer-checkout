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
        <ShippingAddressFields />
      </v-container>
      <v-btn
        id="customer-step-submit"
        color="primary"
        @click="submit()"
        :block="isMobile"
        :disabled="disabled"
        :loading="loading_customer"
      >{{ $t('steps.customer.button') }}</v-btn>
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
        this.validations.invalid_billing_address ||
        this.validations.invalid_shipping_address
      )
    },
    ...mapState(['order']),
    ...mapFields(['buttons.loading_customer'])
  },
  methods: {
    submit () {
      this.loading_customer = true
      this.$store.dispatch('setOrderAddresses').then(() => {
        this.loading_customer = false
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
