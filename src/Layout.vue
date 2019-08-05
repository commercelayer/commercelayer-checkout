<template>
  <v-content id="layout" :class="{ 'sm-and-up': $vuetify.breakpoint.smAndUp, 'md-and-up': $vuetify.breakpoint.mdAndUp }">
    <v-container>
      <v-img :src="logoUrl" :width="logoWidth"/>
    </v-container>
    <v-container>
      <v-layout wrap>
        <v-flex xs12 md7 order-xs2 order-md1>
          <router-view></router-view>
        </v-flex>
        <v-flex xs12 md5 order-xs1 order-md2>
          <OrderSummary />
        </v-flex>
      </v-layout>
      <OrderFooter />
    </v-container>
  </v-content>
</template>

<script>
import OrderSummary from '@/components/OrderSummary.vue'
import OrderFooter from '@/components/OrderFooter.vue'

export default {
  name: 'Layout',
  data () {
    return {
      logoUrl: process.env.VUE_APP_LOGO_URL,
      logoWidth: process.env.VUE_APP_LOGO_WIDTH
    }
  },
  components: {
    OrderSummary,
    OrderFooter
  }
}
</script>
