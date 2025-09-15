export const AdminHome = () => {
  const bays = [
    { id: 'BAY-01', plate: '25나 1024', using: true, amount: 900 },
    { id: 'BAY-02', plate: '12가 3456', using: true, amount: 1800 },
    { id: 'BAY-03', plate: null, using: false, amount: 0 },
  ]
  const allow = async (id: string, allow: boolean) => {
    try {
      await (await import('../../api/client')).api.post('/device/allow-water', undefined, { params: { bayCode: id, allow } })
      alert(`${id} ${allow ? '허용' : '차단'} 완료`)
    } catch (e) {
      alert('명령 실패')
    }
  }
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">베이 모니터링</h2>
      <div className="grid grid-cols-2 gap-3">
        {bays.map(b => (
          <div key={b.id} className="rounded-xl bg-white/5 p-4">
            <div className="text-sm opacity-70">{b.id}</div>
            <div className="mt-1 font-semibold">{b.plate ?? '대기중'}</div>
            <div className="mt-1 text-sm">{b.using ? '사용중' : '미사용'}</div>
            <div className="mt-2 text-xl font-bold">{b.amount.toLocaleString()}원</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="h-9 rounded-lg bg-emerald-500 font-semibold" onClick={() => allow(b.id, true)}>물 허용</button>
              <button className="h-9 rounded-lg bg-rose-600 font-semibold" onClick={() => allow(b.id, false)}>차단</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


