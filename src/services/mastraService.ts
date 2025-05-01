import { MastraClient } from '@mastra/client-js';
import { getConfig } from '../utils/configStore';


export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}


const mastraService = {
  client: null as any,
  agent: null as any,
  connected: false,
  
  async initializeClient() {
    try {
      const config = await getConfig();
      
      if (!config.mastraCloudUrl || !config.agentId) {
        this.connected = false;
        return false;
      }
      
      this.client = new MastraClient({
        baseUrl: config.mastraCloudUrl
      });
      
      // Use getAgent instead of agent
      this.agent = this.client.getAgent(config.agentId);
      return true;
    } catch (error) {
      console.error('Failed to initialize Mastra client:', error);
      this.connected = false;
      return false;
    }
  },
  
  async ensureInitialized() {
    if (!this.client || !this.agent) {
      return await this.initializeClient();
    }
    return true;
  },
  
  // Generate response (non-streaming)
  async generateResponse(prompt: string): Promise<string> {
    if (!await this.ensureInitialized()) {
      throw new Error('Failed to initialize Mastra client');
    }

    try {
      const response = await this.agent.generate({
        messages: [{ role: "user", content: prompt }]
      });
      
      // Handle different response formats
      if (typeof response === 'string') {
        return response;
      } else if (response && typeof response === 'object') {
        // If response is an object, look for content property
        if ('content' in response) {
          return response.content;
        } else if ('text' in response) {
          return response.text;
        }
      }
      
      // Fallback
      return 'No response received';
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  },
  
  // Stream message with callback for chunks
  async streamMessage(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    if (!await this.ensureInitialized()) {
      throw new Error('Failed to initialize Mastra client');
    }

    try {
      const response = await this.agent.stream({
        messages: [{ role: "user", content: prompt }]
      });
      
      if (response && typeof response.processDataStream === 'function') {
        await response.processDataStream({
          onTextPart: (text: string) => {
            if (text) {
              onChunk(text);
            }
          },
          onErrorPart: () => {} // Handle errors if needed
        });
      } 
      // Check if response has a readable stream body
      else if (response && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          onChunk(text);
        }
      }
      // Handle non-streaming response as fallback
      else if (response) {
        let content = '';
        
        if (typeof response === 'string') {
          content = response;
        } else if (response.content) {
          content = response.content;
        } else if (response.text) {
          content = response.text;
        } else {
          content = JSON.stringify(response);
        }
        
        onChunk(content);
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      throw error;
    }
  },
  
  // Helper to format messages
  formatMessage(role: 'user' | 'assistant', content: string): Message {
    return {
      id: `${role}-${Date.now()}`,
      content,
      role,
      timestamp: new Date()
    };
  },
  
  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      if (!await this.ensureInitialized()) {
        return false;
      }

      // Send a simple test message
      await this.agent.generate({
        messages: [{ role: "user", content: "Test connection" }]
      });
      
      this.connected = true;
      return true;
    } catch (error) {
      this.connected = false;
      return false;
    }
  }
};

export default mastraService;
