<template>
  <v-layout row wrap>
    <v-flex xs12 pa-2>
      <v-checkbox label="Ship to different address"
        v-model="ship_to_different_address"
        :disabled="ship_to_different_address_required">
        </v-checkbox>
    </v-flex>
    <template v-if="ship_to_different_address">
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field label="First name" v-model="first_name"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field label="Last name" v-model="last_name"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field label="Address" v-model="line_1"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field label="City" v-model="city"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-select label="Country"
          :items="countries"
          item-text="name"
          item-value="code"
          v-model="country_code"
          :disabled="shippingCountryCodeLocked">
          </v-select>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field label="State" v-model="state_code"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field label="Zip code" v-model="zip_code"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 px-2 py-1>
        <v-text-field label="Phone" v-model="phone"></v-text-field>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'
import countries from '@/data/countries'

export default {
  computed: {
    countries () {
      return countries
    },
    shippingCountryCodeLocked () {
      return !_.isEmpty(this.shipping_country_code_lock)
    },
    ...mapFields([
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
  }
}
</script>

<style>
</style>
