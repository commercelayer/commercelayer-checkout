<template>
  <v-layout row wrap>
    <v-text-field label="Email" v-model="customer_email"></v-text-field>
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
