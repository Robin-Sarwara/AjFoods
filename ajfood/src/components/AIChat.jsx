import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRole } from '../utils/useRole';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const AIChat = () => {
  const location = useLocation();
  const { userId } = useRole();
  
  // Pages where chatbot should be hidden
  const hiddenPages = [
    '/login',
    '/signup',
    '/forget-pass',
    '/reset-password',
    '/cart',
    '/order',
    '/profile',
    '/edit-profile',
    '/update-email',
    '/delivery-address/add',
    '/order-manager',
    '/add-product'
  ];
  
  // Check if current page is in hidden list
  const shouldHideChat = hiddenPages.some(page => location.pathname.startsWith(page));
  
  // Don't render if on hidden pages
  if (shouldHideChat) {
    return null;
  }
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m your AjFood AI Assistant. I can help you find delicious food, analyze reviews, and make personalized recommendations based on your order history. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to AI
  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Use userId from context (already available from useRole hook)
      const API_BASE_URL = import.meta.env.MODE === "production"
        ? "https://ajfoods.onrender.com/api"
        : "http://localhost:9090/api";

      // Get last 5 messages for context (excluding the welcome message)
      const conversationHistory = messages
        .filter(msg => msg.content !== 'Hello! 👋 I\'m your AjFood AI Assistant. I can help you find delicious food, analyze reviews, and make personalized recommendations based on your order history. What would you like to know?')
        .slice(-5) // Get last 5 messages
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userId: userId || null, // Using userId from context
          conversationHistory: conversationHistory // Send last 5 messages
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          context: data.context
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: '😔 Sorry, I encountered an error. Please try again or contact support.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared! How can I help you today? 😊',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${isChatOpen ? 'rotate-90' : ''}`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Toggle AI Assistant"
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        <span className="absolute -top-1 -right-1 bg-green-400 text-xs px-1.5 py-0.5 rounded-full font-bold animate-pulse">
          AI
        </span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-[100] w-full max-w-md transition-all duration-300 transform ${isChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[600px] max-h-[calc(100vh-120px)]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">AjFood AI Assistant</h3>
                <p className="text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  Online & Ready {userId && '• Personalized'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                onClick={handleClearChat}
                title="Clear chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button 
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                onClick={() => setIsChatOpen(false)}
                title="Minimize"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message}
              />
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-sm w-fit">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />

          {/* Footer */}
          <div className="bg-gray-100 p-2 text-center">
            <p className="text-xs text-gray-500">
              Powered by <span className="font-semibold text-orange-600">Google Gemini AI</span> ✨
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
