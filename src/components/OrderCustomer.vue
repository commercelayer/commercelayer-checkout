<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 pa-2>
      <v-text-field label="Email" v-model="customer_email"></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
export default {
  computed: {
    ...mapFields([
      'order.customer_email'
    ])
  }
}
</script>

<style>

</style>
