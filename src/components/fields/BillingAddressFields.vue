<template>
  <div>
    <v-radio-group v-model="_billing_address_clone_id" v-if="showAddressBook">
      <v-layout wrap class="body-2">
        <CustomerAddressFields
          v-for="customer_address in addresses"
          :key="customer_address.id"
          :customer_address="customer_address"
        />
      </v-layout>
      <v-radio class="new-address-option" :value="false" :label="$t('generic.new_address')"></v-radio>
    </v-radio-group>

    <v-layout row wrap v-if="showBillingAddress">
      <v-flex xs6 px-2>
        <v-text-field
          id="billing-address-first-name"
          :label="inputLabel('first_name')"
          v-model="first_name"
          :error-messages="errorMessages('first_name')"
          @input="handleInput()"
          @blur="handleBlur('first_name')"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 px-2>
        <v-text-field
          id="billing-address-last-name"
          :label="inputLabel('last_name')"
          v-model="last_name"
          :error-messages="errorMessages('last_name')"
          @input="handleInput()"
          @blur="handleBlur('last_name')"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2>
        <v-text-field
          id="billing-address-line-1"
          :label="inputLabel('line_1')"
          v-model="line_1"
          :error-messages="errorMessages('line_1')"
          @input="handleInput()"
          @blur="handleBlur('line_1')"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 px-2>
        <v-text-field
          id="billing-address-city"
          :label="inputLabel('city')"
          v-model="city"
          :error-messages="errorMessages('city')"
          @input="handleInput()"
          @blur="handleBlur('city')"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 px-2>
        <v-autocomplete
          id="billing-address-country-code"
          :label="inputLabel('country_code')"
          :items="countries"
          item-text="name"
          item-value="code"
          v-model="country_code"
          :error-messages="errorMessages('country_code')"
          @input="handleInput()"
          @blur="handleBlur('country_code')"
          @change="updateShipToDifferentAddressRequired"
        ></v-autocomplete>
      </v-flex>
      <v-flex xs6 px-2>
        <v-text-field
          id="billing-address-state-code"
          :label="inputLabel('state_code')"
          v-model="state_code"
          :error-messages="errorMessages('state_code')"
          @input="handleInput()"
          @blur="handleBlur('state_code')"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 px-2>
        <v-text-field
          id="billing-address-zip-code"
          :label="inputLabel('zip_code')"
          v-model="zip_code"
          :error-messages="errorMessages('zip_code')"
          @input="handleInput()"
          @blur="handleBlur('zip_code')"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2>
        <v-text-field
          id="billing-address-phone"
          :label="inputLabel('phone')"
          v-model="phone"
          :error-messages="errorMessages('phone')"
          @input="handleInput()"
          @blur="handleBlur('phone')"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 px-2 v-if="order.requires_billing_info">
        <v-text-field
          id="billing-address-billing-info"
          :label="inputLabel('billing_info')"
          v-model="billing_info"
          :error-messages="errorMessages('billing_info')"
          @input="handleInput()"
          @blur="handleBlur('billing_info')"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 px-2 v-if="showAddressBook">
        <v-checkbox
          :label="$t('generic.save_to_address_book')"
          id="save-billing-address-checkbox"
          v-model="_save_billing_address_to_customer_address_book"
          color="primary"
        ></v-checkbox>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from 'lodash'
import { addressMixin } from '@/mixins/addressMixin'
import { mapFields } from 'vuex-map-fields'

export default {
  mixins: [addressMixin],
  computed: {
    ...mapFields([
      'validations.invalid_billing_address',
      'order.shipping_country_code_lock',
      'order.ship_to_different_address',
      'order.ship_to_different_address_required',
      'order.billing_address.first_name',
      'order.billing_address.last_name',
      'order.billing_address.line_1',
      'order.billing_address.city',
      'order.billing_address.country_code',
      'order.billing_address.state_code',
      'order.billing_address.zip_code',
      'order.billing_address.phone',
      'order.billing_address.billing_info',
      'order._save_billing_address_to_customer_address_book'
    ])
  },
  methods: {
    updateAddressInvalid () {
      this.invalid_billing_address = this.$v.$invalid
    },
    updateShipToDifferentAddressRequired () {
      if (!_.isEmpty(this.shipping_country_code_lock)) {
        let isRequired = this.shipping_country_code_lock !== this.country_code
        this.ship_to_different_address_required = isRequired
        this.ship_to_different_address = isRequired
      }
    }
  }
}
</script>

<style scoped>
.new-address-option {
  margin-top: 1rem;
}
</style>
