<template>
  <v-layout row wrap>
    <v-flex xs12 px-2>
      <v-checkbox
        :label="$t('generic.ship_to_different_address') | capitalize"
        id="ship-to-different-address-checkbox"
        v-model="ship_to_different_address"
        @change="handleChange()"
        color="primary"
        :disabled="ship_to_different_address_required"
      ></v-checkbox>
    </v-flex>
    <template v-if="ship_to_different_address">
      <v-flex xs12 px-2>
        <v-radio-group v-model="_shipping_address_clone_id" v-if="showAddressBook">
          <v-layout wrap class="body-2">
            <CustomerAddressFields
              v-for="customer_address in addresses"
              :key="customer_address.id"
              :customer_address="customer_address"
            />
          </v-layout>
          <v-radio class="new-address-option" :value="false" :label="$t('generic.new_address')"></v-radio>
        </v-radio-group>
      </v-flex>
      <template v-if="showShippingAddress">
        <v-flex xs6 px-2>
          <v-text-field
            id="shipping-address-first-name"
            :label="inputLabel('first_name')"
            v-model="first_name"
            :error-messages="errorMessages('first_name')"
            @input="handleInput()"
            @blur="handleBlur('first_name')"
          ></v-text-field>
        </v-flex>
        <v-flex xs6 px-2>
          <v-text-field
            id="shipping-address-last-name"
            :label="inputLabel('last_name')"
            v-model="last_name"
            :error-messages="errorMessages('last_name')"
            @input="handleInput()"
            @blur="handleBlur('last_name')"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 px-2>
          <v-text-field
            id="shipping-address-line-1"
            :label="inputLabel('line_1')"
            v-model="line_1"
            :error-messages="errorMessages('line_1')"
            @input="handleInput()"
            @blur="handleBlur('line_1')"
          ></v-text-field>
        </v-flex>
        <v-flex xs6 px-2>
          <v-text-field
            id="shipping-address-city"
            :label="inputLabel('city')"
            v-model="city"
            :error-messages="errorMessages('city')"
            @input="handleInput()"
            @blur="handleBlur('city')"
          ></v-text-field>
        </v-flex>
        <v-flex xs6 px-2>
          <v-autocomplete
            id="shipping-address-country-code"
            :label="inputLabel('country_code')"
            :items="countries"
            item-text="name"
            item-value="code"
            v-model="country_code"
            :error-messages="errorMessages('country_code')"
            @input="handleInput()"
            @blur="handleBlur('country_code')"
            :disabled="shippingCountryCodeLocked"
          ></v-autocomplete>
        </v-flex>
        <v-flex xs6 px-2>
          <v-text-field
            id="shipping-address-state-code"
            :label="inputLabel('state_code')"
            v-model="state_code"
            :error-messages="errorMessages('state_code')"
            @input="handleInput()"
            @blur="handleBlur('state_code')"
          ></v-text-field>
        </v-flex>
        <v-flex xs6 px-2>
          <v-text-field
            id="shipping-address-zip-code"
            :label="inputLabel('zip_code')"
            v-model="zip_code"
            :error-messages="errorMessages('zip_code')"
            @input="handleInput()"
            @blur="handleBlur('zip_code')"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 px-2>
          <v-text-field
            id="shipping-address-phone"
            :label="inputLabel('phone')"
            v-model="phone"
            :error-messages="errorMessages('phone')"
            @input="handleInput()"
            @blur="handleBlur('phone')"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 py-2></v-flex>
        <v-flex xs12 px-2 v-if="showAddressBook">
          <v-checkbox
            :label="$t('generic.save_to_address_book')"
            id="save-shipping-address-checkbox"
            v-model="_save_shipping_address_to_customer_address_book"
            color="primary"
          ></v-checkbox>
        </v-flex>
      </template>
    </template>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import { addressMixin } from '@/mixins/addressMixin'
import { mapFields } from 'vuex-map-fields'

export default {
  mixins: [addressMixin],
  data () {
    return {
      billing: false
    }
  },
  computed: {
    shippingCountryCodeLocked () {
      return !_.isEmpty(this.shipping_country_code_lock)
    },
    ...mapFields([
      'validations.invalid_shipping_address',
      'order.shipping_country_code_lock',
      'order.ship_to_different_address',
      'order.ship_to_different_address_required',
      'order.shipping_address.first_name',
      'order.shipping_address.last_name',
      'order.shipping_address.line_1',
      'order.shipping_address.city',
      'order.shipping_address.country_code',
      'order.shipping_address.state_code',
      'order.shipping_address.zip_code',
      'order.shipping_address.phone',
      'order._save_shipping_address_to_customer_address_book'
    ])
  },
  methods: {
    updateAddressInvalid () {
      this.invalid_shipping_address =
        this.ship_to_different_address && this.$v.$invalid
    },
    handleChange () {
      this.updateAddressInvalid()
    }
  }
}
</script>

<style scoped>
.new-address-option {
  margin-top: 1rem;
}
</style>
