import _ from 'lodash'

export const collectBrowserInfo = () => {
  const screenWidth = window && window.screen ? window.screen.width : ''
  const screenHeight = window && window.screen ? window.screen.height : ''
  const colorDepth = window && window.screen ? window.screen.colorDepth : ''
  const userAgent = window && window.navigator ? window.navigator.userAgent : ''
  const javaEnabled =
    window && window.navigator ? navigator.javaEnabled() : false

  let language = ''
  if (window && window.navigator) {
    language = window.navigator.language
      ? window.navigator.language
      : window.navigator.browserLanguage // Else is for IE <+ 10
  }

  const d = new Date()
  const timeZoneOffset = d.getTimezoneOffset()

  const browserInfo = {
    screenWidth,
    screenHeight,
    colorDepth,
    userAgent,
    timeZoneOffset,
    language,
    javaEnabled
  }

  return browserInfo
}

export const getCurrentStep = order => {
  let step = getRequiresPayment(order) ? 3 : 2

  if (
    _.isEmpty(order.customer_email) ||
    _.isEmpty(order.billing_address.first_name) ||
    _.isEmpty(order.shipping_address.first_name)
  ) {
    step = 1
  } else {
    _.each(order.shipments, shipment => {
      if (_.isEmpty(shipment.shipping_method)) step = 2
    })
  }

  return step
}

export const getRequiresDelivery = order => {
  return !_.isEmpty(skuLineItems(order))
}

export const getRequiresPayment = order => {
  return order.total_amount_with_taxes_float > 0
}

export const getGiftCardOrCouponApplied = order => {
  return !_.isEmpty(order.gift_card_or_coupon_code)
}

export const skuLineItems = order => {
  return _.filter(order.line_items, { item_type: 'skus' })
}

// not used
export const clearPaymentScripts = () => {
  let scripts = document.getElementsByClassName('payment-script')
  _.each(scripts, el => {
    el.parentNode.removeChild(el)
  })
}
