import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';

function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>;
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={className}>
      <Container>{children}</Container>
    </section>
  );
}

function FadeIn({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function FeatureIcon({ children }) {
  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-[14px] border"
      style={{
        borderColor: 'var(--lp-border)',
        background: 'rgb(var(--lp-accent-primary-rgb) / 0.10)',
        color: 'var(--lp-accent-primary)',
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function BentoCard({ children, className = '', style }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-[28px] border ${className}`}
      style={{
        borderColor: 'var(--lp-border)',
        background: 'var(--lp-surface-strong)',
        boxShadow: 'var(--lp-shadow)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function MockFrame({ title, children }) {
  return (
    <div
      className="overflow-hidden rounded-[22px] border"
      style={{
        borderColor: 'var(--lp-border)',
        background: 'var(--lp-surface-strong)',
        boxShadow: 'var(--lp-shadow)',
      }}
    >
      <div
        className="flex h-11 items-center justify-between px-4"
        style={{
          background:
            'linear-gradient(90deg, rgb(var(--lp-accent-primary-rgb) / 0.18), rgb(var(--lp-accent-secondary-rgb) / 0.12))',
          borderBottom: '1px solid var(--lp-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.80)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgb(var(--lp-accent-secondary-rgb) / 0.78)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgb(var(--lp-accent-tertiary-rgb) / 0.76)' }} />
        </div>
        <div className="text-xs font-extrabold tracking-tight" style={{ color: 'var(--lp-text)' }}>
          {title}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ScreenshotFrame({ title, src, alt }) {
  return (
    <div
      className="overflow-hidden rounded-[22px] border"
      style={{
        borderColor: 'var(--lp-border)',
        background: 'var(--lp-surface-strong)',
        boxShadow: 'var(--lp-shadow)',
      }}
    >
      <div
        className="flex h-11 items-center justify-between px-4"
        style={{
          background:
            'linear-gradient(90deg, rgb(var(--lp-accent-primary-rgb) / 0.18), rgb(var(--lp-accent-secondary-rgb) / 0.12))',
          borderBottom: '1px solid var(--lp-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.80)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgb(var(--lp-accent-secondary-rgb) / 0.78)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgb(var(--lp-accent-tertiary-rgb) / 0.76)' }} />
        </div>
        <div className="text-xs font-extrabold tracking-tight" style={{ color: 'var(--lp-text)' }}>
          {title}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="overflow-hidden rounded-[18px] border" style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.02)' }}>
          <img src={src} alt={alt} className="block h-auto w-full" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

function MockEditor({ compact = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <MockFrame title="Editor">
      <div className="flex flex-wrap gap-2">
        {['Heading', 'To-do', 'Code', 'Link'].slice(0, compact ? 3 : 4).map((t) => (
          <span
            key={t}
            className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
            style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)', color: 'var(--lp-text-secondary)' }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <motion.div
          className="h-5 w-2/3 rounded-full"
          style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.16)' }}
          animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
          transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="mt-4 grid gap-3">
          <motion.div
            className="h-3 w-full rounded-full"
            style={{ background: 'rgb(148 163 184 / 0.22)' }}
            animate={reduceMotion ? undefined : { opacity: [0.65, 0.95, 0.65] }}
            transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="h-3 w-11/12 rounded-full"
            style={{ background: 'rgb(148 163 184 / 0.18)' }}
            animate={reduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55] }}
            transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          />
          <motion.div
            className="h-3 w-4/5 rounded-full"
            style={{ background: 'rgb(148 163 184 / 0.18)' }}
            animate={reduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55] }}
            transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>

        <div className="mt-6 grid gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <motion.span
                className="h-4 w-4 rounded-[6px] border"
                style={{
                  borderColor: 'var(--lp-border)',
                  background: 'rgb(255 255 255 / 0.02)',
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                      borderColor:
                        i === 0
                          ? ['var(--lp-border)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.34)', 'var(--lp-border)']
                          : i === 1
                            ? ['rgb(var(--lp-accent-tertiary-rgb) / 0.34)', 'var(--lp-border)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.34)']
                            : ['var(--lp-border)', 'var(--lp-border)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.34)'],
                      background:
                        i === 0
                          ? ['rgb(255 255 255 / 0.02)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.14)', 'rgb(255 255 255 / 0.02)']
                          : i === 1
                            ? ['rgb(var(--lp-accent-tertiary-rgb) / 0.14)', 'rgb(255 255 255 / 0.02)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.14)']
                            : ['rgb(255 255 255 / 0.02)', 'rgb(255 255 255 / 0.02)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.14)'],
                    }
                }
                transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
              />
              <div className="h-3 flex-1 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function MockSearch({ compact = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <MockFrame title="Search">
      <div
        className="rounded-[16px] border px-4 py-3"
        style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="h-2.5 w-2/3 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
          <motion.span
            className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
            style={{
              borderColor: 'rgb(var(--lp-accent-secondary-rgb) / 0.30)',
              background: 'rgb(var(--lp-accent-secondary-rgb) / 0.14)',
              color: 'var(--lp-text)',
            }}
            animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            Cmd K
          </motion.span>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {Array.from({ length: compact ? 3 : 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-[16px] border px-4 py-3"
            style={{
              borderColor: 'var(--lp-border)',
              background: i === 0 ? 'rgb(var(--lp-accent-primary-rgb) / 0.10)' : 'rgb(255 255 255 / 0.03)',
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                  background:
                    i === 0
                      ? ['rgb(var(--lp-accent-primary-rgb) / 0.10)', 'rgb(255 255 255 / 0.03)', 'rgb(255 255 255 / 0.03)']
                      : i === 1
                        ? ['rgb(255 255 255 / 0.03)', 'rgb(var(--lp-accent-primary-rgb) / 0.10)', 'rgb(255 255 255 / 0.03)']
                        : ['rgb(255 255 255 / 0.03)', 'rgb(255 255 255 / 0.03)', 'rgb(var(--lp-accent-primary-rgb) / 0.10)'],
                }
            }
            transition={reduceMotion ? undefined : { duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.05 * i }}
          >
            <div className="h-3 w-2/3 rounded-full" style={{ background: 'rgb(148 163 184 / 0.26)' }} />
            <div className="mt-2 h-2.5 w-full rounded-full" style={{ background: 'rgb(148 163 184 / 0.18)' }} />
          </motion.div>
        ))}
      </div>
    </MockFrame>
  );
}

function MockColors({ compact = false }) {
  const reduceMotion = useReducedMotion();
  const colors = useMemo(
    () => [
      { bg: 'rgb(var(--lp-accent-primary-rgb) / 0.16)', border: 'rgb(var(--lp-accent-primary-rgb) / 0.30)' },
      { bg: 'rgb(var(--lp-accent-secondary-rgb) / 0.14)', border: 'rgb(var(--lp-accent-secondary-rgb) / 0.30)' },
      { bg: 'rgb(var(--lp-accent-tertiary-rgb) / 0.12)', border: 'rgb(var(--lp-accent-tertiary-rgb) / 0.28)' },
      { bg: 'rgb(251 113 133 / 0.10)', border: 'rgb(251 113 133 / 0.22)' },
      { bg: 'rgb(250 204 21 / 0.10)', border: 'rgb(250 204 21 / 0.22)' },
    ],
    []
  );

  return (
    <MockFrame title="Colors">
      <div className="grid gap-3">
        {Array.from({ length: compact ? 2 : 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-[16px] border px-4 py-3"
            style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
          >
            <div>
              <div className="text-sm font-black" style={{ color: 'var(--lp-text)' }}>
                Note {i + 1}
              </div>
              <div className="mt-1 text-xs font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                subtle highlight
              </div>
            </div>
            <div className="flex items-center gap-2">
              {colors.slice(0, 4).map((c, idx) => (
                <span key={idx} className="h-4 w-4 rounded-full border" style={{ borderColor: c.border, background: c.bg }} aria-hidden="true" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-5 gap-2">
        {colors.map((c, idx) => (
          <motion.div
            key={idx}
            className="h-10 rounded-[14px] border"
            style={{ borderColor: c.border, background: c.bg }}
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
            transition={reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.12 }}
          />
        ))}
      </div>
    </MockFrame>
  );
}

function MockSharing({ compact = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <MockFrame title="Sharing">
      <div className="grid gap-3">
        <motion.div
          className="rounded-[16px] border px-4 py-3"
          style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
          animate={
            reduceMotion
              ? undefined
              : {
                borderColor: ['var(--lp-border)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.30)', 'var(--lp-border)'],
                background: ['rgb(255 255 255 / 0.03)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.10)', 'rgb(255 255 255 / 0.03)'],
              }
          }
          transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-sm font-black" style={{ color: 'var(--lp-text)' }}>
            Share link
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="h-2.5 flex-1 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
            <motion.span
              className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
              style={{
                borderColor: 'rgb(var(--lp-accent-tertiary-rgb) / 0.28)',
                background: 'rgb(var(--lp-accent-tertiary-rgb) / 0.12)',
                color: 'var(--lp-text)',
              }}
              animate={reduceMotion ? undefined : { opacity: [1, 0.75, 1], scale: [1, 1.03, 1] }}
              transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Copy
            </motion.span>
          </div>
        </motion.div>

        <div
          className="rounded-[16px] border px-4 py-3"
          style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-black" style={{ color: 'var(--lp-text)' }}>
                Access
              </div>
              <div className="mt-1 text-xs font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                view-only
              </div>
            </div>
            <span
              className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
              style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.02)', color: 'var(--lp-text-secondary)' }}
            >
              Public link
            </span>
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="mt-6 grid grid-cols-3 gap-2">
          {['A', 'B', 'C'].map((k) => (
            <div
              key={k}
              className="h-9 rounded-[14px] border"
              style={{
                borderColor: 'var(--lp-border)',
                background:
                  k === 'B'
                    ? 'linear-gradient(135deg, rgb(var(--lp-accent-primary-rgb) / 0.16), rgb(var(--lp-accent-secondary-rgb) / 0.10))'
                    : 'rgb(255 255 255 / 0.03)',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : null}
    </MockFrame>
  );
}

function MockAutosave({ compact = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <MockFrame title="Autosave">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-black" style={{ color: 'var(--lp-text)' }}>
            Status
          </div>
          <div className="mt-1 text-xs font-bold" style={{ color: 'var(--lp-text-muted)' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
              transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              updating…
            </motion.span>
          </div>
        </div>
        <div className="relative">
          <motion.span
            className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
            style={{
              borderColor: 'rgb(var(--lp-accent-primary-rgb) / 0.30)',
              background: 'rgb(var(--lp-accent-primary-rgb) / 0.12)',
              color: 'var(--lp-text)',
              position: 'absolute',
              inset: 0,
              justifyContent: 'center',
              whiteSpace: 'nowrap',
            }}
            animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
            transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Saving…
          </motion.span>
          <motion.span
            className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
            style={{
              borderColor: 'rgb(var(--lp-accent-secondary-rgb) / 0.28)',
              background: 'rgb(var(--lp-accent-secondary-rgb) / 0.12)',
              color: 'var(--lp-text)',
              whiteSpace: 'nowrap',
            }}
            animate={reduceMotion ? undefined : { opacity: [0, 1, 0] }}
            transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Saved
          </motion.span>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {Array.from({ length: compact ? 2 : 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[16px] border px-4 py-3"
            style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
          >
            <div className="flex items-center justify-between">
              <motion.div
                className="h-2.5 w-1/2 rounded-full"
                style={{ background: 'rgb(148 163 184 / 0.18)' }}
                animate={reduceMotion ? undefined : { opacity: [0.55, 0.92, 0.55] }}
                transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.12 * i }}
              />
              <motion.div
                className="h-2.5 w-16 rounded-full"
                style={{ background: 'rgb(148 163 184 / 0.14)' }}
                animate={reduceMotion ? undefined : { opacity: [0.45, 0.85, 0.45] }}
                transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.18 * i }}
              />
            </div>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

export default function LandingPageNew() {
  const reduceMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const mockupRotate = useTransform(scrollYProgress, [0, 1], [0.6, 0]);

  const heroContainer = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: 0.055,
          delayChildren: 0.08,
        },
      },
    }),
    []
  );

  const heroLine = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    }),
    []
  );

  return (
    <div className="LandingPageNew min-h-screen" style={{ background: 'var(--lp-bg-2)', color: 'var(--lp-text)' }}>
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          borderBottomColor: 'var(--lp-border)',
          background: 'var(--lp-surface)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-sm font-black tracking-tight" aria-label="Memora">
            <div className="BrandMark is-logo" style={{ width: 175, height: 40 }}>
              <img className="BrandLogo" src="/logo-memora.png" alt="Memora" />
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" aria-label="Primary">
            <a href="#features" className="transition-colors" style={{ color: 'var(--lp-text-secondary)' }}>
              Features
            </a>
            <a href="#stories" className="transition-colors" style={{ color: 'var(--lp-text-secondary)' }}>
              Stories
            </a>
            <a href="#pricing" className="transition-colors" style={{ color: 'var(--lp-text-secondary)' }}>
              Pricing
            </a>
            <a href="#contact" className="transition-colors" style={{ color: 'var(--lp-text-secondary)' }}>
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden md:inline-flex text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
                  {user.email}
                </span>
                <Link
                  to="/app"
                  className="hidden md:inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                    color: 'white',
                    boxShadow: '0 22px 70px rgb(var(--lp-accent-primary-rgb) / 0.22)',
                  }}
                >
                  Go to app
                </Link>
                <button
                  onClick={() => signOut().then(() => navigate('/'))}
                  className="hidden md:inline-flex rounded-full border px-4 py-2 text-sm font-extrabold"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text)', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full border px-4 py-2 text-sm font-extrabold md:inline-flex"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text)' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                    color: 'white',
                    boxShadow: '0 22px 70px rgb(var(--lp-accent-primary-rgb) / 0.22)',
                  }}
                >
                  Get started free
                </Link>
              </>
            )}
            <button
              className="MobileNavToggle md:hidden"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileNavOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
                )}
              </svg>
            </button>
          </div>
        </Container>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <motion.div
            className="MobileNavDrawer md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'var(--lp-surface-strong)',
              borderBottom: '1px solid var(--lp-border)',
              padding: '16px 24px 24px',
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
            }}
          >
            <nav className="grid gap-1" aria-label="Mobile">
              {[
                { href: '#features', label: 'Features' },
                { href: '#stories', label: 'Stories' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#contact', label: 'Contact' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-[14px] px-4 py-3 text-sm font-bold transition-colors"
                  style={{ color: 'var(--lp-text)', display: 'block' }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            {user ? (
              <div className="mt-4 grid gap-3">
                <div className="px-4 py-2 text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
                  {user.email}
                </div>
                <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Link
                    to="/app"
                    onClick={() => setMobileNavOpen(false)}
                    className="inline-flex h-11 items-center justify-center rounded-[14px] text-sm font-extrabold"
                    style={{
                      background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                      color: 'white',
                    }}
                  >
                    Go to app
                  </Link>
                  <button
                    onClick={() => { setMobileNavOpen(false); signOut().then(() => navigate('/')); }}
                    className="inline-flex h-11 items-center justify-center rounded-[14px] border text-sm font-extrabold"
                    style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text)', cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border text-sm font-extrabold"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text)' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] text-sm font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                    color: 'white',
                  }}
                >
                  Get started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </header>

      <main>
        <section
          id="top"
          className="relative pt-20 HeroSection"
          style={{ background: 'linear-gradient(180deg, var(--lp-bg), var(--lp-bg-2))', overflow: 'hidden' }}
          data-reduce-motion={reduceMotion ? 'true' : 'false'}
        >
          {/* Animated gradient mesh */}
          <div className="HeroGradientMesh" aria-hidden="true" />
          <Container>
            <div ref={heroRef} className="grid items-center gap-10 pb-16 pt-10 lg:grid-cols-2 lg:pb-24">
              <motion.div variants={heroContainer} initial={reduceMotion ? false : 'hidden'} animate="show">
                <motion.div
                  variants={heroLine}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.24em]"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text-muted)' }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))' }}
                  />
                  Calm, writing-first notes
                </motion.div>

                <motion.h1
                  variants={heroLine}
                  className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  Notes that feel
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    like a real product
                  </span>{' '}
                  .
                </motion.h1>

                <motion.p
                  variants={heroLine}
                  className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
                  style={{ color: 'var(--lp-text-secondary)' }}
                >
                  A focused editor with gentle organization: color-coded notes, fast search, and share links when you need them.
                </motion.p>

                <motion.div variants={heroLine} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to="/signup"
                    className="inline-flex h-12 items-center justify-center rounded-[16px] px-6 text-sm font-extrabold"
                    style={{
                      background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                      color: 'white',
                      boxShadow: '0 24px 80px rgb(var(--lp-accent-primary-rgb) / 0.22)',
                    }}
                  >
                    Get started free
                  </Link>
                  <Link
                    to="/app"
                    className="inline-flex h-12 items-center justify-center rounded-[16px] border px-6 text-sm font-extrabold"
                    style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text)' }}
                  >
                    Open app
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex h-12 items-center justify-center rounded-[16px] border px-6 text-sm font-extrabold"
                    style={{ borderColor: 'var(--lp-border)', background: 'transparent', color: 'var(--lp-text)' }}
                  >
                    See features
                  </a>
                </motion.div>

                <motion.div variants={heroLine} className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {['AM', 'JR', 'SK', 'TD', 'LN'].map((initials) => (
                      <span
                        key={initials}
                        className="grid h-9 w-9 place-items-center rounded-full border text-[11px] font-black"
                        style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text-secondary)' }}
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
                    Loved by creators, developers, and thinkers
                  </div>
                </motion.div>
              </motion.div>

              <motion.div style={{ y: reduceMotion ? 0 : mockupY, rotate: reduceMotion ? 0 : mockupRotate }} className="relative">
                <div
                  className="pointer-events-none absolute -inset-10 rounded-[40px]"
                  aria-hidden="true"
                  style={{
                    background:
                      'radial-gradient(closest-side at 32% 40%, rgb(var(--lp-accent-primary-rgb) / 0.36), transparent 72%), radial-gradient(closest-side at 72% 55%, rgb(var(--lp-accent-secondary-rgb) / 0.22), transparent 74%), radial-gradient(closest-side at 52% 85%, rgb(var(--lp-accent-tertiary-rgb) / 0.18), transparent 74%)',
                    filter: 'blur(18px)',
                    opacity: 0.9,
                  }}
                />

                <motion.div
                  className="relative"
                  animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                  transition={reduceMotion ? undefined : { duration: 7.5, ease: 'easeInOut', repeat: Infinity }}
                >
                  <ScreenshotFrame title="Dashboard" src="/memora-dashboard.png" alt="Memora dashboard" />
                </motion.div>

                <div
                  className="pointer-events-none absolute -bottom-8 -right-8 hidden rounded-[28px] border p-4 lg:block"
                  aria-hidden="true"
                  style={{
                    borderColor: 'var(--lp-border)',
                    background: 'var(--lp-surface)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'var(--lp-shadow)',
                  }}
                >
                  <div className="text-xs font-black" style={{ color: 'var(--lp-text)' }}>
                    Search
                  </div>
                  <div className="mt-2 h-2.5 w-40 rounded-full" style={{ background: 'rgba(148, 163, 184, 0.22)' }} />
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="h-6 rounded-full border px-3 text-[11px] font-extrabold"
                      style={{
                        borderColor: 'rgb(var(--lp-accent-secondary-rgb) / 0.30)',
                        background: 'rgb(var(--lp-accent-secondary-rgb) / 0.14)',
                        color: 'var(--lp-text)',
                      }}
                    >
                      “meeting”
                    </span>
                    <span
                      className="h-6 rounded-full border px-3 text-[11px] font-extrabold"
                      style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text-secondary)' }}
                    >
                      9 results
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        <Section className="pt-10 pb-10" style={{ background: 'var(--lp-bg-2)' }}>
          <FadeIn>
            <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3">
              {[{ k: '2 min', t: 'Setup', d: 'Start fast' }, { k: 'PDF/MD/TXT', t: 'Export', d: 'Portable notes' }, { k: 'Links', t: 'Sharing', d: 'Send when needed' }].map(
                (item) => (
                  <div
                    key={item.t}
                    className="rounded-[22px] border p-5"
                    style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface-strong)', boxShadow: 'var(--lp-shadow)' }}
                  >
                    <div className="text-xs font-black" style={{ color: 'var(--lp-text-muted)' }}>
                      {item.k}
                    </div>
                    <div className="mt-2 text-base font-black tracking-tight" style={{ color: 'var(--lp-text)' }}>
                      {item.t}
                    </div>
                    <div className="mt-1 text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
                      {item.d}
                    </div>
                  </div>
                )
              )}
            </div>
          </FadeIn>
        </Section>

<Section id="features" className="py-16 sm:py-24" style={{ background: 'var(--lp-bg-2)' }}>
    <FadeIn>
        <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'var(--lp-text-muted)' }}>
                Features
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                Built to keep you in flow.
            </h2>
            <p className="mt-3 text-sm leading-relaxed sm:text-base mx-auto" style={{ color: 'var(--lp-text-secondary)', maxWidth: '32rem' }}>
                A writing-first editor, quick navigation, and just enough structure to keep your week clear.
            </p>
        </div>
    </FadeIn>

    {/* ── Bento Grid ── */}
    <div className="mt-12 grid gap-4 md:grid-cols-12">

        {/* ─ ROW 1: Editor (wide) + Search ─ */}
        <FadeIn className="md:col-span-8">
            <BentoCard
                className="p-6 sm:p-8 h-full"
                style={{
                    background:
                        'radial-gradient(800px 500px at 18% 18%, rgb(var(--lp-accent-primary-rgb) / 0.14), transparent 62%), var(--lp-surface-tint)',
                }}
            >
                <div className="flex items-center gap-3 mb-5">
                    <FeatureIcon>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M7 7h10M7 12h7M7 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </FeatureIcon>
                    <div>
                        <div className="text-base font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                            Write like you mean it
                        </div>
                        <div className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
                            Blocks, checklists, links — clean defaults that keep focus on your words.
                        </div>
                    </div>
                </div>

                <div
                    className="rounded-[18px] border p-5"
                    style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface-strong)' }}
                >
                    <div className="flex flex-wrap gap-2 mb-5">
                        {['Heading', 'To-do', 'Code', 'Link'].map((t) => (
                            <span
                                key={t}
                                className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
                                style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)', color: 'var(--lp-text-secondary)' }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <motion.div
                        className="h-5 w-3/5 rounded-full"
                        style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.16)' }}
                        animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
                        transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="mt-4 grid gap-3">
                        {[{ w: 'w-full' }, { w: 'w-11/12' }, { w: 'w-4/5' }].map((l, i) => (
                            <motion.div
                                key={i}
                                className={`h-3 ${l.w} rounded-full`}
                                style={{ background: 'rgb(148 163 184 / 0.18)' }}
                                animate={reduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55] }}
                                transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                            />
                        ))}
                    </div>
                    <div className="mt-5 grid gap-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <motion.span
                                    className="h-4 w-4 rounded-[6px] border"
                                    style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.02)' }}
                                    animate={
                                        reduceMotion
                                            ? undefined
                                            : {
                                                background:
                                                    i === 1
                                                        ? ['rgb(255 255 255 / 0.02)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.14)', 'rgb(255 255 255 / 0.02)']
                                                        : undefined,
                                            }
                                    }
                                    transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
                                />
                                <div className="h-3 flex-1 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </BentoCard>
        </FadeIn>

        <FadeIn className="md:col-span-4" delay={0.05}>
            <BentoCard className="p-6 h-full" style={{ background: 'var(--lp-surface-strong)' }}>
                <div className="flex items-center gap-3 mb-5">
                    <FeatureIcon>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M10 18a8 8 0 1 1 5.3-14.1A8 8 0 0 1 10 18Z" stroke="currentColor" strokeWidth="2" />
                            <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </FeatureIcon>
                    <div>
                        <div className="text-base font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                            Find anything
                        </div>
                        <div className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
                            Instant search across all your notes.
                        </div>
                    </div>
                </div>

                <div
                    className="rounded-[16px] border px-4 py-3 mb-3"
                    style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="h-2.5 w-2/3 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
                        <motion.span
                            className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
                            style={{
                                borderColor: 'rgb(var(--lp-accent-secondary-rgb) / 0.30)',
                                background: 'rgb(var(--lp-accent-secondary-rgb) / 0.14)',
                                color: 'var(--lp-text)',
                            }}
                            animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
                            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            Ctrl K
                        </motion.span>
                    </div>
                </div>
                <div className="grid gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="rounded-[14px] border px-4 py-2.5"
                            style={{
                                borderColor: 'var(--lp-border)',
                                background: i === 0 ? 'rgb(var(--lp-accent-primary-rgb) / 0.08)' : 'rgb(255 255 255 / 0.03)',
                            }}
                            animate={
                                reduceMotion
                                    ? undefined
                                    : {
                                        background:
                                            i === 0
                                                ? ['rgb(var(--lp-accent-primary-rgb) / 0.08)', 'rgb(255 255 255 / 0.03)', 'rgb(255 255 255 / 0.03)']
                                                : i === 1
                                                    ? ['rgb(255 255 255 / 0.03)', 'rgb(var(--lp-accent-primary-rgb) / 0.08)', 'rgb(255 255 255 / 0.03)']
                                                    : ['rgb(255 255 255 / 0.03)', 'rgb(255 255 255 / 0.03)', 'rgb(var(--lp-accent-primary-rgb) / 0.08)'],
                                    }
                            }
                            transition={reduceMotion ? undefined : { duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.05 * i }}
                        >
                            <div className="h-2.5 w-3/5 rounded-full" style={{ background: 'rgb(148 163 184 / 0.24)' }} />
                            <div className="mt-1.5 h-2 w-full rounded-full" style={{ background: 'rgb(148 163 184 / 0.14)' }} />
                        </motion.div>
                    ))}
                </div>
            </BentoCard>
        </FadeIn>

        {/* ─ ROW 2: Colors + Autosave + Sharing ─ */}
        <FadeIn className="md:col-span-4" delay={0.08}>
            <BentoCard className="p-6 h-full" style={{ background: 'var(--lp-surface-strong)' }}>
                <div className="flex items-center gap-3 mb-5">
                    <FeatureIcon>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 3v6m0 12v-6M3 12h6m12 0h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </FeatureIcon>
                    <div>
                        <div className="text-base font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                            Color-coded notes
                        </div>
                        <div className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
                            Organize by color, mood, or priority.
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-4">
                    {[
                        { bg: 'rgb(var(--lp-accent-primary-rgb) / 0.16)', border: 'rgb(var(--lp-accent-primary-rgb) / 0.30)' },
                        { bg: 'rgb(var(--lp-accent-secondary-rgb) / 0.14)', border: 'rgb(var(--lp-accent-secondary-rgb) / 0.30)' },
                        { bg: 'rgb(var(--lp-accent-tertiary-rgb) / 0.12)', border: 'rgb(var(--lp-accent-tertiary-rgb) / 0.28)' },
                        { bg: 'rgb(251 113 133 / 0.10)', border: 'rgb(251 113 133 / 0.22)' },
                        { bg: 'rgb(250 204 21 / 0.10)', border: 'rgb(250 204 21 / 0.22)' },
                    ].map((c, idx) => (
                        <motion.div
                            key={idx}
                            className="h-10 rounded-[14px] border"
                            style={{ borderColor: c.border, background: c.bg }}
                            animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                            transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.14 }}
                        />
                    ))}
                </div>
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className="rounded-[14px] border px-4 py-2.5 mb-2 flex items-center justify-between"
                        style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
                    >
                        <div className="h-2.5 w-1/3 rounded-full" style={{ background: 'rgb(148 163 184 / 0.22)' }} />
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((j) => (
                                <span
                                    key={j}
                                    className="h-3.5 w-3.5 rounded-full border"
                                    style={{
                                        borderColor: j === 0 ? 'rgb(var(--lp-accent-primary-rgb) / 0.30)' : 'var(--lp-border)',
                                        background: j === 0 ? 'rgb(var(--lp-accent-primary-rgb) / 0.16)' : 'rgb(255 255 255 / 0.03)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </BentoCard>
        </FadeIn>

        <FadeIn className="md:col-span-4" delay={0.1}>
            <BentoCard className="p-6 h-full" style={{ background: 'var(--lp-surface-strong)' }}>
                <div className="flex items-center gap-3 mb-5">
                    <FeatureIcon>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </FeatureIcon>
                    <div>
                        <div className="text-base font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                            Autosave, always
                        </div>
                        <div className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
                            Your momentum stays uninterrupted.
                        </div>
                    </div>
                </div>

                <div
                    className="rounded-[16px] border px-4 py-3 mb-3"
                    style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
                >
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-black" style={{ color: 'var(--lp-text-muted)' }}>
                            <motion.span
                                style={{ display: 'inline-block' }}
                                animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
                                transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                Saving…
                            </motion.span>
                        </div>
                        <motion.div
                            className="h-2 w-2 rounded-full"
                            style={{ background: 'rgb(var(--lp-accent-tertiary-rgb))' }}
                            animate={reduceMotion ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                            transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="rounded-[14px] border px-4 py-2.5"
                            style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
                        >
                            <div className="flex items-center justify-between">
                                <motion.div
                                    className="h-2.5 w-2/5 rounded-full"
                                    style={{ background: 'rgb(148 163 184 / 0.18)' }}
                                    animate={reduceMotion ? undefined : { opacity: [0.55, 0.92, 0.55] }}
                                    transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.12 * i }}
                                />
                                <div className="h-2 w-14 rounded-full" style={{ background: 'rgb(148 163 184 / 0.12)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </BentoCard>
        </FadeIn>

        <FadeIn className="md:col-span-4" delay={0.12}>
            <BentoCard className="p-6 h-full" style={{ background: 'var(--lp-surface-strong)' }}>
                <div className="flex items-center gap-3 mb-5">
                    <FeatureIcon>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 12a3 3 0 0 1 3-3h7a3 3 0 0 1 0 6h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 12a3 3 0 0 1-3 3H5a3 3 0 1 1 0-6h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </FeatureIcon>
                    <div>
                        <div className="text-base font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                            Share with a link
                        </div>
                        <div className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
                            Send when needed. Keep everything else private.
                        </div>
                    </div>
                </div>

                <motion.div
                    className="rounded-[16px] border px-4 py-3 mb-3"
                    style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
                    animate={
                        reduceMotion
                            ? undefined
                            : {
                                borderColor: ['var(--lp-border)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.30)', 'var(--lp-border)'],
                                background: ['rgb(255 255 255 / 0.03)', 'rgb(var(--lp-accent-tertiary-rgb) / 0.08)', 'rgb(255 255 255 / 0.03)'],
                            }
                    }
                    transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="text-xs font-black mb-2" style={{ color: 'var(--lp-text)' }}>
                        Share link
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="h-2.5 flex-1 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
                        <motion.span
                            className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
                            style={{
                                borderColor: 'rgb(var(--lp-accent-tertiary-rgb) / 0.28)',
                                background: 'rgb(var(--lp-accent-tertiary-rgb) / 0.12)',
                                color: 'var(--lp-text)',
                            }}
                            animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
                            transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            Copy
                        </motion.span>
                    </div>
                </motion.div>
                <div
                    className="rounded-[14px] border px-4 py-2.5 flex items-center justify-between"
                    style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
                >
                    <div>
                        <div className="text-xs font-black" style={{ color: 'var(--lp-text)' }}>Access</div>
                        <div className="text-[11px] font-bold" style={{ color: 'var(--lp-text-muted)' }}>view-only</div>
                    </div>
                    <span
                        className="inline-flex h-6 items-center rounded-full border px-3 text-[10px] font-extrabold"
                        style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.02)', color: 'var(--lp-text-secondary)' }}
                    >
                        Public link
                    </span>
                </div>
            </BentoCard>
        </FadeIn>

    </div>
</Section>


        <Section id="how" className="py-16 sm:py-24" style={{ background: 'var(--lp-bg-1)' }}>
          <FadeIn>
            <div className="max-w-2xl">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'var(--lp-text-muted)' }}>
                How it works
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                Three steps. No setup overhead.
              </h2>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Create account', desc: 'Start in seconds with a clean workspace.' },
              { title: 'Write notes', desc: 'Blocks, checklists, links — your way.' },
              { title: 'Share or organize', desc: 'Send a link or color-code to stay clear.' },
            ].map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.05}>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  className="rounded-[22px] border p-6"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}
                >
                  <div className="text-xs font-black" style={{ color: 'var(--lp-text-muted)' }}>
                    0{i + 1}
                  </div>
                  <div className="mt-2 text-lg font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                    {s.title}
                  </div>
                  <div className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>
                    {s.desc}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </Section>

        <Section id="showcase" className="py-16 sm:py-24" style={{ background: 'var(--lp-bg-2)' }}>
          <FadeIn>
            <div
              className="relative overflow-hidden rounded-[28px] border p-6 sm:p-10"
              style={{
                borderColor: 'var(--lp-border)',
                background:
                  'radial-gradient(960px 580px at 18% 18%, rgb(var(--lp-accent-primary-rgb) / 0.14), transparent 62%), radial-gradient(880px 580px at 82% 10%, rgb(var(--lp-accent-secondary-rgb) / 0.10), transparent 62%), radial-gradient(820px 560px at 66% 84%, rgb(var(--lp-accent-tertiary-rgb) / 0.08), transparent 66%), var(--lp-surface-tint)',
                boxShadow: 'var(--lp-shadow-strong)',
              }}
            >
              <div className="grid items-center gap-10 lg:grid-cols-[0.52fr_0.48fr]">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'var(--lp-text-muted)' }}>
                    Showcase
                  </div>
                  <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                    Your dashboard, quietly powerful.
                  </h2>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed sm:text-base" style={{ color: 'var(--lp-text-secondary)' }}>
                    A calm overview of your notes — designed to keep you moving without distraction.
                  </p>
                </div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative">
                    <div
                      className="pointer-events-none absolute -inset-10 rounded-[40px]"
                      aria-hidden="true"
                      style={{
                        background:
                          'radial-gradient(closest-side at 30% 35%, rgb(var(--lp-accent-primary-rgb) / 0.34), transparent 72%), radial-gradient(closest-side at 72% 45%, rgb(var(--lp-accent-secondary-rgb) / 0.22), transparent 74%), radial-gradient(closest-side at 55% 85%, rgb(var(--lp-accent-tertiary-rgb) / 0.16), transparent 74%)',
                        filter: 'blur(22px)',
                        opacity: 0.75,
                      }}
                    />
                    <ScreenshotFrame title="Memora" src="/memora-dashboard.png" alt="Memora dashboard" />
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeIn>
        </Section>

        <Section id="stories" className="py-16 sm:py-24" style={{ background: 'var(--lp-bg-1)' }}>
          <FadeIn>
            <div className="max-w-2xl">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'var(--lp-text-muted)' }}>
                Testimonials
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                A tool people settle into.
              </h2>
            </div>
          </FadeIn>

          <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-3">
            {[
              {
                name: 'Nadia B.',
                role: 'Product designer',
                quote: 'The editor feels calm. I can think in paragraphs again — without tweaking formatting every 10 seconds.',
              },
              {
                name: 'Sam R.',
                role: 'Frontend engineer',
                quote: 'Search is genuinely fast. I stopped making duplicate notes because I can actually find the old ones.',
              },
              {
                name: 'Leo K.',
                role: 'Founder',
                quote: 'Color notes is subtle but perfect. It’s just enough structure to keep my week clear.',
              },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.05}>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  className="flex h-full flex-col rounded-[22px] border p-6"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface-tint)', boxShadow: 'var(--lp-shadow)' }}
                >
                  <div className="text-sm font-bold leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 900,
                      }}
                    >
                      “
                    </span>
                    {t.quote}
                    <span
                      aria-hidden="true"
                      style={{
                        background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 900,
                      }}
                    >
                      ”
                    </span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <div>
                      <div className="text-sm font-black" style={{ color: 'var(--lp-text)' }}>
                        {t.name}
                      </div>
                      <div className="mt-1 text-xs font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                        {t.role}
                      </div>
                    </div>
                    <span
                      className="h-9 w-9 rounded-full border"
                      style={{
                        borderColor: 'var(--lp-border)',
                        background:
                          'linear-gradient(135deg, rgb(var(--lp-accent-primary-rgb) / 0.20), rgb(var(--lp-accent-secondary-rgb) / 0.14))',
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </Section>

        <Section id="pricing" className="py-16 sm:py-24" style={{ background: 'var(--lp-bg-2)' }}>
          <FadeIn>
            <div className="max-w-2xl">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'var(--lp-text-muted)' }}>
                Pricing
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                Free to start.
              </h2>
              <p className="mt-3 max-w-prose text-sm leading-relaxed sm:text-base" style={{ color: 'var(--lp-text-secondary)' }}>
                Simple and honest. You can iterate later when you add teams.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Starter', price: 'Free', cta: 'Start', highlight: true,
                desc: 'Everything you need to write and organize.',
                features: ['Unlimited notes', 'Color themes', 'PDF / MD / TXT export', 'Share links', 'Folders & search'],
              },
              {
                title: 'Plus', price: 'Soon', cta: 'Notify me', highlight: false,
                desc: 'For power users who want more.',
                features: ['Everything in Starter', 'Offline mode', 'Priority support', 'Advanced export options', 'Custom themes'],
              },
              {
                title: 'Teams', price: 'Later', cta: 'Talk to us', highlight: false,
                desc: 'Collaboration for your whole team.',
                features: ['Everything in Plus', 'Team workspaces', 'Admin controls', 'Shared folders', 'Usage analytics'],
              },
            ].map((p) => (
              <FadeIn key={p.title}>
                <div
                  className="relative rounded-[22px] border p-6 flex flex-col"
                  style={{
                    borderColor: p.highlight ? 'rgb(var(--lp-accent-primary-rgb) / 0.30)' : 'var(--lp-border)',
                    background: 'var(--lp-surface-strong)',
                    boxShadow: p.highlight ? 'var(--lp-shadow-strong)' : 'var(--lp-shadow)',
                  }}
                >
                  {p.highlight && (
                    <span
                      className="absolute -top-3 right-5 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold"
                      style={{
                        background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                        color: 'white',
                      }}
                    >
                      Popular
                    </span>
                  )}
                  <div className="text-xs font-black" style={{ color: 'var(--lp-text-muted)' }}>
                    {p.title}
                  </div>
                  <div className="mt-3 text-2xl font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                    {p.price}
                  </div>
                  <div className="mt-2 text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
                    {p.desc}
                  </div>
                  <ul className="mt-5 grid gap-2.5" style={{ listStyle: 'none', padding: 0 }}>
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="8" cy="8" r="7" stroke="rgb(var(--lp-accent-primary-rgb) / 0.40)" strokeWidth="1.5" />
                          <path d="M5.5 8l2 2 3.5-3.5" stroke="var(--lp-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-semibold">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 mt-auto pt-2">
                    <a
                      href={p.title === 'Starter' ? '/signup' : '#contact'}
                      className="inline-flex h-11 w-full items-center justify-center rounded-[16px] px-5 text-sm font-extrabold transition-transform hover:-translate-y-0.5"
                      style={{
                        background: p.highlight ? 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))' : 'var(--lp-surface)',
                        color: p.highlight ? 'white' : 'var(--lp-text)',
                        border: p.highlight ? 'none' : '1px solid var(--lp-border)',
                      }}
                    >
                      {p.cta}
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>

        <Section id="contact" className="py-16 sm:py-24" style={{ background: 'var(--lp-bg-1)' }}>
          <FadeIn>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'var(--lp-text-muted)' }}>
                  Contact
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                  Want something customized?
                </h2>
                <p className="mt-3 max-w-prose text-sm leading-relaxed sm:text-base" style={{ color: 'var(--lp-text-secondary)' }}>
                  Tell us what you need Memora to become. We’ll prioritize the roadmap.
                </p>
              </div>

              <div
                className="rounded-[22px] border p-6"
                style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface-strong)', boxShadow: 'var(--lp-shadow)' }}
              >
                <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
                  <label className="grid gap-2 text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
                    Email
                    <input
                      type="email"
                      placeholder="you@domain.com"
                      className="h-11 rounded-[14px] border px-4"
                      style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.70)', color: 'var(--lp-text)' }}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
                    What do you need?
                    <textarea
                      rows={4}
                      placeholder="Tell us what you want to build."
                      className="rounded-[14px] border p-4"
                      style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.70)', color: 'var(--lp-text)' }}
                    />
                  </label>
                  <button
                    type="submit"
                    className="mt-2 inline-flex h-11 items-center justify-center rounded-[16px] px-5 text-sm font-extrabold"
                    style={{ background: 'rgba(11, 18, 32, 0.92)', color: 'white' }}
                  >
                    Send
                  </button>
                  <div className="text-xs font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                    This is a demo form for now (no backend hook yet).
                  </div>
                </form>
              </div>
            </div>
          </FadeIn>
        </Section>

        <Section className="py-16 sm:py-24" style={{ background: 'var(--lp-bg-2)' }}>
          <FadeIn>
            <div
              className="rounded-[28px] border px-6 py-10 sm:px-10"
              style={{
                borderColor: 'var(--lp-border)',
                background:
                  'radial-gradient(980px 560px at 16% 12%, rgb(var(--lp-accent-primary-rgb) / 0.18), transparent 62%), radial-gradient(880px 560px at 86% 22%, rgb(var(--lp-accent-secondary-rgb) / 0.14), transparent 62%), radial-gradient(820px 540px at 62% 92%, rgb(var(--lp-accent-tertiary-rgb) / 0.10), transparent 66%), var(--lp-surface-tint)',
                boxShadow: 'var(--lp-shadow-strong)',
              }}
            >
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                    Start writing with less friction.
                  </h2>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed sm:text-base" style={{ color: 'var(--lp-text-secondary)' }}>
                    Get a focused workspace in minutes — and keep it beautiful in light or dark mode.
                  </p>
                </div>
                <Link
                  to="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-[16px] px-6 text-sm font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                    color: 'white',
                    boxShadow: '0 24px 90px rgb(var(--lp-accent-primary-rgb) / 0.24)',
                  }}
                >
                  Get started free
                </Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </main>

      <footer className="border-t" style={{ borderTopColor: 'var(--lp-border)' }}>
        <Container className="grid gap-8 py-12 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div>
            <div className="BrandMark is-logo" style={{ width: 160, height: 36 }}>
              <img className="BrandLogo" src="/logo-memora.png" alt="Memora" />
            </div>
            <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--lp-text-muted)' }}>
              Your knowledge, beautifully organized.
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" style={{ color: 'var(--lp-text-muted)' }} className="transition-colors hover:opacity-80">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" style={{ color: 'var(--lp-text-muted)' }} className="transition-colors hover:opacity-80">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm font-bold sm:justify-self-end" style={{ color: 'var(--lp-text-secondary)' }}>
            <a href="/privacy" className="transition-colors hover:opacity-80">Privacy</a>
            <a href="/terms" className="transition-colors hover:opacity-80">Terms</a>
            <span className="text-xs font-semibold" style={{ color: 'var(--lp-text-muted)' }}>© {new Date().getFullYear()} Memora</span>
          </div>
        </Container>
      </footer>
    </div>
  );
}
