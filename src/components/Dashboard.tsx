import React from 'react';
import { StudentProfile, MainSectionId } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { StudentSectionCard } from './StudentSectionCard';
import { 
  BookOpen, 
  PenTool, 
  SpellCheck, 
  MessageSquareQuote, 
  Scale, 
  Star, 
  Mic, 
  ClipboardCheck, 
  History, 
  Lock, 
  ArrowLeft,
  Users,
  Feather,
  GraduationCap,
  Sparkles,
  Bot,
  Award
} from 'lucide-react';

interface DashboardProps {
  student: StudentProfile | null;
  onSelectSection: (section: MainSectionId) => void;
  onSaveProfile: (profile: StudentProfile) => void;
  onOpenProfileModal: () => void;
  onOpenTeacherModal: () => void;
  onClearProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  student,
  onSelectSection,
  onSaveProfile,
  onOpenProfileModal,
  onOpenTeacherModal,
  onClearProfile,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-right" dir="rtl">
      {/* Official School & Project Banner */}
      <header className="relative bg-gradient-to-br from-blue-700 via-teal-800 to-emerald-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl overflow-hidden border border-white/10 text-center">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-3">
          {/* Centered School Logo (شعار المدرسة بطريقة متوسطة وأنيقة) */}
          <div className="flex justify-center mb-2">
            <div className="p-1.5 bg-white/90 rounded-full shadow-lg border-2 border-amber-400/80 backdrop-blur-xs">
              <SchoolLogo size={115} className="mx-auto" />
            </div>
          </div>

          <p className="text-sm sm:text-base font-bold text-teal-200 tracking-wider">
            المدارس الأهلية الخاصة - الغبيبة
          </p>

          <h1 className="font-cairo text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-md my-2">
            كنوز اللغة العربية
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 font-medium max-w-xl mx-auto">
            منظومة لغوية تعليمية شاملة لعلوم النحو والإعراب، الإملاء، المعاجم، البلاغة، والعَروض
          </p>

          {/* Supervisors Grid */}
          <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/15 backdrop-blur-xs p-3 rounded-2xl border border-amber-400/50 shadow-xs">
              <p className="text-amber-300 font-bold mb-0.5">إعداد التطبيق</p>
              <p className="font-bold text-white text-sm font-cairo">الطالبة: سيما محمد كحول</p>
              <p className="text-[10px] text-amber-200 mt-0.5">معدة ومطورة المنظومة</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <p className="text-slate-300 font-medium mb-0.5">تنسيق وإخراج</p>
              <p className="font-bold text-white text-sm">أ/ بلسم حسني جرّار</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <p className="text-slate-300 font-medium mb-0.5">تدقيق المعلومات</p>
              <p className="font-bold text-white text-sm">أ/ غادة الجاسم</p>
              <p className="text-[10px] text-teal-200 mt-0.5">معلمة اللغة العربية</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <p className="text-slate-300 font-medium mb-0.5">الإشراف العام</p>
              <p className="font-bold text-white text-sm">د/ وسام عبد العال</p>
            </div>
          </div>
        </div>
      </header>

      {/* 🌟 قسم الطالب الرسمي ولوحة المعلم بشكل مكبر */}
      <StudentSectionCard
        student={student}
        onSaveProfile={onSaveProfile}
        onOpenEditModal={onOpenProfileModal}
        onOpenTeacherModal={onOpenTeacherModal}
        onClearProfile={onClearProfile}
      />

