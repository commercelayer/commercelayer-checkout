<template>
  <div>
    <v-stepper-step :complete="complete" :step="step" :editable="complete" :edit-icon="editIcon">
      Billing & Shipping
      <small>Add your billing and shipping addresses.</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
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

      <v-btn color="primary" @click="nextStep" :block="isMobile">Continue to delivery</v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
export default {
  mixins: [checkoutStepMixin]
}
</script>

<style>

</style>
