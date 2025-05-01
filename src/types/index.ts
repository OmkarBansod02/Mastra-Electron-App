// Configuration type for Mastra
export interface MastraConfig {
  mastraUrl: string;
  agentId: string;
}

// Message response from Mastra
export interface MastraResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Handlers for streaming responses
export interface StreamHandlers {
  onTextPart: (text: string) => void;
  onErrorPart?: (error: any) => void;
  onDone?: () => void;
}

// Stream response types
export interface StreamResponse {
  processDataStream?: (handlers: StreamHandlers) => Promise<void>;
  body?: ReadableStream<Uint8Array>;
  text?: string;
  content?: string;
}
