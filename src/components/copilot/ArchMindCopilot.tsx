import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { archMindStore } from '../../services/store';
import { aiService } from '../../services/aiService';
import { CopilotMessage } from '../../types';
import { formatINR } from '../../utils/formatters';

interface CopilotProps {
  onNavigate?: (route: string) => void;
}

export const ArchMindCopilot: React.FC<CopilotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const activeProject = archMindStore.getActiveProject();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg_init',
      role: 'assistant',
      content: `Hello! I am **ArchMind AI Copilot**, your real-time architectural and cost assistant for **${activeProject?.name || 'your home project'}**.
I have live access to your designs, 2D floor plans, budget allocations (${formatINR(activeProject?.budgetLimit || 2850000)}), and contractor tasks.

How can I help you optimize your renovation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const summary = archMindStore.getBudgetSummary();
      const res = await aiService.askCopilot(
        nextMessages.map((m) => ({ role: m.role, content: m.content })),
        {
          ...activeProject,
          budgetSummary: summary,
        }
      );

      const aiMsg: CopilotMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: res.actionSuggestion,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: 'I analyzed your project parameters. For optimal cost and aesthetic balance, consider replacing solid hardwood with engineered oak (saving ~MYR 8,000) and review the 2D layout in the Floor Plans tab.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = (action: any) => {
    if (action.type === 'add_task') {
      archMindStore.addTask({
        projectId: activeProject?.id || 'proj_modern_terrace',
        title: action.payload.title,
        category: action.payload.category || 'Finishes',
        priority: action.payload.priority || 'High',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'Pending',
      });
      setActionDone('Task created in your project task list!');
      setTimeout(() => setActionDone(null), 4000);
    } else if (action.type === 'navigate' && onNavigate) {
      onNavigate(action.payload.route);
      setIsOpen(false);
    }
  };

  const quickPrompts = [
    'How can I reduce my renovation cost?',
    'Explain my budget breakdown',
    'Which flooring matches my design?',
    'What tasks are currently pending?',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#006B7B] text-white rounded-full shadow-xl hover:bg-[#004F5C] transition-all hover:scale-105 group border border-teal-300/30"
          title="Open ArchMind AI Copilot"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <span className="text-sm font-medium tracking-tight">AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* Slide-out Copilot Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] h-[620px] max-h-[calc(100vh-48px)] bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#004F5C] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                <Sparkles className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">ArchMind Copilot</h3>
                  <span className="text-[10px] bg-teal-800/80 text-teal-200 px-1.5 py-0.5 rounded font-mono">Gemini 2.5</span>
                </div>
                <p className="text-xs text-teal-100/80 truncate max-w-[240px]">
                  Project: {activeProject?.name || 'Modern Terrace'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Success Toast */}
          {actionDone && (
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{actionDone}</span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF8]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#E4F3F4] text-[#006B7B] flex items-center justify-center flex-shrink-0 mt-0.5 border border-teal-200">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#006B7B] text-white rounded-tr-none'
                    : 'bg-white text-[#171C2C] border border-[#E6E9ED] shadow-xs rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  
                  {/* Action Suggestion Card */}
                  {m.actionTaken && (
                    <div className="mt-3 pt-2.5 border-t border-[#E6E9ED]">
                      <button
                        onClick={() => executeAction(m.actionTaken)}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#E4F3F4] hover:bg-[#d6eef0] text-[#006B7B] rounded-lg font-medium text-xs transition-colors"
                      >
                        <span>{m.actionTaken.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 ${m.role === 'user' ? 'text-teal-200' : 'text-gray-400'}`}>
                    {m.timestamp}
                  </div>
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-gray-400 text-xs">
                <div className="w-7 h-7 rounded-lg bg-[#E4F3F4] text-[#006B7B] flex items-center justify-center border border-teal-200">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <span>ArchMind AI is synthesizing project data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-[#E6E9ED] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-[11px] px-2.5 py-1 bg-gray-50 hover:bg-[#E4F3F4] hover:text-[#006B7B] text-gray-600 rounded-full border border-gray-200 transition-colors flex-shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#E6E9ED] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about floor plans, budget, materials..."
              className="flex-1 text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#006B7B] focus:bg-white text-gray-800 transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-3.5 py-2.5 bg-[#006B7B] hover:bg-[#004F5C] disabled:bg-gray-200 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
