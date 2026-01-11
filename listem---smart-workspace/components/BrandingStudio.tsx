
import React, { useCallback } from 'react';
import { ImageFile, BrandingStudioProject, BrandingResultCategory, AspectRatio } from '../types';
import { resizeImage } from '../utils';
import { analyzeLogoForBranding, generateImage, editImage } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import BrandingResultsGrid from './BrandingResultsGrid';
import { ASPECT_RATIOS } from '../constants';

const MOCKUP_CATEGORIES: BrandingResultCategory[] = [
    'Logo Construction Grid', 'Typography Showcase', 'Logo Color Variations', 'Monochrome Version',
    '3D Glass Logo', 'Business Card Mockup', '3D Glass App Icon', 'Creative Pen Mockup',
    'Merchandise (Tote Bag)', 'Pencil Sketch Logo', 'Notebook Mockup', 'Waving Flag Mockup'
];

const getPromptForCategory = (category: BrandingResultCategory, aspectRatio: AspectRatio): string => {
    const aspectRatioRequirement = ` The final image must have a ${aspectRatio} aspect ratio.`;
    const compositionRequirement = ` The final image composition must have a ${aspectRatio} aspect ratio.`;

    switch (category) {
        case 'Logo Construction Grid':
            return "Create a technical brand guideline image. Display the provided logo on a light grid, showing construction lines, proportions (e.g., '2x', '3x'), and a clear space margin around it. The style should be clean, precise, and professional, like an architectural blueprint for the logo." + aspectRatioRequirement;
        case 'Typography Showcase':
            return "Create a brand typography specimen sheet. Analyze the font style used in the provided logo. Recreate that typographic style to display the full English alphabet in uppercase (A-Z), lowercase (a-z), and numbers (0-9). The characters should be arranged neatly on a clean, minimalist background. Add the title 'Brand Font' at the top of the image. The final image should look like a professional brand guideline page." + aspectRatioRequirement;
        case 'Logo Color Variations':
            return "Create a brand guideline image showing logo color variations. Display four versions of the provided logo, each on a different solid-colored background derived from the brand's main colors (e.g., primary, accent, dark, and light). The layout should be a clean 2x2 grid." + aspectRatioRequirement;
        case 'Monochrome Version':
            return 'A high-contrast, single-color (white) version of the provided logo, presented on a black background. The result should be sharp and minimalist.' + aspectRatioRequirement;
        case '3D Glass Logo':
            return "Create a photorealistic 3D mockup of the provided logo rendered in glossy, translucent glass. The logo should be set against a dark, moody background with subtle studio lighting and soft reflections." + aspectRatioRequirement;
        case 'Business Card Mockup':
            return "A photorealistic mockup of a premium, thick-stock business card with textured paper, featuring the provided logo. The card is placed on a stylish surface like dark wood or marble." + compositionRequirement;
        case '3D Glass App Icon':
            return "Create a photorealistic 3D app icon from the provided logo. The icon should be rendered in glossy, translucent glass with subtle internal light effects. Place the icon against a pure black background to make it stand out. The lighting should be soft and create beautiful reflections on the glass surface." + aspectRatioRequirement;
        case 'Creative Pen Mockup':
            return "A photorealistic mockup of a high-end, elegant pen with the provided logo subtly engraved on its clip. The pen is resting on a clean, minimalist surface with soft lighting." + compositionRequirement;
        case 'Merchandise (Tote Bag)':
            return "A photorealistic lifestyle mockup of the provided logo printed on a high-quality canvas tote bag. The bag is being held by a stylish person in an urban setting." + compositionRequirement;
        case 'Pencil Sketch Logo':
            return "Create a photorealistic, artistic sketch of the provided logo as if it were hand-drawn with a graphite pencil on textured white paper. The sketch should show realistic pencil strokes, shading, and texture. The style should be artistic and detailed." + aspectRatioRequirement;
        case 'Notebook Mockup':
            return "A photorealistic mockup of a premium Moleskine-style notebook. The provided logo is elegantly debossed on the cover. The notebook is placed on a creative desk setup with other stationery items." + compositionRequirement;
        case 'Waving Flag Mockup':
            return "A photorealistic mockup of the provided logo on a large, majestic flag waving gently in the wind against a clear sky. The fabric should show realistic texture and folds. The overall mood should be epic and inspiring." + compositionRequirement;
        default:
            return `A professional product shot of the provided logo.` + aspectRatioRequirement;
    }
}

