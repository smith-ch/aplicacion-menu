'use client';

import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '@/components/providers';
import { AuthShell } from '@/components/ui/AuthCard';
import { Alert } from '@/components/ui/bits';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true); setError('');
    try {
      const user = await login(String(f.get('email')), String(f.get('password')));
      router.push(next || (user.role === 'client' ? '/mi-cuenta' : '/admin'));
    } catch (err) { setError((err as Error).message); setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div><label className="label">Correo</label><input name="email" type="email" required className="input" autoComplete="email" /></div>
      <div><label className="label">Contraseña</label><input name="password" type="password" required className="input" autoComplete="current-password" /></div>
      {error && <Alert>{error}</Alert>}
      <button className="btn-primary w-full py-3" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Ingresar</button>
      <p className="text-center text-sm text-ink-900/60">¿No tienes cuenta? <Link href={`/registro${next ? `?next=${next}` : ''}`} className="font-semibold text-brand">Regístrate</Link></p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell title="Bienvenido de nuevo" subtitle="Accede a tu portal para ver tus órdenes, documentos y evaluaciones.">
      <Suspense><LoginForm /></Suspense>
    </AuthShell>
  );
}
