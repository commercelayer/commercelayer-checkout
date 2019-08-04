<template>
  <v-layout row wrap>
    <v-flex xs12 pa-2>
      <v-checkbox label="Ship to different address"
        v-model="ship_to_different_address"
        @change="handleChange()"
        :disabled="ship_to_different_address_required">
        </v-checkbox>
    </v-flex>
    <template v-if="ship_to_different_address">
      <v-flex xs6 px-2 py-1>
        <v-text-field
          label="First name"
          v-model="first_name"
          :error-messages="errorMessages('first_name')"
          @input="handleInput()"
          @blur="handleBlur('first_name')">
        </v-text-field>
      </v-flex>
      <v-flex xs6 px-2 py-1>
        <v-text-field
          label="Last name"
          v-model="last_name"
          :error-messages="errorMessages('last_name')"
          @input="handleInput()"
          @blur="handleBlur('last_name')">
        </v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field
          label="Address"
          v-model="line_1"
          :error-messages="errorMessages('line_1')"
          @input="handleInput()"
          @blur="handleBlur('line_1')">
        </v-text-field>
      </v-flex>
      <v-flex xs6 px-2 py-1>
        <v-text-field
          label="City"
          v-model="city"
          :error-messages="errorMessages('city')"
          @input="handleInput()"
          @blur="handleBlur('city')">
        </v-text-field>
      </v-flex>
      <v-flex xs6 px-2 py-1>
        <v-select
          label="Country"
          :items="countries"
          item-text="name"
          item-value="code"
          v-model="country_code"
          :error-messages="errorMessages('country_code')"
          @input="handleInput()"
          @blur="handleBlur('country_code')"
          :disabled="shippingCountryCodeLocked">
        </v-select>
      </v-flex>
      <v-flex xs6 px-2 py-1>
        <v-text-field
          label="State"
          v-model="state_code"
          :error-messages="errorMessages('state_code')"
          @input="handleInput()"
          @blur="handleBlur('state_code')">
        </v-text-field>
      </v-flex>
      <v-flex xs6 px-2 py-1>
        <v-text-field
          label="Zip code"
          v-model="zip_code"
          :error-messages="errorMessages('zip_code')"
          @input="handleInput()"
          @blur="handleBlur('zip_code')">
        </v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field
          label="Phone"
          v-model="phone"
          :error-messages="errorMessages('phone')"
          @input="handleInput()"
          @blur="handleBlur('phone')">
        </v-text-field>
      </v-flex>
      <v-flex xs12 py-2></v-flex>
    </template>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import { addressMixin } from '@/mixins/addressMixin'
import { mapFields } from 'vuex-map-fields'

export default {
  mixins: [addressMixin],
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
      'order.shipping_address.phone'
    ])
  },
  methods: {
    updateAddressInvalid () {
      this.invalid_shipping_address = this.ship_to_different_address && this.$v.$invalid
    },
    handleChange () {
      this.updateAddressInvalid()
    },
    handleInput () {
      this.updateAddressInvalid()
    }
  },
  mounted () {
    this.updateAddressInvalid()
  }
}
</script>

<style>
  .shipping-address {
    margin-bottom: 1rem;
  }
</style>
