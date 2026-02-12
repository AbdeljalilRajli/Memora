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
