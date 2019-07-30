<template>
  <v-stepper v-model="e6" vertical>
    <v-stepper-step :complete="e6 > 1" step="1" :editable="e6 > 1" edit-icon="$vuetify.icons.complete">
      Customer
      <small>filippo.conforti@gmail.com</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <form>
        <v-text-field label="Email"></v-text-field>
      </form>
      <v-btn color="primary" @click="e6 = 2" :block="isMobile">Continue to billing</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 2" step="2" :editable="e6 > 2" edit-icon="$vuetify.icons.complete">
      Billing & Shipping
      <small>Add your billing and shipping addresses.</small>
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-layout row wrap>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="First name"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="Last name"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="Address"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="Address Line 2"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="City"></v-text-field>
        </v-flex>
        <v-flex xs12 sm3 pa-2>
          <v-text-field label="Zipcode"></v-text-field>
        </v-flex>
        <v-flex xs12 sm3 pa-2>
          <v-text-field label="State"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="Country"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="Phone"></v-text-field>
        </v-flex>
        <v-flex xs12 pa-2>
          <v-checkbox label="Ship to this address" input-value="true"></v-checkbox>
        </v-flex>
      </v-layout>

      <v-btn color="primary" @click="e6 = 3" :block="isMobile">Continue to delivery</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 3" :editable="e6 > 3" step="3" edit-icon="$vuetify.icons.complete">
      Delivery options
      <small>Review shipments and select a shipping method.</small>
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-btn color="primary" @click="e6 = 4" :block="isMobile">Continue to payment</v-btn>
    </v-stepper-content>

    <v-stepper-step step="4">
      Payment
      <small>Add a payment method and place the order.</small>
    </v-stepper-step>
    <v-stepper-content step="4">
      <v-btn color="primary" @click="e6 = 1" :block="isMobile">Place order</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
  import store from '@/store'

  export default {
    data () {
      return {
        e6: 1
      }
    },
    computed: {
      isMobile () {
        return this.$vuetify.breakpoint.xs
      }
    }
  }
</script>

<style>
</style>
