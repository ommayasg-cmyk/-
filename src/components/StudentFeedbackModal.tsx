import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResultHistoryItem } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { getMotivationalMessage } from '../utils/motivational';
import { 
  X, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Award, 
  Calendar, 
  User, 
  School, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Share2,
  ExternalLink
} from 'lucide-react';

interface StudentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ResultHistoryItem | null;
  padletUrl?: string;
}

export const StudentFeedbackModal: React.FC<StudentFeedbackModalProps> = ({
  isOpen,
  onClose,
  result,
  padletUrl = 'https://padlet.com/balsamjarrar72/padlet-j22b57l6i7bvvciw',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccessNotice, setExportSuccessNotice] = useState('');

  if (!isOpen || !result) return null;

  const motivation = getMotivationalMessage(result.percentage);

  const formattedDate = new Date(result.date).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Export as PNG Image
  const handleExportImage = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    setExportSuccessNotice('');
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `نتيجة-${result.studentName.replace(/\s+/g, '_')}-${result.lesson.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setExportSuccessNotice('تم حفظ بطاقة النتيجة والتغذية الراجعة كصورة PNG بنجاح!');
    } catch (err) {
      console.error('Failed to export image', err);
      alert('حدث خطأ أثناء حفظ الصورة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExportingImage(false);
    }
  };

  // Export as PDF
  const handleExportPdf = async () => {
    if (!cardRef.current) return;
    setIsExportingPdf(true);
    setExportSuccessNotice('');
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`شهادة-${result.studentName.replace(/\s+/g, '_')}-${result.lesson.replace(/\s+/g, '_')}.pdf`);
      setExportSuccessNotice('تم تصدير ملف PDF للنتيجة والتقرير بنجاح!');
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('حدث خطأ أثناء تصدير ملف PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden text-right my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        dir="rtl"
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-cairo font-bold text-base sm:text-lg">
              بطاقة النتيجة والتغذية الراجعة والشهادة التحفيزية
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Strip */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportImage}
              disabled={isExportingImage || isExportingPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isExportingImage ? 'جاري تجهيز الصورة...' : 'حفظ كصورة (PNG)'}</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingImage || isExportingPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{isExportingPdf ? 'جاري تصدير PDF...' : 'تصدير ملف (PDF)'}</span>
            </button>
          </div>

          <a
            href={padletUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-600 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            <span>نشر على حائط Padlet</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </a>
        </div>

        {exportSuccessNotice && (
          <div className="bg-emerald-50 text-emerald-900 px-6 py-2.5 text-xs font-bold border-b border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{exportSuccessNotice}</span>
          </div>
        )}

        {/* Scrollable Printable/Capturable Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/50">
          <div
            ref={cardRef}
            className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-500/70 shadow-lg text-right relative overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Inner dashed accent */}
            <div className="absolute inset-2.5 border-2 border-dashed border-emerald-700/25 rounded-2xl pointer-events-none" />

            {/* School Header & Logo */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-200 pb-5 mb-5 gap-4 relative">
              <div className="flex items-center gap-4 text-center sm:text-right">
                <SchoolLogo size={68} className="shrink-0 drop-shadow-md mx-auto sm:mx-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-800 block">
                    المدارس الأهلية الخاصة - الغبيبة · كنوز اللغة العربية
                  </span>
                  <h2 className="font-cairo text-2xl font-black text-slate-900 tracking-tight">
                    شهادة إنجاز وتقييم نشاط لغوي
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    وثيقة معتمدة وموثقة لنتائج الأنشطة والاختبارات التفاعلية
                  </span>
                </div>
              </div>

              {/* Badge */}
              <div className="text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{motivation.badge}</span>
                </span>
                <span className="block text-[11px] text-slate-500 mt-1 font-semibold">
                  {motivation.level}
                </span>
              </div>
            </div>

            {/* Student & Activity Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-5 relative text-xs">
              <div>
                <span className="text-slate-500 font-medium block">اسم الطالب/ـة:</span>
                <span className="font-bold text-slate-900 text-sm block truncate">{result.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">الصف والشعبة:</span>
                <span className="font-bold text-slate-900 text-sm block">{result.studentClass} ({result.studentSection})</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">المعلم/ـة المشرف/ـة:</span>
                <span className="font-bold text-slate-900 text-sm block truncate">{result.teacherName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">تاريخ الإنجاز:</span>
                <span className="font-bold text-slate-900 text-sm block truncate">{formattedDate}</span>
              </div>
            </div>

            {/* Score & Motivational Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 mb-5 relative shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-amber-300 font-bold block mb-1">
                    المبحث / الدرس: {result.lesson}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-cairo text-4xl sm:text-5xl font-black text-amber-400">
                      {result.score}
                    </span>
                    <span className="text-slate-300 text-lg">من {result.total}</span>
                    <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full mr-3">
                      النسبة: {result.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-20 h-20 rounded-full border-4 border-amber-400 flex items-center justify-center bg-white/10 shrink-0 text-center">
                  <div className="font-black font-cairo text-2xl text-amber-300">
                    {result.percentage}%
                  </div>
                </div>
              </div>

              {/* Motivational Quote (العبارات التحفيزية الملهمة) */}
              <div className="mt-4 pt-3 border-t border-white/20 flex items-start gap-2 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <p>
                  <strong>كلمة تحفيزية: </strong>
                  «{result.motivationalQuote || motivation.quote}»
                </p>
              </div>
            </div>

            {/* Educational Feedback Breakdown (التغذية الراجعة التفصيلية) */}
            {result.answersBreakdown && result.answersBreakdown.length > 0 && (
              <div className="space-y-3 mb-5">
                <h4 className="font-cairo font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>التغذية الراجعة التفصيلية لإجابات الطالب:</span>
                </h4>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {result.answersBreakdown.map((ans, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        ans.isCorrect 
                          ? 'bg-emerald-50/60 border-emerald-200' 
                          : 'bg-rose-50/60 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-800">
                          {idx + 1}. {ans.questionText}
                        </span>
                        {ans.isCorrect ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>صحيح</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1 text-[11px] shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>يحتاج تصويب</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 mb-1">
                        <div>إجابة الطالب: <strong className={ans.isCorrect ? 'text-emerald-800' : 'text-rose-700'}>{ans.selectedAnswer}</strong></div>
                        {!ans.isCorrect && (
                          <div>الإجابة المعتمدة: <strong className="text-emerald-800">{ans.correctAnswer}</strong></div>
                        )}
                      </div>

                      {ans.explanation && (
                        <p className="text-[11px] text-slate-500 bg-white/70 p-2 rounded-lg border border-slate-200/80">
                          💡 <strong>الإيضاح التعليمي:</strong> {ans.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Footer Signature */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span>إشراف: أ/ بلسم جرّار · أ/ غادة الجاسم · د/ وسام عبد العال</span>
              <span className="font-semibold text-emerald-900">
                منصة كنوز اللغة العربية · المدارس الأهلية الخاصة
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
