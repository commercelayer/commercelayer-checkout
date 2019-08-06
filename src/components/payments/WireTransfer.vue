<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('wire_transfer')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="wire_transfers_radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit eligendi natus odit ullam, minima ipsa tempore voluptates harum perferendis a doloribus quia hic id voluptatum amet labore expedita sit itaque.
    </div>
  </div>
</template>

<script>
import { paymentMethodMixin } from '@/mixins/paymentMethodMixin'
export default {
  mixins: [paymentMethodMixin],
  methods: {
    handlePayment () {
      console.log('handle wire transfer payment')
    }
  }
}
</script>

<style>

</style>
