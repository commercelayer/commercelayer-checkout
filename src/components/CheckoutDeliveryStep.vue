<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" :edit-icon="editIcon">
      Delivery options
      <small>Review shipments and select a shipping method.</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <OrderShipment v-for="shipment in shipments" :shipment="shipment" :key="shipment.id" />
      <v-card-actions>
        <v-btn color="primary" @click="nextStep" :block="isMobile">Continue to payment</v-btn>
      </v-card-actions>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import { mapMultiRowFields } from 'vuex-map-fields'
import OrderShipment from '@/components/OrderShipment'
export default {
  components: {
    OrderShipment
  },
  mixins: [checkoutStepMixin],
  computed: {
    ...mapMultiRowFields([
      'order.shipments'
    ])
  }
}
</script>

<style>

</style>
