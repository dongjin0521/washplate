import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useWashStore } from '../../store/useWashStore'

export const Login = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/u/status'
  const login = useWashStore(s => s.login)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!phone.trim()) return setError('전화번호를 입력하세요')
    setLoading(true)
    try {
      await login(phone, name || undefined)
      navigate(next, { replace: true })
    } catch (e: any) {
      setError(e?.response?.data?.message || '로그인에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 flex items-center justify-center min-h-[70dvh]">
      <div className="card w-full max-w-sm">
        <div className="card-body space-y-3">
          <h1 className="text-lg font-semibold">로그인</h1>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="label">전화번호</label>
              <input className="input" placeholder="010-1234-5678" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="label">이름(선택)</label>
              <input className="input" placeholder="이름" value={name} onChange={e => setName(e.target.value)} />
            </div>
            {error && <div className="text-xs text-rose-600">{error}</div>}
            <button disabled={loading} className={"btn btn-primary w-full " + (loading ? 'disabled' : '')}>
              {loading ? '진행 중...' : '로그인'}
            </button>
          </form>
          <div className="text-center text-sm text-gray-600">
            계정이 없으신가요? <Link to="/auth/register" className="text-sky-700">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
