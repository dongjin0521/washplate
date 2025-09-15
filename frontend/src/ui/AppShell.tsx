import { Outlet, NavLink, useLocation } from 'react-router-dom'

export const AppShell = () => {
  const { pathname } = useLocation()
  return (
    <div className="mx-auto max-w-sm min-h-[100dvh] bg-gray-950 text-gray-100 flex flex-col" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }}>
      <header className="px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 bg-gray-950/80 backdrop-blur">
        <div className="font-semibold">Washplate</div>
        <div className="text-xs opacity-70">{pathname.startsWith('/admin') ? '관리자' : '이용자'}</div>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <nav className="sticky bottom-0 bg-gray-900/90 border-t border-white/10">
        {pathname.startsWith('/admin') ? (
          <div className="grid grid-cols-5 text-xs">
            <Tab to="/admin/status" label="현황" active={pathname.startsWith('/admin/status')} />
            <Tab to="/admin/vehicles" label="차량" active={pathname.startsWith('/admin/vehicles')} />
            <Tab to="/admin/settlements" label="정산수단" active={pathname.startsWith('/admin/settlements')} />
            <Tab to="/admin/franchises" label="가맹점" active={pathname.startsWith('/admin/franchises')} />
            <Tab to="/admin/settings" label="설정" active={pathname.startsWith('/admin/settings')} />
          </div>
        ) : (
          <div className="grid grid-cols-5 text-xs">
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
  <NavLink to={to} className={"text-center py-3 " + (active ? 'text-emerald-400' : 'text-gray-300')}>{label}</NavLink>
)




