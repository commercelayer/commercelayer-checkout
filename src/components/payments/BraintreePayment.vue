<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('braintree')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="braintree_payments_radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <v-layout row wrap>
        <v-flex xs12 pa-2>
          <div class="braintree-hosted-field-label">{{ $t('generic.card_number') | capitalize }}</div>
          <div class="braintree-hosted-field" id="braintree-card-number"></div>
        </v-flex>
        <v-flex xs6 pa-2>
          <div class="braintree-hosted-field-label">{{ $t('generic.card_exp_date') | capitalize }}</div>
          <div class="braintree-hosted-field" id="braintree-card-expiration-date"></div>
        </v-flex>
        <v-flex xs6 pa-2>
          <div class="braintree-hosted-field-label">{{ $t('generic.card_cvv') }}</div>
          <div class="braintree-hosted-field" id="braintree-card-cvv"></div>
        </v-flex>
        <div class="payment-error" id="braintree-card-error"></div>
      </v-layout>
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
                  // 'input.valid': {
                  //   'color': 'green'
                  // },
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
                  console.log(hostedFieldsErr)
                  return
                }

                let btn = document.getElementById('place-order-button')
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
    handleError (message) {
      let cardError = document.getElementById('braintree-card-error')
      // eslint-disable-next-line
      cardError.innerHTML = _.capitalize(message)
    },
    handlePayment (hostedFieldsInstance, clientToken) {
      this.loading_payment = true

      let that = this

      hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
        if (tokenizeErr) {
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
                        console.log(err)
                        that.loading_payment = false
                        return
                      }

                      that.$store
                        .dispatch('updateOrderPaymentSource', {
                          payment_method_nonce: response.nonce
                        })
                        .then(paymentSource => {
                          that.$store
                            .dispatch('placeOrder')
                            .then(() => {
                              that.$router.push({ name: 'confirmation' })
                            })
                            .catch(error => {
                              console.log(error)
                              that.handleError('unauthorized')
                              that.loading_payment = false
                            })
                        })
                    }
                  )
                }
              )
            }
          )
        })
      })
    },
    getScript (scriptSrc) {
      let scripts = document.getElementsByTagName('script')
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === scriptSrc) return scripts[i]
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = scriptSrc
      document.head.appendChild(script)
      return script
    }
  }
}
</script>

<style lang="scss" scoped>
.braintree-hosted-field {
  box-sizing: border-box;
  height: 40px;
  padding: 10px 12px;
  border: 1px solid $v-border;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}
.braintree-hosted-field-label {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
</style>
