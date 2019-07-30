<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.dispatch('getOrder', this.$route.params.order_id)
  }
}
</script>
