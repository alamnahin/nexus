import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, inputValue, setInputValue, handleSubmit, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900/50 border-r border-gray-800 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          N
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-white">Nexus</h1>
          <p className="text-xs text-gray-400">AI Knowledge Cartographer</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="mt-10 px-4 text-center">
             <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
              Explore the Unknown
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Ask about complex topics. Nexus will analyze the semantic relationships and build a visual map.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {["Quantum Entanglement", "The Fall of Rome", "CRISPR CAS-9", "Neural Networks"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="p-3 text-sm text-left bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-indigo-500/50 rounded-lg transition-all text-gray-300"
                >
                  Explain <strong>{suggestion}</strong>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm'
              }`}>
                {msg.isLoading ? (
                   <div className="flex space-x-2 h-5 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <div className="markdown-content whitespace-pre-wrap">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex-shrink-0 flex items-center justify-center border border-gray-600">
                <span className="text-xs font-bold text-white">U</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Search for a topic (e.g., Black Holes)..."
            className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl pl-4 pr-12 py-3.5 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;