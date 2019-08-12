<template>
  <div :class="{subtotal: true, total: total}">
    <v-container>
      <v-layout row>
        <v-flex xs6 offset-xs3>{{ $t(`order_summary.${label}`) | capitalize }}</v-flex>
        <v-flex xs3>
          <div class="amount">{{ amount }}</div>
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
    amount: {
      type: String,
      required: true
    },
    total: {
      type: Boolean,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
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
