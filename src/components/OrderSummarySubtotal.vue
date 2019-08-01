<template>
  <div :class="{subtotal: true, total: total}">
    <v-layout row>
      <v-flex xs6 offset-xs3>
        {{ $t(label) | capitalize }}
      </v-flex>
      <v-flex xs3>
        <div class="amount">
          {{ amount }}
        </div>
      </v-flex>
    </v-layout>
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
    margin-top: 1rem;
    padding-top: 1rem;
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
