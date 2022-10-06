import axios from 'axios'

const bloodLineApi = axios.create({
  baseURL: 'http://192.168.1.5:4561/api',
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Authorization",
    "Accept": "*/*",
  }
})

export default bloodLineApi