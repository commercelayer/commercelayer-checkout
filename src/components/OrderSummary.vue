<template>
  <div class="pa-4">
    <h2>{{ $t('order') | capitalize }} #{{ order.number }} ({{ order.skus_count }} {{ $tc('item', order.skus_count)}})</h2>
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
