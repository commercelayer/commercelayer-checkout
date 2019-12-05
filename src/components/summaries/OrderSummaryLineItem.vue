<template>
  <div class="line-item body-2">
    <v-container>
      <v-layout row>
        <v-flex xs3>
          <v-img :src="line_item.image_url || ''" aspect-ratio="1" width="75" />
        </v-flex>
        <v-flex xs6>
          <div class="name">{{ line_item.name }}</div>
          <div class="sku-code">{{ line_item.sku_code }}</div>
          <div class="quanity">{{ $t('generic.quantity') | capitalize }}: {{ line_item.quantity }}</div>
        </v-flex>
        <v-flex xs3>
          <div class="amount">{{ line_item.formatted_total_amount }}</div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    line_item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.line-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  &:not(:last-child) {
    border-bottom: 1px solid $v-border;
  }
  .name {
    font-weight: bolder;
  }
  .amount {
    text-align: right;
  }
}
</style>
