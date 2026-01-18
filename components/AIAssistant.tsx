
import React, { useState, useRef, useEffect } from 'react';
import { InsightMessage } from '../types';
import { getDebtInsight } from '../services/geminiService';
import { Brain, Send, User, Sparkles, AlertCircle } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<InsightMessage[]>([
    { 
      role: 'assistant', 
      content: "Hello! I am **DebtSage**. I can help you understand the complexities of US fiscal policy, ownership structure, or the implications of the current debt growth. What would you like to know?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: InsightMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getDebtInsight(input, messages);
    
    const assistantMsg: InsightMessage = { 
      role: 'assistant', 
      content: aiResponse, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="glass-card rounded-3xl flex flex-col h-[600px] border-amber-500/10 mt-8">
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/50 rounded-t-3xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Brain className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">DebtSage Intelligence</h3>
            <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Powered by Gemini Pro</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-amber-500/40 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line.includes('**') ? 
                        line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="text-amber-400">{part}</strong> : part) 
                        : line}
                    </p>
                  ))}
                </div>
                <div className="mt-2 text-[10px] opacity-40 flex items-center">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
              <span className="text-xs text-slate-400 italic">Analyzing fiscal data...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-700/50 rounded-b-3xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about foreign holders, Social Security debt, or inflation..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-slate-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-1.5 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-2 text-[10px] text-slate-500 uppercase tracking-tighter">
          <AlertCircle className="w-3 h-3" />
          <span>Information for educational purposes based on general economic principles.</span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
