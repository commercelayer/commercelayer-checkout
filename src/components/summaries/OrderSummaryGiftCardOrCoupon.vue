<template>
  <div class="gift-card-or-coupon-field">
    <v-container>
      <v-layout row>
        <v-flex xs9 offset-xs3>
          <v-text-field
            id="gift-card-or-coupon-code"
            :label="$t('order_summary.gift_card_or_coupon_code')"
            v-model="gift_card_or_coupon_code"
            :append-icon="appendIcon"
            @click:append="applyCoupon"
            :error="inputError"
            :error-messages="$t(errors.apply_gift_card_or_coupon)"
            v-show="!notifications.gift_card_or_coupon_applied"
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
      if (this.gift_card_or_coupon_applied) return 'mdi-check'
      return _.isEmpty(this.gift_card_or_coupon_code) ? '' : 'mdi-arrow-right'
    },
    inputError () {
      return !_.isEmpty(this.errors.apply_gift_card_or_coupon)
    },
    ...mapState(['errors', 'notifications']),
    ...mapFields(['order.gift_card_or_coupon_code'])
  },
  methods: {
    applyCoupon () {
      this.$store.dispatch('setOrderGiftCardOrCouponCode')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
