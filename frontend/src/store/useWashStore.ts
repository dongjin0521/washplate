import { create } from 'zustand'
import { api, setAuthToken } from '../api/client'

type Session = {
  id: number
  plateNumber: string
  bayCode: string
  minutes: number
  liters: number
  amount: number
}

type State = {
  user?: { id: number; name: string; phone: string; role: string }
  session?: Session
  login: (phone: string, name?: string) => Promise<void>
  logout: () => void
  startSession: (plateNumber: string, bayCode: string) => Promise<void>
  syncUsage: (minutes: number, liters: number, amount: number) => Promise<void>
  closeSession: () => Promise<number>
}

export const useWashStore = create<State>((set, get) => ({
  async login(phone, name) {
    const { data } = await api.post('/auth/login', { phone, name })
    if (data.token) setAuthToken(data.token)
    const user = { id: data.userId, name: data.name, phone: data.phone, role: data.role }
    try { localStorage.setItem('wp_user', JSON.stringify(user)) } catch {}
    set({ user })
  },
  logout() {
    setAuthToken(undefined)
    try { localStorage.removeItem('wp_user') } catch {}
    set({ user: undefined })
  },
  async startSession(plateNumber, bayCode) {
    const { data } = await api.post('/sessions/start', { plateNumber, bayCode })
    set({ session: { id: data.sessionId, plateNumber, bayCode, minutes: 0, liters: 0, amount: 0 } })
  },
  async syncUsage(minutes, liters, amount) {
    const s = get().session
    if (!s) return
    await api.post(`/sessions/${s.id}/sync`, { minutes, liters, amount })
    set({ session: { ...s, minutes, liters, amount } })
  },
  async closeSession() {
    const s = get().session
    if (!s) return 0
    const { data } = await api.post(`/sessions/${s.id}/close`)
    set({ session: undefined })
    return data.charged as number
  },
}))

// 초기 사용자 상태 하이드레이션
try {
  const raw = localStorage.getItem('wp_user')
  if (raw) {
    const parsed = JSON.parse(raw)
    useWashStore.setState({ user: parsed })
  }
} catch {}




