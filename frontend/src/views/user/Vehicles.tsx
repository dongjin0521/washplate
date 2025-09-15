import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type Vehicle = { id: number; plateNumber: string; nickname?: string; isDefault?: boolean }

export const UserVehicles = () => {
  const [list, setList] = useState<Vehicle[]>([])
  const [form, setForm] = useState({ plateNumber: '', nickname: '' })

  const fetchList = async () => {
    const { data } = await api.get('/vehicles')
    setList(data)
  }
  useEffect(() => { fetchList() }, [])

  const add = async () => {
    if (!form.plateNumber.trim()) return
    await api.post('/vehicles', form)
    setForm({ plateNumber: '', nickname: '' })
    fetchList()
  }
  const remove = async (id: number) => {
    await api.delete(`/vehicles/${id}`)
    fetchList()
  }
  const setDefault = async (id: number) => {
    await api.put(`/vehicles/${id}`, { isDefault: true })
    fetchList()
  }
  const rename = async (id: number, nickname: string) => {
    await api.put(`/vehicles/${id}`, { nickname })
    fetchList()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">차량 관리</h2>
      <div className="rounded-xl bg-white/5 p-4 space-y-2">
        <div className="font-semibold">등록한 차량</div>
        {list.length === 0 && <div className="text-sm opacity-60">없음</div>}
        {list.map(v => (
          <div key={v.id} className="space-y-1 rounded-lg bg-white/0 p-2">
            <div className="flex items-center justify-between text-sm">
              <div>
                {v.plateNumber} {v.nickname ? `· ${v.nickname}` : ''}
                {v.isDefault ? <span className="ml-2 px-2 py-0.5 text-[10px] rounded bg-emerald-600">기본</span> : null}
              </div>
              <div className="space-x-2">
                {!v.isDefault && <button className="px-2 py-1 rounded bg-emerald-600" onClick={() => setDefault(v.id)}>기본설정</button>}
                <button className="px-2 py-1 rounded bg-white/10" onClick={() => {
                  const nn = prompt('별칭 변경', v.nickname || '')
                  if (nn != null) rename(v.id, nn)
                }}>이름변경</button>
                <button className="px-2 py-1 rounded bg-rose-600" onClick={() => remove(v.id)}>삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white/5 p-4 space-y-2">
        <div className="font-semibold">차량 등록</div>
        <div className="grid grid-cols-3 gap-2">
          <input className="h-10 rounded bg-white/10 px-3 col-span-2" placeholder="번호판" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })} />
          <input className="h-10 rounded bg-white/10 px-3" placeholder="별칭(선택)" value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} />
        </div>
        <button className="h-10 w-full rounded bg-emerald-600" onClick={add}>등록</button>
      </div>
    </div>
  )
}


