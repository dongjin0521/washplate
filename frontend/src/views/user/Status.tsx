import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type Active = { id: number; plateNumber: string; bayCode: string; minutes: number; liters: number; amount: number } | null
type History = { id: number; bayCode: string; startedAt: string; endedAt: string; minutes: number; liters: number; amount: number }

export const UserStatus = () => {
  const [active, setActive] = useState<Active>(null)
  const [history, setHistory] = useState<History[]>([])

  useEffect(() => {
    const plate = '12가3456'
    api.get(`/sessions/active`, { params: { plateNumber: plate } }).then(res => setActive(res.data.active))
    api.get(`/sessions/history`, { params: { plateNumber: plate } }).then(res => setHistory(res.data))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">현황</h2>
      <div className="rounded-xl bg-white/5 p-4">
        <div className="font-semibold mb-2">입출차 시간</div>
        {history[0] ? (
          <div className="text-sm opacity-80">최근 입차: {new Date(history[0].startedAt).toLocaleString()}</div>
        ) : (
          <div className="text-sm opacity-60">기록 없음</div>
        )}
      </div>
      <div className="rounded-xl bg-white/5 p-4">
        <div className="font-semibold mb-2">현재 사용내역</div>
        {active ? (
          <div className="space-y-1 text-sm">
            <div>베이 {active.bayCode}</div>
            <div>{active.minutes}분 · {active.liters}L</div>
            <div className="text-xl font-bold">{active.amount.toLocaleString()}원</div>
          </div>
        ) : (
          <div className="text-sm opacity-60">이용중 아님</div>
        )}
      </div>
      <div className="rounded-xl bg-white/5 p-4">
        <div className="font-semibold mb-2">누적 이용내역</div>
        <div className="space-y-2">
          {history.length === 0 && <div className="text-sm opacity-60">기록 없음</div>}
          {history.map(h => (
            <div key={h.id} className="flex items-center justify-between text-sm">
              <div>베이 {h.bayCode}</div>
              <div>{h.minutes}분 / {h.liters}L / {h.amount.toLocaleString()}원</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


