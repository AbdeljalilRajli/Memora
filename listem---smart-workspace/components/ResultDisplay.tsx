
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ImageFile } from '../types';

interface ResultDisplayProps {
  imageFile: ImageFile | null;
  isLoading: boolean;
  isEditing: boolean;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  onImageEdit: () => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ExpandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11 5l-5-5m5 5v-4m0 4h-4M4 16v4m0 0h4m-4 0l5-5m11 1V4" />
    </svg>
);


const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    imageFile, 
    isLoading,
    isEditing,
    editPrompt,
    setEditPrompt,
    onImageEdit,
}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    const handleDownload = (resolution: '2k' | '4k') => {
        if (!imageFile) return;

        setIsDownloading(true);
        const img = new Image();
        img.src = `data:${imageFile.mimeType};base64,${imageFile.base64}`;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsDownloading(false);
                return;
            };

            const targetWidth = resolution === '4k' ? 4096 : 2048;
            const aspectRatio = img.width / img.height;
            
            canvas.width = targetWidth;
            canvas.height = targetWidth / aspectRatio;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const link = document.createElement('a');
            link.download = `Jenta-byMahmoudReda-generated-${resolution}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            setIsDownloading(false);
        }
        img.onerror = () => {
             setIsDownloading(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="w-full aspect-square bg-black/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden relative">
                {(isLoading || isEditing) && <LoadingSpinner />}
                {!(isLoading || isEditing) && !imageFile && <span className="text-[var(--color-text-muted)]">Your result will appear here</span>}
                {!(isLoading || isEditing) && imageFile && (
                     <button onClick={() => setIsModalOpen(true)} className="w-full h-full focus:outline-none" aria-label="Enlarge generated image">
                        <img 
                            src={`data:${imageFile.mimeType};base64,${imageFile.base64}`} 
                            alt="Generated Result" 
                            className="object-contain w-full h-full cursor-pointer"
                        />
                    </button>
                )}
            </div>
            {imageFile && !isLoading && (
                <>
                <div className="flex flex-col gap-3">
                    <label htmlFor="edit-prompt" className="text-sm font-medium text-[var(--color-text-medium)]">
                        Refine the result with a prompt:
                    </label>
                    <textarea
                        id="edit-prompt"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        rows={2}
                        className="w-full glass-input rounded-md p-3 text-sm leading-relaxed transition-all"
                        placeholder="e.g., 'Change the background to a sunny beach' or 'Make the lighting more dramatic'"
                        disabled={isEditing}
                    />
                    <button
                        onClick={onImageEdit}
                        disabled={isEditing || !editPrompt.trim()}
                        className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] hover:from-[var(--color-accent-dark)] hover:to-[var(--color-accent-darker)] text-[var(--color-text-base)] font-bold py-2 px-4 rounded-lg text-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-[var(--color-accent)]/20 disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                        {isEditing ? 'Generating...' : 'Apply Edit'}
                    </button>
                </div>

                <div className="w-full border-t border-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] my-1"></div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => handleDownload('2k')}
                        disabled={isDownloading || isEditing}
                        className="flex-1 inline-flex items-center justify-center bg-[rgba(var(--color-text-base-rgb,229,231,206),0.05)] hover:bg-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] border border-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] text-[var(--color-text-base)] font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                        <DownloadIcon />
                        Download 2K
                    </button>
                    <button 
                        onClick={() => handleDownload('4k')}
                        disabled={isDownloading || isEditing}
                        className="flex-1 inline-flex items-center justify-center bg-[rgba(var(--color-text-base-rgb,229,231,206),0.05)] hover:bg-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] border border-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] text-[var(--color-text-base)] font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                        <DownloadIcon />
                        Download 4K
                    </button>
                </div>
                </>
            )}
            {isModalOpen && imageFile && createPortal(
                <div 
                    className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-[9999] p-4 animate-fade-in"
                    onClick={() => setIsModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Enlarged image view"
                >
                    <style>{`
                        @keyframes fade-in {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        .animate-fade-in {
                            animation: fade-in 0.3s ease-out;
                        }
                    `}</style>
                    <img
                        src={`data:${imageFile.mimeType};base64,${imageFile.base64}`}
                        alt="Enlarged generated result"
                        className="max-w-[95vw] max-h-[95vh] object-contain shadow-2xl rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors backdrop-blur-sm"
                        aria-label="Close enlarged image view"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ResultDisplay;
