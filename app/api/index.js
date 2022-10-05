import axios from 'axios'

const bloodLineApi = axios.create({
  baseURL: 'http://192.168.1.7:4561/api',
})

export default bloodLineApi