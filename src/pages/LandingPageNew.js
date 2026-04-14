import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';

// --- Icons ---
const icons = {
  menu: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  close: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  arrowRight: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>,
  check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  write: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
  search: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  colors: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>,
  share: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  export: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  lock: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
};

// --- Components ---
function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-6 lg:px-8 ${className}`}>{children}</div>;
}

function FadeIn({ children, className = '', delay = 0, direction = 'up' }) {
  const reduceMotion = useReducedMotion();
  const directionOffset = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
  };
  
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, ...directionOffset[direction] }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children, className = '' }) {
  return (
    <span 
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${className}`}
      style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)', color: 'var(--lp-text-muted)' }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--lp-accent-primary)' }} />
      {children}
    </span>
  );
}

function Button({ children, variant = 'primary', href, onClick, className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold';
  
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
      color: 'white',
      boxShadow: '0 8px 32px rgba(249, 110, 91, 0.25)',
    },
    secondary: {
      background: 'var(--lp-surface)',
      color: 'var(--lp-text)',
      border: '1px solid var(--lp-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--lp-text-secondary)',
    },
  };

  const Component = href ? Link : 'button';
  
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
      <Component 
        to={href} 
        onClick={onClick}
        className={`${baseStyles} ${className} transition-all duration-200`}
        style={variants[variant]}
      >
        {children}
      </Component>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <motion.div 
        className="group rounded-3xl border p-8 transition-all duration-300"
        style={{ 
          borderColor: 'var(--lp-border)', 
          background: 'var(--lp-surface)',
        }}
        whileHover={{ 
          y: -8, 
          boxShadow: '0 20px 40px rgba(249, 110, 91, 0.15)',
          borderColor: 'rgba(249, 110, 91, 0.3)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div 
          className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.1)', color: 'var(--lp-accent-primary)' }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {icon}
        </motion.div>
        <h3 className="mb-2 text-lg font-bold" style={{ color: 'var(--lp-text)' }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>{description}</p>
      </motion.div>
    </FadeIn>
  );
}

function TestimonialCard({ quote, author, role, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <motion.div 
        className="relative p-6"
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Large quote mark */}
        <div 
          className="absolute top-2 left-2 text-6xl font-serif leading-none"
          style={{ color: 'rgb(var(--lp-accent-primary-rgb) / 0.2)' }}
        >
          "
        </div>
        
        <div className="relative">
          <p className="text-lg font-medium leading-relaxed mb-6" style={{ color: 'var(--lp-text)' }}>
            {quote}
          </p>
          
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))', color: 'white' }}
            >
              {author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--lp-text)' }}>{author}</div>
              <div className="text-xs" style={{ color: 'var(--lp-text-muted)' }}>{role}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

