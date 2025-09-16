import { Outlet, NavLink, useLocation } from 'react-router-dom'

export const AppShell = () => {
  const { pathname } = useLocation()
  return (
    <div className="mx-auto max-w-sm min-h-[100dvh] bg-white text-gray-900 flex flex-col" style={{ boxShadow: '0 0 0 1px rgba(17,24,39,0.06)' }}>
      <header className="px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 bg-white/85 backdrop-blur">
        <div className="font-semibold tracking-tight text-sky-700">Washplate</div>
        <div className="text-xs text-gray-500">{pathname.startsWith('/admin') ? '관리자' : '이용자'}</div>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <nav className="sticky bottom-0 bg-white/95 border-t border-gray-200">
        {pathname.startsWith('/admin') ? (
          <div className="grid grid-cols-5 text-[11px]">
            <Tab to="/admin/status" label="현황" active={pathname.startsWith('/admin/status')} />
            <Tab to="/admin/vehicles" label="차량" active={pathname.startsWith('/admin/vehicles')} />
            <Tab to="/admin/settlements" label="정산수단" active={pathname.startsWith('/admin/settlements')} />
            <Tab to="/admin/franchises" label="가맹점" active={pathname.startsWith('/admin/franchises')} />
            <Tab to="/admin/settings" label="설정" active={pathname.startsWith('/admin/settings')} />
          </div>
        ) : (
          <div className="grid grid-cols-5 text-[11px]">
            <Tab to="/u/status" label="현황" active={pathname.startsWith('/u/status')} />
            <Tab to="/u/vehicles" label="차량" active={pathname.startsWith('/u/vehicles')} />
            <Tab to="/u/payments" label="결제수단" active={pathname.startsWith('/u/payments')} />
            <Tab to="/u/merchants" label="가맹점" active={pathname.startsWith('/u/merchants')} />
            <Tab to="/u/settings" label="설정" active={pathname.startsWith('/u/settings')} />
          </div>
        )}
      </nav>
    </div>
  )
}

const Tab = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <NavLink to={to} className={"text-center py-3 relative group " + (active ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700')}>
    <span className={"inline-flex items-center gap-1 px-3 py-1 rounded-full " + (active ? 'bg-sky-50 text-sky-700' : 'bg-transparent group-hover:bg-gray-100')}>{label}</span>
  </NavLink>
)




