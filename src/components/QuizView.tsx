import React, { useState, useRef } from 'react';
import { Question, StudentProfile, QuizSubmission, SectionCategory, ResultHistoryItem, PADLET_LINKS } from '../types';
import { ReportCard } from './ReportCard';
import { PadletModal } from './PadletModal';
import { StudentFeedbackModal } from './StudentFeedbackModal';
import { getMotivationalMessage } from '../utils/motivational';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { 
  RotateCw, 
  CheckCircle, 
  HelpCircle, 
  Share2, 
  Download, 
  Award, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Info,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';

interface QuizViewProps {
  category: SectionCategory | 'arood';
  categoryTitle: string;
  categoryDescription: string;
  questions: Question[];
  student: StudentProfile | null;
  padletUrl?: string;
  onRenewQuestions: () => void;
  onRequireProfile: () => void;
  onBackToHome: () => void;
  onRecordResult?: (res: ResultHistoryItem) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  category,
  categoryTitle,
  categoryDescription,
  questions,
  student,
  padletUrl,
  onRenewQuestions,
  onRequireProfile,
  onBackToHome,
  onRecordResult,
}) => {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(questions);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPadletModalOpen, setIsPadletModalOpen] = useState(false);
  const [validationWarning, setValidationWarning] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [recordedSuccessfully, setRecordedSuccessfully] = useState(false);

  const reportCardRef = useRef<HTMLDivElement | null>(null);

  // Sync questions when parent updates them
  React.useEffect(() => {
    setCurrentQuestions(questions);
    setIsAiGenerated(false);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setSubmission(null);
    setRecordedSuccessfully(false);
  }, [questions]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setValidationWarning('');
  };

  // Generate brand new questions via Gemini AI
  const handleGenerateAIQuestions = async () => {
    setIsGeneratingAI(true);
    setValidationWarning('');
    try {
      const categoryMap: Record<string, string> = {
        grammar: 'نحو',
        spelling: 'إملاء',
        mojam: 'معاجم',
        lexicon: 'معاجم',
        rhetoric: 'بلاغة',
        arood: 'عروض'
      };
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryMap[category] || 'نحو',
          topic: categoryTitle,
          difficulty: 'متوسط'
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const formatted: Question[] = data.questions.map((q: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          category: q.category || categoryTitle,
          subcategory: q.subcategory || categoryTitle,
          prompt: q.prompt || q.question,
          sentence: q.sentence,
          type: 'multiple-choice',
          options: q.options || ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
          correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : (q.correctIndex || 0),
          explanation: q.explanation || 'إجابة صحيحة وفق القواعد المعتمدة.',
          ruleTip: q.ruleTip || 'راجع القاعدة التعليمية الخاصة بالمبحث بدقة.'
        }));
        setCurrentQuestions(formatted);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setSubmission(null);
        setIsAiGenerated(true);
        setRecordedSuccessfully(false);
      } else {
        onRenewQuestions();
      }
    } catch (err) {
      console.error('AI question generation error', err);
      onRenewQuestions();
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleVerifyAll = () => {
    // 1. Mandatory Student Profile Check
    if (!student || !student.fullName) {
      onRequireProfile();
      return;
    }

    // 2. Check if all questions have answers
    const unansweredCount = currentQuestions.filter(q => selectedAnswers[q.id] === undefined).length;
    if (unansweredCount > 0) {
      setValidationWarning(`تنبيه: تبقى لديك ${unansweredCount} أسئلة لم تُجب عليها بعد. يمكنك إكمالها الآن أو المتابعة للتحقق.`);
    }

    // 3. Calculate Results
    let correctCount = 0;
    const answerBreakdown = currentQuestions.map(q => {
      const selectedIdx = selectedAnswers[q.id];
      const isCorrect = selectedIdx === q.correctAnswer;
      if (isCorrect) correctCount++;

      const selectedText = selectedIdx !== undefined && q.options 
        ? q.options[selectedIdx] 
        : 'لم يتم الإجابة';
      const correctText = q.options 
        ? q.options[Number(q.correctAnswer)] 
        : String(q.correctAnswer);

      return {
        questionId: q.id,
        questionText: q.prompt,
        selectedAnswer: selectedText,
        correctAnswer: correctText,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((correctCount / currentQuestions.length) * 100);

    const sub: QuizSubmission = {
      student,
      topic: categoryTitle,
      category: category === 'grammar' ? 'نحو وإعراب' : category === 'spelling' ? 'إملاء وترقيم' : category === 'lexicon' ? 'معاجم وجذور' : category === 'arood' ? 'عروض وقوافي' : 'بلاغة وأدب',
      totalQuestions: currentQuestions.length,
      correctAnswersCount: correctCount,
      scorePercentage: percentage,
      completedAt: new Date().toISOString(),
      answers: answerBreakdown,
    };

    setSubmission(sub);
    setIsSubmitted(true);

    const motivational = getMotivationalMessage(percentage);
    const resultItem: ResultHistoryItem = {
      id: `res-${Date.now()}`,
      studentName: student.fullName,
      studentClass: student.grade,
      studentSection: student.section,
      teacherName: student.teacherName,
      lesson: categoryTitle,
      score: correctCount,
      total: currentQuestions.length,
      percentage,
      date: new Date().toISOString(),
      category: sub.category,
      motivationalQuote: motivational.quote,
      feedbackText: motivational.badge,
      answersBreakdown: answerBreakdown.map(a => ({
        questionText: a.questionText,
        selectedAnswer: a.selectedAnswer,
        correctAnswer: a.correctAnswer,
        isCorrect: a.isCorrect,
        explanation: a.explanation
      })),
    };

    setRecordedResultItem(resultItem);

    // Save and link directly to Teacher's Results History!
    if (onRecordResult) {
      onRecordResult(resultItem);
      setRecordedSuccessfully(true);
    }

    // Confetti celebration if scored 70%+
    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Scroll to results
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const [recordedResultItem, setRecordedResultItem] = useState<ResultHistoryItem | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // PDF export handler using jsPDF + html2canvas
  const handleExportPdf = async () => {
    if (!reportCardRef.current) return;
    setIsExportingPdf(true);
    try {
      const canvas = await html2canvas(reportCardRef.current, {
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
      const cleanName = (student?.fullName || 'طالب').replace(/\s+/g, '_');
      const cleanTopic = categoryTitle.replace(/\s+/g, '_');
      pdf.save(`شهادة-نتيجة-${cleanName}-${cleanTopic}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('حدث خطأ أثناء تصدير ملف PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleRenewQuestionsClick = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setSubmission(null);
    setValidationWarning('');
    setIsAiGenerated(false);
    setRecordedSuccessfully(false);
    onRenewQuestions();
  };

  const handleRetryCurrent = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setSubmission(null);
    setValidationWarning('');
    setRecordedSuccessfully(false);
  };

  // Export card image and trigger Padlet workflow
  const handleExportForPadlet = async () => {
    if (!reportCardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeName = (student?.fullName || 'طالب').replace(/\s+/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `كنوز_اللغة_العربية_${safeName}_${category}_${dateStr}.png`;
      link.href = imgData;
      link.click();

      // Open guidance modal
      setIsPadletModalOpen(true);
    } catch (err) {
      console.error('Error generating card image:', err);
      alert('حدث خطأ أثناء تنزيل الصورة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  const answeredQuestionsCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-right" dir="rtl">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={onBackToHome}
                className="text-emerald-200 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>الرئيسية</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
              <span className="text-slate-400">/</span>
              <span className="text-xs text-amber-300 font-bold">أنشطة وتطبيقات متجددة</span>
            </div>
            <h1 className="font-cairo text-2xl sm:text-3xl font-black text-white">
              {categoryTitle}
            </h1>
            <p className="text-sm text-emerald-100 max-w-2xl mt-1">
              {categoryDescription}
            </p>
          </div>

          {/* Action Buttons: AI Generation + Bank Renewal */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleGenerateAIQuestions}
              disabled={isGeneratingAI}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title="توليد 5 أسئلة جديدة ومخصصة كلياً بواسطة الذكاء الاصطناعي (Gemini)"
            >
              {isGeneratingAI ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>جاري الصياغة بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-950" />
                  <span>تحديث الأسئلة بالذكاء الاصطناعي ✨</span>
                </>
              )}
            </button>

            <button
              onClick={handleRenewQuestionsClick}
              disabled={isGeneratingAI}
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-white bg-white/15 hover:bg-white/25 active:scale-95 rounded-xl border border-white/20 transition-all cursor-pointer whitespace-nowrap"
              title="تجديد مجموعة أسئلة من بنك الأسئلة المحلي"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>تجديد من بنك الأسئلة</span>
            </button>
          </div>
        </div>

        {/* Progress tracker & AI Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-emerald-200 gap-2">
          <div className="flex items-center gap-3">
            <span>عدد الأسئلة: <strong className="text-white">{currentQuestions.length}</strong></span>
            <span>·</span>
            <span>الأسئلة المجاب عنها: <strong className="text-amber-300">{answeredQuestionsCount}</strong> من {currentQuestions.length}</span>
            {isAiGenerated && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>تم التوليد بالذكاء الاصطناعي</span>
              </span>
            )}
          </div>
          {student ? (
            <span className="text-[11px] text-emerald-300">
              المتعلم/ـة: <strong>{student.fullName}</strong> ({student.grade} - {student.section})
            </span>
          ) : (
            <button
              onClick={onRequireProfile}
              className="text-[11px] text-amber-300 underline font-semibold hover:text-amber-200 cursor-pointer"
            >
              يرجى تسجيل بياناتك لاعتماد النتيجة
            </button>
          )}
        </div>
      </div>

      {/* Confirmation of Auto-Recording to Teacher Results */}
      {recordedSuccessfully && isSubmitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              تم رصد نتيجتك بنجاح وربطها بسجل نتائج المعلم/ـة المشرف/ـة (لوحة التحكم)!
            </span>
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100 px-3 py-1 rounded-lg">
            موثقة ومحفوظة ✓
          </span>
        </div>
      )}

      {/* Warning if unanswered */}
      {validationWarning && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{validationWarning}</span>
          </div>
          <button
            onClick={() => setValidationWarning('')}
            className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {currentQuestions.map((q, qIndex) => {
          const selectedIdx = selectedAnswers[q.id];
          const isAnswered = selectedIdx !== undefined;
          const isCorrect = isSubmitted && selectedIdx === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-xs ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/80 bg-emerald-50/20'
                    : 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 block">
                      {q.subcategory}
                    </span>
                    <h3 className="font-cairo text-base sm:text-lg font-bold text-slate-900">
                      {q.prompt}
                    </h3>
                  </div>
                </div>

                {isSubmitted && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {isCorrect ? 'إجابة صحيحة ✓' : 'إجابة خاطئة ✕'}
                  </span>
                )}
              </div>

              {/* Context sentence if available */}
              {q.sentence && (
                <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="font-amiri text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
                    {q.sentence}
                  </span>
                </div>
              )}

              {/* Multiple Choice Options */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {q.options.map((option, optIdx) => {
                    const isChosen = selectedIdx === optIdx;
                    const isThisCorrect = q.correctAnswer === optIdx;

                    let optionStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

                    if (isSubmitted) {
                      if (isThisCorrect) {
                        optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isChosen && !isThisCorrect) {
                        optionStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                      } else {
                        optionStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isChosen) {
                      optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3.5 rounded-2xl border text-right text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <span className="leading-snug">{option}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isChosen
                              ? isSubmitted
                                ? isThisCorrect ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-rose-600 border-rose-600 text-white'
                                : 'bg-emerald-800 border-emerald-800 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChosen && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation & Rule Tip after submission */}
              {isSubmitted && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950">
                    <span className="font-bold block mb-1">التعليل والشرح:</span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                  {q.ruleTip && (
                    <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950">
                      <span className="font-bold ml-1">إضاءة نحوية/إملائية:</span>
                      <span>{q.ruleTip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer Bar */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>
            {isSubmitted
              ? `تم اعتماد النتيجة: ${submission?.correctAnswersCount} من ${submission?.totalQuestions} (${submission?.scorePercentage}%)`
              : `أجبت على ${answeredQuestionsCount} من أصل ${questions.length} أسئلة`}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isSubmitted ? (
            <button
              onClick={handleVerifyAll}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-98 rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>تحقق من جميع الإجابات</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleExportForPadlet}
                disabled={isExporting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>{isExporting ? 'جاري تصدير الصورة...' : 'مشاركة في Padlet (تنزيل الصورة)'}</span>
              </button>

              <button
                onClick={handleRetryCurrent}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                إعادة المحاولة
              </button>

              <button
                onClick={handleRenewQuestionsClick}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>أسئلة جديدة</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Generated Report Card Section when submitted */}
      {isSubmitted && submission && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-emerald-800 block">
              نتاج التعلم المكتمل
            </span>
            <h2 className="font-cairo text-2xl font-black text-slate-900">
              بطاقة النتيجة الرسمية للتسليم
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              هذه البطاقة جاهزة للتصدير كصورة وإرفاقها مباشرة في منصة Padlet المدرسية
            </p>
          </div>

          {/* Official Report Card */}
          <ReportCard submission={submission} cardRef={reportCardRef} />

          {/* Export action bar right below report card */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={handleExportForPadlet}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'جاري التصدير...' : 'تحميل النتيجة كصورة (PNG)'}</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{isExportingPdf ? 'جاري إنشاء PDF...' : 'تحميل النتيجة كملف (PDF)'}</span>
            </button>

            {recordedResultItem && (
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 active:scale-98 rounded-xl transition-all cursor-pointer border border-emerald-300"
              >
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>عرض الشهادة والتغذية الراجعة</span>
              </button>
            )}

            <button
              onClick={() => setIsPadletModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-800 hover:bg-teal-900 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              <span>تسليم النشاط في Padlet</span>
            </button>
          </div>
        </div>
      )}

      {/* Student Feedback & Motivational Modal */}
      {recordedResultItem && (
        <StudentFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          result={recordedResultItem}
          padletUrl={padletUrl || student?.padletUrl || PADLET_LINKS.all}
        />
      )}

      {/* Padlet Guidance Modal */}
      {student && (
        <PadletModal
          isOpen={isPadletModalOpen}
          onClose={() => setIsPadletModalOpen(false)}
          padletUrl={padletUrl || student.padletUrl || 'https://padlet.com'}
          studentName={student.fullName}
          score={`${submission?.correctAnswersCount || 0} / ${submission?.totalQuestions || 0}`}
        />
      )}
    </div>
  );
};
