<template>
  <div class="order-summary">
    <h2 class="order-summary-title">
      <a v-if="viewCartLink" @click="toggleCart()">
        {{ viewCartLabel | capitalize }}
      </a>
      <span v-if="!viewCartLink">
        {{ $t('your_cart') | capitalize }}
      </span>
      <span class="order-summary-title-total">
        {{ order.formatted_total_amount_with_taxes }}
      </span>
    </h2>
    <div class="order-summary-content" v-show="viewCart">
      <v-subheader>
        {{ $t('order') | capitalize }} #{{ order.number }} ({{ order.skus_count }} {{ $tc('item', order.skus_count)}})
      </v-subheader>
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
  </div>
</template>

<script>
import _ from 'lodash'
import OrderSummaryLineItem from '@/components/OrderSummaryLineItem'
import OrderSummarySubtotal from '@/components/OrderSummarySubtotal'
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
      return this.viewCart ? this.$t('hide_cart') : this.$t('view_cart')
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

  .order-summary {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .order-summary-content {
    margin-top: 1rem;
    border-top: 1px solid $v-border;

    .v-subheader {
      padding: 0;
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
