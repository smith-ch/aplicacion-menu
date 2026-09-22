'use client';

import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';

/**
 * Símbolo F.I.S.C. armado con sus 4 piezas (recortadas del logo oficial).
 * - Al cargar, las piezas llegan desde afuera y se ensamblan.
 * - Con el cursor, cada pieza se desplaza según su profundidad (parallax 3D)
 *   y el conjunto se inclina.
 * - Al hacer scroll las piezas se separan en una "vista explotada".
 */
const PIECES = [
  { id: 'f', depth: 18, explode: { x: -70, y: -60, r: -8 }, enter: { x: -260, y: -120 } },
  { id: 's-top', depth: 38, explode: { x: 60, y: -30, r: 7 }, enter: { x: 240, y: -160 } },
  { id: 's-mid', depth: 60, explode: { x: -30, y: 40, r: -6 }, enter: { x: -80, y: 220 } },
  { id: 's-bottom', depth: 28, explode: { x: 40, y: 110, r: 6 }, enter: { x: 200, y: 260 } },
] as const;

export function LogoParallax({ variant = 'white', className = '', scrollTarget }: {
  variant?: 'white' | 'black';
  className?: string;
  /** Sección que controla la "explosión" con el scroll (por defecto el propio componente). */
  scrollTarget?: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(sy, [-1, 1], [12, -12]);

  const { scrollYProgress } = useScroll({ target: scrollTarget ?? ref, offset: ['start start', 'end start'] });
  const explode = useSpring(useTransform(scrollYProgress, [0, 0.7], [0, 1]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  return (
    <div ref={ref} className={`relative [perspective:1200px] ${className}`}>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative aspect-[422/511] w-full">
        {/* Halo de luz detrás del símbolo */}
        <div className="absolute inset-[10%] rounded-full bg-accent/25 blur-3xl" />
        {PIECES.map((p, i) => (
          <Piece key={p.id} piece={p} index={i} variant={variant} sx={sx} sy={sy} explode={explode} />
        ))}
      </motion.div>
    </div>
  );
}

function Piece({ piece, index, variant, sx, sy, explode }: {
  piece: (typeof PIECES)[number]; index: number; variant: string;
  sx: MotionValue<number>; sy: MotionValue<number>; explode: MotionValue<number>;
}) {
  const x = useTransform([sx, explode] as MotionValue[], ([m, e]: number[]) => m * piece.depth + e * piece.explode.x);
  const y = useTransform([sy, explode] as MotionValue[], ([m, e]: number[]) => m * piece.depth + e * piece.explode.y);
  const rotate = useTransform(explode, [0, 1], [0, piece.explode.r]);
  return (
    <motion.div className="absolute inset-0" style={{ x, y, rotate, z: piece.depth * 2 }}>
      <motion.img
        src={`/brand/piece-${piece.id}-${variant}.png`}
        alt=""
        draggable={false}
        className="h-full w-full select-none"
        initial={{ opacity: 0, x: piece.enter.x, y: piece.enter.y, rotate: piece.explode.r * 3, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.2 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

/**
 * Campo de piezas del logo flotando a distintas profundidades: las lejanas son
 * pequeñas, difusas y lentas; las cercanas grandes y rápidas (parallax con
 * cursor y con scroll).
 */
const SHARDS = [
  { id: 's-mid', left: 6, top: 18, size: 90, depth: 0.2, rot: -20, blur: 3, o: 0.18 },
  { id: 's-top', left: 14, top: 72, size: 140, depth: 0.5, rot: 25, blur: 1, o: 0.22 },
  { id: 'f', left: 44, top: 8, size: 70, depth: 0.15, rot: 40, blur: 4, o: 0.12 },
  { id: 's-bottom', left: 38, top: 82, size: 110, depth: 0.35, rot: -12, blur: 2, o: 0.16 },
  { id: 's-mid', left: 88, top: 12, size: 120, depth: 0.6, rot: 15, blur: 0, o: 0.2 },
  { id: 'f', left: 92, top: 64, size: 180, depth: 0.8, rot: -25, blur: 0, o: 0.14 },
  { id: 's-top', left: 62, top: 90, size: 80, depth: 0.25, rot: 60, blur: 3, o: 0.14 },
  { id: 's-bottom', left: 2, top: 46, size: 60, depth: 0.1, rot: 80, blur: 5, o: 0.1 },
];

export function LogoShards({ variant = 'white', scrollTarget }: { variant?: 'white' | 'black'; scrollTarget?: React.RefObject<HTMLElement | null> }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const { scrollYProgress } = useScroll({ target: scrollTarget, offset: ['start start', 'end start'] });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SHARDS.map((s, i) => <Shard key={i} s={s} sx={sx} sy={sy} scroll={scrollYProgress} variant={variant} i={i} />)}
    </div>
  );
}

function Shard({ s, sx, sy, scroll, variant, i }: {
  s: (typeof SHARDS)[number]; sx: MotionValue<number>; sy: MotionValue<number>; scroll: MotionValue<number>; variant: string; i: number;
}) {
  const x = useTransform(sx, (v) => -v * 60 * s.depth);
  const y = useTransform([sy, scroll] as MotionValue[], ([v, p]: number[]) => -v * 60 * s.depth - p * 600 * s.depth);
  const rotate = useTransform(scroll, [0, 1], [s.rot, s.rot + 90 * s.depth * (i % 2 ? 1 : -1)]);
  return (
    <motion.div className="absolute" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, x, y, rotate }}>
      <motion.img
        src={`/brand/piece-${s.id}-${variant}.png`}
        alt=""
        className="w-full animate-float"
        style={{ filter: `blur(${s.blur}px)`, opacity: s.o, animationDelay: `${i * -1.3}s`, animationDuration: `${7 + (i % 4) * 2}s` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, delay: 0.6 + i * 0.08 }}
      />
    </motion.div>
  );
}
