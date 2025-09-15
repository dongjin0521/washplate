import { useEffect, useState } from 'react'
import { useWashStore } from '../../store/useWashStore'

export const UserHome = () => {
  const { user, session, login, startSession, syncUsage, closeSession } = useWashStore()
  const [local, setLocal] = useState({ minutes: 0, liters: 0, amount: 0 })

  useEffect(() => {
    if (!user) {
      login('01012345678', '세차유저')
    }
  }, [user, login])

  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-white/5 p-4 space-y-1">
        <div className="text-sm opacity-70">{session ? '현재 이용중' : '대기중'}</div>
        <div className="text-xl font-semibold mt-1">{session?.bayCode ?? '-'}</div>
        <div className="mt-2 text-sm">차량 {session?.plateNumber ?? '-'} · {session?.minutes ?? 0}분 · {session?.liters ?? 0}L</div>
        <div className="mt-3 text-2xl font-bold">{(session?.amount ?? 0).toLocaleString()}원</div>
      </section>
      {!session ? (
        <div className="grid grid-cols-2 gap-3">
          <button className="h-12 rounded-xl bg-emerald-500 text-white font-semibold" onClick={() => startSession('12가3456', 'BAY-01')}>세션 시작</button>
          <button className="h-12 rounded-xl bg-white/10 font-semibold">차량 관리</button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <input className="h-11 rounded-lg bg-white/10 px-3" placeholder="분" type="number" value={local.minutes} onChange={e => setLocal({ ...local, minutes: Number(e.target.value) })} />
            <input className="h-11 rounded-lg bg-white/10 px-3" placeholder="L" type="number" value={local.liters} onChange={e => setLocal({ ...local, liters: Number(e.target.value) })} />
            <input className="h-11 rounded-lg bg-white/10 px-3" placeholder="원" type="number" value={local.amount} onChange={e => setLocal({ ...local, amount: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="h-12 rounded-xl bg-white/10 font-semibold" onClick={() => syncUsage(local.minutes, local.liters, local.amount)}>사용량 동기화</button>
            <button className="h-12 rounded-xl bg-emerald-500 text-white font-semibold" onClick={async () => { const charged = await closeSession(); alert(`결제 금액: ${charged.toLocaleString()}원`) }}>결제하고 종료</button>
          </div>
        </div>
      )}
    </div>
  )
}


