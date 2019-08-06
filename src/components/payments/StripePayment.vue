<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('stripe')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="stripe_payments_radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div class="card-wrap">
        <div id="stripe-card"></div>
        <div id="stripe-card-error"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentMixin } from '@/mixins/paymentMixin'

export default {
  data () {
    return {
      scriptSrc: 'https://js.stripe.com/v3/'
    }
  },
  mixins: [paymentMixin],
  methods: {
    setupPayment () {
      let script = this.getScript()
      let i18n = this.$i18n

      // Init card element
      script.addEventListener('load', () => {
        let stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY) // eslint-disable-line
        let elements = stripe.elements({ locale: i18n.locale })
        let cardElement = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif'
            }
          }
        })
        cardElement.mount('#stripe-card')

        let btn = document.getElementById('place-order-button')
        btn.onclick = () => {
          this.loading_payment = true
          this.setPaymentSource()
            .then(paymentSource => {
              this.handlePayment(stripe, cardElement, paymentSource.client_secret)
            })
        }
      })
    },
    handlePayment (stripe, cardElement, clientSecret) {
      let that = this

      stripe.handleCardPayment(
        clientSecret, cardElement, {
          payment_method_data: {
            billing_details: {
              email: that.order.customer_email,
              name: that.order.billing_address.full_name,
              phone: that.order.billing_address.phone,
              address: {
                city: that.order.billing_address.city,
                country: that.order.billing_address.country_code,
                line1: that.order.billing_address.line_1,
                postal_code: that.order.billing_address.zip_code,
                state: that.order.billing_address.state_code
              }
            }
          }
        }
      ).then(result => {
        if (result.error) {
          let cardError = document.getElementById('stripe-card-error')
          cardError.innerHTML = result.error.message
          that.loading_payment = false
        } else {
          that.$store.dispatch('placeOrder')
            .then(() => {
              that.$router.push({ name: 'confirmation' })
            })
        }
      })
    },
    getScript () {
      let scripts = document.getElementsByTagName('script')
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === this.scriptSrc) return scripts[i]
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = this.scriptSrc
      document.head.appendChild(script)
      return script
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrap {
  padding: 1rem 0;
  .StripeElement {
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
  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }
  .StripeElement--invalid {
    border-color: $ERROR_COLOR;
  }
  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
  #stripe-card-error {
    color: $ERROR_COLOR;
    margin-top: 0.5rem;
  }
}
.sm-and-up {
  .card-wrap {
    padding: 1rem 2rem;
  }
}
</style>
