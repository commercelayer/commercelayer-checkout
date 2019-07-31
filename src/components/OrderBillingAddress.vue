<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="First name" v-model="first_name"></v-text-field>
    </v-flex>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="Last name" v-model="last_name"></v-text-field>
    </v-flex>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="Address" v-model="line_1"></v-text-field>
    </v-flex>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="Address Line 2" v-model="line_2"></v-text-field>
    </v-flex>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="City" v-model="city"></v-text-field>
    </v-flex>
    <v-flex xs12 sm3 pa-2>
      <v-text-field label="Zipcode" v-model="zip_code"></v-text-field>
    </v-flex>
    <v-flex xs12 sm3 pa-2>
      <v-text-field label="State" v-model="state_code"></v-text-field>
    </v-flex>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="Country" v-model="country_code"></v-text-field>
    </v-flex>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="Phone" v-model="phone"></v-text-field>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-checkbox label="Ship to this address" input-value="true"></v-checkbox>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
export default {
  computed: {
    ...mapFields([
      'order.billing_address.first_name',
      'order.billing_address.last_name',
      'order.billing_address.line_1',
      'order.billing_address.line_2',
      'order.billing_address.city',
      'order.billing_address.zip_code',
      'order.billing_address.state_code',
      'order.billing_address.country_code',
      'order.billing_address.phone'
    ])    
  }
}
</script>

<style>

</style>
