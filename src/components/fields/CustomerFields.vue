<template>
  <v-layout row wrap>
    <v-flex xs12 px-2>
      <v-text-field
        id="customer-email"
        label="Email"
        v-model="customer_email"
        :autofocus="autofocusEmail"
        :error-messages="errorMessages"
        @input="handleInput()"
        @blur="handleBlur()"
      ></v-text-field>
    </v-flex>
    <v-flex xs12 px-2 v-if="showCustomerSubscription">
      <v-checkbox
        :label="$t('generic.customer_subscription')"
        id="customer-subscription-checkbox"
        v-model="customer_subscription.checked"
        @change="handleCustomerSubscription"
        color="primary"
      ></v-checkbox>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'
import { required, email } from 'vuelidate/lib/validators'

export default {
  computed: {
    autofocusEmail () {
      return _.isEmpty(this.customer_email)
    },
    showCustomerSubscription () {
      return this.editable && process.env.VUE_APP_SUBSCRIPTION_REF
    },
    errorMessages () {
      const errors = []
      if (!this.$v.customer_email.$dirty) return errors
      !this.$v.customer_email.email && errors.push('Must be valid email')
      !this.$v.customer_email.required && errors.push("Can't be blank")
      return errors
    },
    ...mapFields([
      'validations.invalid_customer',
      'order.editable',
      'order.customer_email',
      'customer_subscription'
    ])
  },
  validations: {
    customer_email: { required, email }
  },
  methods: {
    updateValidations () {
      this.invalid_customer = this.$v.$invalid
    },
    handleInput () {
      this.updateValidations()
    },
    handleBlur () {
      this.$v.customer_email.$touch()
      if (!this.$v.$invalid) this.setCustomerEmail()
    },
    setCustomerEmail () {
      this.$store.dispatch('setOrderCustomerEmail')
      this.handleCustomerSubscription()
    },
    handleCustomerSubscription () {
      this.$store.dispatch('handleCustomerSubscription')
    }
  },
  mounted () {
    this.updateValidations()
  }
}
</script>

<style></style>
