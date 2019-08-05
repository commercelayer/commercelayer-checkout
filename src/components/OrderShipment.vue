<template>
  <div class="shipment">
    <v-subheader>
      {{ $t('generic.shipment') | capitalize }} {{count}} {{ $t('generic.of') }} {{total}}
    </v-subheader>
    <v-divider></v-divider>
    <OrderShipmentLineItem
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
        @change="handleChange(shipping_method)"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import _ from 'lodash'
import OrderShipmentLineItem from '@/components/OrderShipmentLineItem'

import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  components: {
    OrderShipmentLineItem
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
  .v-divider {
    margin-bottom: 1rem;
  }
</style>