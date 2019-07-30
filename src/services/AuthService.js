import axios from 'axios'

const authClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

const getAccessToken = () => {
  return authClient.post('/oauth/token', {
    grant_type: "client_credentials",
    client_id: process.env.VUE_APP_API_CLIENT_ID,
  })
  .then(response => {
    localStorage.setItem('accessToken', response.data.access_token)
  })
  .catch(error => {
    console.log('Get access token error:', error.response)
  })  
}

export default {
  getAccessToken
}