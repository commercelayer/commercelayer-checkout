<template>
  <v-content
    id="layout"
    :class="{ 'sm-and-up': $vuetify.breakpoint.smAndUp, 'md-and-up': $vuetify.breakpoint.mdAndUp }"
  >
    <v-container>
      <v-layout wrap>
        <v-flex xs12 md7 order-xs2 order-md1>
          <v-row justify="center" class="header">
            <v-img :src="logoUrl" :width="logoWidth" max-width="240" />
          </v-row>
        </v-flex>
        <v-flex xs12 md5 order-xs1 order-md2></v-flex>
      </v-layout>

      <v-layout wrap>
        <v-flex xs12 md7 order-xs2 order-md1>
          <router-view></router-view>
        </v-flex>
        <v-flex xs12 md5 order-xs1 order-md2>
          <OrderSummary />
        </v-flex>
      </v-layout>

      <v-layout wrap>
        <v-flex xs12 md7 order-xs2 order-md1>
          <v-row justify="center" class="header">
            <Footer />
          </v-row>
        </v-flex>
        <v-flex xs12 md5 order-xs1 order-md2></v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import OrderSummary from '@/components/summaries/OrderSummary.vue'
import Footer from '@/components/partials/Footer.vue'

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
    Footer
  },
  metaInfo: {
    titleTemplate: `%s | ${process.env.VUE_APP_BRAND_NAME}`,
    link: [{ rel: 'icon', href: process.env.VUE_APP_FAVICON_URL, once: true }]
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding: 1rem 0 2rem;
}
</style>
