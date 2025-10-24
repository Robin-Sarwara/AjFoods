import React from 'react';

const ChatMessage = ({ message }) => {
  const { role, content, timestamp, isError, context } = message;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format markdown-like content (basic support)
  const formatContent = (text) => {
    // Convert **bold** to bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Convert bullet points
    formatted = formatted.replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>');
    formatted = formatted.replace(/^• (.*?)$/gm, '<li class="ml-4">$1</li>');
    
    // Wrap lists
    formatted = formatted.replace(/(<li.*?<\/li>\s*)+/gs, '<ul class="list-disc list-inside space-y-1 my-2">$&</ul>');
    
    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
        role === 'assistant' 
          ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-md' 
          : 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md'
      }`}>
        {role === 'assistant' ? '🤖' : '👤'}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%] ${role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isError 
            ? 'bg-red-100 text-red-800 border border-red-200'
            : role === 'assistant'
            ? 'bg-white text-gray-800 border border-gray-200'
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
        }`}>
          <div 
            className="text-sm leading-relaxed whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />
          
          {context && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                📊 {context.productsAnalyzed} products
              </span>
              {context.hasOrderHistory && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✓ Personalized
                </span>
              )}
            </div>
          )}
        </div>
        
        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
