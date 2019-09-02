<template>
  <div class="coupon-field">
    <v-container>
      <v-layout row>
        <v-flex xs9 offset-xs3>
          <v-text-field
            id="coupon-code"
            :label="$t('order_summary.coupon_code')"
            v-model="coupon_code"
            :append-icon="appendIcon"
            @click:append="applyCoupon"
            :error="inputError"
            :error-messages="$t(errors.apply_coupon)"
            v-show="!notifications.coupon_applied"
            outlined
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
export default {
  computed: {
    appendIcon () {
      if (this.coupon_applied) return 'mdi-check'
      return _.isEmpty(this.coupon_code) ? '' : 'mdi-arrow-right'
    },
    inputError () {
      return !_.isEmpty(this.errors.apply_coupon)
    },
    ...mapState(['errors', 'notifications']),
    ...mapFields(['order.coupon_code'])
  },
  methods: {
    applyCoupon () {
      this.$store.dispatch('setOrderCouponCode')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
