<template>
  <div>
    {{ address.first_name }} {{ address.last_name }}
    <br />
    {{ address.line_1 }}
    <br />
    {{ address.zip_code }} {{ address.city }} ({{ address.state_code }}) {{ countryName }}
    <br />
    {{ address.phone }}
    <span v-if="billing">
      <br />
      {{ address.billing_info }}
    </span>
  </div>
</template>

<script>
import _ from 'lodash'
import countries from '@/data/countries'

export default {
  props: {
    address: {
      type: Object,
      required: true
    },
    billing: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    countryName () {
      let country = _.find(countries, {
        code: _.upperCase(this.address.country_code)
      })
      return country.name
    }
  }
}
</script>

<style>
</style>
