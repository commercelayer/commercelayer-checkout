<template>
  <div class="order-summary">
    <h2>{{ $t('order') | capitalize }} #{{ order.number }} ({{ order.skus_count }} {{ $tc('item', order.skus_count)}})</h2>
    <div class="line-items">
      <OrderSummaryLineItem
        v-for="line_item in skuLineItems"
        :line_item="line_item"
        :key="line_item.id"
        />
    </div>
    <div class="subtotals">
      <OrderSummarySubtotal label="subtotal" :amount="order.formatted_subtotal_amount" />
      <OrderSummarySubtotal label="discount" :amount="order.formatted_discount_amount" />
      <OrderSummarySubtotal label="shipping" :amount="order.formatted_shipping_amount" />
      <OrderSummarySubtotal label="payment_method" :amount="order.formatted_payment_method_amount" />
      <OrderSummarySubtotal label="taxes" :amount="order.formatted_total_tax_amount" />
      <OrderSummarySubtotal label="order_total" :amount="order.formatted_total_amount_with_taxes" :total="true"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import OrderSummaryLineItem from '@/components/OrderSummaryLineItem'
import OrderSummarySubtotal from '@/components/OrderSummarySubtotal'
import { mapState } from 'vuex'

export default {
  components: {
    OrderSummaryLineItem,
    OrderSummarySubtotal
  },
  computed: {
    skuLineItems () {
      return _.filter(this.order.line_items, { item_type: 'skus' })
    },
    ...mapState(['order'])
  }
}

</script>

<style lang="scss" scoped>
  .order-summary {
    padding: 2rem;

    .line-items {
      margin: 2rem 0;
    }
  }
</style>
