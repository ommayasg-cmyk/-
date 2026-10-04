import React, { useState } from 'react';
import { StudentProfile, SCHOOL_GRADES, DEFAULT_TEACHERS } from '../types';
import { 
  UserCheck, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Edit3, 
  ArrowLeft,
  Lock,
  LogOut,
  ShieldAlert,
  UserPlus
} from 'lucide-react';

interface StudentSectionCardProps {
  student: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
  onOpenEditModal: () => void;
  onOpenTeacherModal: () => void;
  onClearProfile?: () => void;
}

export const StudentSectionCard: React.FC<StudentSectionCardProps> = ({
  student,
  onSaveProfile,
  onOpenEditModal,
  onOpenTeacherModal,
  onClearProfile,
}) => {
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('الصف التاسع');
  const [section, setSection] = useState('و'); // افتراضياً شعبة و أو أ
  const [teacherName, setTeacherName] = useState('أ/ بلسم حسني جرّار');
  const [customTeacher, setCustomTeacher] = useState('');
  const [error, setError] = useState('');

  // استبعاد اسم الطالبة سيما محمد كحول من نموذج التدريب لأنها معدة ومطورة التطبيق
  const isActualStudent = Boolean(
    student &&
    student.fullName &&
    !student.fullName.includes('سيما') &&
    !student.fullName.toLowerCase().includes('sima')
  );

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    if (!cleanName) {
      setError('يرجى كتابة الاسم الكامل للطالب/ـة.');
      return;
    }

    if (cleanName.includes('سيما') || cleanName.toLowerCase().includes('sima')) {
      setError('الطالبة سيما محمد كحول هي معدة ومطورة التطبيق في الواجهة الرسمية. يرجى إدخال اسم الطالب/ـة المتدرب/ـة الفعلي للدخول للأقسام.');
      return;
    }

    if (!grade.trim()) {
      setError('يرجى تحديد الصف الدراسي.');
      return;
    }
    if (!section.trim()) {
      setError('يرجى تحديد الشعبة.');
      return;
    }
    const effectiveTeacher = teacherName === 'معلم آخر' ? customTeacher.trim() : teacherName.trim();
    if (!effectiveTeacher) {
      setError('يرجى تحديد أو كتابة اسم المعلم/ـة المشرف/ـة.');
      return;
    }

    setError('');
    onSaveProfile({
      fullName: cleanName,
      grade: grade.trim(),
      section: section.trim(),
      teacherName: effectiveTeacher,
      padletUrl: 'https://padlet.com',
      registeredAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4 text-right font-cairo" dir="rtl">
      {/* شبكة ثنائية مكبرة وواضحة جداً: [قسم الطالب] و [لوحة المعلم] */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. بطاقة قسم الطالب (مكبرة وواضحة) */}
        <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-500/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-bold">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    بوابة الطلاب الرسمية
                  </span>
                  <h2 className="font-cairo text-2xl sm:text-3xl font-black text-white">
                    قسم الطالب
                  </h2>
                </div>
              </div>

              {isActualStudent ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>طالب مسجل</span>
                </span>
              ) : (
                <span className="bg-amber-400/20 text-amber-300 border border-amber-300/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>تسجيل إلزامي للدخول</span>
                </span>
              )}
            </div>

            {/* حالة الطالب المسجل المعتمد (بدون اسم سيما) */}
            {isActualStudent && student ? (
              <div className="space-y-4 py-2">
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15 space-y-2">
                  <span className="text-[11px] text-teal-200 block font-semibold">
                    اسم الطالب المعتمد:
                  </span>
                  <p className="font-cairo text-2xl font-black text-white">
                    {student.fullName}
                  </p>
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-100">
                    <span>
                      الصف: <strong className="text-amber-300 font-bold">{student.grade}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      الشعبة: <strong className="text-amber-300 font-bold">شعبة {student.section}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      المعلم المشرف: <strong className="text-white font-bold">{student.teacherName}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={onOpenEditModal}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>تعديل بيانات الطالب</span>
                  </button>

                  {onClearProfile && (
                    <button
                      onClick={onClearProfile}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all cursor-pointer"
                      title="تسجيل خروج أو تبديل الطالب"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تبديل الطالب</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* حالة عدم وجود طالب مسجل: دعوة مباشرة ومكبرة للتسجيل */
              <div className="space-y-3 py-1">
                <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                  يجب على الطالب تسجيل اسمه، صفه الدراسي (من الروضة حتى الثاني عشر)، وشعبته (أ، ب، ج، د، هـ، <strong>و</strong>)، واسم المعلم المشرف قبل التجول في الأقسام لمزامنة درجاته وتوثيق شهاداته.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={onOpenEditModal}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-2xl shadow-lg transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-slate-950" />
                    <span>تسجيل بيانات الطالب الآن (إلزامي للدخول) ←</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. بطاقة لوحة المعلم (مكبرة وواضحة جداً) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-bold">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    لوحة الإشراف والمتابعة
                  </span>
                  <h2 className="font-cairo text-2xl sm:text-3xl font-black text-white">
                    لوحة المعلم (سجل النتائج)
                  </h2>
                </div>
              </div>

              <span className="bg-amber-400/20 text-amber-300 border border-amber-300/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                <span>رمز الأمان: 1111</span>
              </span>
            </div>

            <div className="space-y-3 py-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                لوحة المعلم المشرف لمتابعة تفاعل وإنجازات الطلبة، استعراض إجاباتهم النحوية واللغوية بالتفصيل، تصدير بطاقات التقييم والشهادات كملفات PDF وصور PNG، وتتبع سجل الدخول والأنشطة المتزامن لحظياً.
              </p>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>إشراف معتمد: أ/ بلسم جرّار · أ/ غادة الجاسم · د/ وسام عبد العال</span>
                <span className="text-amber-400 font-bold">مزامنة حية ⚡</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenTeacherModal}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>دخول لوحة المعلم المشرف (الرمز 1111) 🔒</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* نموذج تسجيل بيانات الطالب السريع في حال لم يكن مسجلاً (مع إضافة شعبة و) */}
      {!isActualStudent && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-emerald-600/40 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-cairo text-lg font-bold text-slate-900">
                نموذج تسجيل بيانات الطالب السريع
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                أدخل بياناتك هنا مباشرة لتفعيل التجوّل في كافة أقسام التطبيق:
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              الشعب المتاحة: أ، ب، ج، د، هـ، و
            </span>
          </div>

          {error && (
            <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleInlineSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  اسم الطالب / الطالبة الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="اكتب اسم الطالب/ـة الثلاثي أو الرباعي..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900 font-semibold"
                  required
                />
              </div>

              {/* Grade (from KG to 12th) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  الصف الدراسي (من الروضة KG حتى الثاني عشر) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900 font-semibold cursor-pointer"
                  required
                >
                  {SCHOOL_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section with 'و' & Teacher */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  المعلم المشرف والشعبة (شعبة و مضافة) <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 outline-hidden text-slate-900 font-semibold cursor-pointer"
                    required
                  >
                    {DEFAULT_TEACHERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="معلم آخر">معلم آخر</option>
                  </select>

                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-24 px-2 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 outline-hidden text-slate-900 font-bold text-center cursor-pointer"
                    required
                  >
                    {['أ', 'ب', 'ج', 'د', 'هـ', 'و', '1', '2', '3', '4', '5', '6'].map((sec) => (
                      <option key={sec} value={sec}>
                        شعبة {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {teacherName === 'معلم آخر' && (
              <div>
                <input
                  type="text"
                  value={customTeacher}
                  onChange={(e) => setCustomTeacher(e.target.value)}
                  placeholder="اكتب اسم المعلم/ـة المشرف/ـة..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>
            )}

            {/* Quick Section Buttons Strip (مع إضافة شعبة و البارزة) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="font-bold text-slate-600 ml-1">تحديد سريع للشعبة:</span>
              {['أ', 'ب', 'ج', 'د', 'هـ', 'و'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSection(s)}
                  className={`px-3 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                    section === s
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  شعبة {s}
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 font-medium">
                🔒 الحفظ إلزامي لاعتماد الدرجات والربط مع لوحة المعلم.
              </p>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-slate-950" />
                <span>حفظ بيانات الطالب وبدء التجوّل في الأقسام ←</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
