<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" :edit-icon="editIcon">
      Customer
      <small>filippo.conforti@gmail.com</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <OrderCustomer />
      <v-btn color="primary" @click="nextStep" :block="isMobile">Continue to billing</v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import OrderCustomer from '@/components/OrderCustomer'

export default {
  components: {
    OrderCustomer
  },
  mixins: [checkoutStepMixin]
}
</script>

<style>

</style>
