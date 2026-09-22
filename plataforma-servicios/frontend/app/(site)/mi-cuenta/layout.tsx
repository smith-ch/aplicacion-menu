'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { Spinner } from '@/components/ui/bits';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login?next=/mi-cuenta');
    else if (user.role !== 'client') router.replace('/admin');
  }, [user, loading, router]);
  if (!user || user.role !== 'client') return <div className="pt-32"><Spinner /></div>;
  return <>{children}</>;
}
