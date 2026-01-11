
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { BrandingResult, BrandingResultCategory } from '../types';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
    </div>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const ImageResultCard: React.FC<{ 
    result: BrandingResult;
    onImageEdit: (category: BrandingResultCategory) => void;
    onSetEditPrompt: (category: BrandingResultCategory, prompt: string) => void;
}> = ({ result, onImageEdit, onSetEditPrompt }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const openModal = () => {
        if (result.image && !result.isLoading && !result.isEditing) setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleDownload = (resolution: '2k' | '4k') => {
        if (!result.image) return;
        setIsDownloading(true);
        const img = new Image();
        img.src = `data:${result.image.mimeType};base64,${result.image.base64}`;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsDownloading(false); return;
            };
            const targetWidth = resolution === '4k' ? 4096 : 2048;
            const aspectRatio = img.width / img.height;
            canvas.width = targetWidth;
            canvas.height = targetWidth / aspectRatio;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const link = document.createElement('a');
            link.download = `Jenta-byMahmoudReda-branding-${result.category.replace(/\s+/g, '-').toLowerCase()}-${resolution}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            setIsDownloading(false);
        }
        img.onerror = () => setIsDownloading(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-center text-[var(--color-text-medium)]">{result.category}</h4>
            <div 
                onClick={openModal}
                className={`w-full aspect-square bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden relative group transition-all ${result.image && !result.isLoading ? 'cursor-pointer' : ''}`}
            >
                {(result.isLoading || result.isEditing) && <LoadingSpinner />}
                {!result.isLoading && !result.isEditing && result.error && (
                    <div className="flex flex-col items-center text-center p-2">
                        <ErrorIcon />
                        <p className="text-xs text-red-300 mt-2">{result.error}</p>
                    </div>
                )}
                {!result.isLoading && !result.isEditing && result.image && (
                    <>
                        <img 
                            src={`data:${result.image.mimeType};base64,${result.image.base64}`} 
                            alt={`Generated Result for ${result.category}`} 
                            className="object-contain w-full h-full"
                        />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>
                    </>
                )}
            </div>

            {result.image && !result.isLoading && (
                <div className="flex flex-col gap-2">
                    <textarea
                        value={result.editPrompt}
                        onChange={(e) => onSetEditPrompt(result.category, e.target.value)}
                        rows={2}
                        className="w-full glass-input rounded-md p-2 text-xs leading-relaxed transition-all"
                        placeholder="e.g., 'Change the background to blue'"
                        disabled={result.isEditing}
                    />
                    <button
                        onClick={() => onImageEdit(result.category)}
                        disabled={result.isEditing || !result.editPrompt.trim()}
                        className="w-full text-sm bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] hover:from-[var(--color-accent-dark)] hover:to-[var(--color-accent-darker)] text-[var(--color-text-base)] font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-[var(--color-accent)]/20 disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                        {result.isEditing ? 'Generating...' : 'Apply Edit'}
                    </button>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleDownload('2k')}
                            disabled={isDownloading || result.isEditing}
                            className="flex-1 text-xs inline-flex items-center justify-center bg-[rgba(var(--color-text-base-rgb,229,231,206),0.05)] hover:bg-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] border border-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] text-[var(--color-text-base)] font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50"
                        > <DownloadIcon /> 2K </button>
                        <button 
                            onClick={() => handleDownload('4k')}
                            disabled={isDownloading || result.isEditing}
                            className="flex-1 text-xs inline-flex items-center justify-center bg-[rgba(var(--color-text-base-rgb,229,231,206),0.05)] hover:bg-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] border border-[rgba(var(--color-text-base-rgb,229,231,206),0.1)] text-[var(--color-text-base)] font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50"
                        > <DownloadIcon /> 4K </button>
                    </div>
                </div>
            )}
            
            {isModalOpen && result.image && createPortal(
                <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-[9999] p-4" onClick={closeModal} >
                    <img
                        src={`data:${result.image.mimeType};base64,${result.image.base64}`}
                        alt={`Enlarged result for ${result.category}`}
                        className="max-w-[95vw] max-h-[95vh] object-contain shadow-2xl rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={closeModal} className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors backdrop-blur-sm" >
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

const BrandingResultsGrid: React.FC<{
  results: BrandingResult[];
  onImageEdit: (category: BrandingResultCategory) => void;
  onSetEditPrompt: (category: BrandingResultCategory, prompt: string) => void;
  gridClassName?: string;
}> = ({ results, onImageEdit, onSetEditPrompt, gridClassName }) => {
  if (results.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center text-[var(--color-text-secondary)] p-4 min-h-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>Your generated mockups will appear here.</p>
      </div>
    );
  }

  const defaultGridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

  return (
    <div className={gridClassName || defaultGridClass}>
      {results.map((result) => (
        <ImageResultCard 
          key={result.category} 
          result={result} 
          onImageEdit={onImageEdit}
          onSetEditPrompt={onSetEditPrompt}
        />
      ))}
    </div>
  );
};

export default BrandingResultsGrid;
