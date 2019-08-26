<template>
  <div>
    <v-card>
      <div>
        <header>
          <v-icon>mdi-check</v-icon>
          <h2>{{ $t('generic.thankyou')}}, {{ order.billing_address.first_name }}!</h2>
          <p>{{ $t('generic.thankyou_message')}}</p>
        </header>
        <section>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <div class="header">{{ order.customer_email }}</div>
                <AddressSummary :address="order.billing_address" />
              </v-flex>
              <v-flex xs12 sm6>
                <div class="header ship-to-header">{{ $t('generic.ship_to') | capitalize }}:</div>
                <AddressSummary :address="order.shipping_address" :billing="false" />
              </v-flex>
            </v-layout>
          </v-container>
        </section>
        <section>
          <ShipmentSummary
            v-for="(shipment, index) in order.shipments"
            :shipment="shipment"
            :key="shipment.id"
            :count="index+1"
            :total="order.shipments.length"
            :editable="false"
          />
        </section>
        <section class="actions">
          <v-btn
            color="primary"
            :href="order.return_url"
            v-if="order.return_url"
          >{{ $t('generic.continue_shopping') }}</v-btn>
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
