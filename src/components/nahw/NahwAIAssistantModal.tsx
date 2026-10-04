import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface NahwAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const NahwAIAssistantModal: React.FC<NahwAIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentTopic = 'النحو العربي',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `أهلاً بك يا بطل لغة الضاد! أنا «مساعد النحو الذكي».
أنا هنا لمساعدتك في فهم قواعد النحو، تبسيط الشرح، تحليل وإعراب الجمل، أو تقديم أمثلة إضافية في موضوع «${currentTopic}».
ما الذي تود أن نبدأ به اليوم؟`,
      timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'اشرح لي بطريقة أسهل 💡', query: `اشرح لي موضوع ${currentTopic} بأسلوب سهل جداً ومبسط ومقسم إلى نقاط.` },
    { label: 'أعطني أمثلة إضافية 📚', query: `أعطني 3 أمثلة إضافية مشكولة مع بيان الإعراب في موضوع ${currentTopic}.` },
    { label: 'ما الفرق بين الفاعل ونائبه؟ ⚖️', query: `ما الفرق النحوي بين الفاعل ونائب الفاعل مع أمثلة مقارنة؟` },
    { label: 'أعرب لي جملة ✍️', query: `كيف أعرب جملة تطبيقية نموذجية على موضوع ${currentTopic} خطوة بخطوة؟` },
    { label: 'اختبرني بسؤال سريع 🎯', query: `اطرح عليّ سؤالاً ذكياً في موضوع ${currentTopic} مع خيارات دون كشف الإجابة حتى أجيبك.` }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/grammar-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          topic: currentTopic,
          userQuery: query
        })
      });

      const data = await response.json();
      const botReply = data.answer || 'مرحباً بك! تذكر أن كل قاعدة في النحو مبنية على المعنى والعامل المؤثر.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `القاعدة الذهبية في «${currentTopic}»: تفهم المعنى أولاً، فالمعنى هو مرشدك الأول لتحديد الموقع الإعرابي الصحيح.`,
        timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col overflow-hidden text-right animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cairo font-bold text-base sm:text-lg">مساعد النحو الذكي</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-300/30 px-2 py-0.5 rounded-full font-semibold">
                  مدعوم بالذكاء الاصطناعي
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                موضوع الجلسة: <strong className="text-white">{currentTopic}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 overflow-x-auto flex items-center gap-2 shrink-0">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.query)}
              disabled={isLoading}
              className="text-xs font-semibold px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-100/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line font-medium">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-black/5 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
                      title="نسخ الشرح"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-xs text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
              <span>مساعد النحو الذكي يستحضر القاعدة والأمثلة...</span>
            </div>
          )}
        </div>

        {/* Bottom Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`اطرح سؤالك حول «${currentTopic}» أو اطلب إعراب جملة...`}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden text-slate-900 transition-all font-medium"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-transform active:scale-95 cursor-pointer shadow-xs"
            aria-label="إرسال"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
