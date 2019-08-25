<template>
  <div class="shipment-summary">
    <div
      class="shipment-header"
    >{{ $t('generic.shipment') | capitalize }} {{count}} {{ $t('generic.of') }} {{total}}</div>
    <v-divider></v-divider>
    <ShipmentLineItem
      v-for="shipment_line_item in shipment.shipment_line_items"
      :key="shipment_line_item.id"
      :shipment_line_item="shipment_line_item"
    />
    <div class="shipping-method-details" v-if="!editable">{{ shipment.shipping_method.name }}</div>
  </div>
</template>

<script>
import ShipmentLineItem from '@/components/partials/ShipmentLineItem'

export default {
  components: {
    ShipmentLineItem
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
    },
    editable: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.shipment-summary {
  margin-bottom: 2rem;
}
.shipment-header {
  font-weight: bolder;
}
.shipping-method-details {
  padding: 1rem 0;
}
</style>
