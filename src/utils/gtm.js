import Vue from 'vue'
import _ from 'lodash'

export const gtmProducts = order => {
  let skuLineItems = _.filter(order.line_items, { item_type: 'skus' })
  return _.map(skuLineItems, lineItem => {
    return {
      name: lineItem.name,
      id: lineItem.id,
      price: lineItem.unit_amount_float,
      quantity: lineItem.quantity
    }
  })
}

export const trackPurchase = order => {
  Vue.gtm.trackEvent({
    event: 'purchase',
    ecommerce: {
      currencyCode: order.currency_code,
      purchase: {
        actionField: {
          id: order.number,
          revenue: order.total_amount_with_taxes_float,
          shipping: order.shipping_amount_float,
          tax: order.total_tax_amount_float,
          coupon: order.gift_card_or_coupon_code
        },
        products: gtmProducts(order)
      }
    }
  })
}
