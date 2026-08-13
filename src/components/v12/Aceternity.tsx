import type { CSSProperties, MouseEvent, PropsWithChildren, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

type ClassValue = string | false | null | undefined;

export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ');

export function Reveal({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function TextGenerate({ text, className }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.055 } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="v12-generated-word"
          key={`${word}-${index}`}
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 22, filter: reduceMotion ? 'none' : 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.span>
  );
}

export function Spotlight({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      aria-hidden="true"
      className={cn('v12-spotlight', className)}
      viewBox="0 0 3787 2842"
      fill="none"
      initial={reduceMotion ? false : { opacity: 0, y: -100, x: -100 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <g filter="url(#v12-spotlight-filter)">
        <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.69 2291.24)" fill="#F5B301" fillOpacity="0.26" />
      </g>
      <defs>
        <filter id="v12-spotlight-filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="151" />
        </filter>
      </defs>
    </motion.svg>
  );
}

const beamPaths = [
  'M-180 80C220 80 248 450 560 450C870 450 900 160 1280 160C1600 160 1680 500 2040 500',
  'M-160 360C150 360 290 170 560 170C920 170 930 590 1320 590C1660 590 1740 260 2100 260',
  'M-220 650C210 650 220 530 590 530C900 530 1050 780 1390 780C1710 780 1760 510 2130 510',
];

export function BackgroundBeams({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className={cn('v12-background-beams', className)}>
      <svg viewBox="0 0 1920 900" preserveAspectRatio="none">
        {beamPaths.map((path, index) => (
          <g key={path}>
            <path d={path} stroke="rgba(255,255,255,.06)" strokeWidth="1.2" />
            <motion.path
              d={path}
              stroke={`url(#v12-beam-gradient-${index})`}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={reduceMotion ? { pathLength: 1 } : { pathLength: [0, 0.75, 0], pathOffset: [0, 0.18, 1] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 6 + index * 1.4, repeat: Infinity, ease: 'linear', delay: index * 0.8 }}
            />
            <defs>
              <linearGradient id={`v12-beam-gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#F5B301" stopOpacity="0" />
                <stop offset=".35" stopColor="#F5B301" />
                <stop offset=".68" stopColor="#FFF0A8" />
                <stop offset="1" stopColor="#F5B301" stopOpacity="0" />
              </linearGradient>
            </defs>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function MovingBorderButton({
  children,
  className,
  onClick,
  type = 'button',
}: PropsWithChildren<{ className?: string; onClick?: () => void; type?: 'button' | 'submit' }>) {
  return (
    <button className={cn('v12-moving-border', className)} onClick={onClick} type={type}>
      <span className="v12-moving-border__track" aria-hidden="true" />
      <span className="v12-moving-border__surface">{children}</span>
    </button>
  );
}

export function CardSpotlight({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={cn('v12-card-spotlight', className)}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{ '--v12-spot-x': `${position.x}px`, '--v12-spot-y': `${position.y}px`, '--v12-spot-opacity': active ? 1 : 0 } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function WobbleCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const reduceMotion = useReducedMotion();
  const [point, setPoint] = useState({ x: 0, y: 0 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPoint({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 12,
    });
  };

  return (
    <motion.div
      className={cn('v12-wobble-card', className)}
      animate={{ x: point.x, y: point.y, scale: point.x || point.y ? 1.012 : 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.45 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setPoint({ x: 0, y: 0 })}
    >
      <motion.div animate={{ x: -point.x * 1.4, y: -point.y * 1.4 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function TiltCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const reduceMotion = useReducedMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    setRotate({ x: (0.5 - py) * 9, y: (px - 0.5) * 11 });
  };

  return (
    <div className={cn('v12-tilt-scene', className)} onMouseMove={handleMove} onMouseLeave={() => setRotate({ x: 0, y: 0 })}>
      <motion.div
        className="v12-tilt-card"
        animate={{ rotateX: rotate.x, rotateY: rotate.y, translateZ: rotate.x || rotate.y ? 18 : 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 20, mass: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export type StickyFeature = {
  label: string;
  title: string;
  body: string;
  outcome: string;
  icon: string;
  visual: ReactNode;
};

export function StickyReveal({ items }: { items: StickyFeature[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(items.length - 1, Math.max(0, Math.floor(latest * items.length)));
    setActive(index);
  });

  return (
    <div className="v12-sticky-reveal" ref={containerRef}>
      <div className="v12-sticky-reveal__copy">
        {items.map((item, index) => (
          <motion.article
            className={cn('v12-sticky-copy', active === index && 'is-active')}
            key={item.label}
            onMouseEnter={() => setActive(index)}
            initial={false}
            animate={{ opacity: active === index ? 1 : 0.34 }}
          >
            <span className="v12-agent-icon">{item.icon}</span>
            <small>{item.label}</small>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div>→ {item.outcome}</div>
          </motion.article>
        ))}
      </div>
      <div className="v12-sticky-reveal__stage">
        <div className="v12-sticky-stage__glow" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="v12-sticky-stage__visual"
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -18, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          >
            {items[active]?.visual}
          </motion.div>
        </AnimatePresence>
        <div className="v12-sticky-dots" aria-label={`Agente ${active + 1} di ${items.length}`}>
          {items.map((item, index) => <button type="button" key={item.label} aria-label={`Mostra ${item.label}`} onClick={() => setActive(index)} className={active === index ? 'is-active' : ''} />)}
        </div>
      </div>
    </div>
  );
}

export function TracingBeam({ children, className }: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.78', 'end 0.26'] });
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.35 });
  const height = useTransform(eased, [0, 1], ['0%', '100%']);

  return (
    <div className={cn('v12-tracing-beam', className)} ref={ref}>
      <div className="v12-tracing-beam__rail" aria-hidden="true">
        <motion.div className="v12-tracing-beam__progress" style={{ height }} />
        <motion.i style={{ top: height }} />
      </div>
      {children}
    </div>
  );
}

export function AnimatedModal({
  open,
  onClose,
  children,
  labelledBy,
}: PropsWithChildren<{ open: boolean; onClose: () => void; labelledBy: string }>) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...(surfaceRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])]
        .filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) {
        event.preventDefault();
        surfaceRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey, true);
    const focusFrame = requestAnimationFrame(() => {
      if (!surfaceRef.current?.contains(document.activeElement)) surfaceRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(focusFrame);
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey, true);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="v12-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
          <motion.div
            ref={surfaceRef}
            className="v12-modal__surface"
            tabIndex={-1}
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <button className="v12-modal__close" type="button" aria-label="Chiudi" onClick={onClose}>×</button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
