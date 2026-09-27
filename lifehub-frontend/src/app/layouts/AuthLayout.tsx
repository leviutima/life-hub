import { Outlet } from 'react-router'

/** Moldura das telas publicas (/auth/*): marca no topo, conteudo centralizado. */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 py-5">
        <span className="text-sm font-semibold tracking-tight">life-hub</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
