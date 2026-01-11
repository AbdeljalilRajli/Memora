
import React, { useCallback, useEffect } from 'react';
import { CampaignStudioProject, ImageFile, CampaignResult, CampaignScenario } from '../types';
import { resizeImage } from '../utils';
import { analyzeProductForCampaign, generateImage, editImage } from '../services/geminiService';
import ImageWorkspace from './ImageWorkspace';
import BrandingResultsGrid from './BrandingResultsGrid'; // Resuing similar grid layout

const CAMPAIGN_SCENARIOS: CampaignScenario[] = [
    'Creative Usage (Action)', 
    'Human Usage (Lifestyle)', 
    'Surreal Composition (Art)', 
    'Narrative Flat Lay (Story)', 
    'Cinematic Hero (Impact)', 
    'Textured Macro (Sensory)'
];

const CAMPAIGN_MOODS = [
    { label: 'Original', value: '' },
    { label: 'Minimalist White', value: 'Clean, high-key white minimalist aesthetic' },
    { label: 'Dark Luxury', value: 'Low-key, dramatic dark luxury aesthetic with gold accents' },
    { label: 'Pastel Pop', value: 'Soft, playful pastel colors and bright lighting' },
    { label: 'Nature Green', value: 'Organic, fresh aesthetic with green tones and natural elements' },
    { label: 'Ocean Blue', value: 'Cool, refreshing aesthetic with blue tones' },
    { label: 'Warm Gold', value: 'Warm, sunny, golden hour aesthetic' },
    { label: 'Cyberpunk Neon', value: 'Futuristic, high-contrast neon lighting' },
];

const COLOR_SUGGESTIONS = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Teal', hex: '#14B8A6' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Navy', hex: '#000080' },
];

// Helper to construct prompts based on the analyzed product context + specific angles for Social Media
const getCampaignPrompt = (scenario: CampaignScenario, productContext: string, styleInstruction: string): string => {
    let baseRequirement = `Create a high-end, award-winning Social Media campaign photo. Maintain the aspect ratio and orientation of the source image.
    Product Analysis: "${productContext}". 
    
    Constraint: Do not include any text, overlays, or watermarks. The focus must be 100% on the visual imagery. `;

    // Append custom style instructions if provided
    if (styleInstruction) {
        baseRequirement += `
        Global Style Requirement: ${styleInstruction}. `;
    }

    // Check if it's a known scenario or a custom one
    if (CAMPAIGN_SCENARIOS.includes(scenario)) {
        switch (scenario) {
            case 'Creative Usage (Action)':
                return baseRequirement + `
                Scene Concept: **Creative Usage in Context**. 
                Do not just place the product on a table. Show it in action or being actively used in a creative way suitable for the product type. 
                - If it's liquid, show a splash or pour. 
                - If it's wearable, show it on a model in motion. 
                - If it's tech, show it glowing or active.
                - If it's food/skincare, show texture swatches or ingredients exploding around it.
                The goal is to visualize the *experience* of using the product in a stylized, editorial manner.`;
                
            case 'Human Usage (Lifestyle)':
                return baseRequirement + `
                Scene Concept: **Human Interaction & Lifestyle**.
                Show a person (hands, face, or full body depending on product) actively using the product in a natural, real-life setting.
                - If it's a beverage, show someone drinking it or holding it with enjoyment.
                - If it's a gadget, show hands interacting with it.
                - If it's fashion/beauty, show it worn or applied on a model.
                The focus is on the human connection and the experience of using the product. The lighting should be natural and flattering.`;

            case 'Surreal Composition (Art)':
                return baseRequirement + `
                Scene Concept: **Surreal Art Installation**. 
                Place the product in a dreamlike, avant-garde setting. 
                Use impossible geometry, defying gravity, floating rocks, or oversized props. 
                The lighting should be artistic and dramatic (e.g., shafts of light, colored gels). 
                Treat the product like a piece of modern art in a gallery.`;

            case 'Narrative Flat Lay (Story)':
                return baseRequirement + `
                Scene Concept: **Visual Storytelling Flat Lay**. 
                A top-down or high-angle shot that tells a story about the user's lifestyle. 
                Don't just line things up; create a "controlled mess" that looks lived-in and aesthetic. 
                Include props that hint at a specific time of day (e.g., morning coffee, evening book) or activity related to the product. 
                The lighting should be dappled, perhaps filtering through leaves or blinds.`;

            case 'Cinematic Hero (Impact)':
                return baseRequirement + `
                Scene Concept: **The Blockbuster Hero Shot**. 
                A low-angle, imposing shot of the product that makes it look monumental and premium. 
                Use "Rim Lighting" or "Backlighting" to create a halo effect around the edges. 
                The background should be a cinematic blur (bokeh) that complements the product colors. 
                This is the main poster image for the campaign.`;

            case 'Textured Macro (Sensory)':
                return baseRequirement + `
                Scene Concept: **Sensory Texture Detail**. 
                An extreme close-up that focuses on the *feeling* of the materials. 
                Highlight condensation droplets, fabric weave, metallic grain, or the smoothness of the surface. 
                Use a shallow depth of field. 
                The goal is to make the viewer want to reach out and touch the product.`;
        }
    } 
    
    // Fallback or Custom logic handled in onGenerate, but if passed here:
    return baseRequirement;
};

const GreenCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const CampaignStudio: React.FC<{
    project: CampaignStudioProject;
    setProject: React.Dispatch<React.SetStateAction<CampaignStudioProject>>;
}> = ({ project, setProject }) => {

    const handleFileUpload = async (files: File[]) => {
        if (!files || files.length === 0) return;

        setProject(s => ({ ...s, isUploading: true, error: null }));
        let currentError: string | null = null;
        
        const filePromises = files.map(file => {
            return new Promise<ImageFile | null>(async (resolve) => {
                if (!file.type.startsWith('image/')) {
                    if (!currentError) currentError = `File '${file.name}' is not a supported image type.`;
                    resolve(null);
                    return;
                }
                try {
                    const resizedFile = await resizeImage(file, 2048, 2048);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        resolve({
                            base64: base64String.split(',')[1],
                            mimeType: resizedFile.type,
                            name: resizedFile.name
                        });
                    };
                    reader.onerror = () => {
                        if (!currentError) currentError = `Error reading file '${resizedFile.name}'.`;
                        resolve(null);
                    };
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

        if (validImages.length === 0) {
             setProject(s => ({ ...s, isUploading: false, error: currentError }));
             return;
        }

        const combinedImages = [...project.productImages, ...validImages];

        setProject(s => ({
            ...s,
            productImages: combinedImages,
            error: currentError,
            isUploading: false,
            isAnalyzing: true, 
            productAnalysis: '' // Reset to trigger loading view
        }));

        try {
            const analysis = await analyzeProductForCampaign(combinedImages);
            setProject(s => ({
                ...s,
                productAnalysis: analysis,
                isAnalyzing: false
            }));
        } catch (err) {
            console.error('Auto-analysis failed:', err);
            setProject(s => ({ ...s, isAnalyzing: false }));
        }
    };

    // Paste event listener
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                e.preventDefault();
                const files = Array.from(e.clipboardData.files);
                handleFileUpload(files);
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [project.productImages]); // Add dependency for handleFileUpload logic consistency

    const handleRemoveImage = (index: number) => {
        setProject(s => {
            const newImages = s.productImages.filter((_, i) => i !== index);
            return { 
                ...s, 
                productImages: newImages,
                // If all images removed, clear analysis
                productAnalysis: newImages.length === 0 ? null : s.productAnalysis,
                results: newImages.length === 0 ? [] : s.results
            };
        });
    };

    const handleUpdateImage = (index: number, newImage: ImageFile) => {
         setProject(s => {
            const newImages = [...s.productImages];
            if (index >= 0 && index < newImages.length) {
                newImages[index] = newImage;
            }
            return { ...s, productImages: newImages };
        });
    };

    const updateCustomIdea = (index: number, value: string) => {
        setProject(s => {
            const newIdeas = [...s.customIdeas];
            newIdeas[index] = value;
            return { ...s, customIdeas: newIdeas };
        });
    };

    const onGenerate = useCallback(async () => {
        if (project.productImages.length === 0) {
            setProject(s => ({ ...s, error: 'Please upload at least one product image.' }));
            return;
        }

        // Custom Mode Validation
        if (project.mode === 'custom') {
            const hasIdeas = project.customIdeas.some(idea => idea.trim() !== '');
            if (!hasIdeas) {
                setProject(s => ({ ...s, error: 'Please enter at least one post idea.' }));
                return;
            }
        }

        setProject(s => ({ ...s, isAnalyzing: true, isGenerating: true, error: null, results: [] }));

        try {
            // 1. Analyze the product (using all uploaded images)
            let analysis = project.productAnalysis;
            if (!analysis) {
                analysis = await analyzeProductForCampaign(project.productImages);
                setProject(s => ({ ...s, productAnalysis: analysis, isAnalyzing: false }));
            } else {
                setProject(s => ({ ...s, isAnalyzing: false }));
            }

            // 2. Prepare Results Array
            let scenariosToRun: string[] = [];
            
            if (project.mode === 'auto') {
                scenariosToRun = CAMPAIGN_SCENARIOS;
            } else {
                // Custom Mode: Only run indices that have text
                scenariosToRun = project.customIdeas.map((idea, i) => idea.trim() ? `Custom Post ${i + 1}` : null).filter(Boolean) as string[];
            }

            const initialResults = scenariosToRun.map(scenario => ({
                scenario, image: null, isLoading: true, error: null, editPrompt: '', isEditing: false
            } as any));
            
            setProject(s => ({ ...s, results: initialResults }));

            // 3. Generate images in parallel
            const generationPromises = scenariosToRun.map((scenario) => {
                let prompt = '';
                
                if (project.mode === 'auto') {
                     const moodValue = CAMPAIGN_MOODS.find(m => m.label === project.selectedMood)?.value || '';
                     const customPromptValue = project.customPrompt.trim();
                     const combinedStyle = [moodValue, customPromptValue].filter(Boolean).join(' ');
                     prompt = getCampaignPrompt(scenario, analysis!, combinedStyle);
                } else {
                    // Custom Mode Prompt Construction
                    const ideaIndex = parseInt(scenario.replace('Custom Post ', '')) - 1;
                    const specificIdea = project.customIdeas[ideaIndex];
                    const campaignStyle = project.customPrompt.trim(); // Reusing customPrompt for Style
                    
                    prompt = `Create a high-end Social Media campaign photo based on the following:
                    Product Analysis: "${analysis}".
                    Specific Scene Concept: "${specificIdea}".
                    Global Campaign Style/Lighting: "${campaignStyle}".
                    Constraint: Do not include text or watermarks. Focus on visual storytelling.`;
                }

                return generateImage(project.productImages, prompt, null)
                    .then(image => ({ status: 'fulfilled' as const, value: { scenario, image } }))
                    .catch(error => ({ status: 'rejected' as const, reason: { scenario, error } }));
            });

            const settledResults = await Promise.all(generationPromises);

            settledResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    const { scenario, image } = result.value;
                    setProject(s => ({
                        ...s,
                        results: s.results.map(r => r.scenario === scenario ? { ...r, image, isLoading: false } : r)
                    }));
                } else {
                    const { scenario, error } = result.reason;
                    setProject(s => ({
                        ...s,
                        results: s.results.map(r => r.scenario === scenario ? { ...r, error: error.message || 'Failed', isLoading: false } : r)
                    }));
                }
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred during campaign generation.';
            setProject(s => ({ ...s, error: errorMessage, isAnalyzing: false }));
        } finally {
            setProject(s => ({ ...s, isGenerating: false }));
        }

    }, [project.productImages, project.productAnalysis, project.selectedMood, project.customPrompt, project.mode, project.customIdeas, setProject]);

    const handleImageEdit = async (scenario: CampaignScenario) => {
        const resultToEdit = project.results.find(r => r.scenario === scenario);
        if (!resultToEdit || !resultToEdit.image || !resultToEdit.editPrompt.trim()) return;

        setProject(s => ({ ...s, results: s.results.map(r => r.scenario === scenario ? { ...r, isEditing: true, error: null } : r) }));
        try {
            const newImage = await editImage(resultToEdit.image, resultToEdit.editPrompt);
            setProject(s => ({ ...s, results: s.results.map(r => r.scenario === scenario ? { ...r, image: newImage, isEditing: false, editPrompt: '' } : r) }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Edit failed.';
            setProject(s => ({ ...s, results: s.results.map(r => r.scenario === scenario ? { ...r, error: errorMessage, isEditing: false } : r) }));
        }
    };

    const handleSetEditPrompt = (scenario: CampaignScenario, prompt: string) => {
        setProject(s => ({ ...s, results: s.results.map(r => r.scenario === scenario ? { ...r, editPrompt: prompt } : r) }));
    };

    const handleColorClick = (colorName: string) => {
        setProject(s => ({ ...s, customPrompt: s.customPrompt ? `${s.customPrompt}, ${colorName}` : `Dominant color: ${colorName}` }));
    };

    return (
        <main className="w-full max-w-7xl flex flex-col gap-4 pt-4 pb-8 flex-grow">
            {/* Header & Upload */}
            <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-64 flex-shrink-0">
                    <h3 className="text-sm font-bold text-[var(--color-text-medium)] text-center mb-2">Upload Image(s)</h3>
                    {/* Using ImageWorkspace for multi-upload support */}
                    <div className="w-full">
                         <ImageWorkspace
                            productImages={project.productImages}
                            onProductImagesUpload={handleFileUpload}
                            onProductImageRemove={handleRemoveImage}
                            isUploading={project.isUploading}
                            onProductImageUpdate={handleUpdateImage}
                        />
                    </div>
                     <div className="mt-2 text-center">
                        <p className="text-[10px] text-[var(--color-text-muted)] leading-tight">
                            Note: Result images will match the aspect ratio of your uploaded images.
                        </p>
                    </div>
                </div>
                
                <div className="flex-grow w-full flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--color-text-base)]">Creative Campaign Studio</h2>
                        <p className="text-md text-[var(--color-text-secondary)] mt-1">
                            Generate creative Social Media assets. Choose between automatic scenarios or define your own ideas.
                        </p>
                    </div>
                    
                    {/* MODE TOGGLE */}
                    <div className="flex bg-black/20 rounded-lg p-1 w-full sm:w-fit self-center sm:self-start">
                        <button
                            onClick={() => setProject(s => ({ ...s, mode: 'auto' }))}
                            className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                                project.mode === 'auto' 
                                ? 'bg-[var(--color-accent)] text-white shadow-md' 
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-base)]'
                            }`}
                        >
                            Auto Scenarios (6)
                        </button>
                        <button
                            onClick={() => setProject(s => ({ ...s, mode: 'custom' }))}
                            className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                                project.mode === 'custom' 
                                ? 'bg-[var(--color-accent)] text-white shadow-md' 
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-base)]'
                            }`}
                        >
                            Custom Ideas (3)
                        </button>
                    </div>

                    {/* AUTO MODE CONTROLS */}
                    {project.mode === 'auto' && (
                        <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                             {/* Mood Selector */}
                             <div className="flex flex-wrap gap-2">
                                {CAMPAIGN_MOODS.map(mood => (
                                    <button
                                        key={mood.label}
                                        onClick={() => setProject(s => ({ ...s, selectedMood: mood.label }))}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors border ${
                                            project.selectedMood === mood.label
                                            ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                                            : 'bg-black/20 text-[var(--color-text-secondary)] border-transparent hover:border-[var(--color-accent)] hover:text-[var(--color-text-base)]'
                                        }`}
                                    >
                                        {mood.label}
                                    </button>
                                ))}
                             </div>
                             
                             {/* Custom Prompt Input */}
                             <div className="w-full">
                                <label className="text-xs font-semibold text-[var(--color-text-muted)] mb-1 block">Custom Prompt / Color Theme</label>
                                <input
                                    type="text"
                                    value={project.customPrompt}
                                    onChange={(e) => setProject(s => ({ ...s, customPrompt: e.target.value }))}
                                    placeholder="e.g. Minimalist background, bright lighting..."
                                    className="w-full glass-input rounded-md px-3 py-2 text-sm text-[var(--color-text-base)] placeholder-[var(--color-text-muted)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all mb-2"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_SUGGESTIONS.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => handleColorClick(color.name)}
                                            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 transition-all text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-base)]"
                                        >
                                            <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color.hex }}></div>
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}

                    {/* CUSTOM MODE CONTROLS */}
                    {project.mode === 'custom' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                             {/* Style Input */}
                             <div className="w-full">
                                <label className="text-sm font-bold text-[var(--color-text-base)] mb-1 block">Campaign Style & Mood</label>
                                <input
                                    type="text"
                                    value={project.customPrompt}
                                    onChange={(e) => setProject(s => ({ ...s, customPrompt: e.target.value }))}
                                    placeholder="e.g. Cinematic lighting, dark moody atmosphere, neon accents..."
                                    className="w-full glass-input rounded-xl px-4 py-3 text-sm text-[var(--color-text-base)] border border-[rgba(var(--color-text-base-rgb),0.1)] focus:border-[var(--color-accent)] transition-all"
                                />
                             </div>

                             {/* 3 Ideas Inputs */}
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">Post Idea {i + 1}</label>
                                        <textarea
                                            value={project.customIdeas[i]}
                                            onChange={(e) => updateCustomIdea(i, e.target.value)}
                                            rows={3}
                                            className="w-full glass-input rounded-xl p-3 text-sm text-[var(--color-text-base)] placeholder-[var(--color-text-muted)] border border-[rgba(var(--color-text-base-rgb),0.1)] focus:border-[var(--color-accent)] transition-all resize-none"
                                            placeholder={`Describe idea for post ${i + 1}...`}
                                        />
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {(project.productAnalysis !== null || project.isAnalyzing) && (
                        <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-left animate-in fade-in duration-500 relative mt-2">
                             {project.isAnalyzing && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
                                     <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                             )}
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider flex items-center gap-1">
                                    AI Analysis <span className="opacity-50 text-[10px] font-normal lowercase ml-1">(editable)</span>
                                </h4>
                                <EditIcon />
                            </div>
                            <textarea
                                value={project.productAnalysis || ''}
                                onChange={(e) => setProject(s => ({ ...s, productAnalysis: e.target.value }))}
                                className="w-full bg-transparent border border-green-500/30 rounded-md p-2 text-sm text-green-400/90 focus:outline-none focus:border-green-500 transition-colors resize-y min-h-[60px] leading-relaxed"
                                placeholder={project.isAnalyzing ? "Analyzing product..." : "Analysis will appear here"}
                            />
                        </div>
                    )}

                    <div className="w-full mt-2">
                        <button
                            onClick={onGenerate}
                            disabled={project.productImages.length === 0 || project.isGenerating || project.isUploading || project.isAnalyzing}
                            className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] hover:from-[var(--color-accent-dark)] hover:to-[var(--color-accent-darker)] text-[var(--color-text-base)] font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/20 disabled:shadow-none transform hover:-translate-y-1 disabled:transform-none whitespace-nowrap"
                        >
                            {project.isUploading ? 'Uploading...' : project.isAnalyzing ? 'Analyzing...' : project.isGenerating ? 'Generating Campaign...' : `Generate ${project.mode === 'auto' ? '6 Scenarios' : 'Custom Campaign'}`}
                        </button>
                    </div>
                </div>
            </div>

            {project.error && <div className="bg-[rgba(var(--color-accent-rgb),0.2)] border border-[rgba(var(--color-accent-rgb),0.5)] text-[var(--color-accent-light)] px-4 py-3 rounded-lg" role="alert">{project.error}</div>}

            {/* Results */}
            {project.results.length > 0 && (
                <div className="glass-card rounded-2xl p-4">
                     <h3 className="text-xl font-bold text-[var(--color-text-base)] mb-4">Campaign Assets</h3>
                     <BrandingResultsGrid 
                        results={project.results.map(r => ({ ...r, category: r.scenario as any }))}
                        onImageEdit={(cat) => handleImageEdit(cat as any)}
                        onSetEditPrompt={(cat, p) => handleSetEditPrompt(cat as any, p)}
                        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                     />
                </div>
            )}
        </main>
    );
};

export default CampaignStudio;
