import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type PM = { id: number; type: 'CARD'|'ACCOUNT'; label: string; maskedNumber: string }

export const UserPayments = () => {
  const [list, setList] = useState<PM[]>([])
  const [form, setForm] = useState({ type: 'CARD', label: '', maskedNumber: '' })

  const fetchList = async () => {
    const { data } = await api.get('/payment-methods')
    setList(data)
  }
  useEffect(() => { fetchList() }, [])

  const add = async () => {
    if (!form.label || !form.maskedNumber) return
    await api.post('/payment-methods', form)
    setForm({ type: 'CARD', label: '', maskedNumber: '' })
    fetchList()
  }
  const remove = async (id: number) => {
    await api.delete(`/payment-methods/${id}`)
    fetchList()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">결제수단 관리</h2>
      <div className="rounded-xl bg-white/5 p-4 space-y-2">
        <div className="font-semibold">등록한 결제수단</div>
        {list.length === 0 && <div className="text-sm opacity-60">없음</div>}
        {list.map(m => (
          <div key={m.id} className="flex items-center justify-between text-sm">
            <div>{m.label} · {m.maskedNumber}</div>
            <button className="px-3 py-1 rounded bg-rose-600" onClick={() => remove(m.id)}>삭제</button>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white/5 p-4 space-y-2">
        <div className="font-semibold">결제수단 등록</div>
        <div className="grid grid-cols-3 gap-2">
          <select className="h-10 rounded bg-white/10 px-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
            <option value="CARD">카드</option>
            <option value="ACCOUNT">계좌</option>
          </select>
          <input className="h-10 rounded bg-white/10 px-3" placeholder="표시명" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          <input className="h-10 rounded bg-white/10 px-3" placeholder="마스킹번호" value={form.maskedNumber} onChange={e => setForm({ ...form, maskedNumber: e.target.value })} />
        </div>
        <button className="h-10 w-full rounded bg-emerald-600" onClick={add}>등록</button>
      </div>
      <div className="rounded-xl bg-white/5 p-4">포인트카드</div>
    </div>
  )
}


