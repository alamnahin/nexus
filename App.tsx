import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import Visualizer from './components/Visualizer';
import { generateKnowledge } from './services/geminiService';
import { ChatMessage, GraphData, KnowledgeNode, KnowledgeEdge } from './types';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const query = inputValue;
    setInputValue('');

    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Add Loading Placeholder
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isLoading: true
    }]);

    try {
      const response = await generateKnowledge(query);
      
      // Update Graph Data
      const coreNode: KnowledgeNode = {
        id: 'core',
        label: query,
        type: 'core',
        x: 0,
        y: 0,
        description: 'Main research topic'
      };

      const nodes: KnowledgeNode[] = [coreNode];
      const edges: KnowledgeEdge[] = [];

      // Generate positions in a circle layout
      const angleStep = (2 * Math.PI) / response.relatedConcepts.length;
      const radius = 180; // Distance from center

      response.relatedConcepts.forEach((concept, index) => {
        const angle = index * angleStep;
        const id = `node-${index}`;
        
        nodes.push({
          id,
          label: concept.topic,
          type: 'concept',
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          description: concept.description
        });

        edges.push({
          source: 'core',
          target: id
        });
      });

      setGraphData({ nodes, edges });

      // Replace loading message with actual content
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId ? {
          ...msg,
          content: response.markdown,
          isLoading: false
        } : msg
      ));

    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId ? {
          ...msg,
          content: "I encountered an error analyzing that topic. Please try again.",
          isLoading: false
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-900/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-900/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row h-full">
        {/* Left Side: Chat */}
        <div className="w-full md:w-[450px] flex-shrink-0 h-[40vh] md:h-full">
          <ChatPanel 
            messages={messages} 
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {/* Right Side: Visualizer */}
        <div className="flex-1 p-4 md:p-6 bg-gray-950/30">
          <Visualizer data={graphData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;