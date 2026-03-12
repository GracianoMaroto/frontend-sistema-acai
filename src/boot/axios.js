import axios from 'axios'
import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/auth'

const api = axios.create({
  // baseURL: 'https://sistema-acai-backend.onrender.com',
  // timeout: 10000,
  baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})
export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
