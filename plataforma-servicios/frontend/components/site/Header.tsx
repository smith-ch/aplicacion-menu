'use client';

import { AnimatePresence, motion } from 'motion/react';
import { LogIn, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth, useCart } from '@/components/providers';
import type { Settings } from '@/lib/types';
import { Logo } from './Logo';

const NAV = [
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#proceso', label: 'Cómo trabajamos' },
  { href: '/#trabajos', label: 'Trabajos' },
  { href: '/#faq', label: 'Preguntas' },
  { href: '/#contacto', label: 'Contacto' },
  { href: '/seguimiento', label: 'Seguimiento' },
];

export function Header({ brand }: { brand: Settings['brand'] }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setMobile(false), [pathname]);

  // En la portada el header arranca transparente sobre el hero oscuro
  const dark = pathname === '/' && !scrolled;
  const account = user ? (user.role === 'client' ? '/mi-cuenta' : '/admin') : '/login';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${dark ? 'py-5' : 'py-3'}`}>
      <div className="container-x">
        <div className={`flex items-center justify-between rounded-full px-4 py-2 transition-all duration-500 sm:px-5 ${
          dark ? 'bg-transparent' : 'border border-ink-900/10 bg-white/75 shadow-lg shadow-ink-900/5 backdrop-blur-xl'}`}>
          <Logo name={brand.name} tagline={brand.tagline} logoUrl={brand.logoUrl} logoLightUrl={brand.logoLightUrl} light={dark} />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${dark ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-ink-900/70 hover:bg-ink-900/5 hover:text-ink-900'}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <button onClick={() => cart.setOpen(true)} aria-label="Ver solicitud"
              className={`relative grid h-10 w-10 place-items-center rounded-full transition ${dark ? 'text-white hover:bg-white/10' : 'hover:bg-ink-900/5'}`}>
              <ShoppingBag className="h-5 w-5" />
              {cart.items.length > 0 && (
                <span className="absolute top-0.5 right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink-950">
                  {cart.items.length}
                </span>
              )}
            </button>
            <Link href={account} aria-label="Mi cuenta"
              className={`hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition sm:flex ${dark ? 'text-white hover:bg-white/10' : 'hover:bg-ink-900/5'}`}>
              {user ? <UserRound className="h-4.5 w-4.5" /> : <LogIn className="h-4.5 w-4.5" />}
              <span>{user ? user.name.split(' ')[0] : 'Ingresar'}</span>
            </Link>
            <Link href="/solicitar" className="btn-primary hidden md:inline-flex">Solicitar servicio</Link>
            <button onClick={() => setMobile((v) => !v)} aria-label="Menú"
              className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${dark ? 'text-white' : ''}`}>
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobile && (
            <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mt-2 grid gap-1 rounded-3xl border border-ink-900/10 bg-white p-3 shadow-xl lg:hidden">
              {NAV.map((n) => <Link key={n.href} href={n.href} className="rounded-xl px-4 py-3 font-medium hover:bg-sand-100">{n.label}</Link>)}
              <Link href={account} className="rounded-xl px-4 py-3 font-medium hover:bg-sand-100">{user ? 'Mi cuenta' : 'Ingresar / Registrarse'}</Link>
              <Link href="/solicitar" className="btn-primary mt-1">Solicitar servicio</Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
