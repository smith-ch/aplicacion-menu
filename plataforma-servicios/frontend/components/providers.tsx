'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '@/lib/api';
import type { Service, User } from '@/lib/types';

// ---------------- Autenticación ----------------

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: Record<string, string>) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
}

// ---------------- Carrito de servicios ----------------

export interface CartItem { serviceId: number; name: string; slug: string; icon: string | null; quantity: number; notes: string }

interface CartCtx {
  items: CartItem[];
  add: (s: Pick<Service, 'id' | 'name' | 'slug' | 'icon'>) => void;
  remove: (serviceId: number) => void;
  update: (serviceId: number, patch: Partial<CartItem>) => void;
  has: (serviceId: number) => boolean;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartCtx | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart fuera de CartProvider');
  return ctx;
}

const CART_KEY = 'ps_cart';

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!getToken()) { setUser(null); setLoading(false); return; }
    try { setUser(await api<User>('/auth/me')); } catch { setUser(null); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    refresh();
    try { setItems(JSON.parse(localStorage.getItem(CART_KEY) || '[]')); } catch { /* vacío */ }
  }, [refresh]);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
  }, [items]);

  const auth = useMemo<AuthCtx>(() => ({
    user, loading, refresh,
    login: async (email, password) => {
      const res = await api<{ token: string; user: User }>('/auth/login', { body: { email, password } });
      setToken(res.token); setUser(res.user); return res.user;
    },
    register: async (data) => {
      const res = await api<{ token: string; user: User }>('/auth/register', { body: data });
      setToken(res.token); setUser(res.user); return res.user;
    },
    logout: () => { setToken(null); setUser(null); },
  }), [user, loading, refresh]);

  const cart = useMemo<CartCtx>(() => ({
    items, open, setOpen,
    add: (s) => setItems((prev) => prev.some((i) => i.serviceId === s.id) ? prev
      : [...prev, { serviceId: s.id, name: s.name, slug: s.slug, icon: s.icon, quantity: 1, notes: '' }]),
    remove: (id) => setItems((prev) => prev.filter((i) => i.serviceId !== id)),
    update: (id, patch) => setItems((prev) => prev.map((i) => (i.serviceId === id ? { ...i, ...patch } : i))),
    has: (id) => items.some((i) => i.serviceId === id),
    clear: () => setItems([]),
  }), [items, open]);

  return (
    <AuthContext.Provider value={auth}>
      <CartContext.Provider value={cart}>{children}</CartContext.Provider>
    </AuthContext.Provider>
  );
}
