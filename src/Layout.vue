<template>
  <v-content>
    <v-container>
      <v-img :src="logoUrl" :width="logoWidth"/>
    </v-container>
    <v-container>
      <v-layout wrap>
        <v-flex xs12 md7>
          <router-view></router-view>
        </v-flex>
        <v-flex xs12 md5>
          <OrderSummary :order="order" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import OrderSummary from '@/components/OrderSummary.vue'

export default {
  name: 'Layout',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      logoUrl: process.env.VUE_APP_LOGO_URL,
      logoWidth: process.env.VUE_APP_LOGO_WIDTH
    }
  },
  components: {
    OrderSummary
  }
}
</script>
