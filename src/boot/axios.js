import axios from 'axios'
import { useAuthStore } from 'stores/auth'

const api = axios.create({
  baseURL: 'https://sistema-acai-backend.onrender.com',
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})

export { api }
