<template>
  <div :class="{subtotal: true, total: total}">
    <v-container>
      <v-layout row>
        <v-flex xs6 offset-xs3>
          <div class="label">{{ $t(`order_summary.${label}`) | capitalize }}</div>
          <div class="hint" v-show="showHint">{{ hint }}</div>
        </v-flex>
        <v-flex xs3>
          <div
            :class="{amount: true, discounted: isDiscounted}"
            :id="amountId"
          >{{ formattedAmount }}</div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    hint: {
      type: String,
      required: false
    },
    showHint: {
      type: Boolean,
      required: false
    },
    formattedAmount: {
      type: String,
      required: true
    },
    amountFloat: {
      type: Number,
      required: true
    },
    total: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    amountId () {
      return `order-summary-${this.label}-amount`
    },
    isDiscounted () {
      return this.amountFloat < 0
    }
  }
}
</script>

<style lang="scss" scoped>
.hint {
  font-size: 0.8rem;
  color: #999;
}
.discounted {
  color: $SUCCESS_COLOR;
}
.subtotal {
  border-top: 1px solid $v-border;
}
.amount {
  text-align: right;
}
.total {
  font-weight: bolder;
  font-size: 1.3rem;
}
</style>
