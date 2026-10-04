import React, { useState } from 'react';
import { lookupWordInLexicon, DictionaryEntry, SAMPLE_LEXICON_ENTRIES } from '../data/lexiconDictionary';
import { Search, Book, Sparkles, Compass, CheckCircle2, Bookmark, ArrowLeft } from 'lucide-react';

interface LexiconExplorerProps {
  onStartQuiz: () => void;
}

export const LexiconExplorer: React.FC<LexiconExplorerProps> = ({ onStartQuiz }) => {
  const [searchTerm, setSearchTerm] = useState('استعلام');
  const [currentEntry, setCurrentEntry] = useState<DictionaryEntry>(SAMPLE_LEXICON_ENTRIES['استعلام']);

  const handleSearch = (wordToLookup: string) => {
    if (!wordToLookup.trim()) return;
    const entry = lookupWordInLexicon(wordToLookup.trim());
    setCurrentEntry(entry);
  };

  const sampleWords = ['استعلام', 'انتصار', 'استشهاد', 'ميزان', 'تفاؤل', 'كاتب', 'متعلم'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-amber-300 font-bold">كنوز اللغة والمعاجم</span>
            </div>
            <h1 className="font-cairo text-2xl sm:text-3xl font-black text-white">
              المعجم التفاعلي وكاشف الجذور
            </h1>
            <p className="text-sm text-emerald-100 max-w-2xl mt-1">
              تعرّف على خطوات تجريد الكلمة إلى جذرها الثلاثي وكيفية البحث عنها في المعاجم الحديثة والقديمة بنظامي الأوائل والأواخر.
            </p>
          </div>

          <button
            onClick={onStartQuiz}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-900" />
            <span>بدء تدريبات المعاجم المتجددة</span>
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              placeholder="اكتب أي كلمة للكشف عنها وتجريد جذرها... (مثال: استغفار، ميزان، انتصار)"
              className="w-full px-4 py-3 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900 font-medium"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
          </div>

          <button
            onClick={() => handleSearch(searchTerm)}
            className="px-6 py-3 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-98 rounded-2xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            كشف الجذر والمعجم
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium">كلمات للتجربة السريعة:</span>
          {sampleWords.map((w) => (
            <button
              key={w}
              onClick={() => {
                setSearchTerm(w);
                handleSearch(w);
              }}
              className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Card Result */}
      {currentEntry && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Top highlight */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
            <div>
              <span className="text-xs text-slate-500 font-semibold block mb-1">الكلمة المفحوصة</span>
              <h2 className="font-amiri text-3xl font-bold text-slate-900">
                {currentEntry.word}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[11px] text-emerald-800 block font-medium">الجذر الثلاثي المجرد</span>
                <span className="font-cairo text-xl font-black text-emerald-950 block">
                  ({currentEntry.root})
                </span>
              </div>

              <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[11px] text-amber-800 block font-medium">الوزن الصرفي</span>
                <span className="font-cairo text-lg font-bold text-amber-950 block">
                  {currentEntry.weight}
                </span>
              </div>
            </div>
          </div>

          {/* Meaning */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-1">
              الدلالة المعجمية والمعنى:
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {currentEntry.meaning}
            </p>
          </div>

          {/* Dual Lookup Comparison: Modern vs Ancient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Modern: المعجم الوسيط */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900">
                <Book className="w-4 h-4 text-emerald-700" />
                <h3 className="font-cairo text-sm font-bold">
                  طريقة المعاجم الحديثة (أوائل الكلمات)
                </h3>
              </div>
              <span className="text-xs text-slate-600 block">
                مثل: <strong>{currentEntry.modernLookup.dictionary}</strong>، المنجد، معجم الطلاب.
              </span>
              <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1 text-xs">
                <div>
                  <span className="text-slate-500 ml-1">الباب:</span>
                  <strong className="text-emerald-950">{currentEntry.modernLookup.chapter}</strong>
                </div>
                <div>
                  <span className="text-slate-500 ml-1">الترتيب:</span>
                  <span className="text-slate-800 font-medium">{currentEntry.modernLookup.order}</span>
                </div>
              </div>
            </div>

            {/* Ancient: لسان العرب / القاموس المحيط */}
            <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-3">
              <div className="flex items-center gap-2 text-teal-900">
                <Compass className="w-4 h-4 text-teal-700" />
                <h3 className="font-cairo text-sm font-bold">
                  طريقة المعاجم التراثية (نظام القافية / الأواخر)
                </h3>
              </div>
              <span className="text-xs text-slate-600 block">
                مثل: <strong>{currentEntry.ancientLookup.dictionary}</strong>، تاج العروس.
              </span>
              <div className="p-3 bg-white rounded-xl border border-teal-100 space-y-1 text-xs">
                <div>
                  <span className="text-slate-500 ml-1">الباب (الحرف الأخير):</span>
                  <strong className="text-teal-950">{currentEntry.ancientLookup.chapter}</strong>
                </div>
                <div>
                  <span className="text-slate-500 ml-1">الفصل (الحرف الأول):</span>
                  <strong className="text-teal-950">{currentEntry.ancientLookup.section}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Derivatives & Family */}
          {currentEntry.derivatives.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                المشتقات وتصاريف المادة اللغوية:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentEntry.derivatives.map((deriv, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200"
                  >
                    {deriv}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
