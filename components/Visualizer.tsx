import React, { useEffect, useState, useRef } from 'react';
import { GraphData, KnowledgeNode } from '../types';

interface VisualizerProps {
  data: GraphData | null;
  isLoading: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ data, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-indigo-300 font-mono text-sm animate-pulse">Analyzing Neural Pathways...</p>
        </div>
      </div>
    );
  }

  if (!data || data.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">Awaiting Input</h3>
          <p className="text-gray-400">Enter a complex topic in the chat to generate a knowledge graph.</p>
        </div>
      </div>
    );
  }

  // Calculate center offsets to center the graph
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        
        <svg className="w-full h-full cursor-grab active:cursor-grabbing">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" opacity="0.6" />
                </marker>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Edges */}
            {data.edges.map((edge, i) => {
                const source = data.nodes.find(n => n.id === edge.source);
                const target = data.nodes.find(n => n.id === edge.target);
                if (!source || !target) return null;

                return (
                    <line
                        key={i}
                        x1={source.x + centerX}
                        y1={source.y + centerY}
                        x2={target.x + centerX}
                        y2={target.y + centerY}
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        markerEnd="url(#arrowhead)"
                        className="transition-all duration-1000 ease-out"
                    />
                );
            })}

            {/* Nodes */}
            {data.nodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                const isCore = node.type === 'core';
                
                return (
                    <g 
                        key={node.id} 
                        transform={`translate(${node.x + centerX}, ${node.y + centerY})`}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="transition-all duration-500 ease-out cursor-pointer"
                    >
                        {/* Pulse effect for core node */}
                        {isCore && (
                             <circle r="30" fill="#4f46e5" opacity="0.2">
                                <animate attributeName="r" values="30;40;30" dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
                             </circle>
                        )}

                        {/* Node Circle */}
                        <circle
                            r={isCore ? 25 : 18}
                            fill={isCore ? "#4f46e5" : "#1f2937"}
                            stroke={isCore ? "#818cf8" : "#374151"}
                            strokeWidth={isHovered ? 3 : 2}
                            filter={isCore ? "url(#glow)" : ""}
                            className="transition-all duration-300"
                        />
                        
                        {/* Label */}
                        <text
                            y={isCore ? 45 : 35}
                            textAnchor="middle"
                            fill={isHovered ? "#fff" : "#9ca3af"}
                            fontSize={isCore ? 14 : 12}
                            fontWeight={isCore ? 600 : 400}
                            className="pointer-events-none select-none font-sans"
                        >
                            {node.label}
                        </text>

                        {/* Tooltip (embedded in SVG for simplicity, z-order tricky but works if last) */}
                        {isHovered && (
                            <foreignObject x="20" y="-80" width="200" height="100" className="overflow-visible z-50 pointer-events-none">
                                <div className="bg-gray-900 border border-gray-700 text-xs p-3 rounded-lg shadow-xl text-gray-200">
                                    <p className="font-semibold text-indigo-400 mb-1">{node.label}</p>
                                    <p className="leading-tight">{node.description}</p>
                                </div>
                            </foreignObject>
                        )}
                    </g>
                );
            })}
        </svg>
        
        {/* Graph Controls overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                Core Topic
            </div>
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-700 border border-gray-500 mr-2"></span>
                Related Concept
            </div>
        </div>
    </div>
  );
};

export default Visualizer;