import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'

type Row = { id: number; bayCode: string; startedAt: string; endedAt: string; minutes: number; liters: number; amount: number }

export const AdminStatus = () => {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [carwashes, setCarwashes] = useState<Array<{ id: number; code: string; name: string }>>([])
  const [selectedCarwashId, setSelectedCarwashId] = useState<number | ''>('')
  const [bays, setBays] = useState<Array<{ id: number; code: string; name?: string; active: boolean }>>([])

  useEffect(() => {
    // 세차장 목록 로드
    api.get('/carwashes')
      .then(res => {
        const list = res.data as Array<{ id: number; code: string; name: string }>
        setCarwashes(list)
        if (list[0]) setSelectedCarwashId(list[0].id)
      })
      .catch(() => setCarwashes([]))
  }, [])

  useEffect(() => {
    if (!selectedCarwashId) { setBays([]); return }
    api.get(`/carwashes/${selectedCarwashId}/bays`).then(res => setBays(res.data))
  }, [selectedCarwashId])

  useEffect(() => {
    // NOTE: 아직 카워시별 세션 API가 없어 샘플 차량으로 대체 (목업 표시)
    setLoading(true)
    api.get(`/sessions/history`, { params: { plateNumber: '12가3456' } })
      .then(res => setRows(res.data))
      .finally(() => setLoading(false))
  }, [selectedCarwashId])

  const metrics = useMemo(() => {
    const today = new Date().toDateString()
    const todayRows = rows.filter(r => new Date(r.startedAt).toDateString() === today)
    const baysActive = bays.filter(b => b.active).length
    const revenue = rows.reduce((s, r) => s + (r.amount || 0), 0)
    const todayRevenue = todayRows.reduce((s, r) => s + (r.amount || 0), 0)
    return { baysActive, revenue, todayRevenue, bayCount: bays.length }
  }, [rows, bays])

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">현황</h2>

      <div className="flex items-center gap-2">
        <select className="input h-10 max-w-xs" value={selectedCarwashId} onChange={e => setSelectedCarwashId(Number(e.target.value))}>
          {carwashes.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
          ))}
        </select>
        <span className="text-xs text-gray-500">세차장 선택</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="전체 베이" value={String(metrics.bayCount)} accent="from-sky-50" />
        <KpiCard label="가동 베이" value={String(metrics.baysActive)} accent="from-sky-50" />
        <KpiCard label="누적 매출" value={formatCurrency(metrics.revenue)} accent="from-sky-50" />
        <KpiCard label="금일 매출" value={formatCurrency(metrics.todayRevenue)} accent="from-sky-50" />
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 p-3 text-xs">
        현재 매출/세션 표는 샘플 데이터(차량 기준)입니다. 카워시별 세션 API 연결 시 실제 지표로 대체됩니다.
      </div>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">최근 세션</h3>
        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <div className="grid grid-cols-5 gap-3 px-4 py-2 text-[11px] uppercase tracking-wide text-gray-500 bg-gray-50">
            <div>베이</div>
            <div>입차</div>
            <div>퇴차</div>
            <div>이용</div>
            <div className="text-right">금액</div>
          </div>
          {loading && (
            <div className="p-4 text-sm text-gray-500">로딩 중...</div>
          )}
          {!loading && rows.length === 0 && (
            <div className="p-6 text-sm text-gray-500">데이터 없음</div>
          )}
          {!loading && rows.map(r => (
            <div key={r.id} className="grid grid-cols-5 gap-3 px-4 py-3 border-t border-gray-100">
              <div className="text-sm font-medium">{r.bayCode}</div>
              <div className="text-xs text-gray-500">{formatDateTime(r.startedAt)}</div>
              <div className="text-xs text-gray-500">{formatDateTime(r.endedAt)}</div>
              <div className="text-sm">{r.minutes}분 · {r.liters.toFixed(1)}L</div>
              <div className="text-right font-semibold">{formatCurrency(r.amount)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">베이 목록</h3>
        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <div className="grid grid-cols-3 gap-3 px-4 py-2 text-[11px] uppercase tracking-wide text-gray-500 bg-gray-50">
            <div>코드</div>
            <div>이름</div>
            <div className="text-right">상태</div>
          </div>
          {bays.length === 0 && (
            <div className="p-6 text-sm text-gray-500">베이가 없습니다</div>
          )}
          {bays.map(b => (
            <div key={b.id} className="grid grid-cols-3 gap-3 px-4 py-3 border-t border-gray-100">
              <div className="text-sm font-medium">{b.code}</div>
              <div className="text-sm text-gray-600">{b.name || '-'}</div>
              <div className="text-right text-sm">{b.active ? '활성' : '비활성'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const formatCurrency = (v: number) => v.toLocaleString() + '원'
const formatDateTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '-')

const KpiCard = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
  <div className={`rounded-2xl p-4 border border-gray-200 bg-gradient-to-br ${accent} to-transparent shadow-sm`}>
    <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    <div className="mt-1.5 text-xl font-semibold text-gray-900">{value}</div>
  </div>
)


