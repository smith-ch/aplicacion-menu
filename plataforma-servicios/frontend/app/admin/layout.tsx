'use client';

import {
  BarChart3, ClipboardList, CreditCard, FileClock, HelpCircle, Images, Layers, LayoutDashboard, LogOut, Mail, Menu, MessageSquareQuote,
  Palette, Star, Users, Wrench, X, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { Spinner } from '@/components/ui/bits';

const NAV = [
  { group: 'Operación', items: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, admin: true },
    { href: '/admin/ordenes', label: 'Órdenes', icon: ClipboardList },
    { href: '/admin/pagos', label: 'Pagos', icon: CreditCard, admin: true },
    { href: '/admin/evaluaciones', label: 'Evaluaciones', icon: Star, admin: true },
    { href: '/admin/mensajes', label: 'Mensajes', icon: Mail, admin: true },
  ] },
  { group: 'Contenido de la web', items: [
    { href: '/admin/contenido', label: 'Textos y marca', icon: Palette, admin: true },
    { href: '/admin/servicios', label: 'Servicios', icon: Wrench, admin: true },
    { href: '/admin/pilares', label: 'Pilares', icon: Layers, admin: true },
    { href: '/admin/portafolio', label: 'Portafolio', icon: Images, admin: true },
    { href: '/admin/testimonios', label: 'Testimonios', icon: MessageSquareQuote, admin: true },
    { href: '/admin/faq', label: 'Preguntas frecuentes', icon: HelpCircle, admin: true },
  ] },
  { group: 'Sistema', items: [
    { href: '/admin/usuarios', label: 'Usuarios y técnicos', icon: Users, admin: true },
    { href: '/admin/integracion', label: 'Integración Concrebill', icon: FileClock, admin: true },
  ] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/login?next=${pathname}`);
    else if (user.role === 'client') router.replace('/mi-cuenta');
    else if (user.role === 'technician' && pathname === '/admin') router.replace('/admin/ordenes');
  }, [user, loading, router, pathname]);
  useEffect(() => setOpen(false), [pathname]);

  if (!user || user.role === 'client') return <Spinner className="min-h-screen items-center" />;
  const isAdmin = user.role === 'admin';

  const sidebar = (
    <nav className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/symbol-white.png" alt="" className="h-8" />
        <span className="leading-none"><span className="block font-display font-bold tracking-[0.14em]">F.I.S.C.</span><span className="text-[10px] tracking-widest text-white/50 uppercase">{isAdmin ? 'Administración' : 'Técnicos'}</span></span>
      </Link>
      <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {NAV.map((g) => {
          const items = g.items.filter((i) => isAdmin || !i.admin);
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">{g.group}</p>
              {items.map((i) => {
                const active = i.href === '/admin' ? pathname === '/admin' : pathname.startsWith(i.href);
                return (
                  <Link key={i.href} href={i.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-white text-ink-900' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}>
                    <i.icon className="h-4 w-4" /> {i.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/10 hover:text-white"><ExternalLink className="h-4 w-4" /> Ver sitio web</Link>
        <button onClick={() => { logout(); router.push('/'); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
        <p className="mt-2 truncate px-3 text-xs text-white/40">{user.name} · {user.email}</p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-sand-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink-950 text-white lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-ink-950 text-white">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-900/10 bg-sand-100/80 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Menú" className="grid h-10 w-10 place-items-center rounded-xl bg-white">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <span className="font-display font-bold tracking-[0.14em]">F.I.S.C.</span>
          <BarChart3 className="ml-auto h-5 w-5 text-ink-900/30" />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
