import axios from 'axios'
import store from '@/store'
import jwt from 'jsonwebtoken'

const authClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const getAccessToken = () => {
  let accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    decodeAccessToken(accessToken)
    return Promise.resolve(accessToken)
  }

  return authClient
    .post('/oauth/token', {
      grant_type: 'client_credentials',
      client_id: process.env.VUE_APP_API_CLIENT_ID
    })
    .then(response => {
      localStorage.setItem('accessToken', response.data.access_token)
      decodeAccessToken(response.data.access_token)
      return response.data.access_token
    })
    .catch(error => {
      console.log('Get access token error:', error.response)
    })
}

const refreshAccessToken = refreshToken => {
  return authClient
    .post('/oauth/token', {
      grant_type: 'refresh_token',
      client_id: process.env.VUE_APP_API_CLIENT_ID,
      refresh_token: refreshToken
    })
    .then(response => {
      localStorage.setItem('accessToken', response.data.access_token)
      localStorage.setItem('refreshToken', response.data.refresh_token)
      decodeAccessToken(response.data.access_token)
      return response.data.access_token
    })
    .catch(error => {
      console.log('Get access token error:', error.response)
    })
}

const updateAccessToken = () => {
  localStorage.removeItem('accessToken')
  let refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    return refreshAccessToken(refreshToken)
  } else {
    return getAccessToken()
  }
}

const decodeAccessToken = accessToken => {
  let decoded = jwt.decode(accessToken)
  if (decoded) {
    store.commit(
      'updateAuthHasCustomer',
      !!decoded.owner && decoded.owner.type === 'Customer'
    )
  }
}

export default {
  getAccessToken,
  updateAccessToken
}
