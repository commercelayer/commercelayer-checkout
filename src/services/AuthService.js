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
  let accessToken = store.state.auth.access_token

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
      store.commit('updateAuthAccessToken', response.data.access_token)
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
      store.commit('updateAuthAccessToken', response.data.access_token)
      store.commit('refreshToken', response.data.refresh_token)
      decodeAccessToken(response.data.access_token)
      return response.data.access_token
    })
    .catch(error => {
      console.log('Get access token error:', error.response)
    })
}

const updateAccessToken = () => {
  store.commit('clearAuthAccessToken')
  let refreshToken = store.state.auth.refresh_token
  if (refreshToken) {
    return refreshAccessToken(refreshToken)
  } else {
    return getAccessToken()
  }
}

const decodeAccessToken = accessToken => {
  let decoded = jwt.decode(accessToken)
  if (decoded) {
    // Verify with shared secret (when available)
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
