<template>
  <p>
    {{ address.first_name }} {{ address.last_name }}
    <br />
    {{ address.line_1 }}
    <br />
    {{ address.zip_code }} {{ address.city }} ({{ address.state_code }})
    <br />
    {{ countryName }}
    <br />
    <v-icon :small="true">phone</v-icon>
    {{ address.phone }}
  </p>
</template>

<script>
import _ from 'lodash'
import countries from '@/data/countries'

export default {
  props: {
    address: {
      type: Object,
      required: true
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

<style scoped>
</style>
