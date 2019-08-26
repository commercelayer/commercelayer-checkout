<template>
  <v-layout wrap class="address body-2">
    <v-flex xs12>
      <v-layout>
        <v-flex shrink>
          <v-icon :small="true">place</v-icon>
        </v-flex>
        <v-flex>
          <div class="px-2">
            {{ address.first_name }} {{ address.last_name }}
            <br />
            {{ address.line_1 }}
            <br />
            {{ address.zip_code }} {{ address.city }} ({{ address.state_code }})
            <br />
            {{ countryName }}
            <br />
            {{ address.phone }}
            <span v-if="billing">
              <br />
              {{ address.billing_info }}
            </span>
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
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

<style lang="scss" scoped>
</style>
