<template>
  <v-layout row wrap>
    <v-flex xs12 px-2 py-1>
      <v-text-field
        label="Email"
        v-model="customer_email"
        :autofocus="autofocusEmail"
        :error-messages="errorMessages"
        @blur="handleBlur()">
        </v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'
import countries from '@/data/countries'
import { required, email } from 'vuelidate/lib/validators'

export default {
  computed: {
    autofocusEmail () {
      return _.isEmpty(this.customer_email)
    },
    countries () {
      return countries
    },
    errorMessages () {
      const errors = []
      if (!this.$v.customer_email.$dirty) return errors
      !this.$v.customer_email.email && errors.push('Must be valid email')
      !this.$v.customer_email.required && errors.push('Can\'t be blank')
      return errors
    },
    ...mapFields([
      'order.customer_email',
      'order.billing_address.phone',
      'order.billing_address.first_name',
      'order.billing_address.last_name',
      'order.billing_address.line_1',
      'order.billing_address.line_2',
      'order.billing_address.zip_code',
      'order.billing_address.city',
      'order.billing_address.state_code',
      'order.billing_address.country_code'
    ])
  },
  validations: {
    customer_email: { required, email }
  },
  methods: {
    handleBlur () {
      this.$v.customer_email.$touch()
    }
  }
}
</script>

<style>

</style>
