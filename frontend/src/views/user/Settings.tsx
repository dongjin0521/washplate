import { useWashStore } from '../../store/useWashStore'
import { api } from '../../api/client'
import { useNavigate } from 'react-router-dom'

export const UserSettings = () => {
  const user = useWashStore(s => s.user)
  const logout = useWashStore(s => s.logout)
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">설정</h2>

      <div className="card">
        <div className="card-body flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">{user?.name?.[0] || 'U'}</div>
          <div className="flex-1">
            <div className="font-medium">{user?.name || '사용자'}</div>
            <div className="text-sm text-gray-600">{user?.phone || '-'}</div>
          </div>
          <button className="btn btn-outline">프로필 편집</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body space-y-2">
          <div className="font-semibold">계정</div>
          <div className="flex items-center justify-between">
            <div className="text-sm">알림 수신</div>
            <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">자동 로그인</div>
            <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" defaultChecked />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body space-y-2">
          <div className="font-semibold">앱 정보</div>
          <div className="text-sm text-gray-600">버전 0.0.1</div>
          <div className="text-sm text-gray-600">오픈소스 라이선스</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <button className="btn w-full bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={async () => {
            try { await api.post('/auth/logout') } catch {}
            logout()
            const next = encodeURIComponent('/u/status')
            navigate('/auth/login?next=' + next, { replace: true })
          }}>로그아웃</button>
          <button className="btn w-full mt-2 bg-rose-50 text-rose-700 border border-rose-200" onClick={() => alert('지원팀에 문의해주세요.')}>회원 탈퇴</button>
        </div>
      </div>
    </div>
  )
}


