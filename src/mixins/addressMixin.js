import countries from '@/data/countries'
import { required } from 'vuelidate/lib/validators'

export const addressMixin = {
  computed: {
    countries () {
      return countries
    }
  },
  validations: {
    first_name: { required },
    last_name: { required },
    line_1: { required },
    city: { required },
    country_code: { required },
    state_code: { required },
    zip_code: { required },
    phone: { required }
  },
  methods: {
    handleBlur (fieldName) {
      this.$v[fieldName].$touch()
    },
    errorMessages (fieldName) {
      const errors = []
      if (!this.$v[fieldName].$dirty) return errors
      !this.$v[fieldName].required && errors.push('Can\'t be blank')
      return errors
    }
  }
}
