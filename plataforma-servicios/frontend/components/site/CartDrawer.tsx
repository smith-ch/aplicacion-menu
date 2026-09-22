'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/providers';
import { ServiceIcon } from '@/components/Icon';

export function CartDrawer() {
  const cart = useCart();
  return (
    <AnimatePresence>
      {cart.open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-ink-950/40 backdrop-blur-sm" onClick={() => cart.setOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="fixed top-0 right-0 bottom-0 z-[71] flex w-full max-w-md flex-col bg-sand-50 shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-ink-900/10 p-5">
              <h3 className="flex items-center gap-2 text-lg font-bold"><ShoppingBag className="h-5 w-5 text-brand" /> Tu solicitud</h3>
              <button onClick={() => cart.setOpen(false)} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-900/5"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {cart.items.length === 0 ? (
                <div className="py-16 text-center text-ink-900/50">
                  <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-40" />
                  <p>Aún no has agregado servicios.</p>
                  <Link href="/servicios" onClick={() => cart.setOpen(false)} className="btn-ghost mt-4">Ver catálogo</Link>
                </div>
              ) : cart.items.map((i) => (
                <div key={i.serviceId} className="card flex items-center gap-3 p-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><ServiceIcon name={i.icon} className="h-5 w-5" /></span>
                  <span className="flex-1 text-sm font-semibold">{i.name}</span>
                  <button onClick={() => cart.remove(i.serviceId)} aria-label="Quitar" className="grid h-8 w-8 place-items-center rounded-full text-ink-900/40 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            {cart.items.length > 0 && (
              <div className="border-t border-ink-900/10 p-5">
                <p className="mb-3 text-xs text-ink-900/60">Un solo levantamiento para todos los servicios. Recibirás una cotización unificada.</p>
                <Link href="/solicitar" onClick={() => cart.setOpen(false)} className="btn-primary w-full">
                  Continuar con la solicitud <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
