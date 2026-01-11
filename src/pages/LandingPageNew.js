import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

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

function MockEditor({ compact = false }) {
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
        <div className="h-5 w-2/3 rounded-full" style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.16)' }} />
        <div className="mt-4 grid gap-3">
          <div className="h-3 w-full rounded-full" style={{ background: 'rgb(148 163 184 / 0.22)' }} />
          <div className="h-3 w-11/12 rounded-full" style={{ background: 'rgb(148 163 184 / 0.18)' }} />
          <div className="h-3 w-4/5 rounded-full" style={{ background: 'rgb(148 163 184 / 0.18)' }} />
        </div>

        <div className="mt-6 grid gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-[6px] border"
                style={{
                  borderColor: i === 1 ? 'rgb(var(--lp-accent-tertiary-rgb) / 0.30)' : 'var(--lp-border)',
                  background: i === 1 ? 'rgb(var(--lp-accent-tertiary-rgb) / 0.12)' : 'rgb(255 255 255 / 0.02)',
                }}
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
  return (
    <MockFrame title="Search">
      <div
        className="rounded-[16px] border px-4 py-3"
        style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="h-2.5 w-2/3 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
          <span
            className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
            style={{
              borderColor: 'rgb(var(--lp-accent-secondary-rgb) / 0.30)',
              background: 'rgb(var(--lp-accent-secondary-rgb) / 0.14)',
              color: 'var(--lp-text)',
            }}
          >
            Cmd K
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {Array.from({ length: compact ? 3 : 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[16px] border px-4 py-3"
            style={{
              borderColor: 'var(--lp-border)',
              background: i === 0 ? 'rgb(var(--lp-accent-primary-rgb) / 0.10)' : 'rgb(255 255 255 / 0.03)',
            }}
          >
            <div className="h-3 w-2/3 rounded-full" style={{ background: 'rgb(148 163 184 / 0.26)' }} />
            <div className="mt-2 h-2.5 w-full rounded-full" style={{ background: 'rgb(148 163 184 / 0.18)' }} />
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function MockColors({ compact = false }) {
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
          <div key={idx} className="h-10 rounded-[14px] border" style={{ borderColor: c.border, background: c.bg }} aria-hidden="true" />
        ))}
      </div>
    </MockFrame>
  );
}

