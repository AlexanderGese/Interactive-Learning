import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GameState, Medal } from '../types';
import { Scroll, Send, History, Medal as MedalIcon, Lightbulb, Brain, ChevronDown, ChevronUp } from 'lucide-react';

interface GameInterfaceProps {
  gameState: GameState;
  onChoice: (choice: string) => void;
}

function MedalBadge({ medal }: { medal: Medal }) {
  const colors = {
    gold: 'bg-yellow-500',
    silver: 'bg-gray-300',
    bronze: 'bg-amber-600'
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`flex flex-col rounded-lg ${colors[medal.type]} bg-opacity-20 backdrop-blur-sm
                    border border-white/10 hover:border-white/20 transition-colors`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-3"
      >
        <div className="flex items-center gap-2">
          <MedalIcon className={`w-5 h-5 text-${medal.type === 'silver' ? 'gray' : medal.type}-500`} />
          <span className="text-sm font-medium text-white">{medal.type.charAt(0).toUpperCase() + medal.type.slice(1)} Medal</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-white/70" /> : <ChevronDown className="w-4 h-4 text-white/70" />}
      </button>
      {expanded && (
        <div className="px-3 pb-3 text-sm text-white/80 border-t border-white/10">
          {medal.message}
        </div>
      )}
    </div>
  );
}

export default function GameInterface({ gameState, onChoice }: GameInterfaceProps) {
  const [answer, setAnswer] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onChoice(answer.trim());
      setAnswer('');
    }
  };

  // Extract examples from the scene text (between <!-- examples --> tags)
  const examplesMatch = gameState.currentScene.match(/<!-- examples -->\n([\s\S]*?)\n<!-- end examples -->/);
  const examples = examplesMatch ? examplesMatch[1].split('\n').filter(e => e.trim()) : [];
  
  // Remove examples section from displayed scene
  const cleanScene = gameState.currentScene.replace(/<!-- examples -->[\s\S]*?<!-- end examples -->/g, '');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {gameState.medals.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <MedalIcon className="w-5 h-5 text-yellow-500" />
            Your Learning Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gameState.medals.map((medal, index) => (
              <MedalBadge key={index} medal={medal} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Scroll className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Learning Session</h2>
          </div>
          
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/90 
                         prose-strong:text-white prose-em:text-white/80
                         prose-blockquote:border-indigo-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-lg
                         prose-blockquote:py-2 prose-blockquote:px-4">
            <ReactMarkdown>{cleanScene}</ReactMarkdown>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="answer" className="text-lg font-medium text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              Your Answer
            </label>
            
            {examples.length > 0 && (
              <button
                type="button"
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors
                         bg-indigo-500/10 px-3 py-1.5 rounded-lg"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">{showExamples ? 'Hide' : 'Show'} Approaches</span>
              </button>
            )}
          </div>
          
          {examples.length > 0 && showExamples && (
            <div className="mb-4 p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/20">
              <p className="text-sm text-white/80 mb-3">Consider these different approaches:</p>
              <ul className="space-y-2 text-sm text-white/70">
                {examples.map((example, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 bg-white/10 text-white rounded-lg border border-white/20 px-4 py-3
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       placeholder-white/50"
              placeholder="Enter your answer..."
            />
            <button
              type="submit"
              disabled={!answer.trim()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg 
                       hover:bg-indigo-700 transition-colors duration-200
                       disabled:bg-gray-700 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Send className="w-5 h-5" />
              Submit
            </button>
          </div>
        </form>

        {gameState.history.length > 0 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-medium text-white">Learning History</h3>
            </div>
            <div className="space-y-4">
              {gameState.history.map((entry, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <span className="font-medium text-indigo-400">Your answer:</span>
                  <p className="mt-2 text-white/80 italic">{entry}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}