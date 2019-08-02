<template>
  <div class="shipment">
    <v-subheader>Shipment {{count}} of {{total}} ({{ shipment.skus_count }} {{ $tc('item', shipment.skus_count)}})</v-subheader>
    <v-divider></v-divider>
    <OrderShipmentLineItem
      v-for="shipment_line_item in shipment.shipment_line_items"
      :key="shipment_line_item.id"
      :shipment_line_item="shipment_line_item"
      />
    <v-radio-group v-model="shipment.shipping_method">
      <v-radio
        v-for="shipping_method in shipment.available_shipping_methods"
        :key="shipping_method.id"
        :label="shippingMethodLabel(shipping_method)"
        :value="shipping_method"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import _ from 'lodash'
import OrderShipmentLineItem from '@/components/OrderShipmentLineItem'

export default {
  components: {
    OrderShipmentLineItem
  },
  props: {
    shipment: {
      type: Object,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  methods: {
    shippingMethodLabel: shippingMethod => {
      return `${shippingMethod.name} (${shippingMethod.formatted_price_amount})`
    }
  }
}
</script>

<style>
  .v-divider {
    margin-bottom: 1rem;
  }
</style>
