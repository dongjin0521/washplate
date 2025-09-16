import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useWashStore } from '../../store/useWashStore'

type Vehicle = { id: number; plateNumber: string; nickname?: string; isDefault?: boolean }

export const UserVehicles = () => {
  const [list, setList] = useState<Vehicle[]>([])
  const [form, setForm] = useState({ plateNumber: '', nickname: '', isDefault: false })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingNickname, setEditingNickname] = useState('')
  const [showForm, setShowForm] = useState(false)

  const user = useWashStore(s => s.user)
  const login = useWashStore(s => s.login)

  const fetchList = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/vehicles')
      setList(data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchList() }, [])

  const normalizedPlate = useMemo(() => form.plateNumber.replace(/\s+/g, '').toUpperCase(), [form.plateNumber])
  const canSubmit = normalizedPlate.length >= 5 && !saving

  const add = async () => {
    setError(null)
    if (!canSubmit) return
    setSaving(true)
    try {
      await api.post('/vehicles', { plateNumber: normalizedPlate, nickname: form.nickname || undefined, isDefault: form.isDefault || undefined })
      setForm({ plateNumber: '', nickname: '', isDefault: false })
      fetchList()
    } catch (e: any) {
      setError(e?.response?.data?.message || '등록에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }
  const remove = async (id: number) => {
    if (!confirm('차량을 삭제할까요?')) return
    await api.delete(`/vehicles/${id}`)
    fetchList()
  }
  const setDefault = async (id: number) => {
    await api.put(`/vehicles/${id}`, { isDefault: true })
    fetchList()
  }
  const startEdit = (v: Vehicle) => {
    setEditingId(v.id)
    setEditingNickname(v.nickname || '')
  }
  const saveEdit = async (id: number) => {
    await api.put(`/vehicles/${id}`, { nickname: editingNickname })
    setEditingId(null)
    setEditingNickname('')
    fetchList()
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">차량 관리</h2>
      {!user && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-700">차량 관리를 위해 로그인해 주세요.</div>
          <button className="mt-3 h-10 w-full rounded-lg bg-sky-600 text-white" onClick={() => login(prompt('전화번호 입력') || '')}>로그인</button>
        </div>
      )}

      <section className="space-y-3">
        <div className="card">
          <div className="card-body">
          <div className="font-semibold mb-2">등록한 차량</div>
          {loading && <div className="text-sm text-gray-500">불러오는 중...</div>}
          {!loading && list.length === 0 && <div className="text-sm text-gray-500">등록된 차량이 없습니다</div>}
          <div className="space-y-2">
            {list.map(v => (
              <div key={v.id} className="rounded-xl border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium tracking-wide">{v.plateNumber}</div>
                  {editingId === v.id ? (
                    <div className="mt-1 flex items-center gap-2">
                      <input className="h-9 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 text-sm"
                        value={editingNickname} onChange={e => setEditingNickname(e.target.value)} placeholder="별칭" />
                      <button className="btn btn-primary h-9 px-3 text-sm" onClick={() => saveEdit(v.id)}>저장</button>
                      <button className="btn btn-outline h-9 px-3 text-sm" onClick={() => setEditingId(null)}>취소</button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-0.5">{v.nickname || '별칭 없음'}</div>
                  )}
                  {v.isDefault && <div className="mt-1 badge badge-sky">기본 차량</div>}
                </div>
                <div className="flex items-center gap-2">
                  {!v.isDefault && <button className="btn btn-outline h-9" onClick={() => setDefault(v.id)}>기본설정</button>}
                  {editingId !== v.id && <button className="btn btn-outline h-9" onClick={() => startEdit(v)}>편집</button>}
                  <button className="btn h-9 px-3 bg-rose-50 text-rose-700 border border-rose-200" onClick={() => remove(v.id)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {!showForm ? (
          <button className="btn btn-primary w-full" onClick={() => setShowForm(true)}>차량 등록</button>
        ) : (
          <div className="card">
            <div className="card-body">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">차량 등록</div>
              <button className="text-sm text-gray-500 hover:text-gray-700" onClick={() => setShowForm(false)}>닫기</button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="label">번호판</label>
                <input className="input"
                  placeholder="예) 12가3456" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })} />
              </div>
              <div>
                <label className="label">별칭(선택)</label>
                <input className="input"
                  placeholder="예) 출근용" value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-1">
                <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
                기본 차량으로 설정
              </label>
            </div>
            {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
            <button disabled={!canSubmit} className={"btn btn-primary w-full mt-3 " + (!canSubmit ? 'disabled' : '')} onClick={add}>{saving ? '등록 중...' : '등록'}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}


