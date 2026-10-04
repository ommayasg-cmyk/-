import React from 'react';
import { StudentProfile, MainSectionId } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { Lock, Feather, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

interface HeaderProps {
  student: StudentProfile | null;
  activeSection: MainSectionId | 'home';
  onSelectSection: (section: MainSectionId | 'home') => void;
  onOpenProfileModal: () => void;
  onOpenTeacherModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  activeSection,
  onSelectSection,
  onOpenProfileModal,
  onOpenTeacherModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectSection('home')}
          className="flex items-center gap-3 text-right hover:opacity-90 transition-opacity cursor-pointer group"
          title="العودة للرئيسية"
        >
          <SchoolLogo size={46} className="shrink-0" />
          <div>
            <span className="font-cairo text-xl font-black text-slate-900 tracking-tight block">
              كنوز اللغة العربية
            </span>
            <span className="text-[10px] text-emerald-800 font-bold block -mt-1">
              المدارس الأهلية الخاصة - الغبيبة
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onSelectSection('home')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'home'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onSelectSection('nahw')}
            className={`transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              activeSection === 'nahw'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            <span>النحو العربي</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">جديد</span>
          </button>
          <button
            onClick={() => onSelectSection('i3rab')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'i3rab'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            الإعراب
          </button>
          <button
            onClick={() => onSelectSection('imlaa')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'imlaa'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            الإملاء
          </button>
          <button
            onClick={() => onSelectSection('mojam')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'mojam'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            المعاجم
          </button>
          <button
            onClick={() => onSelectSection('balagha')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'balagha'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            البلاغة
          </button>
          <button
            onClick={() => onSelectSection('arood')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'arood'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            العَروض
          </button>
          <button
            onClick={() => onSelectSection('mawdou')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'mawdou'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            الموضوع المتميز
          </button>
          <button
            onClick={() => onSelectSection('smart-reader')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'smart-reader'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            القارئ الذكي
          </button>
          <button
            onClick={() => onSelectSection('assessment')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'assessment'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900'
            }`}
          >
            التقويم الشامل
          </button>
        </nav>

        {/* Zone 3: Actions (Teacher Section + Student Profile) */}
        <div className="flex items-center gap-2.5">
          {/* TEACHER CODE BUTTON - ALWAYS VISIBLE WITH LOCK ICON */}
          <button
            onClick={onOpenTeacherModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeSection === 'teacher-history'
                ? 'bg-slate-900 text-amber-300 border-slate-900'
                : 'bg-slate-800 hover:bg-slate-900 text-white border-slate-700'
            }`}
            title="سجل نتائج الطلبة - خاص بالمعلم المشرف"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>سجل النتائج (المعلم)</span>
          </button>

          {/* Student Profile Button / Badge - قسم الطالب */}
          {student && student.fullName && !student.fullName.includes('سيما') && !student.fullName.toLowerCase().includes('sima') ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl p-1.5 px-3 border border-emerald-300 transition-colors cursor-pointer"
              title="قسم الطالب - عرض وتعديل بياناتك"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-emerald-950 block truncate max-w-[130px]">
                  {student.fullName}
                </span>
                <span className="text-[10px] text-emerald-700 block truncate max-w-[130px]">
                  {student.grade} ({student.section})
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <span>قسم الطالب (تسجيل الدخول)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Scroll */}
      <div className="xl:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/80 text-xs font-semibold gap-2">
        <button
          onClick={() => onSelectSection('home')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'home' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => onSelectSection('nahw')}
          className={`shrink-0 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${activeSection === 'nahw' ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-900'}`}
        >
          <span>النحو العربي</span>
          <span className="text-[8px] bg-amber-400 text-slate-900 px-1 py-0.2 rounded-full font-bold">جديد</span>
        </button>
        <button
          onClick={() => onSelectSection('i3rab')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'i3rab' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          الإعراب
        </button>
        <button
          onClick={() => onSelectSection('imlaa')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'imlaa' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          الإملاء
        </button>
        <button
          onClick={() => onSelectSection('mojam')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'mojam' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          المعاجم
        </button>
        <button
          onClick={() => onSelectSection('balagha')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'balagha' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          البلاغة
        </button>
        <button
          onClick={() => onSelectSection('arood')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'arood' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          العَروض
        </button>
        <button
          onClick={() => onSelectSection('mawdou')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'mawdou' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          الموضوع المتميز
        </button>
        <button
          onClick={() => onSelectSection('smart-reader')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'smart-reader' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          القارئ الذكي
        </button>
        <button
          onClick={() => onSelectSection('assessment')}
          className={`shrink-0 px-2.5 py-1 rounded-lg ${activeSection === 'assessment' ? 'bg-emerald-800 text-white' : 'text-slate-700'}`}
        >
          التقويم الشامل
        </button>
        <button
          onClick={onOpenTeacherModal}
          className={`shrink-0 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold ${activeSection === 'teacher-history' ? 'bg-slate-900 text-amber-300' : 'bg-slate-700 text-white'}`}
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>قسم المعلم</span>
        </button>
      </div>
    </header>
  );
};
