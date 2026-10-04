import React, { useRef, useState } from 'react';
import { NahwQuizAttempt } from '../../types/nahw';
import { SchoolLogo } from '../SchoolLogo';
import { getMotivationalMessage } from '../../utils/motivational';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Share2, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles,
  BookOpen,
  Check,
  ExternalLink
} from 'lucide-react';

interface NahwResultViewProps {
  attempt: NahwQuizAttempt;
  onRetake: () => void;
  onBackToHome: () => void;
  padletUrl?: string;
}

export const NahwResultView: React.FC<NahwResultViewProps> = ({
  attempt,
  onRetake,
  onBackToHome,
  padletUrl = 'https://padlet.com/balsamjarrar72/padlet-j22b57l6i7bvvciw'
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportNotice, setExportNotice] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const motivation = getMotivationalMessage(attempt.percentage);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins} دقيقة و ${s} ثانية`;
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    setExportNotice('');
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `نتيجة-نحو-${attempt.studentName.replace(/\s+/g, '_')}-${attempt.topicTitle.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setExportNotice('تم حفظ بطاقة النتيجة والتغذية الراجعة كصورة بنجاح!');
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء حفظ الصورة.');
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleExportPdf = async () => {
    if (!cardRef.current) return;
    setIsExportingPdf(true);
    setExportNotice('');
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
      pdf.save(`شهادة-نحو-${attempt.studentName.replace(/\s+/g, '_')}-${attempt.topicTitle.replace(/\s+/g, '_')}.pdf`);
      setExportNotice('تم تصدير ملف PDF للنتيجة والتقرير بنجاح!');
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير ملف PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleShare = async () => {
    const shareText = `أنجزت نشاط «${attempt.topicTitle}» في النحو العربي على منصة كنوز اللغة العربية وحصلت على درجة ${attempt.score} من ${attempt.questionsCount} (${attempt.percentage}%)! 🌟`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'شهادة إنجاز النحو العربي',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-right" dir="rtl">
      {/* Top Navigation & Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-slate-700 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة لأقسام النحو العربي</span>
        </button>

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
            <span>{isExportingPdf ? 'جاري تصدير PDF...' : 'تحميل النتيجة (PDF)'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-teal-700" />
            <span>{copiedShare ? 'تم نسخ النص!' : 'مشاركة النتيجة'}</span>
          </button>

          <a
            href={padletUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>نشر في Padlet</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </a>
        </div>
      </div>

      {exportNotice && (
        <div className="bg-emerald-50 text-emerald-900 px-6 py-2.5 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Official Certificate & Report Container (Rendered and Exportable) */}
      <div
        ref={cardRef}
        className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-500/70 shadow-xl text-right relative overflow-hidden space-y-6"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="absolute inset-3 border-2 border-dashed border-emerald-800/20 rounded-2xl pointer-events-none" />

        {/* School Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-200 pb-5 gap-4 relative">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <SchoolLogo size={72} className="shrink-0 drop-shadow-md mx-auto sm:mx-0" />
            <div>
              <span className="text-xs font-bold text-emerald-800 block">
                المدارس الأهلية الخاصة - الغبيبة · قسم النحو العربي
              </span>
              <h2 className="font-cairo text-2xl font-black text-slate-900 tracking-tight">
                شهادة إنجاز وتقييم نشاط نحوي
              </h2>
              <span className="text-[11px] text-slate-500 font-semibold">
                وثيقة معتمدة وموثقة لنتائج تقييم النحو العربي التفاعلي
              </span>
            </div>
          </div>

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

        {/* Student Meta Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">اسم الطالب/ـة:</span>
            <span className="font-bold text-slate-900 text-sm block truncate">{attempt.studentName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">الصف والشعبة:</span>
            <span className="font-bold text-slate-900 text-sm block">{attempt.studentClass} ({attempt.studentSection})</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">المعلم/ـة المشرف/ـة:</span>
            <span className="font-bold text-slate-900 text-sm block truncate">{attempt.teacherName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">مستوى النشاط:</span>
            <span className="font-bold text-emerald-800 text-sm block">{attempt.difficulty}</span>
          </div>
        </div>

        {/* Score Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-300 font-bold block mb-1">
                الدرس والموضوع: {attempt.topicTitle} ({attempt.mode === 'quiz' ? 'اختبار رسمي' : 'نشاط تدريبي'})
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-cairo text-4xl sm:text-5xl font-black text-amber-400">
                  {attempt.score}
                </span>
                <span className="text-slate-300 text-lg">من {attempt.questionsCount}</span>
                <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full mr-3">
                  النسبة المئوية: {attempt.percentage}%
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>الوقت المستغرق: {formatSeconds(attempt.timeSpentSeconds)}</span>
              </div>
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-amber-400 flex flex-col items-center justify-center bg-white/10 shrink-0 text-center">
              <span className="font-black font-cairo text-2xl text-amber-300">{attempt.percentage}%</span>
              <span className="text-[10px] text-slate-200">الدرجة</span>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-start gap-2 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <p>
              <strong>كلمة تحفيزية: </strong>
              «{motivation.quote}»
            </p>
          </div>
        </div>

        {/* Strengths & Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>نقاط القوة والموضوعات المتقنة:</span>
            </span>
            <p className="text-slate-700 leading-relaxed">
              {attempt.strengths.length > 0 ? attempt.strengths.join('، ') : 'إلمام جيد بمبادئ الدرس والمفاهيم الإعرابية.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>التوصية التعليمية الذكية:</span>
            </span>
            <p className="text-slate-700 leading-relaxed">
              {attempt.recommendation || 'ننصحك بمراجعة الأمثلة المشكولة لترسيخ التمييز بين الحركات الأصلية والفرعية.'}
            </p>
          </div>
        </div>

        {/* Detailed Question Breakdown Feed */}
        <div className="space-y-3 pt-2">
          <h4 className="font-cairo font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>التغذية الراجعة التفصيلية لجميع الأسئلة:</span>
          </h4>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {attempt.answersBreakdown.map((ans, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                  ans.isCorrect
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-rose-50/60 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-slate-900">
                    {idx + 1}. {ans.questionPrompt}
                  </span>
                  {ans.isCorrect ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] shrink-0 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>إجابة صحيحة</span>
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold flex items-center gap-1 text-[11px] shrink-0 bg-rose-100/80 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>تحتاج تصويباً</span>
                    </span>
                  )}
                </div>

                {ans.sentence && (
                  <p className="text-slate-600 font-medium mb-1.5 bg-white/70 p-2 rounded-lg border border-slate-200/60">
                    الشاهد: «{ans.sentence}»
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] mb-1.5">
                  <div>إجابة الطالب: <strong className={ans.isCorrect ? 'text-emerald-800' : 'text-rose-700'}>{ans.selectedOption}</strong></div>
                  {!ans.isCorrect && (
                    <div>الإجابة الصحيحة المعتمدة: <strong className="text-emerald-800">{ans.correctOption}</strong></div>
                  )}
                </div>

                <div className="text-[11px] text-slate-600 bg-white/90 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                  <p>💡 <strong>التفسير اللغوي:</strong> {ans.explanation}</p>
                  {ans.wrongFeedbackTip && (
                    <p className="text-slate-500">🔍 <strong>إضاءة نحوية:</strong> {ans.wrongFeedbackTip}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Footer Signature */}
        <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>المدارس الأهلية الخاصة - الغبيبة</span>
          <span>إشراف: أ/ بلسم جرّار · أ/ غادة الجاسم · د/ وسام عبد العال</span>
        </div>
      </div>

      {/* Retake & Home Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all cursor-pointer border border-emerald-300 active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-emerald-800" />
          <span>إعادة النشاط بأسئلة متجددة</span>
        </button>

        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>متابعة التعلم في أقسام النحو</span>
        </button>
      </div>
    </div>
  );
};
