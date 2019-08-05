<template>
  <div class="shipment">
    <div class="shipment-header">
      {{ $t('generic.shipment') | capitalize }} {{count}} {{ $t('generic.of') }} {{total}}
    </div>
    <v-divider></v-divider>
    <ShipmentLineItem
      v-for="shipment_line_item in shipment.shipment_line_items"
      :key="shipment_line_item.id"
      :shipment_line_item="shipment_line_item"
      />
    <v-radio-group v-model="shipment.shipping_method">
      <v-radio
        v-for="shipping_method in sortedAvailableShippingMethods"
        :key="shipping_method.id"
        :label="shippingMethodLabel(shipping_method)"
        :value="shipping_method"
        color="primary"
        @change="handleChange(shipping_method)"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import _ from 'lodash'
import ShipmentLineItem from '@/components/partials/ShipmentLineItem'

import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  components: {
    ShipmentLineItem
  },
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
      this.invalid_shipments = !_.isEmpty(_.find(this.order.shipments, (shipment) => {
        return _.isEmpty(shipment.shipping_method)
      }))
    },
    shippingMethodLabel: shippingMethod => {
      return `${shippingMethod.name} - ${shippingMethod.formatted_price_amount}`
    },
    handleChange (shippingMethod) {
      let payload = {
        order: this.order,
        shipment: this.shipment,
        shippingMethod: shippingMethod
      }
      this.$store.dispatch('setShipmentShippingMethod', payload)
        .then(() => {
          this.updateValidations()
        })
    }
  },
  computed: {
    sortedAvailableShippingMethods () {
      return _.sortBy(this.shipment.available_shipping_methods, ['price_amount_cents'])
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
  .v-divider {
    margin-bottom: 1rem;
  }
</style>
