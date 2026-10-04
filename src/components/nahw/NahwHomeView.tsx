import React, { useState, useMemo } from 'react';
import { NahwSection, NahwTopic, GrammarDifficulty, StudentNahwProgress } from '../../types/nahw';
import { StudentProfile } from '../../types';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Award, 
  Bot, 
  ChevronLeft, 
  ChevronDown,
  ChevronUp,
  Play, 
  Flame, 
  Star, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Bookmark,
  ArrowUpCircle,
  ArrowDownCircle,
  Layers,
  Zap,
  GitCommit,
  MessageSquareQuote,
  AlignRight,
  Wrench,
  GraduationCap
} from 'lucide-react';

interface NahwHomeViewProps {
  sections: NahwSection[];
  student: StudentProfile | null;
  progress: StudentNahwProgress;
  onSelectTopic: (section: NahwSection, topic: NahwTopic) => void;
  onOpenAiAssistant: (topicTitle?: string) => void;
  onBackToMain: () => void;
}

export const NahwHomeView: React.FC<NahwHomeViewProps> = ({
  sections,
  student,
  progress,
  onSelectTopic,
  onOpenAiAssistant,
  onBackToMain,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('الكل');
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (secId: string) => {
    setExpandedSectionIds(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  // Map each of the 12 sections to its custom icon and color theme
  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'basics': return <BookOpen className="w-6 h-6 text-emerald-700" />;
      case 'noun-types': return <Bookmark className="w-6 h-6 text-blue-700" />;
      case 'marfooat': return <ArrowUpCircle className="w-6 h-6 text-teal-700" />;
      case 'mansoobat': return <ArrowDownCircle className="w-6 h-6 text-sky-700" />;
      case 'majroorat': return <Layers className="w-6 h-6 text-indigo-700" />;
      case 'verbs': return <Zap className="w-6 h-6 text-amber-700" />;
      case 'nawasikh': return <Sparkles className="w-6 h-6 text-purple-700" />;
      case 'tawabea': return <GitCommit className="w-6 h-6 text-rose-700" />;
      case 'styles': return <MessageSquareQuote className="w-6 h-6 text-cyan-700" />;
      case 'sentences': return <AlignRight className="w-6 h-6 text-violet-700" />;
      case 'particles': return <Wrench className="w-6 h-6 text-orange-700" />;
      case 'advanced': return <GraduationCap className="w-6 h-6 text-amber-600" />;
      default: return <BookOpen className="w-6 h-6 text-emerald-700" />;
    }
  };

  // Filter sections and topics based on search and difficulty
  const filteredSections = useMemo(() => {
    return sections.map((sec) => {
      const filteredTopics = sec.topics.filter((t) => {
        const matchesSearch =
          searchQuery.trim() === '' ||
          t.title.includes(searchQuery.trim()) ||
          t.shortDescription.includes(searchQuery.trim()) ||
          sec.title.includes(searchQuery.trim());

        const matchesDiff =
          selectedDifficulty === 'الكل' || t.difficulty === selectedDifficulty;

        return matchesSearch && matchesDiff;
      });

      return {
        ...sec,
        topics: filteredTopics,
      };
    }).filter(sec => sec.topics.length > 0);
  }, [sections, searchQuery, selectedDifficulty]);

  // Overall Statistics
  const totalTopics = useMemo(() => {
    return sections.reduce((acc, s) => acc + s.topics.length, 0);
  }, [sections]);

  const completedCount = progress.completedTopicIds.length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const badges = [
    { id: 'b-1', title: 'بداية قوية', icon: '🏆', desc: 'إنجاز أول نشاط نحوي', unlocked: completedCount >= 1 },
    { id: 'b-2', title: 'متعلم نشيط', icon: '⭐', desc: 'إنجاز 3 موضوعات', unlocked: completedCount >= 3 },
    { id: 'b-3', title: 'عاشق النحو', icon: '📚', desc: 'إنجاز 7 موضوعات', unlocked: completedCount >= 7 },
    { id: 'b-4', title: 'دقة عالية', icon: '🎯', desc: 'تحقيق 90%+ في أي اختبار', unlocked: Object.values(progress.topicBestScores).some(s => s >= 90) },
    { id: 'b-5', title: 'سلسلة تعلم', icon: '🔥', desc: 'حصد 100 نقطة XP', unlocked: progress.totalXp >= 100 },
    { id: 'b-6', title: 'خبير النحو', icon: '👑', desc: 'إنجاز 12 قسماً كاملاً', unlocked: completedCount >= 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right font-cairo" dir="rtl">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">منصة كنوز اللغة العربية</span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-emerald-200 font-semibold">قسم المناهج والتدريب</span>
            </div>
            <h1 className="font-cairo text-3xl sm:text-4xl md:text-5xl font-black text-white">
              النحو العربي
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-2xl leading-relaxed">
              تعلّم قواعد النحو العربي بطريقة سهلة وتفاعلية، واختبر معلوماتك وطوّر مهاراتك.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAiAssistant('النحو العربي')}
              className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <Bot className="w-5 h-5 text-slate-950" />
              <span>مساعد النحو الذكي ✨</span>
            </button>

            <button
              onClick={onBackToMain}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all cursor-pointer"
            >
              <span>الرئيسية</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Student Progress & Motivation Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 block">تقدمك في النحو العربي</span>
            <div className="flex items-baseline gap-2">
              <span className="font-cairo text-2xl font-black text-slate-900">{completionPercentage}%</span>
              <span className="text-xs text-slate-500">
                ({completedCount} من أصل {totalTopics} موضوعاً)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{progress.totalXp} نقطة XP</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 font-bold">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{badges.filter(b => b.unlocked).length} شارات مستحقة</span>
            </div>
          </div>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(completionPercentage, 3)}%` }}
          />
        </div>

        {/* Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-1">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="text-2xl mb-1">{b.icon}</div>
              <span className="text-xs font-bold text-slate-900 block truncate">{b.title}</span>
              <span className="text-[10px] text-slate-500 block truncate">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن قاعدة، قسم، موضوع، أو كلمة (مثال: الفاعل، كان وأخواتها)..."
            className="w-full pr-10 pl-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900 font-medium shadow-2xs"
          />
        </div>

        {/* Difficulty Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs shrink-0 text-xs">
          {['الكل', 'مبتدئ', 'متوسط', 'متقدم'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Sections & Topics Cards Grid (تنظيم الأقسام على شكل بطاقات Cards جميلة وواضحة) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="font-cairo text-xl font-bold text-slate-900">
            أقسام النحو العربي (12 قسماً شاملاً)
          </h2>
          <span className="text-xs text-slate-500">
            اضغط على «ابدأ» للاختبار أو «شرح» للاطلاع على القواعد والأمثلة
          </span>
        </div>

        {filteredSections.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-cairo font-bold text-base text-slate-900">
              لم نعثر على نتائج مطابقة لبحثك
            </h3>
            <p className="text-xs text-slate-500">
              جرب البحث بكلمة أخرى مثل «الفاعل»، «المبتدأ»، أو اختر «الكل» لإظهار كافة الأقسام.
            </p>
          </div>
        ) : (
          filteredSections.map((sec) => {
            const secCompleted = sec.topics.filter(t => progress.completedTopicIds.includes(t.id)).length;
            const secPercentage = sec.topics.length > 0 ? Math.round((secCompleted / sec.topics.length) * 100) : 0;
            const totalQuestionsInSec = sec.topics.reduce((acc, t) => acc + t.questionsCount, 0);
            const isExpanded = expandedSectionIds[sec.id] !== false; // Default expanded or user toggled

            return (
              <div
                key={sec.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500/50 shadow-md space-y-5 transition-all"
              >
                {/* 🌟 Section Main Card (كل بطاقة تحتوي على: اسم القسم، وصف مختصر جداً، مستوى الصعوبة، عدد الأسئلة، نسبة إكمال الطالب، زر «ابدأ»، زر «شرح»، أيقونة مناسبة) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-5">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* أيقونة مناسبة للقسم */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                      {getSectionIcon(sec.id)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* اسم القسم */}
                        <h3 className="font-cairo text-xl font-black text-slate-900">
                          {sec.title}
                        </h3>
                        {/* مستوى الصعوبة */}
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          sec.difficulty === 'مبتدئ'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : sec.difficulty === 'متوسط'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {sec.difficulty}
                        </span>
                      </div>
                      {/* وصف مختصر جداً */}
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {sec.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Section Stats & Direct Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0 justify-between lg:justify-end">
                    {/* عدد الأسئلة ونسبة الإكمال */}
                    <div className="text-right sm:text-left bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">الأسئلة:</span>
                        <span className="font-bold text-slate-800">{totalQuestionsInSec} سؤال</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500">الإكمال:</span>
                        <span className="font-bold text-emerald-800">{secPercentage}% ({secCompleted}/{sec.topics.length})</span>
                      </div>
                    </div>

                    {/* زر «شرح» */}
                    <button
                      onClick={() => onSelectTopic(sec, sec.topics[0])}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs"
                      title="عرض الشرح المبسط والقواعد"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-800" />
                      <span>شرح</span>
                    </button>

                    {/* زر «ابدأ» */}
                    <button
                      onClick={() => onSelectTopic(sec, sec.topics[0])}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
                      title="بدء الدرس والأنشطة التفاعلية"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>ابدأ</span>
                    </button>

                    {/* Toggle Sub-topics list */}
                    <button
                      onClick={() => toggleExpand(sec.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      title={isExpanded ? 'طي تفاصيل الدروس' : 'عرض تفاصيل الدروس'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Progress bar inside card */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(secPercentage, 2)}%` }}
                  />
                </div>

                {/* Sub-topics Grid inside Section (عند التوسيع) */}
                {isExpanded && (
                  <div className="pt-1 space-y-3">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      دروس وموضوعات هذا القسم ({sec.topics.length} موضوعات تفاعلية):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sec.topics.map((topic) => {
                        const isCompleted = progress.completedTopicIds.includes(topic.id);
                        const bestScore = progress.topicBestScores[topic.id];

                        return (
                          <div
                            key={topic.id}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                              isCompleted
                                ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-cairo font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                  {topic.title}
                                </span>
                                {isCompleted ? (
                                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] shrink-0 font-bold" title="مكتمل">
                                    ✓
                                  </span>
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                )}
                              </div>

                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {topic.shortDescription}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                              <div className="text-[10px] text-slate-500">
                                {bestScore !== undefined ? (
                                  <span className="font-bold text-emerald-800">
                                    أفضل نتيجة: {bestScore}%
                                  </span>
                                ) : (
                                  <span>{topic.questionsCount} أسئلة</span>
                                )}
                              </div>

                              <button
                                onClick={() => onSelectTopic(sec, topic)}
                                className="px-3 py-1 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <span>تعلم الآن</span>
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
