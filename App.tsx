import React, { useState, useCallback } from 'react';
import { generateVideoScripts, VideoScript } from './services/geminiService';

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
);

const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);


const ScriptCard: React.FC<{ script: VideoScript }> = ({ script }) => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-6 last:mb-0 transform transition-all duration-300 hover:border-teal-500 hover:scale-[1.02]">
        <div className="p-4 bg-gray-900/50">
            <h3 className="text-xl font-bold text-teal-300">{script.platform}</h3>
            <p className="text-gray-300 mt-1">"{script.title}"</p>
        </div>
        <div className="p-4 space-y-4">
            <div>
                <h4 className="font-semibold text-gray-200">Hook (First 3s):</h4>
                <p className="text-gray-400 italic">"{script.hook}"</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-200 mb-2">Scenes:</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {script.scenes.map((scene, index) => (
                        <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                            <p className="font-medium text-gray-300"><span className="font-bold text-teal-400">Visual:</span> {scene.visual}</p>
                            <p className="font-medium text-gray-300"><span className="font-bold text-teal-400">Voiceover:</span> {scene.voiceover}</p>
                            <p className="font-medium text-gray-300"><span className="font-bold text-teal-400">On-screen Text:</span> {scene.onScreenText}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
    const [topic, setTopic] = useState<string>("The history of the first computer.");
    const [generatedScripts, setGeneratedScripts] = useState<VideoScript[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = useCallback(async () => {
        if (!topic.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedScripts(null);

        try {
            const scripts = await generateVideoScripts(topic);
            setGeneratedScripts(scripts);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [topic, isLoading]);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-5xl mb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-500">
                    AI Video Idea Generator
                </h1>
                <p className="mt-2 text-lg text-gray-400">Turn any topic into viral scripts for TikTok, Reels, and Shorts.</p>
            </header>

            <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls Section */}
                <div className="lg:col-span-1 flex flex-col gap-4 p-6 bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl shadow-cyan-500/10 h-fit">
                    <label htmlFor="topic" className="text-lg font-semibold text-gray-200">
                        Enter a Topic or Paste Text
                    </label>
                    <textarea
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The benefits of a Mediterranean diet"
                        className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerateClick}
                        disabled={isLoading || !topic.trim()}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-cyan-500 to-sky-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500"
                    >
                        <LightbulbIcon className="w-5 h-5" />
                        <span>{isLoading ? 'Generating Ideas...' : 'Generate Ideas'}</span>
                    </button>
                </div>

                {/* Scripts Display Section */}
                <div className="lg:col-span-1 p-4 rounded-2xl border border-gray-700 bg-gray-800/50 shadow-2xl shadow-cyan-500/10">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                             <svg className="animate-spin h-12 w-12 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-lg font-medium">Brewing up some viral ideas...</p>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
                            <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && generatedScripts && (
                        <div className="h-full">
                           {generatedScripts.map((script, index) => (
                               <ScriptCard key={index} script={script} />
                           ))}
                        </div>
                    )}
                    {!isLoading && !error && !generatedScripts && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-4">
                           <FilmIcon className="w-16 h-16"/>
                            <p className="font-medium">Your generated video scripts will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
             <footer className="w-full max-w-5xl mt-8 text-center text-gray-500 text-sm">
                <p>
                    This tool is for generating content ideas and scripts. It does not create or process video files.
                </p>
            </footer>
        </div>
    );
};

export default App;