const BrandingStudio: React.FC<{
  project: BrandingStudioProject;
  setProject: React.Dispatch<React.SetStateAction<BrandingStudioProject>>;
}> = ({ project, setProject }) => {

    const handleFileUpload = async (files: File[]) => {
        if (!files || files.length === 0) return;
        const file = files[0];

        setProject(s => ({ ...s, isUploading: true, error: null }));
        try {
            if (!file.type.startsWith('image/')) {
                throw new Error(`File '${file.name}' is not a supported image type.`);
            }
            const resizedFile = await resizeImage(file, 1024, 1024);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProject(s => ({
                    ...s,
                    logo: { base64: base64String.split(',')[1], mimeType: resizedFile.type, name: resizedFile.name },
                    isUploading: false,
                    // Reset previous results when new logo is uploaded
                    results: [],
                    colors: [],
                }));
            };
            reader.onerror = () => { throw new Error(`Error reading file '${resizedFile.name}'.`); };
            reader.readAsDataURL(resizedFile);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Could not process file.';
            setProject(s => ({ ...s, error: errorMessage, isUploading: false }));
        }
    };

    const handleRemoveLogo = () => {
        setProject(s => ({ ...s, logo: null, results: [], colors: [], error: null }));
    };

    const handleUpdateLogo = (index: number, newImage: ImageFile) => {
        setProject(s => ({ ...s, logo: newImage, results: [], colors: [] }));
    };
    
    const onGenerate = useCallback(async () => {
        if (!project.logo) {
            setProject(s => ({...s, error: 'Please upload a logo to begin.'}));
            return;
        }

        // 1. Analyze Logo for Colors
        setProject(s => ({...s, isAnalyzing: true, isGenerating: true, error: null, colors: [], results: []}));
        try {
            const analysis = await analyzeLogoForBranding(project.logo);
            setProject(s => ({...s, colors: analysis.colors, isAnalyzing: false}));

            // 2. Prepare mockups generation
            const initialResults = MOCKUP_CATEGORIES.map(category => ({
                category, image: null, isLoading: true, error: null, editPrompt: '', isEditing: false
            }));
            setProject(s => ({...s, results: initialResults}));
            
            // 3. Generate all mockups in parallel
            const generationPromises = MOCKUP_CATEGORIES.map(category => {
                const prompt = getPromptForCategory(category, project.aspectRatio);
                return generateImage([project.logo!], prompt, null)
                    .then(image => ({ status: 'fulfilled' as const, value: { category, image } }))
                    .catch(error => ({ status: 'rejected' as const, reason: { category, error } }));
            });

            const settledResults = await Promise.all(generationPromises);

            settledResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    const { category, image } = result.value;
                    setProject(s => ({...s, results: s.results.map(r => r.category === category ? { ...r, image, isLoading: false } : r)}));
                } else {
                    const { category, error } = result.reason;
                    console.error(`Failed to generate image for ${category}:`, error);
                    setProject(s => ({ ...s, results: s.results.map(r => r.category === category ? { ...r, error: error.message || 'Generation failed', isLoading: false } : r)}));
                }
            });

        } catch(err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
            setProject(s => ({...s, error: errorMessage, isAnalyzing: false }));
        } finally {
            setProject(s => ({...s, isGenerating: false}));
        }

    }, [project.logo, project.aspectRatio, setProject]);

    const handleSetEditPrompt = (category: BrandingResultCategory, prompt: string) => {
        setProject(s => ({ ...s, results: s.results.map(r => r.category === category ? { ...r, editPrompt: prompt } : r)}));
    };

    const handleImageEdit = async (category: BrandingResultCategory) => {
        const resultToEdit = project.results.find(r => r.category === category);
        if (!resultToEdit || !resultToEdit.image || !resultToEdit.editPrompt.trim()) return;
        
        setProject(s => ({...s, results: s.results.map(r => r.category === category ? { ...r, isEditing: true, error: null } : r)}));
        try {
            const newImage = await editImage(resultToEdit.image, resultToEdit.editPrompt);
            setProject(s => ({...s, results: s.results.map(r => r.category === category ? { ...r, image: newImage, isEditing: false, editPrompt: '' } : r)}));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during image editing.';
            setProject(s => ({...s, results: s.results.map(r => r.category === category ? { ...r, error: errorMessage, isEditing: false } : r)}));
        }
    };

    if (!project) return <div>Loading...</div>;

    const isLoading = project.isUploading || project.isAnalyzing || project.isGenerating;

    return (
        <main className="w-full max-w-7xl flex flex-col gap-4 pt-4 pb-8 flex-grow">
            {/* --- CONTROLS --- */}
            <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-48 flex-shrink-0">
                    <ImageUploader
                        id="branding-logo-uploader"
                        title="Upload Your Logo"
                        images={project.logo ? [project.logo] : []}
                        onFileUpload={handleFileUpload}
                        onRemove={handleRemoveLogo}
                        isUploading={project.isUploading}
                        onImageUpdate={handleUpdateLogo}
                    />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-xl font-bold text-[var(--color-text-base)]">Branding Studio</h2>
                    <p className="text-md text-[var(--color-text-secondary)] mt-1">Upload your logo to generate a complete brand identity kit, from colors and fonts to professional mockups.</p>
                     <div className="mt-4">
                        <h4 className="text-sm font-semibold text-[var(--color-text-medium)] mb-2">Mockup Aspect Ratio</h4>
                        <div className="flex justify-center md:justify-start gap-2 flex-wrap">
                            {ASPECT_RATIOS.map(ratio => (
                                <button
                                    key={ratio.value}
                                    onClick={() => setProject(s => ({ ...s, aspectRatio: ratio.value as AspectRatio }))}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                        project.aspectRatio === ratio.value 
                                        ? 'bg-[var(--color-accent)] text-white' 
                                        : 'bg-black/20 text-[var(--color-text-secondary)] hover:text-[var(--color-text-base)]'
                                    }`}
                                >
                                    {ratio.value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onGenerate}
                    disabled={!project.logo || isLoading}
                    className="w-full md:w-auto flex-shrink-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] hover:from-[var(--color-accent-dark)] hover:to-[var(--color-accent-darker)] text-[var(--color-text-base)] font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/20 disabled:shadow-none transform hover:-translate-y-1 disabled:transform-none"
                >
                    {project.isUploading ? 'Uploading...' : project.isAnalyzing ? 'Analyzing...' : project.isGenerating ? 'Generating...' : 'Generate Branding'}
                </button>
            </div>

            {project.error && <div className="bg-[rgba(var(--color-accent-rgb),0.2)] border border-[rgba(var(--color-accent-rgb),0.5)] text-[var(--color-accent-light)] px-4 py-3 rounded-lg" role="alert">{project.error}</div>}

            {/* --- BRAND IDENTITY RESULTS --- */}
            {(project.colors.length > 0) && !project.isAnalyzing && (
                <div className="glass-card rounded-2xl p-4">
                    <h3 className="text-xl font-bold text-[var(--color-text-base)] mb-4">Brand Identity Kit</h3>
                    <div>
                        <h4 className="text-md font-semibold text-[var(--color-text-medium)] mb-3">Color Palette</h4>
                        <div className="flex flex-wrap gap-3">
                            {project.colors.map((color, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 rounded-lg border border-white/10" style={{backgroundColor: color}}></div>
                                    <p className="text-xs mt-1.5 font-mono text-[var(--color-text-secondary)]">{color}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- MOCKUP RESULTS --- */}
            {project.results.length > 0 && (
                <div className="glass-card rounded-2xl p-4">
                    <h3 className="text-xl font-bold text-[var(--color-text-base)] mb-4">Brand Mockups & Guidelines</h3>
                     <BrandingResultsGrid
                        results={project.results}
                        onImageEdit={handleImageEdit}
                        onSetEditPrompt={handleSetEditPrompt}
                     />
                </div>
            )}
        </main>
    );
};

export default BrandingStudio;
