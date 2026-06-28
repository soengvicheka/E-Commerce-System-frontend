import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'
const STORAGE_BASE = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage/'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export { api, STORAGE_BASE }
