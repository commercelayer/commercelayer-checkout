# Commerce Layer Checkout

This application provides you with a **PCI-compliant**, **PSD2-compliant**, and **production-ready** checkout flow that lets you easily place orders through the [Commerce Layer](https://commercelayer.io/) API. It supports [Stripe](https://stripe.com), [Braintree](https://www.braintreepayments.com), [Adyen](https://www.adyen.com/), and [PayPal](https://www.paypal.com) payment methods out of the box and can be used as is or as a reference to build your own checkout experience.

## Overview

![Demo](docs/demo.gif?raw=true 'Demo')

## Getting started

You can get your checkout application up and running in 4 simple steps:

### 1. Get your credentials

Create a **sales channel** application on [Commerce Layer](https://commercelayer.io) and take note of your API credentials (base endpoint, client ID)

### 2. Deploy

You can deploy the application to any web server or CDN. Deploy to Netlify or Zeit with one click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/commercelayer/commercelayer-checkout)
[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/new/project?template=https://github.com/commercelayer/commercelayer-checkout)

### 3. Customize

Configure your API credentials and customize the look and feel by setting the following environment variables:

| Name                             | Description                                                                                | Example                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| VUE_APP_API_BASE_URL             | Your organization endpoint                                                                 | https://acme.commercelayer.io                             |
| VUE_APP_API_CLIENT_ID            | Your sales channel application client ID                                                   | xxxxxxxxxxxxxxxxxxxx                                      |
| VUE_APP_BRAND_NAME               | Your brand name                                                                            | My Brand                                                  |
| VUE_APP_BRAND_COLOR              | Your brand primary color (used by buttons and links)                                       | #1976D2                                                   |
| VUE_APP_SUCCESS_COLOR            | Your favorite success color (used by the order confirmation page)                          | #4CAF50                                                   |
| VUE_APP_ERROR_COLOR              | Your favorite error color (used by the form validations)                                   | #D32F2F                                                   |
| VUE_APP_LOGO_URL                 | Your logo public URL                                                                       | https://yourbucket.s3-eu-west-1.amazonaws.com/logo.png    |
| VUE_APP_LOGO_WIDTH               | Your logo width                                                                            | 240                                                       |
| VUE_APP_FAVICON_URL              | Your favicon public URL                                                                    | https://yourbucket.s3-eu-west-1.amazonaws.com/favicon.ico |
| VUE_APP_HIDE_GIFT_CARD_OR_COUPON | Hide the gift card or coupon code field                                                    | TRUE                                                      |
| VUE_APP_SUBSCRIPTION_REF         | Enables the customer subscription checkbox (using its value as the subscription reference) | NEWSLETTER                                                |
| VUE_APP_STRIPE_PUBLIC_KEY        | Your Stripe public key (required by Stripe)                                                | pk_live_XXXXXXXXXX                                        |
| VUE_APP_ADYEN_ENV                | Your Adyen environment (required by Adyen)                                                 | live                                                      |
| VUE_APP_ADYEN_ORIGIN_KEY         | Your Adyen origin key (required by Adyen)                                                  | pub.v2.XXXXX.YYYYY.ZZZZZ                                  |
| VUE_APP_GTM_CONTAINER_ID         | Your Google Tag Manager container ID                                                       | GTM-XXXXXXX                                               |
| VUE_APP_GTM_AUTH                 | Your gtm_auth parameter                                                                    | xxxxxxxxxx                                                |
| VUE_APP_GTM_PREVIEW              | Your gtm_preview parameter                                                                 | env-1                                                     |
| VUE_APP_GTM_COOKIES_WIN          | Your gtm_cookies_win parameter                                                             | x                                                         |
| VUE_APP_GTM_LOAD_SCRIPT          | Load the Google Tag Manager script                                                         | TRUE                                                      |
| VUE_APP_GTM_ENABLED              | Enable Google Tag Manager tracking                                                         | TRUE                                                      |
| VUE_APP_GTM_DEBUG                | Enable Google Tag Manager console debug                                                    | TRUE                                                      |

### 4. Checkout

Checkout any order by visiting `https://checkout.yourdomain.com/:order_id`, where `checkout.yourdomain.com` is the domain associated with your checkout application.

## Configure your market(s)

Go to _Settings → Markets_ in Commerce Layer and add the Checkout URL template to your market(s), making sure to include the `:order_id` param placeholder:

![Checkout URL configuration](docs/checkout-url-config.png?raw=true 'Checkout URL configuration')

This way, you'll to get the actual URL (i.e. with the real order id) returned by the orders API in the `checkout_url` order attribute:

![Checkout URL API response](docs/checkout-url-api-response-snippet.png?raw=true 'Checkout URL API response')

## License

Commerce Layer Checkout is an open-sourced software licensed under the [MIT license](LICENSE.txt).
