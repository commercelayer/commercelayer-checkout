<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" :edit-icon="editIcon" :rules="rules">
      {{ $t('steps.delivery.title') | capitalize }}
      <small>{{ $t('steps.delivery.hint') | capitalize }}</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <OrderShipment
        v-for="(shipment, index) in shipments"
        :shipment="shipment"
        :key="shipment.id"
        :count="index+1"
        :total="shipments.length"
        />
      <v-btn
        color="primary"
        @click="nextStep"
        :block="isMobile"
        :disabled="disabled">
          {{ $t('steps.delivery.button') }}
      </v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import _ from 'lodash'
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import { mapMultiRowFields } from 'vuex-map-fields'
import { mapState } from 'vuex'
import OrderShipment from '@/components/OrderShipment'

export default {
  components: {
    OrderShipment
  },
  mixins: [checkoutStepMixin],
  computed: {
    rules () {
      return [() => {
        _.forEach(this.$store.state.order.shipments, shipment => {
          if (_.isEmpty(shipment.available_shipping_methods)) return false
        })
        return true
      }]
    },
    disabled () {
      return this.validations.invalid_shipments
    },
    ...mapState(['validations']),
    ...mapMultiRowFields([
      'order.shipments'
    ])
  }
}
</script>

<style>

</style>