function FAQItem({ question, answer, delay = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <FadeIn delay={delay}>
      <div 
        className="rounded-xl overflow-hidden transition-all duration-200"
        style={{ 
          background: 'white',
          boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/80 transition-colors border-0 outline-none"
          style={{ border: 'none', outline: 'none' }}
        >
          <span className="font-semibold pr-4" style={{ color: 'var(--lp-text)' }}>{question}</span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%',
              background: isOpen ? 'var(--lp-accent-primary)' : 'rgb(var(--lp-accent-primary-rgb) / 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? 'white' : 'var(--lp-accent-primary)'} strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div 
                className="px-5 pb-5 text-sm leading-relaxed"
                style={{ color: 'var(--lp-text-secondary)' }}
              >
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}


export default function LandingPageNew() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#faq', label: 'FAQ' },
    { href: '#testimonials', label: 'Reviews' },
  ];

  return (
    <div className="LandingPageNew min-h-screen" style={{ background: 'var(--lp-bg-2)', color: 'var(--lp-text)' }}>
      {/* --- Navigation --- */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ 
          borderColor: 'var(--lp-border)', 
          background: 'rgba(246, 247, 251, 0.85)', 
          backdropFilter: 'blur(20px)',
        }}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Memora">
            <img src="/logo-memora.png" alt="Memora" className="h-9 w-auto" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className="transition-colors hover:text-[var(--lp-accent-primary)]"
                style={{ color: 'var(--lp-text-secondary)' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--lp-text-secondary)' }}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={loggingOut}
                  className="LogoutButton"
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
                <Link to="/app" className="inline-flex">
                  <Button variant="primary">Go to App</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-medium md:inline-block" style={{ color: 'var(--lp-text-secondary)' }}>
                  Log in
                </Link>
                <Link to="/signup" className="hidden md:inline-flex">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileNavOpen(v => !v)}
              style={{ color: 'var(--lp-text)' }}
            >
              {mobileNavOpen ? icons.close : icons.menu}
            </button>
          </div>
        </Container>

        {/* Mobile Nav */}
        {mobileNavOpen && (
          <motion.div 
            className="border-t md:hidden"
            style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Container className="py-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <a 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="text-lg font-medium"
                    style={{ color: 'var(--lp-text)' }}
                  >
                    {link.label}
                  </a>
                ))}
                <hr style={{ borderColor: 'var(--lp-border)' }} />
                {user ? (
                  <Link to="/app" onClick={() => setMobileNavOpen(false)}>
                    <Button variant="primary" className="w-full">Go to App</Button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={() => setMobileNavOpen(false)}>
                      <Button variant="secondary" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileNavOpen(false)}>
                      <Button variant="primary" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </Container>
          </motion.div>
        )}
      </header>

      <main className="pt-16">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
          {/* Subtle gradient background */}
          <div 
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(var(--lp-accent-primary-rgb) / 0.12), transparent)',
            }}
          />
          
          <Container className="relative">
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn delay={0.1}>
                <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl" style={{ letterSpacing: '-0.03em' }}>
                  Notes that think
                  <br />
                  <span style={{ 
                    background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}>
                    with you
                  </span>
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>
                  Memora is the quiet space for your ideas. Write freely, organize effortlessly, 
                  and find exactly what you need—when you need it.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link to="/signup">
                    <Button variant="primary" className="h-14 px-8 text-base">
                      Start writing free
                      {icons.arrowRight}
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button variant="ghost" className="h-14 px-8 text-base">
                      See how it works
                    </Button>
                  </a>
                </div>
              </FadeIn>
              
              {/* Social Proof */}
              <FadeIn delay={0.4}>
                <div className="mt-12 flex items-center justify-center gap-4">
                  <div className="flex -space-x-3">
                    {['JD', 'SM', 'AK', 'MR'].map((initials, i) => (
                      <div 
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold"
                        style={{ 
                          borderColor: 'var(--lp-bg-2)', 
                          background: `hsl(${25 + i * 15}, 85%, 55%)`,
                          color: 'white',
                        }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--lp-accent-primary)' }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--lp-text-muted)' }}>
                      Trusted by 10,000+ writers
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Hero Image */}
            <FadeIn delay={0.5} direction="up">
              <motion.div 
                className="relative mx-auto mt-16 max-w-5xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              >
                <motion.div 
                  className="absolute -inset-4 rounded-[2rem] blur-2xl"
                  style={{ background: 'rgb(var(--lp-accent-primary-rgb) / 0.15)' }}
                  animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                />
                <motion.div 
                  className="relative overflow-hidden rounded-2xl border shadow-2xl"
                  style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <img 
                    src="/memora-dashboard.png" 
                    alt="Memora Dashboard" 
                    className="w-full"
                    style={{ display: 'block' }}
                  />
                </motion.div>
              </motion.div>
            </FadeIn>
          </Container>
        </section>

        {/* --- Quick Stats --- */}
        <section className="border-y py-12" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
          <Container>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: '50K+', label: 'Notes created' },
                { value: '10K+', label: 'Active writers' },
                { value: '99.9%', label: 'Uptime' },
                { value: '4.9/5', label: 'User rating' },
              ].map((stat, i) => (
                <FadeIn delay={i * 0.1}>
                  <motion.div 
                    className="text-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div 
                      className="text-3xl font-bold"
                      style={{ color: 'var(--lp-accent-primary)' }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200, delay: i * 0.1 + 0.2 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="mt-1 text-sm font-medium" style={{ color: 'var(--lp-text-secondary)' }}>{stat.label}</div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* --- Features --- */}
        <section id="features" className="py-24 lg:py-32">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <Badge>Features</Badge>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                  Everything you need to capture ideas
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mt-4 text-lg" style={{ color: 'var(--lp-text-secondary)' }}>
                  No clutter. No complexity. Just the right tools to help you think and write better.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={icons.write}
                title="Distraction-free writing"
                description="A clean, minimal editor that puts your words first. No formatting toolbars in the way."
                delay={0}
              />
              <FeatureCard 
                icon={icons.search}
                title="Instant search"
                description="Find any note in milliseconds. Search across titles, content, and even inside PDFs."
                delay={0.1}
              />
              <FeatureCard 
                icon={icons.colors}
                title="Color-coded organization"
                description="Assign colors to notes based on mood, priority, or project. Visual organization at a glance."
                delay={0.2}
              />
              <FeatureCard 
                icon={icons.share}
                title="Share with a link"
                description="Generate public links for any note. Share with teammates, friends, or the world."
                delay={0.3}
              />
              <FeatureCard 
                icon={icons.export}
                title="Export anywhere"
                description="Download your notes as PDF, Markdown, or plain text. Your data, your way."
                delay={0.4}
              />
              <FeatureCard 
                icon={icons.lock}
                title="Private by default"
                description="End-to-end encryption for sensitive notes. We can't read them, and neither can anyone else."
                delay={0.5}
              />
            </div>
          </Container>
        </section>

        {/* --- How It Works --- */}
        <section className="py-24" style={{ background: 'var(--lp-surface)' }}>
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <Badge>How It Works</Badge>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="mt-6 text-4xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Start writing in 30 seconds
                </h2>
              </FadeIn>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                { step: '01', title: 'Create your account', description: 'Sign up with email or Google. No credit card required.' },
                { step: '02', title: 'Write your first note', description: 'Just start typing. We\'ll handle saving, formatting, and organization.' },
                { step: '03', title: 'Find it instantly', description: 'Search across all your notes with our lightning-fast search.' },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div className="relative">
                    <div 
                      className="mb-4 text-6xl font-bold"
                      style={{ color: 'rgb(var(--lp-accent-primary-rgb) / 0.15)' }}
                    >
                      {item.step}
                    </div>
                    <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--lp-text)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>{item.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* --- Use Cases --- */}
        <section className="py-24 lg:py-32" style={{ background: 'var(--lp-bg-2)' }}>
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <Badge>Who It's For</Badge>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="mt-6 text-4xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Perfect for every kind of thinker
                </h2>
              </FadeIn>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--lp-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, title: 'Students', desc: 'Capture lecture notes, research, and ideas. Study smarter with instant search.' },
                { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--lp-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, title: 'Writers', desc: 'Draft articles, stories, and books. Distraction-free environment for deep work.' },
                { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--lp-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, title: 'Professionals', desc: 'Meeting notes, project planning, and documentation. Keep everything organized.' },
                { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--lp-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657A4 4 0 0 1 8 11.165a3 3 0 1 1 8 0 4 4 0 0 1 1.657 6.492"/></svg>, title: 'Thinkers', desc: 'Journal daily, track ideas, and build a personal knowledge base.' },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <motion.div 
                    className="group rounded-3xl border p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                    style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-125">{item.icon}</div>
                    <h3 className="mb-2 text-lg font-bold" style={{ color: 'var(--lp-text)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>{item.desc}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* --- FAQ Section --- */}
        <section id="faq" className="py-24" style={{ background: 'var(--lp-surface)' }}>
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <Badge>FAQ</Badge>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="mt-6 text-4xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Questions? We've got answers
                </h2>
              </FadeIn>
            </div>

            <div className="mt-16 mx-auto max-w-3xl space-y-4">
              {[
                { q: 'Is Memora really free?', a: 'Yes! Memora is completely free to use. All core features—unlimited notes, search, and sharing—are available at no cost.' },
                { q: 'Can I access my notes offline?', a: 'Absolutely. Memora works offline by default. Your notes are stored locally and sync when you reconnect.' },
                { q: 'How is my data secured?', a: 'Your notes are encrypted end-to-end. We can\'t read them, and neither can anyone else. Your privacy is our priority.' },
                { q: 'Can I export my notes?', a: 'Yes! Export your notes as PDF, Markdown, or plain text. Your data, your way—anytime you want.' },
                { q: 'Is there a mobile app?', a: 'Memora is a progressive web app (PWA). Install it on your phone for a native app experience without the app store.' },
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} delay={i * 0.1} />
              ))}
            </div>
          </Container>
        </section>

        {/* --- Testimonials --- */}
        <section id="testimonials" className="py-24 lg:py-32">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <Badge>Reviews</Badge>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="mt-6 text-4xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Loved by thinkers worldwide
                </h2>
              </FadeIn>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard 
                quote="Memora replaced three apps for me. It's the first notes app that doesn't get in the way of my thinking."
                author="Sarah Chen"
                role="Product Designer at Spotify"
                delay={0}
              />
              <TestimonialCard 
                quote="The search is magic. I can find a note I wrote two years ago in seconds. Game changer for my research."
                author="Marcus Johnson"
                role="PhD Candidate"
                delay={0.1}
              />
              <TestimonialCard 
                quote="Finally, a notes app that understands I want to WRITE, not fiddle with formatting menus all day."
                author="Elena Rodriguez"
                role="Journalist"
                delay={0.2}
              />
              <TestimonialCard 
                quote="I use Memora for everything—meeting notes, journaling, drafts. The color coding keeps my chaotic brain organized."
                author="David Park"
                role="Engineering Manager"
                delay={0.3}
              />
              <TestimonialCard 
                quote="Switched from Notion because I needed something faster. Memora loads instantly and never lags."
                author="Amanda Foster"
                role="Startup Founder"
                delay={0.4}
              />
              <TestimonialCard 
                quote="The sharing feature is perfect. I draft blog posts in Memora and share the link with my editor instantly."
                author="James Wilson"
                role="Content Creator"
                delay={0.5}
              />
            </div>
          </Container>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-24 lg:py-32">
          <Container>
            <FadeIn>
              <div 
                className="relative overflow-hidden rounded-3xl px-8 py-16 text-center lg:px-16 lg:py-24"
                style={{ 
                  background: 'linear-gradient(135deg, var(--lp-accent-primary), var(--lp-accent-secondary))',
                }}
              >
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                    Ready to start writing?
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
                    Join 10,000+ writers who've found their perfect note-taking home.
                  </p>
                  <div className="mt-8">
                    <Link to="/signup">
                      <button 
                        className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-transform hover:scale-105"
                        style={{ background: 'white', color: 'var(--lp-accent-primary)' }}
                      >
                        Get started free
                        {icons.arrowRight}
                      </button>
                    </Link>
                  </div>
                </div>
                
                {/* Decorative circles */}
                <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              </div>
            </FadeIn>
          </Container>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-16" style={{ background: 'var(--lp-bg-2)' }}>
        <Container>
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <Link to="/" className="mb-6">
              <img src="/logo-memora.png" alt="Memora" className="h-10 w-auto" />
            </Link>
            
            {/* Tagline */}
            <p className="mb-8 max-w-md text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
              The quiet space for your ideas. Write freely, organize effortlessly.
            </p>
            
            {/* Navigation */}
            <nav className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm">
              <a href="#features" className="transition-colors hover:text-[var(--lp-accent-primary)]" style={{ color: 'var(--lp-text-secondary)' }}>Features</a>
              <a href="#faq" className="transition-colors hover:text-[var(--lp-accent-primary)]" style={{ color: 'var(--lp-text-secondary)' }}>FAQ</a>
              <a href="#testimonials" className="transition-colors hover:text-[var(--lp-accent-primary)]" style={{ color: 'var(--lp-text-secondary)' }}>Reviews</a>
              <Link to="/app" className="transition-colors hover:text-[var(--lp-accent-primary)]" style={{ color: 'var(--lp-text-secondary)' }}>Open App</Link>
            </nav>
            
            {/* Divider */}
            <div className="w-full max-w-xs h-px mb-8" style={{ background: 'var(--lp-border)' }} />
            
            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl gap-4 text-xs" style={{ color: 'var(--lp-text-muted)' }}>
              <p>© {new Date().getFullYear()} Memora. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="/privacy" className="transition-colors hover:text-[var(--lp-text)]">Privacy</a>
                <a href="/terms" className="transition-colors hover:text-[var(--lp-text)]">Terms</a>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
