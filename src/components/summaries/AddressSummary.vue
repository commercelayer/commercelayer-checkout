<template>
  <v-layout wrap class="address body-2">
    <v-flex xs12>
      <v-layout>
        <v-flex shrink>
          <v-icon :small="true">place</v-icon>
        </v-flex>
        <v-flex>
          <Address :address="address" :billing="billing" />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Address from '@/components/partials/Address'

export default {
  components: {
    Address
  },
  props: {
    address: {
      type: Object,
      required: true
    },
    billing: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.v-icon {
  margin-right: 8px;
}
</style>
