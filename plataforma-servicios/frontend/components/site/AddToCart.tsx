'use client';

import { Check, Plus } from 'lucide-react';
import { useCart } from '@/components/providers';
import type { Service } from '@/lib/types';

export function AddToCart({ service, className = '', label = 'Agregar' }: { service: Pick<Service, 'id' | 'name' | 'slug' | 'icon'>; className?: string; label?: string }) {
  const cart = useCart();
  const added = cart.has(service.id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (added) cart.remove(service.id); else { cart.add(service); cart.setOpen(true); } }}
      className={`${added ? 'btn bg-emerald-600 text-white' : 'btn-primary'} ${className}`}
    >
      {added ? <><Check className="h-4 w-4" /> Agregado</> : <><Plus className="h-4 w-4" /> {label}</>}
    </button>
  );
}
