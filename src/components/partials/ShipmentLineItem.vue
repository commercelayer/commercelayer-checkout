<template>
  <div class="shipment-line-item body-2">
    <v-container>
      <v-layout row>
        <v-flex shrink px-2 py-1>
          <v-img :src="shipment_line_item.line_item.image_url" aspect-ratio="1" width="50" />
        </v-flex>
        <v-flex grow px-2 py-1>
          <div class="name">{{ shipment_line_item.line_item.name }}</div>
          <div class="sku-code">{{ shipment_line_item.line_item.sku_code }}</div>
          <div
            class="quantity"
          >{{ $t('generic.quantity') | capitalize }}: {{ shipment_line_item.quantity }}</div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    shipment_line_item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.shipment-line-item {
  &:not(:last-child) {
    border-bottom: 1px solid $v-border;
  }
  .name {
    font-weight: bolder;
  }
}
</style>
