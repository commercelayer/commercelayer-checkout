<template>
  <v-radio
    label="Credit Card"
    :value="payment_method.id"
  ></v-radio>
</template>

<script>
export default {
  props: {
    payment_method: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
