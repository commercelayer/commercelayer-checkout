<template>
  <div>
    <v-subheader>Shipment {{ shipment.number }}</v-subheader>
    <v-layout row wrap>
      <v-radio-group v-model="shipment.shipping_method.id">
        <v-radio
          v-for="shipping_method in shipment.available_shipping_methods"
          :key="shipping_method.id"
          :label="shipping_method.name"
          :value="shipping_method.id"
        ></v-radio>
      </v-radio-group>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    shipment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
