import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Shield,
  Layers,
  CloudSun,
  Sprout,
  Compass,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Info,
  Trash2,
  Tractor,
  Globe2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileBarChart2
} from 'lucide-react';
import { FarmShieldApi } from '../services/api';
import { useFarmShield } from '../context/FarmShieldContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  capability?: 'assistant' | 'advisor';
  topic?: string;
  citations?: Array<{ source: string; version?: string; type?: string }>;
  disclaimer?: string;
  structuredAnswer?: {
    shortAnswer: string;
    explanation: string;
    supportingData?: string[];
    risks?: string[];
    suggestedNextSteps?: string[];
  };
}

export const AiAssistantPage: React.FC = () => {
  const { farms, selectedFarm, setSelectedFarm, selectedCountry, setSelectedCountryCode, countries } = useFarmShield();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCapability, setActiveCapability] = useState<'assistant' | 'advisor'>('assistant');
  const [aiStatus, setAiStatus] = useState<any | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await FarmShieldApi.getAiAssistantStatus();
        if (res.success && res.data) {
          setAiStatus(res.data);
        }
      } catch (err) {
        console.error('Failed to load AI Assistant status:', err);
      }
    }
    loadStatus();
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      capability: activeCapability,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await FarmShieldApi.sendAiAssistantMessage(
        text,
        selectedFarm
          ? {
              name: selectedFarm.name,
              soilType: selectedFarm.soilType,
              waterAvailability: selectedFarm.waterAvailability,
              currentCrop: selectedFarm.currentCrop,
              region: selectedFarm.adminLevel1 || selectedFarm.region,
            }
          : undefined,
        selectedCountry?.isoCode || 'ET',
        activeCapability
      );

      if (res.success && res.data) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: res.data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          capability: activeCapability,
          topic: res.data.topic,
          citations: res.data.citations,
          disclaimer: res.data.disclaimer,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Failed to query AI assistant:', err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'The AI Assistant encountered a network timeout. Edaphic, meteorological, and crop rotation data remain directly accessible across FarmShield scientific calculation pages.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: 'System Notice',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const exampleQuestions = [
    {
      title: 'Regional Crop Suitability',
      prompt: `Which crops are suitable for the edaphic conditions in ${selectedCountry?.name || 'Ethiopia'}?`,
      mode: 'advisor' as const,
      icon: Sprout
    },
    {
      title: 'Soil pH & Edaphic Properties',
      prompt: 'Why is soil pH important and how does it influence nitrogen availability?',
      mode: 'assistant' as const,
      icon: Layers
    },
    {
      title: 'CHIRPS Rainfall & Drought SPI',
      prompt: 'Explain what the WMO Standardized Precipitation Index (SPI) means for my farm.',
      mode: 'assistant' as const,
      icon: CloudSun
    },
    {
      title: 'National Agricultural Data',
      prompt: `What verified agricultural datasets and crop statistics are available for ${selectedCountry?.name || 'Ethiopia'}?`,
      mode: 'assistant' as const,
      icon: FileBarChart2
    },
    {
      title: 'Biological Nitrogen Fixation',
      prompt: 'How do legumes biologically fix nitrogen in crop rotation?',
      mode: 'advisor' as const,
      icon: TrendingUp
    },
    {
      title: 'Farm Intelligence Report',
      prompt: 'Help me understand the agronomic indicators in my farm report.',
      mode: 'advisor' as const,
      icon: Compass
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header & Active Agricultural Context Selector */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  FarmShield Agricultural Assistant
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30 font-mono">
                  Grounded Advisory
                </span>
              </div>
              <p className="text-xs text-[#8EB897] mt-0.5">
                Scientific decision support grounded in CHIRPS rainfall, NASA POWER climatology, SoilGrids, and national research extension packages.
              </p>
            </div>
          </div>

          {/* New Conversation Button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C1B14] hover:bg-white/10 text-xs text-[#8EB897] hover:text-white border border-[#8EB897]/25 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>New Conversation</span>
            </button>
          )}
        </div>

        {/* Persistent Context Selector Strip */}
        <div className="pt-3 border-t border-[#8EB897]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Country Context */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C1B14]/80 border border-[#8EB897]/20 text-white">
              <Globe2 className="w-4 h-4 text-[#2ECC71]" />
              <span className="text-[#8EB897]">Country Context:</span>
              <select
                aria-label="Select Country"
                value={selectedCountry?.isoCode || selectedCountry?.isoAlpha2 || 'ET'}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              >
                {countries.map((c) => {
                  const code = c.isoCode || c.isoAlpha2 || '';
                  return (
                    <option key={code} value={code} className="bg-[#132A20] text-white">
                      {c.flag} {c.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Farm Context */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C1B14]/80 border border-[#8EB897]/20 text-white">
              <Tractor className="w-4 h-4 text-amber-400" />
              <span className="text-[#8EB897]">Farm Focus:</span>
              <select
                aria-label="Select Farm"
                value={selectedFarm?.id || ''}
                onChange={(e) => {
                  const f = farms.find((farm) => farm.id === e.target.value);
                  setSelectedFarm(f || null);
                }}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-[#132A20] text-white">General National Context</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id} className="bg-[#132A20] text-white">
                    {farm.name} ({farm.currentCrop || 'Field Crop'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0C1B14] rounded-xl border border-[#8EB897]/20">
            <button
              onClick={() => setActiveCapability('assistant')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCapability === 'assistant'
                  ? 'bg-[#2ECC71] text-[#0C1B14] shadow-sm'
                  : 'text-[#8EB897] hover:text-white'
              }`}
            >
              1. General Assistant
            </button>
            <button
              onClick={() => setActiveCapability('advisor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCapability === 'advisor'
                  ? 'bg-amber-500 text-[#0C1B14] shadow-sm'
                  : 'text-[#8EB897] hover:text-white'
              }`}
            >
              2. Crop Advisor
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Conversation Area or Welcome Screen */}
      <div className="glass-panel flex flex-col h-[540px] overflow-hidden">
        {messages.length === 0 ? (
          // Welcome Screen with Example Question Cards
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-6">
            <div className="max-w-md space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30 flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Welcome to FarmShield Agricultural Assistant
              </h2>
              <p className="text-xs sm:text-sm text-[#8EB897] leading-relaxed">
                Ask questions about crops, soil properties, rainfall, farm conditions, and verified agricultural datasets.
              </p>
            </div>

            {/* Example Question Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-3xl text-left">
              {exampleQuestions.map((q, idx) => {
                const Icon = q.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveCapability(q.mode);
                      handleSendMessage(q.prompt);
                    }}
                    className="p-3.5 rounded-2xl bg-[#0C1B14]/60 hover:bg-[#132A20] border border-[#8EB897]/20 hover:border-[#2ECC71] transition-all group space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#2ECC71]" />
                        <span>{q.title}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8EB897] group-hover:text-[#2ECC71] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-[#A0AEC0] line-clamp-2 leading-relaxed">
                      {q.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Chat Stream
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 border ${
                    msg.capability === 'advisor'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-[#2ECC71]/20 text-[#2ECC71] border-[#2ECC71]/30'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2ECC71] text-[#0C1B14] font-medium rounded-tr-none shadow-md'
                      : 'bg-[#0C1B14]/85 text-[#F8F9FA] border border-[#8EB897]/20 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.topic && (
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${
                      msg.sender === 'user' ? 'text-[#0C1B14]/80' : 'text-amber-400'
                    }`}>
                      {msg.topic}
                    </div>
                  )}

                  <div className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</div>

                  {/* Citations & Verified Sources */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-[#8EB897]/15 text-[11px] text-[#8EB897] space-y-1">
                      <span className="font-semibold text-white">Grounded Datasets:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.citations.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#132A20] border border-[#8EB897]/20 text-[10px] text-[#A0AEC0] font-medium">
                            {c.source} {c.version ? `v${c.version}` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transparency Disclaimer */}
                  {msg.disclaimer && (
                    <div className="text-[10px] text-[#8EB897]/80 italic pt-1 border-t border-[#8EB897]/10">
                      {msg.disclaimer}
                    </div>
                  )}

                  <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-[#0C1B14]/70' : 'text-[#8EB897]/60'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#2ECC71] text-[#0C1B14] flex items-center justify-center shrink-0 mt-1 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3.5 items-center text-xs text-[#8EB897] pl-2">
                <Bot className="w-4 h-4 text-[#2ECC71] animate-pulse" />
                <span>Consulting FarmShield scientific dataset repository & crop rules...</span>
              </div>
            )}
          </div>
        )}

        {/* Input Form at Bottom */}
        <div className="p-4 bg-[#0C1B14]/90 border-t border-[#8EB897]/15">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder={
                activeCapability === 'advisor'
                  ? 'Ask about crop suitability, planting calendars, or rotation sequences...'
                  : 'Ask about rainfall (CHIRPS), soil properties, drought SPI, or satellite vegetation...'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-[#8EB897]/20 bg-[#132A20] text-sm text-white placeholder-[#8EB897]/60 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/40"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 shrink-0 ${
                activeCapability === 'advisor'
                  ? 'bg-amber-500 hover:bg-amber-400 text-[#0C1B14]'
                  : 'bg-[#2ECC71] hover:bg-[#27ae60] text-[#0C1B14]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
