<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('braintree')"
      :value="payment_option.component"
      color="primary"
      @change="setPaymentMethod"
      id="braintree-card-radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div class="braintree-hosted-fields">
        <v-layout row wrap>
          <v-flex xs12>
            <div class="braintree-hosted-field-label">{{ $t('generic.card_number') | capitalize }}</div>
            <div class="braintree-hosted-field" id="braintree-card-number"></div>
          </v-flex>
          <v-flex xs6>
            <div class="braintree-hosted-field-label">{{ $t('generic.card_exp_date') | capitalize }}</div>
            <div class="braintree-hosted-field" id="braintree-card-expiration-date"></div>
          </v-flex>
          <v-flex xs6>
            <div class="braintree-hosted-field-label">{{ $t('generic.card_cvv') }}</div>
            <div class="braintree-hosted-field" id="braintree-card-cvv"></div>
          </v-flex>
        </v-layout>
      </div>
      <div class="payment-error" id="braintree-card-error"></div>
    </div>
  </div>
</template>

<script>
import { paymentMixin } from '@/mixins/paymentMixin'
export default {
  data () {
    return {
      clientSrc: 'https://js.braintreegateway.com/web/3.50.0/js/client.min.js',
      hostedFieldsSrc:
        'https://js.braintreegateway.com/web/3.50.0/js/hosted-fields.min.js',
      threeDSrc:
        'https://js.braintreegateway.com/web/3.50.0/js/three-d-secure.min.js'
    }
  },
  mixins: [paymentMixin],
  methods: {
    setupPayment () {
      let that = this
      let clientScript = this.getScript(this.clientSrc)
      clientScript.addEventListener('load', () => {
        // eslint-disable-next-line
        braintree.client.create(
          {
            authorization: this.order.payment_source.client_token
          },
          (clientErr, clientInstance) => {
            if (clientErr) {
              // Handle error in client creation
              return
            }

            let hostedFieldsScript = that.getScript(that.hostedFieldsSrc)
            hostedFieldsScript.addEventListener('load', () => {
              var options = {
                client: clientInstance,
                styles: {
                  input: {
                    'font-size': '16px',
                    'font-family': 'Roboto, sans-serif'
                  },
                  'input.invalid': {
                    color: process.env.VUE_APP_ERROR_COLOR
                  },
                  '::-webkit-input-placeholder': {
                    color: '#CCC'
                  },
                  ':-moz-placeholder': {
                    color: '#CCC'
                  },
                  '::-moz-placeholder': {
                    color: '#CCC'
                  },
                  ':-ms-input-placeholder': {
                    color: '#CCC'
                  }
                },
                fields: {
                  number: {
                    selector: '#braintree-card-number',
                    placeholder: '4111 1111 1111 1111'
                  },
                  cvv: {
                    selector: '#braintree-card-cvv',
                    placeholder: '123'
                  },
                  expirationDate: {
                    selector: '#braintree-card-expiration-date',
                    placeholder: '10/2023'
                  }
                }
              }
              // eslint-disable-next-line
              braintree.hostedFields.create(options, function(
                hostedFieldsErr,
                hostedFieldsInstance
              ) {
                if (hostedFieldsErr) {
                  // eslint-disable-next-line
                  console.log(hostedFieldsErr)
                  return
                }

                let btn = document.getElementById('payment-step-submit')
                btn.onclick = () => {
                  that.handlePayment(
                    hostedFieldsInstance,
                    that.order.payment_source.client_token
                  )
                }
              })
            })
          }
        )
      })
    },
    handlePayment (hostedFieldsInstance, clientToken) {
      this.loading_payment = true

      let that = this

      hostedFieldsInstance.tokenize(
        {
          cardholderName: `${that.order.billing_address.first_name} ${that.order.billing_address.last_name}`
        },
        (tokenizeErr, payload) => {
          if (tokenizeErr) {
            // eslint-disable-next-line
            console.error(tokenizeErr)
            that.loading_payment = false
            return
          }

          let threeDScript = this.getScript(this.threeDSrc)
          threeDScript.addEventListener('load', () => {
            // eslint-disable-next-line
            braintree.client.create(
              { authorization: clientToken },
              (clientErr, clientInstance) => {
                if (clientErr) {
                  // eslint-disable-next-line
                  console.log(clientErr)
                  that.loading_payment = false
                  return
                }
                // eslint-disable-next-line
                braintree.threeDSecure.create(
                  {
                    client: clientInstance,
                    version: 2
                  },
                  function (threeDSecureErr, threeDSecureInstance) {
                    if (threeDSecureErr) {
                      // eslint-disable-next-line
                      console.log(threeDSecureErr)
                      that.loading_payment = false
                      return
                    }

                    threeDSecureInstance.verifyCard(
                      {
                        amount: that.order.total_amount_with_taxes_float,
                        nonce: payload.nonce,
                        bin: payload.details.bin,
                        exemptionRequested: true,
                        email: that.order.customer_email,
                        billingAddress: {
                          givenName: that.order.billing_address.first_name,
                          surname: that.order.billing_address.last_name,
                          phoneNumber: that.order.billing_address.phone,
                          streetAddress: that.order.billing_address.line_1,
                          locality: that.order.billing_address.city,
                          region: that.order.billing_address.state_code,
                          postalCode: that.order.billing_address.zip_code,
                          countryCodeAlpha2:
                            that.order.billing_address.country_code
                        },
                        onLookupComplete: function (data, next) {
                          // use `data` here, then call `next()`
                          next()
                        }
                      },
                      function (err, response) {
                        if (err) {
                          let cardError = document.getElementById(
                            'braintree-card-error'
                          )
                          // eslint-disable-next-line
                          cardError.innerHTML = this.$t(err.message)
                          that.loading_payment = false
                          return
                        }

                        that.$store
                          .dispatch('updateOrderPaymentSource', {
                            payment_method_nonce: response.nonce
                          })
                          .then(paymentSource => {
                            that.$store.dispatch('placeOrder')
                          })
                      }
                    )
                  }
                )
              }
            )
          })
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.braintree-hosted-fields {
  margin-top: -1rem;
}
.braintree-hosted-field {
  @include hosted-field;
  margin: 10px;
}
.braintree-hosted-field-label {
  font-size: 1rem;
  margin: 10px;
}
</style>
