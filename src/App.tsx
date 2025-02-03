import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { BookOpen, Upload, Play, AlertCircle } from 'lucide-react';
import { extractTextFromPDF } from './utils/pdfUtils';
import { generateGameResponse, validateApiKey } from './utils/gemini';
import GameInterface from './components/GameInterface';
import StyleSelector from './components/StyleSelector';
import { GameState, AdventureStyle, Medal } from './types';

export default function App() {
  const [notes, setNotes] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<AdventureStyle>('fantasy');
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentScene: '',
    history: [],
    context: '',
    style: 'fantasy',
    medals: []
  });

  useEffect(() => {
    const apiKeyError = validateApiKey();
    if (apiKeyError) {
      setError(apiKeyError);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (file?.type === 'application/pdf') {
        const text = await extractTextFromPDF(file);
        setPdfContent(text);
        setError(null);
      }
    } catch (err) {
      setError('Error processing PDF file. Please try again.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  const startGame = async () => {
    try {
      setError(null);
      const context = `${pdfContent}\n${notes}`;
      const response = await generateGameResponse(context, [], selectedStyle);
      
      setGameState({
        isPlaying: true,
        currentScene: response.scene,
        history: [],
        context,
        style: selectedStyle,
        medals: []
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while starting the game. Please try again.');
    }
  };

  const handleChoice = async (choice: string) => {
    try {
      setError(null);
      const newHistory = [...gameState.history, choice];
      const response = await generateGameResponse(
        gameState.context,
        newHistory,
        gameState.style,
        choice
      );

      setGameState({
        ...gameState,
        currentScene: response.scene,
        history: newHistory,
        medals: response.medal 
          ? [...gameState.medals, response.medal]
          : gameState.medals
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your answer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-200 font-medium">Error</h3>
              <p className="text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {!gameState.isPlaying ? (
          <div className="space-y-10">
            <header className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center p-2 bg-indigo-500/20 rounded-2xl mb-6">
                <BookOpen className="w-8 h-8 text-indigo-400" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Interactive Learning Adventure
              </h1>
              <p className="text-lg text-gray-300">
                Transform your study materials into an engaging learning experience.
                Choose your preferred style and begin your educational journey.
              </p>
            </header>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Learning Style
                </h2>
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onStyleSelect={setSelectedStyle}
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Learning Materials
                </h2>

                <div {...getRootProps()} className="mb-6">
                  <input {...getInputProps()} />
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                ${isDragActive 
                                  ? 'border-indigo-500 bg-indigo-500/20' 
                                  : 'border-white/20 hover:border-indigo-500 hover:bg-indigo-500/10'}`}>
                    <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-indigo-400" />
                    </div>
                    <p className="text-white text-lg font-medium">
                      {isDragActive
                        ? 'Drop your PDF here'
                        : 'Drag & drop your PDF here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      PDF files only
                    </p>
                  </div>
                </div>

                {pdfContent && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">
                      PDF Content
                    </h3>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg max-h-40 overflow-y-auto">
                      <p className="text-gray-300 text-sm">{pdfContent}</p>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label htmlFor="notes" className="block text-lg font-medium text-white mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-32 p-3 bg-white/5 text-white 
                             border border-white/20 rounded-lg 
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             placeholder-gray-500"
                    placeholder="Add any additional context or notes for your learning session..."
                  />
                </div>

                <button
                  onClick={startGame}
                  disabled={(!pdfContent && !notes) || !!error}
                  className="w-full flex items-center justify-center gap-2 
                           bg-indigo-600 hover:bg-indigo-700 
                           disabled:bg-gray-700
                           text-white font-semibold
                           px-6 py-4 rounded-lg
                           transition-colors duration-200
                           disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Play className="w-6 h-6" />
                  Begin Learning
                </button>
              </div>
            </div>
          </div>
        ) : (
          <GameInterface
            gameState={gameState}
            onChoice={handleChoice}
          />
        )}
      </div>
    </div>
  );
}