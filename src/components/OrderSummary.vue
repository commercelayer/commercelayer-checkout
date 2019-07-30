<template>
  <div class="pa-4">
    <h2>Order #{{ order.data.attributes.number }}</h2>

    {{ order }}
    
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  }
}

</script>

<style>

</style>
