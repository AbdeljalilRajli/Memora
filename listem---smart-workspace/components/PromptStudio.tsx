import React, { useState, useCallback } from 'react';
import { PromptStudioProject, ImageFile, PromptStudioHistoryItem } from '../types';
import { analyzeImageForPrompt, generatePromptFromText } from '../services/geminiService';
import { resizeImage } from '../utils';

// --- ICONS ---
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
// --- END ICONS ---


const PromptStudio: React.FC<{
  project: PromptStudioProject;
  setProject: React.Dispatch<React.SetStateAction<PromptStudioProject>>;
}> = ({ project, setProject }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [copied, setCopied] = useState(false);

    const TEXT_ONLY_PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 2 7h10c0-2 2-4 2-7a7 7 0 0 0-7-7Z"></path></svg>`;
    const placeholderImageFile: ImageFile = {
        base64: btoa(TEXT_ONLY_PLACEHOLDER_SVG),
        mimeType: 'image/svg+xml',
        name: 'text-idea.svg'
    };

    const handleFileUpload = async (files: File[]) => {
      if (!files || files.length === 0) return;
      setProject(s => ({ ...s, isUploading: true, error: null }));
      
      let currentError: string | null = null;
      const filePromises = files.map(file => {
          return new Promise<ImageFile | null>(async (resolve) => {
              if (!file.type.startsWith('image/')) {
                  if(!currentError) currentError = `File '${file.name}' is not a supported image type.`;
                  resolve(null);
                  return;
              }
              try {
                  const resizedFile = await resizeImage(file, 1024, 1024);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                      const base64String = reader.result as string;
                      resolve({ base64: base64String.split(',')[1], mimeType: resizedFile.type, name: resizedFile.name });
                  };
                  reader.onerror = () => { if(!currentError) currentError = `Error reading file '${resizedFile.name}'.`; resolve(null); };
                  reader.readAsDataURL(resizedFile);
              } catch (err) {
                  console.error(`Error processing ${file.name}:`, err);
                  if (!currentError) currentError = `Could not process file '${file.name}'.`;
                  resolve(null);
              }
          });
      });

      const results = await Promise.all(filePromises);
      const validImages = results.filter((img): img is ImageFile => img !== null);
      
      setProject(s => ({ ...s, images: [...s.images, ...validImages], error: currentError, isUploading: false }));
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(Array.from(e.dataTransfer.files));
            e.dataTransfer.clearData();
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(Array.from(e.target.files));
        }
        e.target.value = '';
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setProject(s => ({ ...s, images: s.images.filter((_, i) => i !== indexToRemove) }));
    };

    const handleGenerate = useCallback(async () => {
        if (project.images.length === 0 && !project.instructions.trim()) {
            setProject(s => ({ ...s, error: 'Please upload an image or write an idea in the instructions.' }));
            return;
        }
        setProject(s => ({ ...s, isLoading: true, error: null, generatedPrompt: null }));
        try {
            let prompt: string;
            let historyImage: ImageFile;

            if (project.images.length > 0) {
                prompt = await analyzeImageForPrompt(project.images, project.instructions);
                historyImage = project.images[0];
            } else {
                prompt = await generatePromptFromText(project.instructions);
                historyImage = placeholderImageFile;
            }

            const newHistoryItem: PromptStudioHistoryItem = {
                image: historyImage,
                instructions: project.instructions,
                generatedPrompt: prompt,
            };
            setProject(s => ({
                ...s,
                isLoading: false,
                generatedPrompt: prompt,
                history: [newHistoryItem, ...s.history],
                instructions: '', // Clear instructions after generation
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setProject(s => ({ ...s, isLoading: false, error: errorMessage }));
        }
    }, [project.images, project.instructions, setProject]);

    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!project) {
      return (
          <main className="w-full max-w-4xl flex items-center justify-center gap-8 pt-8 pb-12 flex-grow">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
              <p className="text-[var(--color-text-secondary)]">Loading Prompt Studio...</p>
          </main>
      );
    }

    return (
        <main className="w-full max-w-4xl flex flex-col gap-4 pt-4 pb-8 mx-auto">
            <div className="glass-card rounded-2xl p-4 space-y-4">
                <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} className="relative">
                    <input type="file" id="prompt-studio-uploader" className="hidden" multiple accept="image/*" onChange={handleInputChange} disabled={project.isUploading} />
                    <label htmlFor="prompt-studio-uploader" className={`group w-full flex flex-col items-center justify-center p-4 min-h-[200px] bg-black/10 rounded-xl border-2 transition-colors duration-300 ${isDragging ? 'border-solid border-[var(--color-accent)]' : 'border-dashed border-[rgba(var(--color-accent-rgb),0.3)] hover:border-[rgba(var(--color-accent-rgb),0.8)] cursor-pointer'}`}>
                       {project.images.length === 0 ? (
                           <div className="text-center">
                               <ChatIcon />
                               <p className="font-semibold mt-2 text-[var(--color-text-base)]">Click or drag & drop image(s)</p>
                               <p className="text-sm text-[var(--color-text-secondary)] mt-1">or write an idea below and click Generate</p>
                           </div>
                       ) : (
                           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 w-full">
                               {project.images.map((img, i) => (
                                   <div key={i} className="relative aspect-square group/image">
                                       <img src={`data:${img.mimeType};base64,${img.base64}`} alt={`upload preview ${i}`} className="w-full h-full object-cover rounded-md"/>
                                       <button onClick={(e) => { e.preventDefault(); handleRemoveImage(i); }} className="absolute top-1 right-1 z-10 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover/image:opacity-100 hover:bg-black/80 transition-opacity">
                                           <XIcon />
                                       </button>
                                   </div>
                               ))}
                           </div>
                       )}
                    </label>
                </div>

                <div className="flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-grow w-full">
                        <label htmlFor="instructions" className="block text-sm font-medium text-[var(--color-text-medium)] mb-2">Instructions / Idea</label>
                        <textarea id="instructions" value={project.instructions} onChange={e => setProject({...project, instructions: e.target.value})} rows={3} className="w-full glass-input rounded-md p-3 text-sm" placeholder="e.g., 'A majestic lion wearing a crown in a futuristic city' or add specific instructions for your uploaded image..."/>
                    </div>
                </div>
                
                {project.error && <div className="bg-[rgba(var(--color-accent-rgb),0.2)] border border-[rgba(var(--color-accent-rgb),0.5)] text-[var(--color-accent-light)] px-4 py-3 rounded-lg text-sm" role="alert">{project.error}</div>}

                {project.generatedPrompt && (
                    <div className="glass-input p-4 rounded-lg bg-black/20">
                        <div className="flex justify-between items-center mb-2">
                           <h3 className="text-md font-semibold text-[var(--color-text-base)]">Generated Prompt</h3>
                           <button onClick={() => handleCopy(project.generatedPrompt ?? '')} className="flex items-center text-xs px-2.5 py-1 rounded-md bg-[rgba(var(--color-accent-rgb),0.2)] hover:bg-[rgba(var(--color-accent-rgb),0.4)] text-[var(--color-accent-light)] hover:text-[var(--color-text-base)] transition-colors font-semibold">
                               {copied ? <CheckIcon /> : <CopyIcon />}
                               {copied ? 'Copied!' : 'Copy'}
                           </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-base)] whitespace-pre-wrap font-mono leading-relaxed">{project.generatedPrompt}</p>
                    </div>
                )}
            </div>

            <div className="w-full px-4 py-2">
                <button
                    onClick={handleGenerate}
                    disabled={project.isLoading || project.isUploading || (project.images.length === 0 && !project.instructions.trim())}
                    className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] hover:from-[var(--color-accent-dark)] hover:to-[var(--color-accent-darker)] text-[var(--color-text-base)] font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/20 disabled:shadow-none transform hover:-translate-y-1 disabled:transform-none"
                >
                    {project.isLoading ? 'Generating...' : 'Generate Prompt'}
                </button>
            </div>
            
            <div className="glass-card rounded-2xl p-4 space-y-4">
                <h2 className="text-xl font-bold text-[var(--color-text-base)]">Analysis History</h2>
                {project.history.length === 0 ? (
                    <p className="text-center text-sm text-[var(--color-text-secondary)] py-8">Analyzed prompts will appear here.</p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto suggestions-scrollbar pr-2">
                        {project.history.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 p-3 bg-black/20 rounded-lg">
                               <img src={`data:${item.image.mimeType};base64,${item.image.base64}`} alt="History item thumbnail" className="w-full sm:w-24 h-24 rounded-md object-contain sm:object-cover flex-shrink-0"/>
                               <div className="flex-1">
                                  <p className="text-sm text-[var(--color-text-base)] font-mono leading-relaxed [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">{item.generatedPrompt}</p>
                                  {item.instructions && <p className="text-xs text-[var(--color-text-muted)] mt-2"><strong>Instructions:</strong> {item.instructions}</p>}
                               </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default PromptStudio;