function MockSharing({ compact = false }) {
  return (
    <MockFrame title="Sharing">
      <div className="grid gap-3">
        <div
          className="rounded-[16px] border px-4 py-3"
          style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
        >
          <div className="text-sm font-black" style={{ color: 'var(--lp-text)' }}>
            Share link
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="h-2.5 flex-1 rounded-full" style={{ background: 'rgb(148 163 184 / 0.20)' }} />
            <span
              className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
              style={{
                borderColor: 'rgb(var(--lp-accent-tertiary-rgb) / 0.28)',
                background: 'rgb(var(--lp-accent-tertiary-rgb) / 0.12)',
                color: 'var(--lp-text)',
              }}
            >
              Copy
            </span>
          </div>
        </div>

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
  return (
    <MockFrame title="Autosave">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-black" style={{ color: 'var(--lp-text)' }}>
            Status
          </div>
          <div className="mt-1 text-xs font-bold" style={{ color: 'var(--lp-text-muted)' }}>
            updated just now
          </div>
        </div>
        <span
          className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
          style={{
            borderColor: 'rgb(var(--lp-accent-secondary-rgb) / 0.28)',
            background: 'rgb(var(--lp-accent-secondary-rgb) / 0.12)',
            color: 'var(--lp-text)',
          }}
        >
          Saved
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {Array.from({ length: compact ? 2 : 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[16px] border px-4 py-3"
            style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
          >
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-1/2 rounded-full" style={{ background: 'rgb(148 163 184 / 0.18)' }} />
              <div className="h-2.5 w-16 rounded-full" style={{ background: 'rgb(148 163 184 / 0.14)' }} />
            </div>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function MockDashboard({ compact = false }) {
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
          Listem Notes
        </div>
      </div>

      <div className={compact ? 'grid grid-cols-[0.46fr_0.54fr]' : 'grid grid-cols-[0.42fr_0.58fr]'}>
        <div
          className="border-r p-4"
          style={{
            borderRightColor: 'var(--lp-border)',
            background: 'rgb(var(--lp-accent-primary-rgb) / 0.04)',
          }}
        >
          <div className="text-[11px] font-extrabold uppercase tracking-[0.22em]" style={{ color: 'var(--lp-text-muted)' }}>
            Workspace
          </div>
          <div className="mt-4 grid gap-3">
            <div
              className="rounded-[16px] border px-3 py-3"
              style={{
                borderColor: 'rgb(var(--lp-accent-primary-rgb) / 0.26)',
                background: 'rgb(255 255 255 / 0.06)',
                boxShadow: '0 18px 50px rgb(var(--lp-accent-primary-rgb) / 0.14)',
              }}
            >
              <div className="text-sm font-black tracking-tight" style={{ color: 'var(--lp-text)' }}>
                Daily Notes
              </div>
              <div className="mt-1 text-[11px] font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                12 pages
              </div>
            </div>

            <div
              className="rounded-[16px] border px-3 py-3"
              style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.05)' }}
            >
              <div className="text-sm font-black tracking-tight" style={{ color: 'var(--lp-text)' }}>
                Ideas
              </div>
              <div className="mt-1 text-[11px] font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                color-coded
              </div>
            </div>

            <div
              className="rounded-[16px] border px-3 py-3"
              style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.05)' }}
            >
              <div className="text-sm font-black tracking-tight" style={{ color: 'var(--lp-text)' }}>
                Shared
              </div>
              <div className="mt-1 text-[11px] font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                link access
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <span
              className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
              style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text-secondary)' }}
            >
              Draft
            </span>
            <span
              className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
              style={{
                borderColor: 'rgb(var(--lp-accent-primary-rgb) / 0.30)',
                background: 'rgb(var(--lp-accent-primary-rgb) / 0.14)',
                color: 'var(--lp-text)',
              }}
            >
              Autofocus
            </span>
            <span
              className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-extrabold"
              style={{
                borderColor: 'rgb(var(--lp-accent-tertiary-rgb) / 0.26)',
                background: 'rgb(var(--lp-accent-tertiary-rgb) / 0.12)',
                color: 'var(--lp-text)',
              }}
            >
              Synced
            </span>
          </div>

          <div className="mt-5">
            <div className="h-5 w-2/3 rounded-full" style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.16)' }} />
            <div className="mt-4 grid gap-3">
              <div className="h-3 w-full rounded-full" style={{ background: 'rgba(148, 163, 184, 0.22)' }} />
              <div className="h-3 w-full rounded-full" style={{ background: 'rgba(148, 163, 184, 0.18)' }} />
              <div className="h-3 w-4/5 rounded-full" style={{ background: 'rgba(148, 163, 184, 0.18)' }} />
            </div>

            <div className="mt-6 grid gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-[6px] border"
                    style={{
                      borderColor: i === 1 ? 'rgb(var(--lp-accent-primary-rgb) / 0.32)' : 'var(--lp-border)',
                      background: i === 1 ? 'rgb(var(--lp-accent-primary-rgb) / 0.14)' : 'var(--lp-surface)',
                    }}
                  />
                  <div className="h-3 flex-1 rounded-full" style={{ background: 'rgba(148, 163, 184, 0.20)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPageNew() {
  const reduceMotion = useReducedMotion();
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

  const features = useMemo(
    () => [
      {
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 7h10M7 12h7M7 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
        title: 'Notion-like editor',
        desc: 'Blocks that stay out of your way — until you need them.',
        visual: <MockEditor compact />,
        reverse: false,
      },
      {
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        ),
        title: 'Autosave',
        desc: 'Write freely — everything is captured as you go.',
        visual: <MockAutosave compact />,
        reverse: true,
      },
      {
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 18a8 8 0 1 1 5.3-14.1A8 8 0 0 1 10 18Z" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
        title: 'Fast search',
        desc: 'Find anything in seconds — titles, text, or tags.',
        visual: <MockSearch compact />,
        reverse: false,
      },
      {
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v6m0 12v-6M3 12h6m12 0h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M7.2 7.2l4.8 4.8 4.8-4.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.22"
            />
          </svg>
        ),
        title: 'Custom note colors',
        desc: 'A gentle visual system for your brain — not a rainbow.',
        visual: <MockColors compact />,
        reverse: true,
      },
      {
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 12a3 3 0 0 1 3-3h7a3 3 0 0 1 0 6h-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 12a3 3 0 0 1-3 3H5a3 3 0 1 1 0-6h2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ),
        title: 'Sharing notes',
        desc: 'Send a link when needed. Keep everything else private.',
        visual: <MockSharing compact />,
        reverse: false,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--lp-bg)', color: 'var(--lp-text)' }}>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(1000px 680px at 16% 6%, rgb(var(--lp-accent-primary-rgb) / 0.22), transparent 62%), radial-gradient(920px 620px at 88% 10%, rgb(var(--lp-accent-secondary-rgb) / 0.16), transparent 60%), radial-gradient(860px 580px at 68% 86%, rgb(var(--lp-accent-tertiary-rgb) / 0.12), transparent 62%)',
          opacity: 1,
        }}
      />

      <header
        className="sticky top-0 z-50 border-b"
        style={{
          borderBottomColor: 'var(--lp-border)',
          background: 'var(--lp-surface)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-sm font-black tracking-tight">
            <span
              className="grid h-9 w-9 place-items-center rounded-[14px] text-white"
              style={{
                background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                boxShadow: '0 18px 50px rgb(var(--lp-accent-primary-rgb) / 0.28)',
              }}
            >
              L
            </span>
            <span>Listem Notes</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" aria-label="Primary">
            <a href="#features" className="transition-colors" style={{ color: 'var(--lp-text-secondary)' }}>
              Features
            </a>
            <a href="#how" className="transition-colors" style={{ color: 'var(--lp-text-secondary)' }}>
              How it works
            </a>
            <a href="#stories" className="transition-colors" style={{ color: 'var(--lp-text-secondary)' }}>
              Stories
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-full border px-4 py-2 text-sm font-extrabold md:inline-flex"
              style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text)' }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold"
              style={{
                background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                color: 'white',
                boxShadow: '0 22px 70px rgb(var(--lp-accent-primary-rgb) / 0.22)',
              }}
            >
              Get started free
            </Link>
          </div>
        </Container>
      </header>

      <main>
        <Section id="top" className="relative pt-20" style={{ background: 'linear-gradient(180deg, var(--lp-bg-1), var(--lp-bg))' }}>
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
                Build momentum with
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  focused
                </span>{' '}
                notes.
              </motion.h1>

              <motion.p
                variants={heroLine}
                className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ color: 'var(--lp-text-secondary)' }}
              >
                Write, search, color-code, and share — with just enough structure to keep you clear.
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
                  to="/login"
                  className="inline-flex h-12 items-center justify-center rounded-[16px] border px-6 text-sm font-extrabold"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text)' }}
                >
                  Login
                </Link>
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
                <MockEditor />
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
        </Section>

        <Section className="pb-6" style={{ background: 'var(--lp-bg)' }}>
          <FadeIn>
            <div
              className="mx-auto grid max-w-6xl grid-cols-2 gap-3 rounded-[22px] border p-4 sm:grid-cols-4"
              style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}
            >
              {['Studio-grade', 'Fast sync', 'Private by default', 'Built for focus'].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] border px-4 py-4"
                  style={{ borderColor: 'var(--lp-border)', background: 'rgb(255 255 255 / 0.03)' }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))' }}
                  />
                  <span className="text-sm font-extrabold" style={{ color: 'var(--lp-text)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </Section>

        <Section id="features" className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, var(--lp-bg), var(--lp-bg-2))' }}>
          <FadeIn>
            <div className="max-w-2xl">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'var(--lp-text-muted)' }}>
                Features
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                Everything you need to stay in flow.
              </h2>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-10">
            {features.map((f, idx) => (
              <FadeIn key={f.title} delay={idx * 0.04}>
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className={f.reverse ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}>
                    <motion.div
                      whileHover={reduceMotion ? undefined : { y: -2 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="relative"
                    >
                      <div
                        className="pointer-events-none absolute -inset-10 rounded-[36px]"
                        aria-hidden="true"
                        style={{
                          background:
                            'radial-gradient(closest-side at 35% 35%, rgb(var(--lp-accent-primary-rgb) / 0.22), transparent 70%), radial-gradient(closest-side at 70% 55%, rgb(var(--lp-accent-secondary-rgb) / 0.16), transparent 72%), radial-gradient(closest-side at 52% 85%, rgb(var(--lp-accent-tertiary-rgb) / 0.12), transparent 74%)',
                          filter: 'blur(18px)',
                          opacity: 0.75,
                        }}
                      />
                      {f.visual}
                    </motion.div>
                  </div>

                  <div className={f.reverse ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}>
                    <div className="flex items-start gap-4">
                      <FeatureIcon>{f.icon}</FeatureIcon>
                      <div>
                        <div className="text-lg font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                          {f.title}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>

        <Section id="how" className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, var(--lp-bg-2), var(--lp-bg))' }}>
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

        <Section id="showcase" className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, var(--lp-bg), var(--lp-bg-1))' }}>
          <FadeIn>
            <div
              className="relative overflow-hidden rounded-[28px] border p-6 sm:p-10"
              style={{
                borderColor: 'var(--lp-border)',
                background:
                  'radial-gradient(960px 580px at 18% 18%, rgb(var(--lp-accent-primary-rgb) / 0.26), transparent 62%), radial-gradient(880px 580px at 82% 10%, rgb(var(--lp-accent-secondary-rgb) / 0.20), transparent 62%), radial-gradient(820px 560px at 66% 84%, rgb(var(--lp-accent-tertiary-rgb) / 0.14), transparent 66%), var(--lp-surface-tint)',
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
                    <MockDashboard />
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeIn>
        </Section>

        <Section id="stories" className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, var(--lp-bg-1), var(--lp-bg))' }}>
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

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
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
                  className="rounded-[22px] border p-6"
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
                  <div className="mt-6 flex items-center justify-between">
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

        <Section className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, var(--lp-bg), var(--lp-bg-2))' }}>
          <FadeIn>
            <div
              className="rounded-[28px] border px-6 py-10 sm:px-10"
              style={{
                borderColor: 'var(--lp-border)',
                background:
                  'radial-gradient(980px 560px at 16% 12%, rgb(var(--lp-accent-primary-rgb) / 0.30), transparent 62%), radial-gradient(880px 560px at 86% 22%, rgb(var(--lp-accent-secondary-rgb) / 0.22), transparent 62%), radial-gradient(820px 540px at 62% 92%, rgb(var(--lp-accent-tertiary-rgb) / 0.14), transparent 66%), linear-gradient(135deg, rgb(var(--lp-accent-primary-rgb) / 0.12), rgb(var(--lp-accent-tertiary-rgb) / 0.08)), var(--lp-surface-tint)',
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
        <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-[14px] text-white"
              style={{ background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))' }}
            >
              L
            </span>
            <div>
              <div className="text-sm font-black">Listem Notes</div>
              <div className="mt-1 text-xs font-bold" style={{ color: 'var(--lp-text-muted)' }}>
                © {new Date().getFullYear()} Listem
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm font-bold" style={{ color: 'var(--lp-text-secondary)' }}>
            <a href="/privacy" className="transition-colors">
              Privacy
            </a>
            <a href="/terms" className="transition-colors">
              Terms
            </a>
            <a href="https://github.com" className="transition-colors" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
}
