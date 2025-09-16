import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useWashStore } from '../../store/useWashStore'

type Active = { id: number; plateNumber: string; bayCode: string; bayName?: string; minutes: number; liters: number; amount: number } | null
type History = { id: number; bayCode: string; startedAt: string; endedAt: string; minutes: number; liters: number; amount: number }

const formatCurrency = (v: number) => v.toLocaleString() + '원'
const formatLiters = (v: number) => v.toFixed(1) + 'L'
const formatMinutes = (v: number) => v + '분'
const formatDateTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '-')

export const UserStatus = () => {
  const [active, setActive] = useState<Active>(null)
  const [history, setHistory] = useState<History[]>([])
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState<{ id: number; plateNumber: string; isDefault?: boolean }[]>([])
  const [plateNumber, setPlateNumber] = useState<string>('')
  const user = useWashStore(s => s.user)

  // 사용자 차량 목록 로드 및 기본 차량 선택
  useEffect(() => {
    let mounted = true
    api.get('/vehicles')
      .then(res => {
        if (!mounted) return
        const list = res.data as { id: number; plateNumber: string; isDefault?: boolean }[]
        setVehicles(list)
        const def = list.find(v => v.isDefault)
        setPlateNumber(def?.plateNumber || list[0]?.plateNumber || '')
      })
      .catch(() => { setVehicles([]); setPlateNumber('') })
    return () => { mounted = false }
  }, [])

  // 선택된 차량의 현황/이력 로드
  useEffect(() => {
    if (!plateNumber) { setActive(null); setHistory([]); setLoading(false); return }
    setLoading(true)
    Promise.all([
      api.get(`/sessions/active`, { params: { plateNumber } }),
      api.get(`/sessions/history`, { params: { plateNumber } }),
    ])
      .then(([a, h]) => {
        setActive(a.data.active)
        setHistory(h.data)
      })
      .finally(() => setLoading(false))
  }, [plateNumber])

  const totals = useMemo(() => {
    const totalAmount = history.reduce((s, x) => s + (x.amount || 0), 0)
    const totalMinutes = history.reduce((s, x) => s + (x.minutes || 0), 0)
    const totalLiters = history.reduce((s, x) => s + (x.liters || 0), 0)
    return { totalAmount, totalMinutes, totalLiters }
  }, [history])

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 bg-gradient-to-br from-sky-50 via-sky-100/70 to-transparent border border-sky-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-emerald-300/80">내 차량 현황</div>
            <div className="text-2xl font-semibold mt-1">{plateNumber || '—'}</div>
          </div>
          <div className={"px-2.5 py-1 rounded-full text-xs font-medium " + (active ? 'bg-sky-100 text-sky-700 border border-sky-300' : 'bg-gray-100 text-gray-600 border border-gray-200')}>
            {active ? '이용 중' : '대기 중'}
          </div>
        </div>
        {vehicles.length > 1 && (
          <div className="mt-3">
            <select className="input h-10" value={plateNumber} onChange={e => setPlateNumber(e.target.value)}>
              {vehicles.map(v => (
                <option key={v.id} value={v.plateNumber}>{v.plateNumber}{v.isDefault ? ' · 기본' : ''}</option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="누적 시간" value={formatMinutes(totals.totalMinutes)} />
          <Stat label="누적 물 사용" value={formatLiters(totals.totalLiters)} />
          <Stat label="누적 결제" value={formatCurrency(totals.totalAmount)} />
        </div>
        {active && (
          <div className="mt-4 rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">현재 사용내역</div>
            <div className="flex items-center justify-between">
              <div className="text-sm">{active.bayName ? `${active.bayName} · 베이 ${active.bayCode}` : `베이 ${active.bayCode}`}</div>
              <div className="text-xl font-bold">{formatCurrency(active.amount)}</div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div className="rounded-lg bg-sky-50/60 px-2.5 py-1.5 text-center border border-sky-100 text-sky-700">{formatMinutes(active.minutes)}</div>
              <div className="rounded-lg bg-sky-50/60 px-2.5 py-1.5 text-center border border-sky-100 text-sky-700">{formatLiters(active.liters)}</div>
              <div className="rounded-lg bg-sky-50/60 px-2.5 py-1.5 text-center border border-sky-100 text-sky-700">베이 {active.bayCode}</div>
            </div>
          </div>
        )}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">최근 이용내역</h3>
          {history.length > 0 && (
            <div className="text-xs text-gray-500">최근 입차 {formatDateTime(history[0]?.startedAt)}</div>
          )}
        </div>
        <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden bg-white shadow-sm">
          {loading && (
            <div className="p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/3"></div>
            </div>
          )}
          {!loading && history.length === 0 && (
            <div className="p-6 text-sm text-gray-500">기록 없음</div>
          )}
          {!loading && history.map(h => (
            <div key={h.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">베이 {h.bayCode}</div>
                <div className="text-xs text-gray-500">{formatDateTime(h.startedAt)} → {formatDateTime(h.endedAt)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{formatMinutes(h.minutes)} · {formatLiters(h.liters)}</div>
                <div className="text-base font-semibold">{formatCurrency(h.amount)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-white border border-gray-200 p-3 shadow-sm">
    <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    <div className="mt-1.5 text-lg font-semibold text-gray-900">{value}</div>
  </div>
)


