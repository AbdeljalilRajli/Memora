
import React, { useState, useEffect } from 'react';
import { askNoteAssistant } from './services/geminiService';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  updatedAt: string;
}

const COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Pink', value: '#FDF2F8' },
  { name: 'Blue', value: '#EFF6FF' },
  { name: 'Green', value: '#ECFDF5' },
  { name: 'Amber', value: '#FFFBEB' },
];

const App = () => {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [activeTab, setActiveTab] = useState('Home');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeNote, setActiveNote] = useState<Note>({
    id: '1',
    title: 'Book Review: "The Alchemist" by Paulo Coelho',
    content: 'The Alchemist is a captivating novel about following your dreams. After that, I enjoy a healthy breakfast, usually consisting of oatmeal with fruits or whole-grain toast...',
    color: '#FFFFFF',
    isPinned: true,
    updatedAt: 'Just now'
  });

  const handleAiRefine = async () => {
    setIsAiLoading(true);
    try {
      const res = await askNoteAssistant(`Make this note more professional: ${activeNote.content}`);
      setActiveNote(prev => ({ ...prev, content: res }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (view === 'landing') {
    return <LandingView onEnter={() => setView('workspace')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-500">
      {/* Workspace Header */}
      <nav className="h-16 px-8 border-b bg-white flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2"/></svg>
          </div>
          <span className="font-bold text-xl tracking-tight">Noteed</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView('landing')} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Log out</button>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 lg:p-12 gap-8">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
             <button onClick={() => setView('landing')} className="text-sm font-bold flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg>
               Back
             </button>
          </div>

          <div className="feature-card flex-grow flex flex-col overflow-hidden" style={{ backgroundColor: activeNote.color }}>
             {/* Note Toolbar */}
             <div className="px-6 py-4 border-b flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Note color:</span>
                  <div className="flex gap-1.5">
                    {COLORS.map(c => (
                      <button 
                        key={c.name}
                        onClick={() => setActiveNote(prev => ({ ...prev, color: c.value }))}
                        className={`w-5 h-5 rounded-full border border-gray-200 transition-transform ${activeNote.color === c.value ? 'scale-125 border-pink-500 ring-2 ring-pink-500/20' : ''}`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-lg border text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                  <button className="px-4 py-1.5 rounded-lg btn-black text-xs font-bold">Save</button>
                  <button className="p-1.5 rounded-lg border hover:bg-gray-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/></svg></button>
                </div>
             </div>

             <div className="p-8 lg:p-16 flex-grow flex flex-col gap-8">
                <input 
                  value={activeNote.title}
                  onChange={e => setActiveNote(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-transparent text-3xl lg:text-4xl font-bold outline-none border-none placeholder:text-gray-200"
                />
                
                {/* Editor Tools */}
                <div className="flex flex-wrap gap-4 py-2 border-y border-gray-100">
                  {['B', 'I', 'U', 'S', '</>', '🔗', '📋', 'H1', 'H2', '≡', '⋮≡', '""'].map(tool => (
                    <button key={tool} className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all">{tool}</button>
                  ))}
                  <button onClick={handleAiRefine} className="ml-auto text-xs font-black text-pink-500 uppercase tracking-widest px-3 py-1 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors">
                    {isAiLoading ? 'Refining...' : 'AI Refine ✨'}
                  </button>
                </div>

                <textarea 
                  value={activeNote.content}
                  onChange={e => setActiveNote(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-transparent flex-grow text-lg leading-relaxed outline-none border-none resize-none placeholder:text-gray-200"
                  placeholder="Start writing your amazing thoughts..."
                />
                
                <div className="flex gap-2 pt-8">
                  <button className="px-4 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">Export ⤴</button>
                  <button className="px-4 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">Print 🖨</button>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar notes */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
           <h3 className="text-xl font-bold">Your notes</h3>
           <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Notes list</span>
                <div className="flex gap-2">
                   <button className="p-1 border rounded">Sort by ▾</button>
                   <button className="px-2 py-1 bg-black text-white rounded">+ New</button>
                </div>
              </div>
              
              <div className="space-y-3">
                 {[
                   { title: 'Aliquip ex ea commodo...', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...', color: '#FDF2F8' },
                   { title: 'Dignissim convallis', body: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis...', color: '#ECFDF5' },
                   { title: 'Lorem Ipsum', body: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis...', color: '#FFFBEB' }
                 ].map((note, i) => (
                   <div key={i} className="p-4 rounded-2xl border bg-white hover:border-pink-500 transition-all cursor-pointer group shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-sm">{note.title}</h4>
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: note.color }}></div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{note.body}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LandingView = ({ onEnter }: { onEnter: () => void }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header */}
      <nav className="fixed top-0 w-full z-[100] h-20 bg-white/80 backdrop-blur-md px-8 md:px-20 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2"/></svg>
          </div>
          <span className="font-bold text-2xl tracking-tight">Noteed</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#" className="hover:text-pink-500 transition-colors">Home</a>
          <a href="#features" className="hover:text-pink-500 transition-colors">Features</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Reviews</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Faq</a>
          <button className="btn-black px-6 py-2 rounded-lg font-bold">Login</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="gradient-blob -top-40 left-1/2 -translate-x-1/2 opacity-60"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 text-[10px] font-bold uppercase tracking-widest text-pink-600 mb-8">
            New features ✨ Read more ➔
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8">
            Ideas captured <br /> Creativity <span className="text-pink-500 italic">unleashed.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            With Noteed, gather, organize, and prioritize your notes effortlessly. Streamline your thoughts and stay organized with ease.
          </p>
          <button onClick={onEnter} className="btn-black px-10 py-5 rounded-xl text-lg font-bold shadow-xl shadow-black/10 flex items-center gap-3 mx-auto">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2"/></svg>
            Sign up for free
          </button>
          
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user"/>
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-white bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">+10k</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex text-yellow-400 gap-0.5">
                {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Loved by 100+ users</p>
            </div>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="max-w-6xl mx-auto mt-24 relative animate-float">
          <div className="absolute inset-0 bg-pink-500/10 blur-[100px] rounded-full -z-10"></div>
          <div className="bg-white p-2 rounded-3xl shadow-2xl border border-gray-100">
             <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070" className="w-full h-auto rounded-2xl" alt="Product Mockup"/>
          </div>
        </div>
      </section>

      {/* Feature Ticker */}
      <div className="py-12 border-y border-gray-100 overflow-hidden bg-white/50 ticker-container">
        <div className="flex gap-16 animate-marquee whitespace-nowrap px-8">
           {['Super Fast', 'Notion-like Editor', 'Dark Mode', 'Notes Privacy', 'Custom Colors', 'Multi-device Sync', 'Share notes', 'Export notes'].map((f, i) => (
             <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
               <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
               {f}
             </div>
           ))}
        </div>
      </div>

      {/* See All Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h5 className="text-[10px] font-bold text-pink-500 uppercase tracking-[0.4em] mb-4">Noteed Features</h5>
            <h2 className="text-5xl font-extrabold mb-6">See All Features</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">Embark on a journey of discovery through a comprehensive array of features, meticulously crafted to elevate your note-taking experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              { title: 'Super Fast', body: 'Noteed ensures your thoughts are captured without delay, keeping up with your pace for efficient note-taking.', icon: '⚡' },
              { title: 'Multi-Device Sync', body: 'With Noteed, your notes sync seamlessly across all devices, ensuring access and updates from anywhere.', icon: '☁️' },
              { title: 'Dark Mode', body: 'Noteed’s dark mode offers a comfortable reading and writing experience, reducing eye strain in low-light settings.', icon: '🌙' }
            ].map((feature, i) => (
              <div key={i} className="feature-card p-12 text-center flex flex-col items-center">
                 <div className="text-5xl mb-8 transform hover:scale-110 transition-transform">{feature.icon}</div>
                 <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>

          {/* Editor Highlight Section */}
          <div className="flex flex-col lg:flex-row items-center gap-20 py-20">
            <div className="flex-1 feature-card p-4 lg:p-12 bg-pink-50 relative group">
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
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Minimal Text Editor</span>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">Notion-like Editor</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">Level up your note-taking with Noteed’s notion-like editor. Enjoy a user-friendly interface and customizable formatting options for effortless organization. Stay productive and organized with ease.</p>
              <button onClick={onEnter} className="btn-black px-8 py-3 rounded-lg font-bold flex items-center gap-3">
                Try it now ➔
              </button>
            </div>
          </div>

          {/* Sharing Highlight Section */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20 py-20">
            <div className="flex-1 feature-card p-4 lg:p-12 bg-purple-50 relative group">
               <div className="bg-white rounded-2xl shadow-xl p-8 transform -rotate-1 group-hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-pink-500 rounded-md"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="h-40 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">Note Preview</div>
               </div>
            </div>
            <div className="flex-1">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Sharing is Caring</span>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">Notes Sharing</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">Easily share your notes with Noteed’s sharing feature. Generate links to your notes for quick and convenient sharing, perfect for sharing ideas or information with others. Stay connected and productive with Noteed.</p>
              <button onClick={onEnter} className="btn-black px-8 py-3 rounded-lg font-bold flex items-center gap-3">
                Try it now ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-4 inline-block">Reviews</span>
            <h2 className="text-5xl font-extrabold">What people are saying...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Emily Watson', role: 'Mobile dev', quote: 'Noteed is awesome! It’s so easy to use and helps me stay organized. I use it for everything from shopping lists to work notes. Highly recommend!' },
              { name: 'Jacob Lee', role: 'Developer', quote: 'Noteed is simply amazing. I use it for work and personal notes, and it has made my life so much easier. The design is clean, and the app is very user-friendly.' },
              { name: 'Mia Garcia', role: 'Student', quote: 'Noteed has been a lifesaver for my studies. I can organize my notes by subject and easily access them whenever I need to. The export feature is also great for sharing notes with classmates.' }
            ].map((review, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-4 mb-6">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-12 h-12 rounded-full" alt="avatar"/>
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

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-4 inline-block">FAQ</span>
            <h2 className="text-4xl font-extrabold">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Can I access my notes from multiple devices?', a: 'Yes, you can access your notes from any device with an internet connection by logging into your Noteed account.' },
              { q: 'Is there a limit to the number of notes I can create?', a: 'No, Noteed allows you to create as many notes as you need without any restrictions.' },
              { q: 'Can I share my notes with others?', a: 'Absolutely. You can generate a shareable link for any note in seconds.' },
              { q: 'Does Noteed support markdown formatting?', a: 'Yes, our editor supports standard markdown and block-based formatting.' }
            ].map((faq, i) => (
              <div key={i} className="accordion-item overflow-hidden">
                 <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between font-bold"
                 >
                   <span>{faq.q}</span>
                   <svg className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
                 </button>
                 {openFaq === i && (
                   <div className="px-8 pb-6 text-gray-600 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                     {faq.a}
                   </div>
                 )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white px-8 md:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5"/></svg>
             </div>
             <span className="font-bold text-gray-500">Made by Salah eddine</span>
           </div>
           <div className="text-xs text-gray-400 font-medium">Terms of Use</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
