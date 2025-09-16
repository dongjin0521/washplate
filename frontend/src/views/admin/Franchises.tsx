import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type Carwash = { id: number; code: string; name: string; address?: string; active: boolean }
type Bay = { id: number; code: string; name?: string; active: boolean }

export const AdminFranchises = () => {
  const [list, setList] = useState<Carwash[]>([])
  const [selected, setSelected] = useState<Carwash | null>(null)
  const [bays, setBays] = useState<Bay[]>([])
  const [form, setForm] = useState({ code: '', name: '', address: '' })
  const [bayForm, setBayForm] = useState({ code: '', name: '' })
  const [query, setQuery] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const load = async () => {
    const { data } = await api.get('/carwashes')
    setList(data)
    if (!selected && data[0]) select(data[0])
  }
  const select = async (c: Carwash) => {
    setSelected(c)
    const { data } = await api.get(`/carwashes/${c.id}/bays`)
    setBays(data)
  }

  useEffect(() => { load() }, [])

  const createCarwash = async () => {
    if (!form.code || !form.name) { setMsg('코드와 이름을 입력하세요'); return }
    try {
      await api.post('/carwashes', form)
      setForm({ code: '', name: '', address: '' })
      setMsg('세차장이 추가되었습니다')
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message || '추가에 실패했습니다')
    }
  }
  const updateCarwash = async () => {
    if (!selected) return
    await api.put(`/carwashes/${selected.id}`, { name: selected.name, address: selected.address })
    load()
  }
  const deleteCarwash = async (id: number) => {
    if (!confirm('세차장을 삭제할까요?')) return
    await api.delete(`/carwashes/${id}`)
    setSelected(null)
    load()
  }

  const createBay = async () => {
    if (!selected || !bayForm.code) { setMsg('베이 코드를 입력하세요'); return }
    await api.post(`/carwashes/${selected.id}/bays`, { code: bayForm.code, name: bayForm.name })
    setBayForm({ code: '', name: '' })
    setMsg('베이가 추가되었습니다')
    select(selected)
  }
  const updateBay = async (b: Bay) => {
    if (!selected) return
    await api.put(`/carwashes/${selected.id}/bays/${b.id}`, { name: b.name, active: b.active })
    select(selected)
  }
  const deleteBay = async (b: Bay) => {
    if (!selected) return
    if (!confirm('베이를 삭제할까요?')) return
    await api.delete(`/carwashes/${selected.id}/bays/${b.id}`)
    select(selected)
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">세차장 관리</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="card-body space-y-3">
            <div className="font-semibold">세차장 목록</div>
            <input className="input" placeholder="검색 (이름/코드)" value={query} onChange={e => setQuery(e.target.value)} />
            <div className="space-y-2 max-h-80 overflow-auto">
              {list.filter(c => (c.name + c.code).toLowerCase().includes(query.toLowerCase())).map(c => (
                <button key={c.id} className={"w-full text-left px-3 py-2 rounded-lg border " + (selected?.id === c.id ? 'border-sky-400 bg-sky-50' : 'border-gray-200')} onClick={() => select(c)}>
                  <div className="text-sm font-medium">{c.name} ({c.code})</div>
                  <div className="text-xs text-gray-600">{c.address || '-'}</div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="font-semibold text-sm">새 세차장</div>
              <input className="input" placeholder="코드" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              <input className="input" placeholder="이름" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="주소(선택)" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              <button className="btn btn-primary w-full" onClick={createCarwash}>세차장 추가</button>
              {msg && <div className="text-xs text-gray-600">{msg}</div>}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">세차장 상세</div>
              {selected && <button className="btn bg-rose-50 text-rose-700 border border-rose-200" onClick={() => deleteCarwash(selected.id)}>삭제</button>}
            </div>

            {!selected && <div className="text-sm text-gray-500">세차장을 선택하세요</div>}
            {selected && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label">코드</label>
                    <input className="input" value={selected.code} disabled />
                  </div>
                  <div>
                    <label className="label">이름</label>
                    <input className="input" value={selected.name} onChange={e => setSelected({ ...selected!, name: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label">주소</label>
                  <input className="input" value={selected.address || ''} onChange={e => setSelected({ ...selected!, address: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-outline" onClick={updateCarwash}>저장</button>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="font-semibold mb-2">베이</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input className="input" placeholder="코드 (예: 01)" value={bayForm.code} onChange={e => setBayForm({ ...bayForm, code: e.target.value })} />
                    </div>
                    <div>
                      <input className="input" placeholder="이름(선택)" value={bayForm.name} onChange={e => setBayForm({ ...bayForm, name: e.target.value })} />
                    </div>
                    <button className="btn btn-primary col-span-3" onClick={createBay}>베이 추가</button>
                  </div>

                  <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-4 gap-3 px-3 py-2 text-[11px] uppercase tracking-wide text-gray-500 bg-gray-50">
                      <div>코드</div>
                      <div>이름</div>
                      <div>상태</div>
                      <div className="text-right">액션</div>
                    </div>
                    {bays.map(b => (
                      <div key={b.id} className="grid grid-cols-4 gap-3 px-3 py-2 border-t border-gray-100 items-center">
                        <div className="text-sm font-medium">{b.code}</div>
                        <input className="input h-9" value={b.name || ''} onChange={e => setBays(prev => prev.map(x => x.id === b.id ? { ...x, name: e.target.value } : x))} />
                        <label className="text-sm text-gray-700 inline-flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" checked={b.active} onChange={e => setBays(prev => prev.map(x => x.id === b.id ? { ...x, active: e.target.checked } : x))} />
                          활성
                        </label>
                        <div className="text-right space-x-2">
                          <button className="btn btn-outline h-9" onClick={() => updateBay(b)}>저장</button>
                          <button className="btn h-9 bg-rose-50 text-rose-700 border border-rose-200" onClick={() => deleteBay(b)}>삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


