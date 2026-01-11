import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="TemplateLanding animate-in fade-in duration-700">
      <nav className="fixed top-0 w-full z-[100] h-20 bg-white/80 backdrop-blur-md px-8 md:px-20 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="Brand tl-brand">
          <div className="BrandMark tl-brand-mark">L</div>
          <div className="BrandName text-lg font-extrabold tracking-tight text-gray-900">Listem Notes</div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <a href="#features" className="hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#reviews" className="hover:text-indigo-600 transition-colors">
            Reviews
          </a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">
            Faq
          </a>
          <Link to="/login" className="btn-black px-6 py-2 rounded-lg font-bold">
            Login
          </Link>
        </div>
      </nav>

      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="gradient-blob -top-40 left-1/2 -translate-x-1/2 opacity-60"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center mb-10 animate-in slide-in-from-top-2 duration-700">
            <div className="tl-hero-logo" aria-hidden="true">
              <div className="BrandMark tl-brand-mark">L</div>
            </div>
            <div className="mt-3 text-sm font-bold uppercase tracking-[0.35em] text-gray-500">Listem Notes</div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-8">
            New features ✨ Read more ➔
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8">
            Ideas captured <br /> Creativity <span className="text-indigo-600 italic">unleashed.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            With Listem, gather, organize, and prioritize your notes effortlessly. Streamline your thoughts and stay organized with ease.
          </p>
          <Link
            to="/signup"
            className="btn-black px-10 py-5 rounded-xl text-lg font-bold shadow-xl shadow-black/10 flex items-center gap-3 mx-auto w-fit"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2" />
            </svg>
            Sign up for free
          </Link>

          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                +10k
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex text-yellow-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Loved by users</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-24 relative animate-float">
          <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] rounded-full -z-10"></div>
          <div className="bg-white p-2 rounded-3xl shadow-2xl border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070"
              className="w-full h-auto rounded-2xl"
              alt="Product Mockup"
            />
          </div>
        </div>
      </section>

      <div className="py-12 border-y border-gray-100 overflow-hidden bg-white/50 ticker-container">
        <div className="flex gap-16 animate-marquee whitespace-nowrap px-8">
          {['Super Fast', 'Notion-like Editor', 'Dark Mode', 'Notes Privacy', 'Custom Colors', 'Multi-device Sync', 'Share notes', 'Export notes'].map(
            (f, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                {f}
              </div>
            )
          )}
        </div>
      </div>

      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h5 className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4em] mb-4">Listem Features</h5>
            <h2 className="text-5xl font-extrabold mb-6">See All Features</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Embark on a journey of discovery through a comprehensive array of features, meticulously crafted to elevate your note-taking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              {
                title: 'Super Fast',
                body: 'Capture ideas instantly. Listem keeps up with your pace for efficient note-taking.',
                icon: '⚡',
              },
              {
                title: 'Multi-Device Sync',
                body: 'Your notes stay available across devices, so you can continue anywhere.',
                icon: '☁️',
              },
              {
                title: 'Dark Mode',
                body: 'Comfortable reading and writing, day or night.',
                icon: '🌙',
              },
            ].map((feature, i) => (
              <div key={i} className="feature-card p-12 text-center flex flex-col items-center">
                <div className="text-5xl mb-8 transform hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-20 py-20">
            <div className="flex-1 feature-card p-4 lg:p-12 bg-indigo-50 relative group">
              <div className="bg-white rounded-2xl shadow-xl p-8 transform rotate-1 group-hover:rotate-0 transition-transform">
                <div className="flex gap-2 mb-6">
                  <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                </div>
                <div className="h-4 w-1/2 bg-gray-100 rounded-full mb-4"></div>
                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-gray-50 rounded-full"></div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full"></div>
                  <div className="h-1.5 w-3/4 bg-gray-50 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                Minimal Text Editor
              </span>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">Notion-like Editor</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Level up your note-taking with Listem’s notion-like editor. Enjoy a user-friendly interface and customizable formatting options for effortless organization.
              </p>
              <Link to="/app" className="btn-black px-8 py-3 rounded-lg font-bold flex items-center gap-3 w-fit">
                Try it now ➔
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-20 py-20">
            <div className="flex-1 feature-card p-4 lg:p-12 bg-purple-50 relative group">
              <div className="bg-white rounded-2xl shadow-xl p-8 transform -rotate-1 group-hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-indigo-600 rounded-md"></div>
                  <div className="h-3 w-24 bg-gray-100 rounded-full"></div>
                </div>
                <div className="h-40 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">
                  Note Preview
                </div>
              </div>
            </div>
            <div className="flex-1">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                Sharing is Caring
              </span>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">Notes Sharing</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Easily share your notes by generating links to your notes for quick and convenient sharing.
              </p>
              <Link to="/signup" className="btn-black px-8 py-3 rounded-lg font-bold flex items-center gap-3 w-fit">
                Try it now ➔
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-4 inline-block">Reviews</span>
            <h2 className="text-5xl font-extrabold">What people are saying...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Emily Watson',
                role: 'Mobile dev',
                quote:
                  'Listem is awesome! It’s easy to use and helps me stay organized. I use it for everything from shopping lists to work notes.',
              },
              {
                name: 'Jacob Lee',
                role: 'Developer',
                quote:
                  'Listem is simply amazing. The design is clean, and the app is very user-friendly. I use it daily.',
              },
              {
                name: 'Mia Garcia',
                role: 'Student',
                quote:
                  'Listem has been a lifesaver for my studies. I can organize my notes easily and access them whenever I need to.',
              },
            ].map((review, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <img src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-12 h-12 rounded-full" alt="avatar" />
                  <div>
                    <h4 className="font-bold text-sm">{review.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed italic">"{review.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-4 inline-block">FAQ</span>
            <h2 className="text-4xl font-extrabold">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Can I access my notes from multiple devices?',
                a: 'Yes, you can access your notes from any device with an internet connection by logging into your Listem account.',
              },
              {
                q: 'Is there a limit to the number of notes I can create?',
                a: 'No, Listem allows you to create as many notes as you need without any restrictions.',
              },
              {
                q: 'Can I share my notes with others?',
                a: 'Absolutely. You can generate a shareable link for any note in seconds.',
              },
              {
                q: 'Does Listem support markdown formatting?',
                a: 'Yes, our editor supports standard markdown and block-based formatting.',
              },
            ].map((faq, i) => (
              <div key={i} className="accordion-item overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between font-bold"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" />
                  </svg>
                </button>
                {openFaq === i ? (
                  <div className="px-8 pb-6 text-gray-600 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 bg-white px-8 md:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="BrandMark tl-brand-mark">L</div>
            <span className="font-bold text-gray-500">© {new Date().getFullYear()} Listem</span>
          </div>
          <div className="text-xs text-gray-400 font-medium">Terms of Use</div>
        </div>
      </footer>
    </div>
  );
}
