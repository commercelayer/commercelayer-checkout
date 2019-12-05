<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" edit-icon="done">
      <div>
        {{ $t('steps.delivery.title') | capitalize }}
        <span v-if="complete">
          &mdash;
          <a>{{ $t('generic.edit') }}</a>
        </span>
      </div>
      <small>{{ $t('steps.delivery.hint') | capitalize }}</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <ShipmentFields
        v-for="(shipment, index) in shipments"
        :shipment="shipment"
        :key="shipment.id"
        :count="index+1"
        :total="shipments.length"
      />
      <v-btn
        id="delivery-step-submit"
        color="primary"
        @click="submit()"
        :block="isMobile"
        :disabled="disabled"
        :loading="buttons.loading_delivery"
      >{{ submitLabel }}</v-btn>

      <div
        class="order-error"
        id="place-order-error"
        v-show="errors.place_order"
        v-if="!requires_payment"
      >{{ errors.place_order }}</div>
    </v-stepper-content>

    <div class="step-summary" v-if="complete">
      <ShipmentSummary
        v-for="(shipment, index) in shipments"
        :shipment="shipment"
        :key="shipment.id"
        :count="index+1"
        :total="shipments.length"
        :editable="false"
      />
    </div>
  </div>
</template>

<script>
import { stepMixin } from '@/mixins/stepMixin'
import { mapMultiRowFields } from 'vuex-map-fields'
import { mapState } from 'vuex'
import ShipmentFields from '@/components/fields/ShipmentFields'
import ShipmentSummary from '@/components/summaries/ShipmentSummary'

export default {
  components: {
    ShipmentFields,
    ShipmentSummary
  },
  mixins: [stepMixin],
  computed: {
    disabled () {
      return this.validations.invalid_shipments
    },
    submitLabel () {
      return this.requires_payment
        ? this.$t('buttons.continue_to_payment')
        : this.$t('buttons.place_order')
    },
    ...mapState(['validations', 'buttons', 'errors', 'requires_payment']),
    ...mapMultiRowFields(['order.shipments'])
  },
  methods: {
    submit () {
      if (this.requires_payment) {
        this.nextStep()
      } else {
        this.$store.dispatch('placeOrder')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shipment-summary {
  &:last-child {
    margin-bottom: 1.5rem;
  }
}
</style>
