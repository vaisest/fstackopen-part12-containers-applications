import axios from 'axios'

console.log("hello lol why wont this print", import.meta.env.VITE_BACKEND_URL)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

export default apiClient