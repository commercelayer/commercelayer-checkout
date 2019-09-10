<template>
  <div class="shipment">
    <ShipmentSummary :shipment="shipment" :count="count" :total="total" :editable="true" />
    <v-radio-group :value="shippingMethodId">
      <v-radio
        class="available-shipping-method"
        v-for="shipping_method in sortedAvailableShippingMethods"
        :key="shipping_method.id"
        :label="shippingMethodLabel(shipping_method)"
        :value="shipping_method.id"
        color="primary"
        @change="handleChange(shipping_method)"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import _ from 'lodash'
import ShipmentSummary from '@/components/summaries/ShipmentSummary'

import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { stepMixin } from '@/mixins/stepMixin'

export default {
  components: {
    ShipmentSummary
  },
  mixins: [stepMixin],
  props: {
    shipment: {
      type: Object,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  methods: {
    updateValidations () {
      this.invalid_shipments = !_.isEmpty(
        _.find(this.order.shipments, shipment => {
          return _.isEmpty(shipment.shipping_method)
        })
      )
    },
    shippingMethodLabel: shippingMethod => {
      return `${shippingMethod.name} - ${shippingMethod.formatted_price_amount_for_shipment}`
    },
    handleChange (shippingMethod) {
      let payload = {
        order: this.order,
        shipment: this.shipment,
        shippingMethod: shippingMethod
      }
      this.$store.dispatch('setShipmentShippingMethod', payload).then(() => {
        this.trackDeliveryOption(shippingMethod.name)
        this.updateValidations()
      })
    }
  },
  computed: {
    sortedAvailableShippingMethods () {
      return _.sortBy(this.shipment.available_shipping_methods, [
        'price_amount_for_shipment_cents'
      ])
    },
    shippingMethodId () {
      return this.shipment.shipping_method
        ? this.shipment.shipping_method.id
        : null
    },
    ...mapState(['order']),
    ...mapFields(['validations.invalid_shipments'])
  },
  mounted () {
    this.updateValidations()
  }
}
</script>

<style lang="scss">
.shipment-header {
  margin-bottom: 0.5rem;
}
</style>
