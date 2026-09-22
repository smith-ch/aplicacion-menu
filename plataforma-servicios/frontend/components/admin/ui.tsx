'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { api } from '@/lib/api';

export function AdminTitle({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-900/60">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <motion.div className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            className={`relative my-8 w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-3xl bg-white p-6 shadow-2xl`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{title}</h2>
              <button onClick={onClose} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-900/5"><X className="h-5 w-5" /></button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Campo de imagen: sube el archivo al API y devuelve la URL pública. */
export function ImageField({ label, value, onChange, dark = false }: { label: string; value: string | null | undefined; onChange: (url: string) => void; dark?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    setBusy(true); setError('');
    try { onChange((await api<{ url: string }>('/uploads', { body: fd })).url); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => input.current?.click()}
          className={`relative grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-ink-900/20 ${dark ? 'bg-ink-900' : 'bg-sand-50'} hover:border-brand`}>
          {busy ? <Loader2 className="h-5 w-5 animate-spin text-brand" /> : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : <ImagePlus className="h-6 w-6 text-ink-900/30" />}
        </button>
        <div className="min-w-0 flex-1 space-y-1.5">
          <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="URL o sube un archivo" className="input" />
          <div className="flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="btn-ghost btn-sm"><Upload className="h-3 w-3" /> Subir</button>
            {value && <button type="button" onClick={() => onChange('')} className="btn-sm btn text-rose-600 hover:bg-rose-50">Quitar</button>}
          </div>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-brand' : 'bg-ink-900/20'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5.5' : 'left-0.5'}`} />
      </button>
      {label}
    </label>
  );
}

export function Toast({ msg, onClose }: { msg: { tone: 'error' | 'success'; text: string } | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          onAnimationComplete={() => setTimeout(onClose, 2800)}
          className={`fixed right-5 bottom-5 z-[90] rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-xl ${msg.tone === 'error' ? 'bg-rose-600' : 'bg-ink-900'}`}>
          {msg.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
