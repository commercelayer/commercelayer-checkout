export const apiRequestHeaders = accessToken => {
  return {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    Authorization: 'Bearer ' + accessToken
  }
}

export const euAddress = {
  first_name: 'Filippo',
  last_name: 'Conforti',
  line_1: 'Via Roma, 23',
  city: 'Firenze',
  zip_code: '59123',
  state_code: 'FI',
  country: 'Italy',
  country_code: 'IT',
  phone: '+39 055 1234567890',
  other_phone: '+39 055 0987654321',
  billing_info: 'ABCDEFGHIJKLMNOPQRSTUVWYXZ'
}

export const usAddress = {
  first_name: 'John',
  last_name: 'Doe',
  line_1: '123 5th Avenue',
  city: 'New York',
  zip_code: '10001',
  state_code: 'NY',
  country: 'United States',
  country_code: 'US',
  phone: '+1 1234567890',
  other_phone: '+1 1234567890',
  billing_info: 'ABCDEFGHIJKLMNOPQRSTUVWYXZ'
}
