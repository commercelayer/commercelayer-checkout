<template>
  <footer>
    <span v-if="order.terms_url">
      <a :href="order.terms_url">{{ $t('generic.terms_of_service') | capitalize }}</a>
    </span>
    <span v-if="order.privacy_url">
      &middot;
      <a :href="order.privacy_url">{{ $t('generic.privacy_policy') | capitalize }}</a>
    </span>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['order'])
  }
}
</script>

<style lang="scss" scoped>
footer {
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;
}

.sm-and-up {
  footer {
    text-align: left;
    font-size: 1rem;
  }
}
</style>
