import React, { useState } from 'react';
import { NahwTopic, NahwSection, GrammarDifficulty } from '../../types/nahw';
import { 
  ArrowLeft, 
  BookOpen, 
  Bot, 
  Play, 
  Award, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface NahwTopicViewProps {
  section: NahwSection;
  topic: NahwTopic;
  onBackToSection: () => void;
  onStartSession: (mode: 'activity' | 'quiz', difficulty: GrammarDifficulty, useAI: boolean) => void;
  onOpenAiAssistant: (topicTitle: string) => void;
}

export const NahwTopicView: React.FC<NahwTopicViewProps> = ({
  section,
  topic,
  onBackToSection,
  onStartSession,
  onOpenAiAssistant,
}) => {
  const [showExplanation, setShowExplanation] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<GrammarDifficulty>(topic.difficulty || 'متوسط');
  const [useAIQuestions, setUseAIQuestions] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-right font-cairo" dir="rtl">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSection}
          className="text-xs font-bold text-slate-700 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة لأقسام النحو العربي</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
          {section.title}
        </span>
      </div>

      {/* Main Topic Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300">{section.title}</span>
            <span className="text-white/40">•</span>
            <span className="text-xs text-emerald-200 font-semibold">{selectedDifficulty}</span>
          </div>

          <h1 className="font-cairo text-2xl sm:text-3xl md:text-4xl font-black text-white">
            {topic.title}
          </h1>

          {/* Short description (شرح مختصر جداً لا يتجاوز عدة أسطر) */}
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-2xl">
            {topic.shortDescription}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            {/* زر «شرح مبسط» */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showExplanation ? 'إخفاء الشرح المبسط' : 'شرح مبسط'}</span>
              {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* زر «توسع في الشرح بالذكاء الاصطناعي» */}
            <button
              onClick={() => onOpenAiAssistant(topic.title)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>توسع في الشرح بالذكاء الاصطناعي ✨</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Explanation Section (الشرح المبسط المقسم إلى نقاط وأمثلة) */}
      {showExplanation && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-cairo text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>الشرح المبسط والقواعد الأساسية:</span>
            </h3>

            <div className="mt-4 space-y-3">
              {topic.simpleExplanation.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Requests Strip (إمكانية طلب شرح أبسط وأمثلة إضافية) */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-700" />
              <span>هل تحتاج إيضاحاً إضافياً من مساعد النحو الذكي؟</span>
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onOpenAiAssistant(`اشرح لي درس ${topic.title} بطريقة أسهل ومبسطة جداً تناسب مستواي`)}
                className="text-xs font-bold px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                💡 اشرح لي بطريقة أسهل
              </button>
              <button
                onClick={() => onOpenAiAssistant(`أعطني أمثلة إضافية مشكولة مع بيان الإعراب لدرس ${topic.title}`)}
                className="text-xs font-bold px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                📚 أعطني أمثلة إضافية
              </button>
              <button
                onClick={() => onOpenAiAssistant(`ما الفرق بين هذا القسم وأقسام النحو الأخرى المشابهة؟ (${topic.title})`)}
                className="text-xs font-bold px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                ⚖️ ما الفرق بين هذا القسم وغيره؟
              </button>
              <button
                onClick={() => onOpenAiAssistant(`اشرح لي سبب إعراب هذه الكلمة ونموذج إعرابي كامل لدرس ${topic.title}`)}
                className="text-xs font-bold px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                ✍️ اشرح لي سبب إعراب الكلمة
              </button>
              <button
                onClick={() => onOpenAiAssistant(`اختبرني في هذا الموضوع بسؤال ذكي: ${topic.title}`)}
                className="text-xs font-bold px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                🎯 اختبرني في هذا الموضوع
              </button>
            </div>
          </div>

          {/* Examples Grid */}
          <div>
            <h4 className="font-cairo text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>أمثلة تطبيقية مشكولة مع الإيضاح:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topic.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 text-sm block">«{ex.text}»</span>
                  <span className="text-xs text-slate-600 block leading-relaxed">{ex.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes if present */}
          {topic.commonMistakes && topic.commonMistakes.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>أخطاء شائعة يجب تجنبها:</span>
              </span>
              {topic.commonMistakes.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-rose-800 font-medium">❌ الخطأ: {m.mistake}</p>
                  <p className="text-emerald-800 font-medium">✅ الصواب: {m.correction}</p>
                  <p className="text-slate-600">السبب: {m.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activity & Quiz Action Control Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-800/30 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-cairo text-lg font-bold text-slate-900">
              بدء التطبيق العملي والاختبار
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              اختر بين النشاط التدريبي المفتوح أو خوض الاختبار الرسمي لاحتساب الدرجات
            </p>
          </div>

          {/* Difficulty Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">مستوى الصعوبة:</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {(['مبتدئ', 'متوسط', 'متقدم'] as GrammarDifficulty[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedDifficulty(lvl)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedDifficulty === lvl
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Questions Toggle */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                توليد أسئلة متجددة بالذكاء الاصطناعي
              </span>
              <span className="text-[11px] text-slate-500 block">
                توليد 10 أسئلة جديدة مبتكرة مخصصة لدرس «{topic.title}»
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useAIQuestions}
              onChange={(e) => setUseAIQuestions(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
          </label>
        </div>

        {/* Dual Actions: Activity vs Official Quiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* 1. ابدأ النشاط */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-200/80 text-teal-900 mb-2">
                تدريب حر دون ضغط
              </span>
              <h4 className="font-cairo font-bold text-base text-slate-900">
                ابدأ النشاط التدريبي
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                تدرب على الأسئلة بحرية مع إمكانية طلب تلميحات ذكية وتغذية راجعة فورية لتثبيت القاعدة.
              </p>
            </div>

            <button
              onClick={() => onStartSession('activity', selectedDifficulty, useAIQuestions)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold text-white bg-teal-800 hover:bg-teal-900 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>ابدأ النشاط</span>
            </button>
          </div>

          {/* 2. ابدأ الاختبار */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-950 mb-2">
                10 أسئلة موثقة للتقييم
              </span>
              <h4 className="font-cairo font-bold text-base text-slate-900">
                ابدأ الاختبار الرسمي
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                اختبار رسمي مكون من 10 أسئلة مع احتساب الدرجات وإصدار شهادة موثقة للمشاركة مع المعلم.
              </p>
            </div>

            <button
              onClick={() => onStartSession('quiz', selectedDifficulty, useAIQuestions)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>ابدأ الاختبار (10 أسئلة)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
