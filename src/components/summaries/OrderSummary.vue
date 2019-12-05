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
        <OrderSummaryLineItem
          v-for="line_item in giftCardLineItems"
          :line_item="line_item"
          :key="line_item.id"
        />
      </div>
      <div class="coupon" v-if="showGiftCardOrCoupon">
        <OrderSummaryGiftCardOrCoupon />
      </div>
      <div class="subtotals">
        <OrderSummarySubtotal
          label="subtotal"
          id="order-summary-subtotal"
          :formattedAmount="order.formatted_subtotal_amount"
          :amountFloat="order.subtotal_amount_float"
        />
        <OrderSummarySubtotal
          label="discount"
          id="order-summary-discount-total"
          :formattedAmount="order.formatted_discount_amount"
          :amountFloat="order.discount_amount_float"
        />
        <OrderSummarySubtotal
          label="shipping"
          id="order-summary-shipping"
          :formattedAmount="order.formatted_shipping_amount"
          :amountFloat="order.shipping_amount_float"
        />
        <OrderSummarySubtotal
          label="payment_method"
          id="order-summary-payment-method"
          :formattedAmount="order.formatted_payment_method_amount"
          :amountFloat="order.payment_method_amount_float"
        />
        <OrderSummarySubtotal
          label="taxes"
          id="order-summary-taxes"
          :formattedAmount="order.formatted_total_tax_amount"
          :amountFloat="order.total_tax_amount_float"
        />
        <OrderSummarySubtotal
          label="gift_card"
          id="order-summary-gift-card"
          :formattedAmount="order.formatted_gift_card_amount"
          :amountFloat="order.gift_card_amount_float"
        />
        <OrderSummarySubtotal
          label="total"
          id="order-summary-total"
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
import OrderSummaryGiftCardOrCoupon from '@/components/summaries/OrderSummaryGiftCardOrCoupon'
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
    OrderSummaryGiftCardOrCoupon,
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
    showGiftCardOrCoupon () {
      return (
        this.order.editable &&
        process.env.VUE_APP_HIDE_GIFT_CARD_OR_COUPON !== 'TRUE'
      )
    },
    skuLineItems () {
      return _.filter(this.order.line_items, { item_type: 'skus' })
    },
    giftCardLineItems () {
      console.log(this.order.line_items)
      return _.filter(this.order.line_items, lineItem => {
        return (
          lineItem.item_type === 'gift_cards' && lineItem.total_amount_float > 0
        )
      })
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
