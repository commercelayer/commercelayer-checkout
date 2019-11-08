<template>
  <div>
    <v-card>
      <div>
        <header>
          <svg
            version="1.1"
            id="animated-tick"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 110 110"
            style="enable-background:new 0 0 110 110;"
            xml:space="preserve"
          >
            <polyline class="tick" points="85,30 51,80 25,61.3 " />
            <circle class="tick" cx="55" cy="55" r="50" />
          </svg>
          <h2>
            {{ $t('generic.thankyou') }},
            {{ order.billing_address.first_name }}!
          </h2>
          <p>{{ $t('generic.thankyou_message') }}</p>
        </header>
        <section>
          <div class="header">{{ $t('generic.customer') }}:</div>
          {{ order.customer_email }}
        </section>
        <section class="addresses">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <div class="header">{{ $t('generic.billing_address') }}:</div>
                <AddressSummary :address="order.billing_address" />
              </v-flex>
              <v-flex xs12 sm6>
                <div class="header ship-to-header">
                  {{ $t('generic.shipping_address') }}:
                </div>
                <AddressSummary
                  :address="order.shipping_address"
                  :billing="false"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </section>
        <section>
          <ShipmentSummary
            v-for="(shipment, index) in order.shipments"
            :shipment="shipment"
            :key="shipment.id"
            :count="index + 1"
            :total="order.shipments.length"
            :editable="false"
          />
        </section>
        <section class="actions">
          <v-btn
            color="primary"
            :href="order.return_url"
            v-if="order.return_url"
            >{{ $t('generic.continue_shopping') }}</v-btn
          >
        </section>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AddressSummary from '@/components/summaries/AddressSummary'
import ShipmentSummary from '@/components/summaries/ShipmentSummary'

export default {
  components: {
    AddressSummary,
    ShipmentSummary
  },
  computed: {
    ...mapState(['order'])
  },
  metaInfo: {
    title: 'Order confirmation'
  }
}
</script>

<style lang="scss" scoped>
svg {
  max-height: 80px;
  margin: 20px 0;
}
polyline {
  stroke-dasharray: 100;
  stroke-dashoffset: -100;
  animation: draw-tick 0.3s ease-in-out forwards;
  animation-delay: 0.7s;
}
circle {
  stroke-dasharray: 400;
  stroke-dashoffset: -400;
  animation: draw-circle 1s ease-in-out forwards;
}
@keyframes draw-tick {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}
.tick {
  fill: none;
  stroke: $SUCCESS_COLOR;
  stroke-width: 5;
  stroke-miterlimit: 10;
}

.v-card {
  padding: 2rem;

  header {
    text-align: center;
    padding: 1rem 0;
    border-bottom: 1px solid $v-border;

    .v-icon {
      color: $SUCCESS_COLOR;
      font-size: 3rem;
    }
  }

  section {
    margin-top: 1rem;
  }

  .header {
    font-weight: bolder;
    margin-bottom: 0.5rem;

    &.ship-to-header {
      margin-top: 1rem;
    }
  }

  .actions {
    text-align: center;
    .v-btn {
      width: 100%;
    }
  }
}

.sm-and-up {
  .v-card {
    padding: 2rem 6rem;

    header {
      padding-bottom: 3rem;
    }

    .header {
      &.ship-to-header {
        margin-top: 0;
      }
    }
    .actions {
      text-align: center;
      padding: 2rem 0;
      .v-btn {
        width: 50%;
      }
    }
  }
}
</style>
