'use client';

import { Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '@/components/providers';
import { AuthShell } from '@/components/ui/AuthCard';
import { Alert } from '@/components/ui/bits';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    for (const k of Object.keys(data)) if (!data[k]) delete data[k];
    setLoading(true); setError('');
    try { await register(data); router.push(next || '/mi-cuenta'); }
    catch (err) { setError((err as Error).message); setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><label className="label">Nombre completo / Empresa *</label><input name="name" required minLength={2} className="input" /></div>
      <div className="sm:col-span-2"><label className="label">Correo *</label><input name="email" type="email" required className="input" /></div>
      <div><label className="label">Teléfono</label><input name="phone" className="input" /></div>
      <div><label className="label">RNC / Cédula</label><input name="documentId" className="input" /></div>
      <div className="sm:col-span-2"><label className="label">Dirección</label><input name="address" className="input" /></div>
      <div className="sm:col-span-2"><label className="label">Contraseña *</label><input name="password" type="password" required minLength={6} className="input" autoComplete="new-password" /></div>
      {error && <div className="sm:col-span-2"><Alert>{error}</Alert></div>}
      <button className="btn-primary py-3 sm:col-span-2" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Crear cuenta</button>
      <p className="text-center text-sm text-ink-900/60 sm:col-span-2">¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-brand">Inicia sesión</Link></p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell title="Crea tu cuenta" subtitle="Tus solicitudes anteriores hechas con el mismo correo se vincularán automáticamente.">
      <Suspense><RegisterForm /></Suspense>
    </AuthShell>
  );
}
