<template>
  <div class="order-summary">
    <h2 class="order-summary-title" v-if="!viewCartLink">
      {{ $t('order_summary.title') | capitalize }}
      <span
        class="order-summary-title-total"
      >{{ order.formatted_total_amount_with_taxes }}</span>
    </h2>
    <div class="order-summary-toggle" v-if="viewCartLink">
      <a @click="toggleCart()">{{ viewCartLabel | capitalize }}</a>
      <span class="order-summary-title-total">{{ order.formatted_total_amount_with_taxes }}</span>
    </div>
    <div class="order-summary-content" v-show="viewCart">
      <div class="order-summary-header">
        {{ $t('order_summary.number') | capitalize }}: #{{ order.number }}
        <span
          v-if="editCartLink"
          class="edit-cart"
        >
          &mdash;
          <a :href="order.cart_url">{{ $t('generic.edit') }}</a>
        </span>
      </div>
      <div class="line-items">
        <OrderSummaryLineItem
          v-for="line_item in skuLineItems"
          :line_item="line_item"
          :key="line_item.id"
        />
      </div>
      <div class="coupon" v-if="order.editable">
        <OrderSummaryCoupon />
      </div>
      <div class="subtotals">
        <OrderSummarySubtotal
          label="subtotal"
          :formattedAmount="order.formatted_subtotal_amount"
          :amountFloat="order.subtotal_amount_float"
        />
        <OrderSummarySubtotal
          label="discount"
          :formattedAmount="order.formatted_discount_amount"
          :amountFloat="order.discount_amount_float"
          :showHint="notifications.coupon_applied"
          :hint="order.coupon_code"
        />
        <OrderSummarySubtotal
          label="shipping"
          :formattedAmount="order.formatted_shipping_amount"
          :amountFloat="order.shipping_amount_float"
        />
        <OrderSummarySubtotal
          label="payment_method"
          :formattedAmount="order.formatted_payment_method_amount"
          :amountFloat="order.payment_method_amount_float"
        />
        <OrderSummarySubtotal
          label="taxes"
          :formattedAmount="order.formatted_total_tax_amount"
          :amountFloat="order.total_tax_amount_float"
        />
        <OrderSummarySubtotal
          label="total"
          :formattedAmount="order.formatted_total_amount_with_taxes"
          :amountFloat="order.total_amount_with_taxes_float"
          :total="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import OrderSummaryLineItem from '@/components/summaries/OrderSummaryLineItem'
import OrderSummaryCoupon from '@/components/summaries/OrderSummaryCoupon'
import OrderSummarySubtotal from '@/components/summaries/OrderSummarySubtotal'
import { mapState } from 'vuex'

export default {
  props: {
    editable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      viewCart: false
    }
  },
  components: {
    OrderSummaryLineItem,
    OrderSummaryCoupon,
    OrderSummarySubtotal
  },
  computed: {
    viewCartLink () {
      return this.$vuetify.breakpoint.smAndDown
    },
    editCartLink () {
      return !_.isEmpty(this.order.cart_url) && this.order.editable
    },
    viewCartLabel () {
      return this.viewCart
        ? this.$t('order_summary.hide')
        : this.$t('order_summary.show')
    },
    skuLineItems () {
      return _.filter(this.order.line_items, { item_type: 'skus' })
    },
    ...mapState(['order', 'notifications'])
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
}
.md-and-up {
  .order-summary {
    padding: 2rem;
  }
}
</style>
