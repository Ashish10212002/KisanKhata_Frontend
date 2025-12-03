import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { askAI } from '../api'; // Import the API function

export default function Assistant() {
  // Initial message
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Namaste! I am Kisan Sahayak. Ask me about crops, fertilizers, or weather in Hindi or English.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message to UI immediately
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 2. CALL THE REAL BACKEND (This was missing/fake before)
      const res = await askAI(input);
      
      // 3. Add Backend Response to UI
      const aiMsg = { role: 'system', content: res.data.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = { role: 'system', content: "Sorry, I cannot connect to the server right now. Is the Backend running?" };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto bg-white md:rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-2 md:mt-6">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 text-white flex items-center gap-3 shadow-md">
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/20">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Kisan Sahayak</h2>
          <p className="text-xs text-green-100 opacity-90 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-slate-700 rounded-tl-none'
            }`}>
              {msg.role === 'system' && <Bot size={16} className="mb-2 text-emerald-600 inline-block mr-2" />}
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 size={16} className="animate-spin text-emerald-600"/>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask e.g. 'Best fertilizer for wheat'..."
          className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
        />
        <button 
          disabled={loading || !input.trim()} 
          className="bg-emerald-600 text-white p-3.5 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}