import React from 'react';
import { QuizSubmission } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { getMotivationalMessage } from '../utils/motivational';
import { Award, CheckCircle2, Calendar, User, School, Clock, ShieldCheck, Feather } from 'lucide-react';

interface ReportCardProps {
  submission: QuizSubmission;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const ReportCard: React.FC<ReportCardProps> = ({ submission, cardRef }) => {
  const { student, topic, category, totalQuestions, correctAnswersCount, scorePercentage, completedAt } = submission;

  const getTier = (percentage: number) => {
    if (percentage >= 90) return { label: 'وسام التميز اللغوي الفائق', rank: 'ممتاز مع مرتبة الشرف', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' };
    if (percentage >= 80) return { label: 'وسام الإتقان المعرفي', rank: 'جيد جداً مرتفع', color: 'text-teal-800 bg-teal-50 border-teal-300' };
    if (percentage >= 60) return { label: 'وسام المجتهد الواعد', rank: 'مستوى جيد ومتقدم', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    return { label: 'شهادة مشاركة وتدريب', rank: 'يحتاج إلى مزيد من المران', color: 'text-slate-800 bg-slate-100 border-slate-300' };
  };

  const tier = getTier(scorePercentage);
  const formattedDate = new Date(completedAt).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(completedAt).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      ref={cardRef}
      id="kanooz-report-card"
      className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-500/80 shadow-xl max-w-2xl mx-auto my-4 text-right relative overflow-hidden"
      dir="rtl"
      style={{
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Decorative inner border */}
      <div className="absolute inset-2 border-2 border-dashed border-emerald-700/30 rounded-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 pb-5 mb-6 relative">
        <div className="flex items-center gap-3">
          <SchoolLogo size={58} className="shrink-0 drop-shadow-md" />
          <div>
            <span className="text-xs font-bold text-emerald-800 block">
              المدارس الأهلية الخاصة - الغبيبة · كنوز اللغة العربية
            </span>
            <h1 className="font-cairo text-2xl font-black text-slate-900 tracking-tight">
              بطاقة نتاج التعلم والتقييم
            </h1>
            <span className="text-[11px] text-slate-500">
              وثيقة إنجاز رسميّة لتسليم المهام والأنشطة المدرسية
            </span>
          </div>
        </div>

        <div className="text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{tier.rank}</span>
          </span>
        </div>
      </div>

      {/* Student Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
        <div>
          <span className="text-[11px] text-slate-500 block">اسم الطالب/ـة</span>
          <span className="text-sm font-bold text-slate-900 block truncate">{student.fullName}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">الصف والشعبة</span>
          <span className="text-sm font-bold text-slate-900 block truncate">{student.grade} ({student.section})</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">المعلم/ـة المشرف/ـة</span>
          <span className="text-sm font-bold text-slate-900 block truncate">{student.teacherName}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">النشاط / المبحث</span>
          <span className="text-sm font-bold text-emerald-800 block truncate">{topic} ({category})</span>
        </div>
      </div>

      {/* Score Highlight Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-2xl mb-6 shadow-inner">
        <div>
          <span className="text-xs text-amber-300 font-bold block mb-1">
            النتيجة المستحقة في التقييم
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-cairo text-4xl font-black text-white tabular-nums">
              {correctAnswersCount}
            </span>
            <span className="text-xl text-emerald-300 font-bold">من أصل</span>
            <span className="font-cairo text-2xl font-bold text-amber-400 tabular-nums">
              {totalQuestions}
            </span>
            <span className="text-xs text-slate-300 mr-2">
              (درجة كاملة: {scorePercentage}%)
            </span>
          </div>
        </div>

        <div className="text-center sm:text-left bg-white/10 px-4 py-2.5 rounded-xl border border-white/15">
          <span className="text-[11px] text-emerald-200 block">الوسام الممنوح</span>
          <span className="text-xs font-black text-amber-300 block">{tier.label}</span>
        </div>
      </div>

      {/* Motivational Quote & Feedback (عبارات تحفيزية وتغذية راجعة) */}
      <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl mb-5 flex items-start gap-2.5 text-xs text-amber-950 leading-relaxed shadow-2xs">
        <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-amber-900 font-bold">رسالة تحفيزية: </strong>
          «{getMotivationalMessage(scorePercentage).quote}»
        </p>
      </div>

      {/* Answers Summary Breakdown */}
      <div className="space-y-2 mb-6">
        <span className="text-xs font-bold text-slate-700 block">
          سجل الأسئلة والإجابات المعتمدة:
        </span>
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
          {submission.answers.map((ans, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                ans.isCorrect
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                  : 'bg-rose-50/70 border-rose-200 text-slate-800'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {ans.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-[10px]">
                    ✕
                  </span>
                )}
              </div>
              <div className="flex-1">
                <span className="font-bold block text-slate-900">{idx + 1}. {ans.questionText}</span>
                <span className="block text-[11px] text-slate-600 mt-0.5">
                  إجابتك: <span className={ans.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 line-through'}>{ans.selectedAnswer}</span>
                  {!ans.isCorrect && (
                    <span className="text-emerald-800 font-bold mr-2"> | الصواب: {ans.correctAnswer}</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Stamp */}
      <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>{formattedDate}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>{formattedTime}</span>
          </span>
        </div>

        {/* Verification badge */}
        <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-50/80 px-3 py-1 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>وثيقة إلكترونية معتمدة من منصة كنوز الضاد</span>
        </div>
      </div>
    </div>
  );
};
