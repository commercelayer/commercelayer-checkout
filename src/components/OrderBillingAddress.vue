<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 px-2 py-1>
      <v-text-field
        label="First name"
        v-model="first_name"
        :error-messages="errorMessages('first_name')"
        @blur="handleBlur('first_name')">
      </v-text-field>
    </v-flex>
    <v-flex xs12 sm6 px-2 py-1>
      <v-text-field
        label="Last name"
        v-model="last_name"
        :error-messages="errorMessages('last_name')"
        @blur="handleBlur('last_name')">
      </v-text-field>
    </v-flex>
    <v-flex xs12 sm6 px-2 py-1>
      <v-text-field
        label="Address"
        v-model="line_1"
        :error-messages="errorMessages('line_1')"
        @blur="handleBlur('line_1')">
      </v-text-field>
    </v-flex>
    <v-flex xs12 sm6 px-2 py-1>
      <v-text-field
        label="City"
        v-model="city"
        :error-messages="errorMessages('city')"
        @blur="handleBlur('city')">
      </v-text-field>
    </v-flex>
    <v-flex xs12 sm6 px-2 py-1>
      <v-select
        label="Country"
        :items="countries"
        item-text="name"
        item-value="code"
        v-model="country_code"
        @change="updateShipToDifferentAddressRequired">
        </v-select>
    </v-flex>
    <v-flex xs12 sm6 px-2 py-1>
      <v-text-field
        label="State"
        v-model="state_code"
        :error-messages="errorMessages('state_code')"
        @blur="handleBlur('state_code')">
      </v-text-field>
    </v-flex>
    <v-flex xs12 sm6 px-2 py-1>
      <v-text-field
        label="Zip code"
        v-model="zip_code"
        :error-messages="errorMessages('zip_code')"
        @blur="handleBlur('zip_code')">
      </v-text-field>
    </v-flex>
    <v-flex xs12 sm6 px-2 py-1>
      <v-text-field
        label="Phone"
        v-model="phone"
        :error-messages="errorMessages('phone')"
        @blur="handleBlur('phone')">
      </v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import { addressMixin } from '@/mixins/addressMixin'
import { mapFields } from 'vuex-map-fields'

export default {
  mixins: [addressMixin],
  computed: {
    ...mapFields([
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
      'order.billing_address.phone'
    ])
  },
  methods: {
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

<style>

</style>
