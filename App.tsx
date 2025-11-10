
import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.065 3.513l-2.61 4.522-4.522 2.61c-1.2.693-1.2 2.507 0 3.2l4.522 2.61 2.61 4.522c.693 1.2 2.507 1.2 3.2 0l2.61-4.522 4.522-2.61c1.2-.693 1.2-2.507 0-3.2l-4.522-2.61-2.61-4.522c-.693-1.2-2.507-1.2-3.2 0zM5.5 4.5a2 2 0 100-4 2 2 0 000 4zM3 13a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>(
        "A photorealistic, adorable chubby baby girl with dark curly hair and rosy cheeks, wearing an elaborate dress made entirely of green cabbage and kale leaves. The dress has a layered skirt and a fitted bodice. She is standing against a soft, neutral studio background."
    );
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = useCallback(async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const base64Image = await generateImage(prompt);
            setGeneratedImage(`data:image/jpeg;base64,${base64Image}`);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [prompt, isLoading]);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-5xl mb-6 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-400 to-emerald-500">
                    AI Image Recreator
                </h1>
                <p className="mt-2 text-lg text-gray-400">Describe an image and watch it come to life.</p>
            </header>

            <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
                {/* Controls Section */}
                <div className="lg:w-1/2 flex flex-col gap-4 p-6 bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl shadow-teal-500/10">
                    <label htmlFor="prompt" className="text-lg font-semibold text-gray-200">
                        Image Description
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A majestic lion wearing a crown in a futuristic city"
                        className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerateClick}
                        disabled={isLoading || !prompt.trim()}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg shadow-lg hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
                    >
                        <MagicWandIcon className="w-5 h-5" />
                        <span>{isLoading ? 'Generating...' : 'Generate Image'}</span>
                    </button>
                </div>

                {/* Image Display Section */}
                <div className="lg:w-1/2 aspect-[9/16] bg-gray-800/50 rounded-2xl border border-gray-700 flex items-center justify-center p-4 overflow-hidden shadow-2xl shadow-teal-500/10">
                    {isLoading && (
                        <div className="flex flex-col items-center gap-4 text-gray-400">
                             <svg className="animate-spin h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-lg font-medium">Creating your vision...</p>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="text-center text-red-400 p-4">
                            <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && generatedImage && (
                        <img src={generatedImage} alt="Generated by AI" className="w-full h-full object-contain rounded-lg" />
                    )}
                    {!isLoading && !error && !generatedImage && (
                        <div className="text-center text-gray-500 flex flex-col items-center gap-4">
                           <ImageIcon className="w-16 h-16"/>
                            <p className="font-medium">Your generated image will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
