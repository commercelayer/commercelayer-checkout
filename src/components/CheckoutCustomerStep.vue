<template>
  <div>
    <v-stepper-step :complete="complete" :step="step" :editable="complete" :edit-icon="editIcon">
      Customer
      <small>filippo.conforti@gmail.com</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <form>
        <v-text-field label="Email"></v-text-field>
      </form>
      <v-btn color="primary" @click="nextStep" :block="isMobile">Continue to billing</v-btn>
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
