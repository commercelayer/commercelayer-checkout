# Commercelayer Checkout

This application provides you with a **PCI-compliant**, **PSD2-compliant**, and **production-ready** checkout flow that lets you easily place orders through the [Commercelayer](https://commercelayer.io/) API. It supports [Stripe](https://stripe.com), [Braintree](https://www.braintreepayments.com), [Adyen](https://www.adyen.com/), and [PayPal](https://www.paypal.com) payment methods out of the box and can be used as is or as a reference to build your own checkout experience.

## Overview

![Demo](demo.gif?raw=true 'Demo')

## Customization

You can customize your look and feel and public credentials by setting the following environment variables:

| Name                      | Description                                                       | Example                                                   |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| VUE_APP_BRAND_NAME        | Your brand name                                                   | My Brand                                                  |
| VUE_APP_BRAND_COLOR       | Your brand primary color (used by buttons and links)              | #1976D2                                                   |
| VUE_APP_SUCCESS_COLOR     | Your favorite success color (used by the order confirmation page) | #4CAF50                                                   |
| VUE_APP_ERROR_COLOR       | Your favorite error color (used by the form validations)          | #D32F2F                                                   |
| VUE_APP_LOGO_URL          | Your logo public URL                                              | https://yourbucket.s3-eu-west-1.amazonaws.com/logo.png    |
| VUE_APP_LOGO_WIDTH        | Your logo width                                                   | 240                                                       |
| VUE_APP_FAVICON_URL       | Your favicon public URL                                           | https://yourbucket.s3-eu-west-1.amazonaws.com/favicon.ico |
| VUE_APP_API_BASE_URL      | Your organization endpoint                                        | https://acme.commercelayer.io                             |
| VUE_APP_API_CLIENT_ID     | Your sales channel application client ID                          | xxxxxxxxxxxxxxxxxxxx                                      |
| VUE_APP_STRIPE_PUBLIC_KEY | Your Stripe public key (required by Stripe)                       | pk_live_XXXXXXXXXX                                        |
| VUE_APP_ADYEN_ENV         | Your Adyen environment (required by Adyen)                        | live                                                      |
| VUE_APP_ADYEN_ORIGIN_KEY  | Your Adyen origin key (required by Adyen)                         | pub.v2.XXXXX.YYYYY.ZZZZZ                                  |

## Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/commercelayer/commercelayer-checkout-vue)
