<template>
  <div class="order-summary">
    <h2 class="order-summary-title" v-if="!viewCartLink">
      {{ $t('order_summary.title') | capitalize }}
      <span class="order-summary-title-total">
        {{ order.formatted_total_amount_with_taxes }}
      </span>
    </h2>
    <div class="order-summary-toggle" v-if="viewCartLink">
      <a @click="toggleCart()">
        {{ viewCartLabel | capitalize }}
      </a>
      <span class="order-summary-title-total">
        {{ order.formatted_total_amount_with_taxes }}
      </span>
    </div>
    <div class="order-summary-content" v-show="viewCart">
      <div class="order-summary-header">
        {{ $t('order_summary.number') | capitalize }}: #{{ order.number }}
        <span v-if="order.cart_url" class="edit-cart">
          &mdash; <a :href="order.cart_url">{{ $t('generic.edit') }}</a>
        </span>
      </div>
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
        <OrderSummarySubtotal label="total" :amount="order.formatted_total_amount_with_taxes" :total="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import OrderSummaryLineItem from '@/components/summaries/OrderSummaryLineItem'
import OrderSummarySubtotal from '@/components/summaries/OrderSummarySubtotal'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      viewCart: false
    }
  },
  components: {
    OrderSummaryLineItem,
    OrderSummarySubtotal
  },
  computed: {
    viewCartLink () {
      return this.$vuetify.breakpoint.smAndDown
    },
    viewCartLabel () {
      return this.viewCart ? this.$t('order_summary.hide') : this.$t('order_summary.show')
    },
    skuLineItems () {
      return _.filter(this.order.line_items, { item_type: 'skus' })
    },
    ...mapState(['order'])
  },
  methods: {
    toggleCart () {
      this.viewCart = !this.viewCart
    }
  },
  mounted () {
    this.viewCart = this.$vuetify.breakpoint.mdAndUp
  }
}

</script>

<style lang="scss" scoped>
  .order-summary-title-total {
    float: right;
  }
  .order-summary-toggle {
    font-size: 1.2rem;
    .order-summary-title-total {
      font-weight: bolder;
    }
  }
  .order-summary {
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
  .order-summary-content {
    margin-top: 1rem;
    border-top: 1px solid $v-border;

    .order-summary-header {
      margin: 1rem 0 2rem;
    }
    .line-items {
      margin: 1rem 0;
    }
  }
  .md-and-up {
    .order-summary {
      padding: 2rem;
    }
  }
</style>
