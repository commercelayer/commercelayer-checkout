<template>
  <v-expansion-panel-content>
    <template v-slot:header>
      <div>{{ slotHeaderLabel }}</div>
    </template>
    <v-card>
      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </v-card-text>
      <v-radio-group v-model="shipment.shipping_method.id">
        <v-radio
          v-for="shipping_method in shipment.available_shipping_methods"
          :key="shipping_method.id"
          :label="shipping_method.name"
          :value="shipping_method.id"
        ></v-radio>
      </v-radio-group>
    </v-card>
  </v-expansion-panel-content>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    shipment: {
      type: Object,
      required: true
    }
  },
  computed: {
    slotHeaderLabel () {
      return _.isEmpty(this.shipment.shipping_method) ? 'Select a shipping method' : this.shipment.shipping_method.name
    }
  }
}
</script>

<style>

</style>
