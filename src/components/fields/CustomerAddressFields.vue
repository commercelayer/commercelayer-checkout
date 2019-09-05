<template>
  <v-flex xs12 md6 py-2>
    <v-layout>
      <v-flex shrink>
        <v-radio :value="customer_address.address.id"></v-radio>
      </v-flex>
      <v-flex>
        <Address :address="customer_address.address" :billing="billing" />
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import Address from '@/components/partials/Address'

export default {
  props: {
    customer_address: {
      type: Object,
      required: true
    },
    billing: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  components: {
    Address
  }
}
</script>

<style lang="scss" scoped>
.v-radio {
  margin-right: 2px;
}
</style>
