'use client';

import { useEffect, useRef } from 'react';

interface Props {
  /** Colores de las manchas de luz (aurora). */
  colors?: string[];
  /** Muestra la malla de puntos reactiva al cursor. */
  dots?: boolean;
  className?: string;
}

/**
 * Fondo interactivo tipo "aurora": manchas de luz que flotan y una de ellas
 * persigue al cursor con inercia; encima, una malla de puntos que se aparta y
 * se ilumina alrededor del puntero. Se pausa fuera de pantalla y respeta
 * `prefers-reduced-motion`.
 */
export function InteractiveBackground({ colors = ['#3E4A52', '#8FA4B0', '#1f2a30', '#5b6b75'], dots = true, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const aurora = auroraRef.current!;
    const dotCanvas = dotsRef.current;
    const actx = aurora.getContext('2d')!;
    const dctx = dotCanvas?.getContext('2d') ?? null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, t = 0;
    const mouse = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4, px: -9999, py: -9999, active: false };

    const blobs = colors.map((c, i) => ({
      color: c,
      r: 0.35 + (i % 3) * 0.08,
      sx: 0.2 + ((i * 37) % 60) / 100,
      sy: 0.2 + ((i * 53) % 60) / 100,
      speed: 0.00018 + i * 0.00005,
      phase: i * 1.7,
    }));

    function resize() {
      const rect = wrap.getBoundingClientRect();
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // La aurora se pinta a baja resolución (se difumina con CSS): mucho más barato.
      aurora.width = Math.max(1, Math.round(w / 6));
      aurora.height = Math.max(1, Math.round(h / 6));
      if (dotCanvas) { dotCanvas.width = w * dpr; dotCanvas.height = h * dpr; }
    }

    function drawAurora() {
      const aw = aurora.width, ah = aurora.height;
      actx.clearRect(0, 0, aw, ah);
      actx.globalCompositeOperation = 'lighter';
      blobs.forEach((b, i) => {
        let x = (b.sx + Math.sin(t * b.speed + b.phase) * 0.18) * aw;
        let y = (b.sy + Math.cos(t * b.speed * 1.3 + b.phase) * 0.16) * ah;
        if (i === 0) { x = mouse.x * aw; y = mouse.y * ah; } // la primera sigue al cursor
        const r = b.r * Math.max(aw, ah);
        const g = actx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, hexA(b.color, i === 0 ? 0.75 : 0.55));
        g.addColorStop(1, hexA(b.color, 0));
        actx.fillStyle = g;
        actx.fillRect(0, 0, aw, ah);
      });
      actx.globalCompositeOperation = 'source-over';
    }

    function drawDots() {
      if (!dctx || !dotCanvas) return;
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dctx.clearRect(0, 0, w, h);
      const gap = w < 640 ? 26 : 32;
      const radius = 170;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.px, dy = y - mouse.py;
          const dist = Math.hypot(dx, dy);
          let ox = 0, oy = 0, glow = 0;
          if (dist < radius) {
            const f = 1 - dist / radius;
            ox = (dx / (dist || 1)) * f * 14;
            oy = (dy / (dist || 1)) * f * 14;
            glow = f;
          }
          const wave = reduced ? 0 : Math.sin((x + y) * 0.012 + t * 0.0015) * 0.5 + 0.5;
          dctx.fillStyle = `rgba(255,255,255,${0.07 + wave * 0.05 + glow * 0.55})`;
          dctx.beginPath();
          dctx.arc(x + ox, y + oy, 1 + glow * 1.6, 0, Math.PI * 2);
          dctx.fill();
        }
      }
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      t = now;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      if (!mouse.active && !reduced) {
        // Sin cursor (móvil / reposo) la luz principal describe una órbita suave
        mouse.tx = 0.5 + Math.sin(now * 0.0003) * 0.25;
        mouse.ty = 0.45 + Math.cos(now * 0.00025) * 0.15;
      }
      drawAurora();
      drawDots();
    }

    function onMove(e: PointerEvent) {
      const rect = wrap.getBoundingClientRect();
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) { mouse.active = false; mouse.px = mouse.py = -9999; return; }
      mouse.active = true;
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = (e.clientY - rect.top) / rect.height;
      mouse.px = e.clientX - rect.left;
      mouse.py = e.clientY - rect.top;
    }

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(wrap);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    window.addEventListener('pointermove', onMove, { passive: true });
    if (reduced) { drawAurora(); drawDots(); } else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [colors.join(','), dots]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={auroraRef} className="absolute inset-0 h-full w-full scale-110 blur-3xl saturate-150" />
      {dots && <canvas ref={dotsRef} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
