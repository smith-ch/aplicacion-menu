'use client';

import { Eye, EyeOff, Loader2, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ICON_NAMES, ServiceIcon } from '@/components/Icon';
import { Empty, Spinner } from '@/components/ui/bits';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { AdminTitle, ImageField, Modal, Toast, Toggle } from './ui';

export type Field =
  | { key: string; label: string; type: 'text' | 'textarea' | 'number' | 'color'; required?: boolean; full?: boolean; placeholder?: string }
  | { key: string; label: string; type: 'bool' | 'image' | 'icon' | 'list'; full?: boolean }
  | { key: string; label: string; type: 'select'; options: { value: string | number; label: string }[]; full?: boolean };

type Row = Record<string, unknown> & { id: number };

/**
 * Pantalla CRUD genérica del panel: lista con vista previa, alta, edición,
 * activar/ocultar y eliminar. Cada sección de contenido la reutiliza.
 */
export function CrudPage({ title, subtitle, endpoint, fields, defaults, render, toForm, toBody }: {
  title: string;
  subtitle?: string;
  endpoint: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  render: (row: Row) => React.ReactNode;
  toForm?: (row: Row) => Record<string, unknown>;
  toBody?: (form: Record<string, unknown>) => Record<string, unknown>;
}) {
  const { data, loading, reload } = useApi<Row[]>(endpoint);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const { id, ...rest } = editing;
    const body = toBody ? toBody(rest) : rest;
    try {
      await api(id ? `${endpoint}/${id}` : endpoint, { method: id ? 'PATCH' : 'POST', body });
      setEditing(null); setMsg({ tone: 'success', text: 'Guardado. Los cambios ya se ven en la web.' }); reload();
    } catch (err) { setMsg({ tone: 'error', text: (err as Error).message }); } finally { setSaving(false); }
  }

  async function remove(row: Row) {
    if (!confirm('¿Eliminar este elemento? Esta acción no se puede deshacer.')) return;
    try { await api(`${endpoint}/${row.id}`, { method: 'DELETE' }); reload(); } catch (err) { setMsg({ tone: 'error', text: (err as Error).message }); }
  }

  async function toggle(row: Row) {
    try { await api(`${endpoint}/${row.id}`, { method: 'PATCH', body: { active: !row.active } }); reload(); } catch (err) { setMsg({ tone: 'error', text: (err as Error).message }); }
  }

  const set = (k: string, v: unknown) => setEditing((f) => ({ ...f!, [k]: v }));

  return (
    <div>
      <AdminTitle title={title} subtitle={subtitle}>
        <button onClick={() => setEditing({ ...defaults })} className="btn-primary"><Plus className="h-4 w-4" /> Agregar</button>
      </AdminTitle>
      {loading && !data ? <Spinner /> : !data?.length ? <Empty>No hay elementos todavía. Usa “Agregar”.</Empty> : (
        <div className="grid gap-3">
          {data.map((row) => (
            <div key={row.id} className={`card flex items-center gap-4 p-4 ${row.active === false ? 'opacity-55' : ''}`}>
              <div className="min-w-0 flex-1">{render(row)}</div>
              <div className="flex shrink-0 gap-1">
                {'active' in row && (
                  <button onClick={() => toggle(row)} title={row.active ? 'Ocultar de la web' : 'Mostrar en la web'} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-900/5">
                    {row.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                )}
                <button onClick={() => setEditing(toForm ? toForm(row) : { ...row })} title="Editar" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-900/5"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(row)} title="Eliminar" className="grid h-9 w-9 place-items-center rounded-full text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Editar' : 'Agregar'} wide={fields.length > 5}>
        {editing && (
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.full || f.type === 'textarea' || f.type === 'list' || f.type === 'image' ? 'sm:col-span-2' : ''}>
                <FieldInput field={f} value={editing[f.key]} onChange={(v) => set(f.key, v)} />
              </div>
            ))}
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancelar</button>
              <button className="btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar</button>
            </div>
          </form>
        )}
      </Modal>
      <Toast msg={msg} onClose={() => setMsg(null)} />
    </div>
  );
}

export function FieldInput({ field: f, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (f.type) {
    case 'bool':
      return <div className="pt-6"><Toggle checked={!!value} onChange={onChange} label={f.label} /></div>;
    case 'image':
      return <ImageField label={f.label} value={value as string} onChange={onChange} />;
    case 'textarea':
      return <><label className="label">{f.label}</label><textarea rows={4} value={(value as string) ?? ''} required={f.required} onChange={(e) => onChange(e.target.value)} className="input" placeholder={f.placeholder} /></>;
    case 'number':
      return <><label className="label">{f.label}</label><input type="number" step="any" value={(value as number) ?? ''} required={f.required} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} className="input" placeholder={f.placeholder} /></>;
    case 'color':
      return <><label className="label">{f.label}</label><div className="flex gap-2"><input type="color" value={(value as string) || '#3E4A52'} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-ink-900/15" /><input value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} className="input" /></div></>;
    case 'select':
      return <><label className="label">{f.label}</label><select value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} className="input"><option value="">—</option>{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></>;
    case 'icon':
      return (
        <div>
          <label className="label">{f.label}</label>
          <div className="flex flex-wrap gap-1.5">
            {ICON_NAMES.map((n) => (
              <button key={n} type="button" onClick={() => onChange(n)} title={n}
                className={`grid h-10 w-10 place-items-center rounded-xl border transition ${value === n ? 'border-brand bg-brand text-white' : 'border-ink-900/10 hover:border-brand/40'}`}>
                <ServiceIcon name={n} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      );
    case 'list': {
      const list = (value as string[]) ?? [];
      return (
        <div>
          <label className="label">{f.label}</label>
          <div className="space-y-2">
            {list.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))} className="input" />
                <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => onChange([...list, ''])} className="btn-ghost btn-sm"><Plus className="h-3 w-3" /> Agregar punto</button>
          </div>
        </div>
      );
    }
    default:
      return <><label className="label">{f.label}</label><input value={(value as string) ?? ''} required={f.required} onChange={(e) => onChange(e.target.value)} className="input" placeholder={f.placeholder} /></>;
  }
}
