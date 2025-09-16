import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    try { localStorage.setItem('wp_token', token) } catch {}
  } else {
    delete api.defaults.headers.common['Authorization']
    try { localStorage.removeItem('wp_token') } catch {}
  }
}

// 초기 로드 시 로컬 토큰을 적용
try {
  const t = localStorage.getItem('wp_token')
  if (t) setAuthToken(t)
} catch {}




