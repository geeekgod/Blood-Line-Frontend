import axios from 'axios'

const bloodLineApi = axios.create({
  baseURL: 'https://bloodline-api.middleware-api.ml/api',
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Authorization",
    "Accept": "*/*",
  }
})

export default bloodLineApi
