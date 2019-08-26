export const orderIncludes = [
  'line_items',
  'billing_address',
  'shipping_address',
  'shipments.shipment_line_items.line_item',
  'shipments.available_shipping_methods',
  'shipments.shipping_method',
  'available_payment_methods',
  'payment_method',
  'payment_source'
]

export const orderAttributes = [
  'id',
  'number',
  'language_code',
  'skus_count',
  'customer_email',
  'coupon_code',
  'editable',
  'requires_billing_info',
  'shipping_country_code_lock',
  'formatted_subtotal_amount',
  'formatted_shipping_amount',
  'formatted_payment_method_amount',
  'formatted_discount_amount',
  'formatted_total_tax_amount',
  'formatted_total_amount_with_taxes',
  'total_amount_with_taxes_float',
  'line_items.item_type',
  'line_items.id',
  'line_items.name',
  'line_items.sku_code',
  'line_items.image_url',
  'line_items.formatted_unit_amount',
  'line_items.quantity',
  'line_items.formatted_total_amount',
  'billing_address.id',
  'billing_address.first_name',
  'billing_address.last_name',
  'billing_address.line_1',
  'billing_address.line_2',
  'billing_address.city',
  'billing_address.zip_code',
  'billing_address.state_code',
  'billing_address.country_code',
  'billing_address.phone',
  'billing_address.billing_info',
  'billing_address.notes',
  'shipping_address.id',
  'shipping_address.first_name',
  'shipping_address.last_name',
  'shipping_address.line_1',
  'shipping_address.line_2',
  'shipping_address.city',
  'shipping_address.zip_code',
  'shipping_address.state_code',
  'shipping_address.country_code',
  'shipping_address.phone',
  'shipping_address.billing_info',
  'shipping_address.notes',
  'shipments.id',
  'shipments.number',
  'shipments.skus_count',
  'shipments.shipment_line_items.line_item.item_type',
  'shipments.shipment_line_items.line_item.name',
  'shipments.shipment_line_items.line_item.sku_code',
  'shipments.shipment_line_items.line_item.image_url',
  'shipments.shipment_line_items.quantity',
  'shipments.available_shipping_methods.id',
  'shipments.available_shipping_methods.name',
  'shipments.available_shipping_methods.formatted_price_amount_for_shipment',
  'shipments.available_shipping_methods.price_amount_for_shipment_cents',
  'shipments.shipping_method.id',
  'shipments.shipping_method.name',
  'shipments.shipping_method.formatted_price_amount_for_shipment',
  'shipments.shipping_method.price_amount_for_shipment_cents',
  'available_payment_methods.id',
  'available_payment_methods.name',
  'available_payment_methods.payment_source_type',
  'payment_method.id',
  'payment_method.name',
  'payment_method.payment_source_type',
  'payment_source.id',
  'cart_url',
  'privacy_url',
  'terms_url',
  'return_url'
]

export const addressAttributes = [
  'id',
  'first_name',
  'last_name',
  'line_1',
  'line_2',
  'city',
  'zip_code',
  'state_code',
  'country_code',
  'phone',
  'billing_info',
  'notes'
]

export const shipmentIncludes = [
  'shipment_line_items.line_item',
  'available_shipping_methods',
  'shipping_method'
]

export const shipmentAttributes = [
  'id',
  'number',
  'skus_count',
  'shipment_line_items.line_item.item_type',
  'shipment_line_items.line_item.name',
  'shipment_line_items.line_item.sku_code',
  'shipment_line_items.line_item.image_url',
  'shipment_line_items.quantity',
  'available_shipping_methods.id',
  'available_shipping_methods.name',
  'available_shipping_methods.formatted_price_amount_for_shipment',
  'available_shipping_methods.price_amount_for_shipment_cents',
  'shipping_method.id',
  'shipping_method.name',
  'shipping_method.formatted_price_amount_for_shipment',
  'shipping_method.price_amount_for_shipment_cents'
]

export const paymentSourceAttributesMap = {
  stripe_payments: ['id', 'client_secret'],
  adyen_payments: ['id', 'payment_methods', 'payment_response'],
  braintree_payments: ['id', 'client_token'],
  paypal_payments: ['id', 'approval_url'],
  wire_transfers: ['id']
}

export const addressDefaults = order => {
  return {
    first_name: '',
    last_name: '',
    line_1: '',
    line_2: '',
    city: '',
    zip_code: '',
    state_code: '',
    country_code: order.shipping_country_code_lock || '',
    phone: '',
    billing_info: ''
  }
}

export const orderDefaults = order => {
  return {
    requires_billing_info: false,
    billing_address: addressDefaults(order),
    shipping_address: addressDefaults(order),
    ship_to_different_address: order.ship_to_different_address || false,
    ship_to_different_address_required:
      order.ship_to_different_address_required || false,
    shipments: [],
    payment_method: {},
    payment_source: {}
  }
}
