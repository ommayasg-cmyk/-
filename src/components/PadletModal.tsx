import React from 'react';
import { ExternalLink, CheckCircle2, Download, Copy, Share2, X, Sparkles } from 'lucide-react';

interface PadletModalProps {
  isOpen: boolean;
  onClose: () => void;
  padletUrl: string;
  studentName: string;
  score: string;
}

export const PadletModal: React.FC<PadletModalProps> = ({
  isOpen,
  onClose,
  padletUrl,
  studentName,
  score,
}) => {
  if (!isOpen) return null;

  const resolvedPadletUrl = padletUrl && padletUrl.startsWith('http')
    ? padletUrl
    : 'https://padlet.com';

  const copyInstructions = () => {
    const text = `نتاج تعلم: ${studentName} | النتيجة: ${score} | تم التقييم عبر منصة كنوز اللغة العربية.`;
    navigator.clipboard.writeText(text);
    alert('تم نسخ ملخص النتيجة إلى الحافظة!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-cairo text-xl font-bold">
            تم تحميل بطاقة النتيجة بنجاح!
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            تم حفظ صورة التقرير الرسمي بجودة عالية على جهازك في مجلد التنزيلات (Downloads).
          </p>
        </div>

        {/* Steps Guide */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>خطوات التسليم السريع إلى معلمك عبر Padlet:</span>
            </h4>
            <ol className="text-xs text-slate-700 space-y-2 pr-4 list-decimal">
              <li>
                اضغط على زر <strong className="text-emerald-950">"افتح حائط Padlet الآن"</strong> بالأسفل.
              </li>
              <li>
                في الحائط التفاعلي، اضغط على زر الإضافة <strong className="text-emerald-950">(+)</strong> لإضافة منشور جديد.
              </li>
              <li>
                انقر على أيقونة إرفاق صورة/ملف <strong className="text-emerald-950">(Upload)</strong>، واختر الصورة التي تم تنزيلها للتو.
              </li>
              <li>
                اكتب اسمك في العنوان وانشر البطاقة لتظهر فوراً لمعلمك وزملائك!
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={resolvedPadletUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>افتح حائط Padlet الآن</span>
              <ExternalLink className="w-4 h-4 text-amber-300" />
            </a>

            <button
              onClick={copyInstructions}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ ملخص النتيجة النصي</span>
            </button>

            <button
              onClick={onClose}
              className="py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              العودة إلى التطبيق ومتابعة التدريب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
