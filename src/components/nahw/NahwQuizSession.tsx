import React, { useState, useEffect } from 'react';
import { NahwTopic, NahwQuestion, NahwQuizAttempt, GrammarDifficulty } from '../../types/nahw';
import { StudentProfile } from '../../types';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft, 
  Bot, 
  Award, 
  Lightbulb, 
  ArrowRight
} from 'lucide-react';

interface NahwQuizSessionProps {
  topic: NahwTopic;
  mode: 'activity' | 'quiz';
  difficulty: GrammarDifficulty;
  student: StudentProfile;
  questions: NahwQuestion[];
  onFinish: (attempt: NahwQuizAttempt) => void;
  onCancel: () => void;
  onOpenAiAssistant: () => void;
}

export const NahwQuizSession: React.FC<NahwQuizSessionProps> = ({
  topic,
  mode,
  difficulty,
  student,
  questions,
  onFinish,
  onCancel,
  onOpenAiAssistant
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Stored answers
  const [recordedAnswers, setRecordedAnswers] = useState<{
    questionPrompt: string;
    sentence?: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
    explanation: string;
    wrongFeedbackTip?: string;
    similarExample?: string;
  }[]>([]);

  // AI Hint state in activity mode
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const currentQ = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    const answerRecord = {
      questionPrompt: currentQ.prompt,
      sentence: currentQ.sentence,
      selectedOption: currentQ.options[selectedOption] || '',
      correctOption: currentQ.options[currentQ.correctAnswer] || '',
      isCorrect,
      explanation: currentQ.explanation,
      wrongFeedbackTip: currentQ.wrongFeedbackTip,
      similarExample: currentQ.similarExample
    };

    setRecordedAnswers(prev => [...prev, answerRecord]);

    if (isCorrect) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setAiHint(null);
    } else {
      // Finish Session
      setTimerActive(false);
      const totalAnswers = recordedAnswers;
      const correctCount = totalAnswers.filter(a => a.isCorrect).length;
      const percentage = Math.round((correctCount / questions.length) * 100);

      // Strengths & recommendations
      const strengths = percentage >= 70
        ? [`استيعاب ممتاز لقواعد «${topic.title}»`, 'القدرة على تمييز الشواهد النحوية وعوامل الإعراب']
        : ['مشاركة نشطة ومحاولة جادة في استيعاب المفاهيم'];

      const needsReview = percentage < 70
        ? [`مراجعة درس «${topic.title}» وضبط شواهده بالشكل`]
        : [];

      const recommendation = percentage >= 80
        ? `أداء متألق! استمر في خوض اختبارات الأقسام المتقدمة لتعزيز ريادتك في علوم لغة الضاد.`
        : `ننصحك بمراجعة الشرح المبسط والأمثلة المشكولة لدرس «${topic.title}» ثم خوض النشاط مجدداً.`;

      const attempt: NahwQuizAttempt = {
        id: `nahw-${Date.now()}`,
        studentId: student.fullName,
        studentName: student.fullName,
        studentClass: student.grade,
        studentSection: student.section,
        teacherName: student.teacherName,
        sectionId: topic.sectionId,
        sectionName: 'النحو العربي',
        topicId: topic.id,
        topicTitle: topic.title,
        mode,
        questionsCount: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: questions.length - correctCount,
        score: correctCount,
        percentage,
        timeSpentSeconds: timerSeconds,
        difficulty,
        completedAt: new Date().toISOString(),
        answersBreakdown: totalAnswers,
        strengths,
        needsReview,
        recommendation
      };

      if (percentage >= 70) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }

      onFinish(attempt);
    }
  };

  const handleRequestAiHint = async () => {
    setIsLoadingHint(true);
    setAiHint(null);
    try {
      const res = await fetch('/api/ai/grammar-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hint_without_answer',
          topic: topic.title,
          userQuery: `أعطني تلميحاً ذكياً موجزاً يساعدني على حل هذا السؤال دون أن تكشف لي الإجابة: "${currentQ.prompt}"`
        })
      });
      const data = await res.json();
      setAiHint(data.answer || currentQ.wrongFeedbackTip || 'فكر في العامل النحوي الذي يسبق الكلمة وموقعها في سياق الجملة.');
    } catch {
      setAiHint(currentQ.wrongFeedbackTip || 'راجع القاعدة النحوية الأساسية وتأمل أثر العامل في الجملة.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  const isCorrect = isAnswerChecked && selectedOption === currentQ.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-right" dir="rtl">
      {/* Session Top Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800">
              {mode === 'quiz' ? 'اختبار رسمي محدد' : 'نشاط تدريبي تفاعلي'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-semibold">{topic.title}</span>
          </div>
          <h2 className="font-cairo text-lg font-black text-slate-900 mt-0.5">
            السؤال {currentIndex + 1} من {questions.length}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="tabular-nums">
              {Math.floor(timerSeconds / 60)}:{('0' + (timerSeconds % 60)).slice(-2)}
            </span>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-semibold text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            إنهاء الجلسة
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-600 to-teal-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              مستوى الصعوبة: {currentQ.difficulty || difficulty}
            </span>
            {mode === 'activity' && !isAnswerChecked && (
              <button
                onClick={handleRequestAiHint}
                disabled={isLoadingHint}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-teal-600" />
                <span>{isLoadingHint ? 'جاري جلب التلميح...' : 'تلميح ذكي 💡'}</span>
              </button>
            )}
          </div>

          <h3 className="font-cairo text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQ.prompt}
          </h3>

          {currentQ.sentence && (
            <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-semibold">
              الشاهد النحوي: «{currentQ.sentence}»
            </div>
          )}
        </div>

        {/* AI Hint Box if requested */}
        {aiHint && (
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950 space-y-1 animate-in fade-in">
            <div className="font-bold flex items-center gap-1 text-teal-900">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>إضاءة ومفتاح الحل:</span>
            </div>
            <p className="leading-relaxed">{aiHint}</p>
          </div>
        )}

        {/* Options Grid */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQ.correctAnswer;

            let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';
            if (isAnswerChecked) {
              if (isCorrectOption) {
                style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
              } else if (isSelected && !isCorrectOption) {
                style = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
              } else {
                style = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              style = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
              >
                <span>{option}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? isAnswerChecked
                        ? isCorrectOption
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-rose-600 border-rose-600 text-white'
                        : 'bg-emerald-800 border-emerald-800 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {isSelected && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Instant Pedagogical Feedback when checked */}
        {isAnswerChecked && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>أحسنت! إجابة صحيحة ومتميزة 🌟</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>ليست الإجابة الصحيحة، لكن لا بأس! الأخطاء جزء من التعلم 💪</span>
                </>
              )}
            </div>

            {!isCorrect && (
              <p className="text-xs">
                الإجابة الصحيحة هي: <strong>{currentQ.options[currentQ.correctAnswer]}</strong>
              </p>
            )}

            <p className="text-xs leading-relaxed text-slate-700 bg-white/80 p-2.5 rounded-xl border border-black/5">
              💡 <strong>التعليل النحوي:</strong> {currentQ.explanation}
            </p>

            {!isCorrect && currentQ.wrongFeedbackTip && (
              <p className="text-xs text-slate-600">
                🔍 <strong>سبب التنبيه:</strong> {currentQ.wrongFeedbackTip}
              </p>
            )}

            {currentQ.similarExample && (
              <p className="text-[11px] text-slate-500">
                📖 <strong>مثال إضافي:</strong> {currentQ.similarExample}
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              تحقق من الإجابة
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>{isLastQuestion ? 'عرض النتيجة النهائية والشهادة' : 'السؤال التالي ←'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
