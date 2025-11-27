export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'core' | 'concept' | 'detail';
  x: number;
  y: number;
  description: string;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface AIResponse {
  markdown: string;
  relatedConcepts: {
    topic: string;
    description: string;
    connectionType: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isLoading?: boolean;
}