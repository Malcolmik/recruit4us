/// <reference types="vite/client" />

import axios from 'axios'
export const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