      {/* 🌟 القسم الجديد: النحو العربي التفاعلي الشامل */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-600/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-right">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-bold">
              <BookOpen className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  قسم رئيسي جديد ✨
                </span>
                <span className="text-xs font-bold text-emerald-200">
                  12 قسماً شاملاً · ذكاء اصطناعي
                </span>
              </div>
              <h2 className="font-cairo text-2xl sm:text-3xl font-black text-white">
                النحو العربي
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-2xl leading-relaxed">
                تعلّم قواعد النحو العربي بطريقة سهلة وتفاعلية، واختبر معلوماتك وطوّر مهاراتك مع أنشطة واختبارات مولدة بالذكاء الاصطناعي وتغذية راجعة فورية متزامنة مع قسم المعلم.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectSection('nahw')}
              className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              <span>دخول قسم النحو العربي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* The Core Educational Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-cairo text-2xl font-black text-slate-900">
              أقسام كنوز اللغة العربية التعليمية
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              اضغط على أي قسم للانتقال إلى الدروس والأنشطة المتجددة أو أدوات الذكاء الاصطناعي
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            تجديد الأسئلة متاح بنقرة واحدة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* قسم النحو العربي (الجديد) */}
          <button
            onClick={() => onSelectSection('nahw')}
            className="group p-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 hover:from-emerald-800 hover:to-teal-800 text-white rounded-2xl shadow-lg transition-all duration-200 text-right cursor-pointer flex items-center justify-between border-2 border-amber-400/60"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-amber-300 font-bold block flex items-center gap-1">
                  <span>جديد بالذكاء الاصطناعي</span>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </span>
                <h3 className="font-cairo text-xl font-black">النحو العربي</h3>
                <span className="text-xs text-emerald-200 block mt-0.5">12 قسماً شاملاً بجميع الفروع</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-amber-300 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 1. الإعراب */}
          <button
            onClick={() => onSelectSection('i3rab')}
            className="group p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-blue-200 font-bold block">1. القواعد والتراكيب</span>
                <h3 className="font-cairo text-xl font-black">الإعراب</h3>
                <span className="text-xs text-blue-100 block mt-0.5">19 درساً وتطبيقاً متجدداً</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-blue-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 2. الإملاء */}
          <button
            onClick={() => onSelectSection('imlaa')}
            className="group p-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-200 font-bold block">2. الرسم الكتابي</span>
                <h3 className="font-cairo text-xl font-black">الإملاء</h3>
                <span className="text-xs text-emerald-100 block mt-0.5">اللام، الهمزات، التاء، الألف</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-emerald-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 3. المعاجم */}
          <button
            onClick={() => onSelectSection('mojam')}
            className="group p-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <SpellCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-purple-200 font-bold block">3. فقه اللغة والبحث</span>
                <h3 className="font-cairo text-xl font-black">المعاجم</h3>
                <span className="text-xs text-purple-100 block mt-0.5">كاشف الجذور والأوائل والأواخر</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-purple-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 4. البلاغة */}
          <button
            onClick={() => onSelectSection('balagha')}
            className="group p-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-amber-200 font-bold block">4. البيان والبديع</span>
                <h3 className="font-cairo text-xl font-black">البلاغة</h3>
                <span className="text-xs text-amber-100 block mt-0.5">علم المعاني والبيان والبديع</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-amber-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 5. العَروض */}
          <button
            onClick={() => onSelectSection('arood')}
            className="group p-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-teal-200 font-bold block">5. موسيقى الشعر العربي</span>
                <h3 className="font-cairo text-xl font-black">العَروض</h3>
                <span className="text-xs text-teal-100 block mt-0.5">البحور الشعرية والتفاعيل</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-teal-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 6. الموضوع المتميز */}
          <button
            onClick={() => onSelectSection('mawdou')}
            className="group p-5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-yellow-200 font-bold block">6. التعبير والإنشاء</span>
                <h3 className="font-cairo text-xl font-black">الموضوع المتميز</h3>
                <span className="text-xs text-yellow-100 block mt-0.5">المصحح اللغوي الذكي (شروط الـ 8)</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-yellow-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 7. القارئ الذكي */}
          <button
            onClick={() => onSelectSection('smart-reader')}
            className="group p-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-rose-200 font-bold block">7. مدرب النطق الصوتي</span>
                <h3 className="font-cairo text-xl font-black">القارئ الذكي</h3>
                <span className="text-xs text-rose-100 block mt-0.5">تسجيل وتحليل القراءة المجهورة</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-rose-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 8. التقويم الشامل */}
          <button
            onClick={() => onSelectSection('assessment')}
            className="group p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-indigo-200 font-bold block">8. الاختبارات الشاملة</span>
                <h3 className="font-cairo text-xl font-black">التقويم الشامل</h3>
                <span className="text-xs text-indigo-100 block mt-0.5">توليد اختبارات من النصوص والقصائد</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-indigo-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 9. سجل النتائج (خاص بالمعلم) */}
          <button
            onClick={onOpenTeacherModal}
            className="group p-5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl shadow-md transition-all duration-200 text-right cursor-pointer flex items-center justify-between border-2 border-amber-400/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <History className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>9. خاص بالمعلم المشرف</span>
                </span>
                <h3 className="font-cairo text-xl font-black text-white">سجل النتائج</h3>
                <span className="text-xs text-slate-300 block mt-0.5">لوحة المعلم لمتابعة أداء الطلبة</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-amber-300 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
