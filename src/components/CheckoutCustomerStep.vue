<template>
  <div>
    <v-stepper-step :complete="currentStep > step" :step="step" :editable="currentStep > step" edit-icon="$vuetify.icons.complete">
      Customer
      <small>filippo.conforti@gmail.com</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <form>
        <v-text-field label="Email"></v-text-field>
      </form>
      <v-btn color="primary" @click="nextStep" :block="$vuetify.breakpoint.xs">Continue to billing</v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['currentStep'])
  },
  methods: {
    nextStep () {
      this.$store.dispatch('setCurrentStep', (this.step + 1))
    }
  }
}
</script>

<style>

</style>
