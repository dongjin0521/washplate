import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useWashStore } from '../../store/useWashStore'

export const Register = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/u/status'
  const login = useWashStore(s => s.login)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!phone.trim()) return setError('전화번호를 입력하세요')
    if (!agree) return setError('약관에 동의해 주세요')
    setLoading(true)
    try {
      // 데모: 회원가입과 로그인 동일 엔드포인트 사용
      await login(phone, name || undefined)
      navigate(next, { replace: true })
    } catch (e: any) {
      setError(e?.response?.data?.message || '회원가입에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 flex items-center justify-center min-h-[70dvh]">
      <div className="card w-full max-w-sm">
        <div className="card-body space-y-3">
          <h1 className="text-lg font-semibold">회원가입</h1>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="label">전화번호</label>
              <input className="input" placeholder="010-1234-5678" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="label">이름</label>
              <input className="input" placeholder="홍길동" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" checked={agree} onChange={e => setAgree(e.target.checked)} />
              서비스 이용약관 및 개인정보 수집에 동의합니다
            </label>
            {error && <div className="text-xs text-rose-600">{error}</div>}
            <button disabled={loading} className={"btn btn-primary w-full " + (loading ? 'disabled' : '')}>
              {loading ? '진행 중...' : '가입하기'}
            </button>
          </form>
          <div className="text-center text-sm text-gray-600">
            이미 계정이 있으신가요? <Link to="/auth/login" className="text-sky-700">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
