import React, { useState, useEffect } from 'react';
import { StudentProfile, SCHOOL_GRADES, DEFAULT_TEACHERS } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { UserCheck, Sparkles, X, School, BookMarked, HelpCircle, AlertCircle, ShieldAlert } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
  requireToProceed?: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
  requireToProceed = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('الصف التاسع');
  const [section, setSection] = useState('أ');
  const [teacherName, setTeacherName] = useState('');
  const [padletUrl, setPadletUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.fullName || '');
      setGrade(initialProfile.grade || 'الصف التاسع');
      setSection(initialProfile.section || 'أ');
      setTeacherName(initialProfile.teacherName || '');
      setPadletUrl(initialProfile.padletUrl || 'https://padlet.com');
    } else {
      setFullName('');
      setGrade('الصف التاسع');
      setSection('أ');
      setTeacherName('');
      setPadletUrl('https://padlet.com');
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('يرجى كتابة الاسم الكامل للطالب/ـة.');
      return;
    }
    if (!grade.trim()) {
      setError('يرجى تحديد الصف الدراسي (من الكي جي إلى الثاني عشر).');
      return;
    }
    if (!section.trim()) {
      setError('يرجى تحديد الشعبة أو الفصل.');
      return;
    }

    if (!teacherName.trim()) {
      setError('يرجى كتابة اسم المعلم/ـة المشرف/ـة.');
      return;
    }

    setError('');
    const profile: StudentProfile = {
      fullName: fullName.trim(),
      grade: grade.trim(),
      section: section.trim(),
      teacherName: teacherName.trim(),
      padletUrl: padletUrl.trim() || 'https://padlet.com',
      registeredAt: new Date().toISOString(),
    };

    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-800/40 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right my-8"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 text-white relative">
          {!requireToProceed && (
            <button
              onClick={onClose}
              className="absolute left-4 top-4 text-emerald-200 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <SchoolLogo size={52} className="shrink-0 drop-shadow-md" />
            <div>
              <span className="text-[11px] text-amber-300 font-bold block">
                المدارس الأهلية الخاصة - الغبيبة
              </span>
              <h2 className="font-cairo text-xl font-bold">
                {initialProfile && !requireToProceed ? 'تعديل بطاقة الطالب' : 'تسجيل بيانات الطالب للدخول للأقسام'}
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                خطوة إلزامية لربط ومزامنة إنجازك ونتائجك تلقائياً مع قسم المعلم
              </p>
            </div>
          </div>
        </div>

        {/* Warning Gate if required to proceed */}
        {requireToProceed && (
          <div className="bg-amber-50 border-b border-amber-200 p-3.5 px-6 text-xs text-amber-950 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="leading-snug">
              <strong>تنبيه إلزامي: </strong>
              لا يمكن الدخول لأقسام المنصة وأنشطتها التفاعلية قبل تسجيل بياناتك (الاسم، الصف، واسم المعلم) لاعتماد نتائجك.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Student Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              الاسم الكامل للطالب / للطالبة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="اكتب اسم الطالب/ـة الثلاثي أو الرباعي..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900 font-semibold"
              required
              autoFocus
            />
          </div>

          {/* 2. Grade (KG to Grade 12) & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                الصف الدراسي (من الكي جي للثاني عشر) <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900 font-medium cursor-pointer"
                required
              >
                {SCHOOL_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                الشعبة / الفصل <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-6 gap-1 mb-1.5">
                {['أ', 'ب', 'ج', 'د', 'هـ', 'و'].map((secOpt) => (
                  <button
                    key={secOpt}
                    type="button"
                    onClick={() => setSection(secOpt)}
                    className={`py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                      section === secOpt
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    شعبة {secOpt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="أو اكتب شعبتك (مثال: أ أو و أو 6)"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden font-bold"
                required
              />
            </div>
          </div>

          {/* 3. Teacher Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              اسم المعلم/ـة المشرف/ـة <span className="text-rose-500">*</span>
            </label>
            <select
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden transition-all text-slate-900 font-medium cursor-pointer"
              required
            >
              {DEFAULT_TEACHERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="معلم آخر">معلم آخر (كتابة الاسم يدويّاً)</option>
            </select>

            {teacherName === 'معلم آخر' && (
              <input
                type="text"
                value={customTeacher}
                onChange={(e) => setCustomTeacher(e.target.value)}
                placeholder="اكتب اسم المعلم/ـة المشرف/ـة هنا..."
                className="w-full mt-2 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 outline-hidden text-slate-900 font-medium"
                required
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {!requireToProceed && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            )}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>حفظ البيانات ومتابعة الدخول للأقسام ←</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
