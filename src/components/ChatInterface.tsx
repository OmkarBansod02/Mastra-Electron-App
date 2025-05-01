import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../services/mastraService';
import mastraService from '../services/mastraService';

interface ChatInterfaceProps {
  isConnected: boolean;
  onSendMessage?: (message: string) => void;
  agentId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isConnected, onSendMessage, agentId }) => {
  // Generate a welcome message based on the agent ID
  const getWelcomeMessage = () => {
    if (!agentId) {
      return "Hello! I'm your AI agent deployed on Mastra Cloud. How can I assist you today?";
    }
    
    // Clean up the agent ID for display
    const cleanAgentId = agentId.replace(/([A-Z])/g, ' $1').toLowerCase();
    const agentName = cleanAgentId
      .split(/[^a-zA-Z0-9]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
    
    // If it's a weather agent
    if (agentId.toLowerCase().includes('weather')) {
      return `Hello! I'm your Weather Agent. I can provide weather forecasts and answer weather-related questions. How can I help you today?`;
    }
    
    // If it's a code or programming agent
    if (agentId.toLowerCase().includes('code') || agentId.toLowerCase().includes('program')) {
      return `Hello! I'm your Coding Assistant. I can help with programming questions, debug code, and provide coding guidance. What would you like help with?`;
    }
    
    // If it has "assistant" in the name
    if (agentId.toLowerCase().includes('assistant')) {
      return `Hello! I'm your AI Assistant. How can I assist you today?`;
    }
    
    // Generic welcome with agent name if we can extract it
    if (agentName && agentName !== agentId) {
      return `Hello! I'm your ${agentName}. How can I assist you today?`;
    }
    
    // Fallback generic message
    return `Hello! I'm your AI agent (${agentId}). How can I assist you today?`;
  };

  const [messages, setMessages] = useState<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt?: Date;
  }[]>([
    {
      id: '1',
      content: getWelcomeMessage(),
      role: 'assistant',
      createdAt: new Date(),
    },
  ]);
  
  // Update welcome message when agentId changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([
        {
          id: '1',
          content: getWelcomeMessage(),
          role: 'assistant',
          createdAt: new Date(),
        },
      ]);
    }
  }, [agentId]);

  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !isConnected || isProcessing) return;
    
    // Store the message text and clear the input
    const messageText = inputValue.trim();
    setInputValue('');
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: messageText,
      role: 'user' as const,
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Create a temporary assistantMessage with a "thinking" state
      const tempAssistantId = `assistant-${Date.now()}`;
      setMessages(prev => [
        ...prev, 
        {
          id: tempAssistantId,
          content: "",
          role: 'assistant',
          createdAt: new Date()
        }
      ]);

      // Use streaming to update the message in real-time
      await mastraService.streamMessage(messageText, (chunk) => {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          // Find the temporary assistant message
          const assistantMessageIndex = updatedMessages.findIndex(m => m.id === tempAssistantId);
          
          if (assistantMessageIndex !== -1) {
            // Update its content with the new chunk
            updatedMessages[assistantMessageIndex] = {
              ...updatedMessages[assistantMessageIndex],
              content: updatedMessages[assistantMessageIndex].content + chunk
            };
          }
          
          return updatedMessages;
        });
      });
    } catch (error) {
      console.error('Failed to get streaming response:', error);
      
      // Handle error by updating the message
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.content === "") {
          // Replace the empty assistant message with an error message
          return [
            ...prev.slice(0, -1),
            {
              id: lastMessage.id,
              content: "Sorry, I couldn't process your request. Please check your connection settings.",
              role: 'assistant',
              createdAt: new Date(),
            },
          ];
        }
        return prev;
      });
    } finally {
      setIsProcessing(false);
      
      // Notify parent component if callback exists
      if (onSendMessage) {
        onSendMessage(messageText);
      }
    }
  };

  // Send icon for button
  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
  );

  return (
    <div className="chat-container">
      {/* Chat messages container */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`message message-${message.role}`}
          >
            <div className="message-bubble">
              {message.content || (message.role === 'assistant' && isProcessing ? 'Thinking...' : '')}
            </div>
            <div className="message-timestamp">
              {message.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="input-container">
        <form 
          onSubmit={handleSendMessage}
          className="input-form"
        >
          <input
            type="text"
            className="input-field"
            placeholder={isConnected ? "Message the agent..." : "Connect to a Mastra AI agent to start chatting..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isConnected || isProcessing}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!isConnected || isProcessing || !inputValue.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
