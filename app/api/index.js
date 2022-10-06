import axios from 'axios'

const bloodLineApi = axios.create({
  baseURL: 'https://bloodline-api.rishabhsingh-dev.me/api',
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Authorization",
    "Accept": "*/*",
  }
})

export default bloodLineApi