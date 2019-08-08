<template>
  <div class="shipment-summary">
    {{ shipment.skus_count }} {{ $tc('generic.item', shipment.skus_count)}} &mdash;
    {{ shipment.shipping_method.name }} &mdash;
    {{ shipment.shipping_method.formatted_price_amount }}
  </div>
</template>

<script>
export default {
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
  }
}
</script>

<style scoped>
.shipment-summary {
  margin-bottom: 0.5rem;
}
</style>
