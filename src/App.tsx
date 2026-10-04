/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  MainSectionId, 
  Question, 
  ResultHistoryItem, 
  StudentActivityLog,
  PADLET_LINKS 
} from './types';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentProfileModal } from './components/StudentProfileModal';
import { TeacherCodeModal } from './components/TeacherCodeModal';
import { ResultsHistoryView } from './components/ResultsHistoryView';
import { QuizView } from './components/QuizView';
import { LexiconExplorer } from './components/LexiconExplorer';
import { AIToolsView } from './components/AIToolsView';
import { NahwSectionController } from './components/nahw/NahwSectionController';

import { generateRenewableGrammarQuestions } from './data/grammarQuestions';
import { generateRenewableSpellingQuestions } from './data/spellingQuestions';
import { generateRenewableRhetoricQuestions } from './data/rhetoricQuestions';
import { generateRenewableLexiconQuestions } from './data/lexiconQuestions';
import { generateRenewableAroodQuestions } from './data/aroodQuestions';

const PROFILE_STORAGE_KEY = 'kanooz_student_profile';
const RESULTS_STORAGE_KEY = 'kanooz_results_history';

export default function App() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [requireProfileModal, setRequireProfileModal] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  
  // Navigation state between the 9 sections
  const [activeSection, setActiveSection] = useState<MainSectionId | 'home'>('home');

  // Renewable questions state
  const [grammarQuestions, setGrammarQuestions] = useState<Question[]>([]);
  const [spellingQuestions, setSpellingQuestions] = useState<Question[]>([]);
  const [rhetoricQuestions, setRhetoricQuestions] = useState<Question[]>([]);
  const [lexiconQuestions, setLexiconQuestions] = useState<Question[]>([]);
  const [aroodQuestions, setAroodQuestions] = useState<Question[]>([]);

  // Custom generated quiz from Assessment or AI
  const [customQuizData, setCustomQuizData] = useState<{
    questions: Question[];
    title: string;
  } | null>(null);

  // Sub-view for Lexicon
  const [lexiconSubView, setLexiconSubView] = useState<'explorer' | 'quiz'>('explorer');

  // Load student profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // سيما هي معدة ومطورة التطبيق وليست طالبة - مسح أي تسجيل سابق يحمل اسمها
        if (parsed?.fullName && (parsed.fullName.includes('سيما') || parsed.fullName.toLowerCase().includes('sima'))) {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
          setStudent(null);
        } else if (parsed && parsed.fullName && parsed.grade && parsed.teacherName) {
          setStudent(parsed);
        } else {
          setStudent(null);
        }
      }
    } catch (e) {
      console.error('Failed to load profile', e);
      setStudent(null);
    }

    // Clean out old mock seed entries from results history
    try {
      const storedResults = localStorage.getItem(RESULTS_STORAGE_KEY);
      if (storedResults) {
        const parsed: ResultHistoryItem[] = JSON.parse(storedResults);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (item) =>
              !['res-1', 'res-2', 'res-3', 'res-4', 'res-5'].includes(item.id) &&
              !['مريم عبد الله المهيري', 'عبد الرحمن خالد', 'فاطمة عمر الزهراء', 'يوسف أحمد المنصور'].includes(item.studentName)
          );
          localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(cleaned));
        }
      }
    } catch (e) {
      console.error('Failed to cleanup old mock results', e);
    }

    // Initialize all renewable question banks
    setGrammarQuestions(generateRenewableGrammarQuestions(5));
    setSpellingQuestions(generateRenewableSpellingQuestions(5));
    setRhetoricQuestions(generateRenewableRhetoricQuestions(5));
    setLexiconQuestions(generateRenewableLexiconQuestions(5));
    setAroodQuestions(generateRenewableAroodQuestions(5));
  }, []);

  const [pendingSection, setPendingSection] = useState<MainSectionId | null>(null);

  // Log student entry to section in activity history (مزامنة دخول الطالب للأقسام مع قسم المعلم)
  const logStudentSectionEntry = (secId: MainSectionId, prof: StudentProfile) => {
    try {
      const titles: Record<string, string> = {
        'nahw': 'قسم النحو العربي الشامل',
        'i3rab': 'قسم الإعراب والنحو',
        'imlaa': 'قسم الإملاء والترقيم',
        'mojam': 'قسم المعاجم والبحث اللغوي',
        'balagha': 'قسم البلاغة والبيان',
        'arood': 'قسم العَروض والقوافي',
        'mawdou': 'الموضوع المتميز (التدقيق اللغوي)',
        'smart-reader': 'القارئ الذكي (التحليل الصوتي)',
        'assessment': 'التقويم الشامل',
      };
      const logItem: StudentActivityLog = {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        studentName: prof.fullName,
        studentClass: prof.grade,
        studentSection: prof.section,
        teacherName: prof.teacherName,
        sectionId: secId,
        sectionTitle: titles[secId] || secId,
        timestamp: new Date().toISOString(),
        activityType: 'دخول وتدريب',
        details: `سجّل الطالب دخولاً وبدأ التدريب والتفاعل في ${titles[secId] || secId}`,
      };

      const stored = localStorage.getItem('kanooz_activity_history');
      const logs: StudentActivityLog[] = stored ? JSON.parse(stored) : [];
      const updated = [logItem, ...logs].slice(0, 150);
      localStorage.setItem('kanooz_activity_history', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to log student activity', err);
    }
  };

  const handleSaveProfile = (profile: StudentProfile) => {
    setStudent(profile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
    setIsProfileModalOpen(false);
    setRequireProfileModal(false);

    // If student attempted to enter a section before registering, navigate to it now!
    if (pendingSection) {
      logStudentSectionEntry(pendingSection, profile);
      setActiveSection(pendingSection);
      if (pendingSection === 'mojam') setLexiconSubView('explorer');
      if (pendingSection !== 'assessment') setCustomQuizData(null);
      setPendingSection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearProfile = () => {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear profile', e);
    }
    setStudent(null);
  };

  const handleRequireProfile = () => {
    setRequireProfileModal(true);
    setIsProfileModalOpen(true);
  };

  // Navigation Guard: No student can enter ANY section before saving full profile!
  const handleNavigateSection = (sec: MainSectionId | 'home') => {
    if (sec === 'home' || sec === 'teacher-history') {
      setActiveSection(sec);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Strict profile gate: Full name, Grade (from KG to 12), and Teacher name required!
    if (!student || !student.fullName?.trim() || !student.grade?.trim() || !student.teacherName?.trim()) {
      setPendingSection(sec);
      setRequireProfileModal(true);
      setIsProfileModalOpen(true);
      return;
    }

    // Log student section visit to teacher activity history
    logStudentSectionEntry(sec, student);

    setActiveSection(sec);
    if (sec === 'mojam') setLexiconSubView('explorer');
    if (sec !== 'assessment') setCustomQuizData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Record result into Teacher History and Activity Log
  const handleRecordResult = (result: ResultHistoryItem) => {
    try {
      const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
      let list: ResultHistoryItem[] = stored ? JSON.parse(stored) : [];
      list = list.filter(
        (item) =>
          !['res-1', 'res-2', 'res-3', 'res-4', 'res-5'].includes(item.id) &&
          !['مريم عبد الله المهيري', 'عبد الرحمن خالد', 'فاطمة عمر الزهراء', 'يوسف أحمد المنصور'].includes(item.studentName)
      );
      const updated = [result, ...list];
      localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(updated));

      // Append to student activity log for teacher oversight
      const logItem: StudentActivityLog = {
        id: `act-res-${Date.now()}`,
        studentName: result.studentName,
        studentClass: result.studentClass,
        studentSection: result.studentSection,
        teacherName: result.teacherName,
        sectionId: result.category || 'quiz',
        sectionTitle: result.lesson,
        timestamp: result.date,
        activityType: 'إنجاز اختبار',
        details: `أتمّ الطالب حل النشاط وحصل على نتيجة ${result.score} من ${result.total} (${result.percentage}%)`,
        scoreText: `${result.score}/${result.total} (${result.percentage}%)`
      };
      const storedLogs = localStorage.getItem('kanooz_activity_history');
      const logs: StudentActivityLog[] = storedLogs ? JSON.parse(storedLogs) : [];
      localStorage.setItem('kanooz_activity_history', JSON.stringify([logItem, ...logs].slice(0, 150)));
    } catch (e) {
      console.error('Failed to append to history', e);
    }
  };

  // Question renewal functions
  const handleRenewGrammar = () => setGrammarQuestions(generateRenewableGrammarQuestions(5));
  const handleRenewSpelling = () => setSpellingQuestions(generateRenewableSpellingQuestions(5));
  const handleRenewRhetoric = () => setRhetoricQuestions(generateRenewableRhetoricQuestions(5));
  const handleRenewLexicon = () => setLexiconQuestions(generateRenewableLexiconQuestions(5));
  const handleRenewArood = () => setAroodQuestions(generateRenewableAroodQuestions(5));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-cairo antialiased selection:bg-emerald-700 selection:text-white">
      {/* Header with Navigation and Teacher Section access */}
      <Header
        student={student}
        activeSection={activeSection}
        onSelectSection={handleNavigateSection}
        onOpenProfileModal={() => {
          setRequireProfileModal(false);
          setIsProfileModalOpen(true);
        }}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {/* 0. Home / Dashboard */}
        {activeSection === 'home' && (
          <Dashboard
            student={student}
            onSelectSection={handleNavigateSection}
            onSaveProfile={handleSaveProfile}
            onOpenProfileModal={() => {
              setRequireProfileModal(false);
              setIsProfileModalOpen(true);
            }}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
            onClearProfile={handleClearProfile}
          />
        )}

        {/* النحو العربي (القسم الشامل المطور بالذكاء الاصطناعي) */}
        {activeSection === 'nahw' && (
          <NahwSectionController
            student={student}
            onRequireProfile={handleRequireProfile}
            onBackToMain={() => setActiveSection('home')}
            onRecordResult={handleRecordResult}
          />
        )}

        {/* 1. الإعراب */}
        {activeSection === 'i3rab' && (
          <QuizView
            category="grammar"
            categoryTitle="قسم الإعراب والنحو والتراكيب"
            categoryDescription="دروس وتطبيقات عملية متجددة على إعراب الكلمة، المبني والمعرب، علامات الإعراب، كان وإن، الفاعل ونائبه، والممنوع من الصرف."
            questions={grammarQuestions}
            student={student}
            padletUrl={PADLET_LINKS.i3rab}
            onRenewQuestions={handleRenewGrammar}
            onRequireProfile={handleRequireProfile}
            onBackToHome={() => setActiveSection('home')}
            onRecordResult={handleRecordResult}
          />
        )}

        {/* 2. الإملاء */}
        {activeSection === 'imlaa' && (
          <QuizView
            category="spelling"
            categoryTitle="قسم الإملاء والرسم الكتابي والترقيم"
            categoryDescription="قواعد وتدريبات متجددة على اللام الشمسية والقمرية، همزات الوصل والقطع، الهمزة المتوسطة والمتطرفة، الألف اللينة، والتاء المربوطة والمبسوطة."
            questions={spellingQuestions}
            student={student}
            padletUrl={PADLET_LINKS.imlaa}
            onRenewQuestions={handleRenewSpelling}
            onRequireProfile={handleRequireProfile}
            onBackToHome={() => setActiveSection('home')}
            onRecordResult={handleRecordResult}
          />
        )}

        {/* 3. المعاجم */}
        {activeSection === 'mojam' && (
          <div>
            {lexiconSubView === 'explorer' ? (
              <LexiconExplorer
                onStartQuiz={() => {
                  setLexiconSubView('quiz');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : (
              <div className="space-y-4">
                <div className="max-w-5xl mx-auto px-4 pt-4">
                  <button
                    onClick={() => setLexiconSubView('explorer')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>← العودة إلى كاشف الجذور والمعاجم</span>
                  </button>
                </div>
                <QuizView
                  category="lexicon"
                  categoryTitle="قسم المعاجم والبحث اللغوي"
                  categoryDescription="تطبيقات عملية متجددة على تحضير الكلمة وتجريدها من حروف الزيادة، فك الإدغام، والبحث بنظامي الأوائل والأواخر."
                  questions={lexiconQuestions}
                  student={student}
                  padletUrl={PADLET_LINKS.mojam}
                  onRenewQuestions={handleRenewLexicon}
                  onRequireProfile={handleRequireProfile}
                  onBackToHome={() => setActiveSection('home')}
                  onRecordResult={handleRecordResult}
                />
              </div>
            )}
          </div>
        )}

        {/* 4. البلاغة */}
        {activeSection === 'balagha' && (
          <QuizView
            category="rhetoric"
            categoryTitle="قسم البلاغة وفنون الأدب"
            categoryDescription="علم المعاني (الخبر والإنشاء والقصر)، علم البيان (التشبيه والاستعارة والكناية والمجاز المرسل)، وعلم البديع (المحسنات اللفظية والمعنوية)."
            questions={rhetoricQuestions}
            student={student}
            padletUrl={PADLET_LINKS.balagha}
            onRenewQuestions={handleRenewRhetoric}
            onRequireProfile={handleRequireProfile}
            onBackToHome={() => setActiveSection('home')}
            onRecordResult={handleRecordResult}
          />
        )}

        {/* 5. العَروض */}
        {activeSection === 'arood' && (
          <QuizView
            category="arood"
            categoryTitle="قسم العَروض وموسيقى الشعر العربي"
            categoryDescription="أوزان البحور الشعرية الخليلية (الطويل، البسيط، الكامل، الوافر، الرمل، الرجز، السريع) والتفاعيل والكتابة العروضية."
            questions={aroodQuestions}
            student={student}
            padletUrl={PADLET_LINKS.arood}
            onRenewQuestions={handleRenewArood}
            onRequireProfile={handleRequireProfile}
            onBackToHome={() => setActiveSection('home')}
            onRecordResult={handleRecordResult}
          />
        )}

        {/* 6. الموضوع المتميز (المصحح اللغوي) */}
        {activeSection === 'mawdou' && (
          <div className="space-y-6">
            <AIToolsView
              student={student}
              initialSubTab="proofreader"
              onRecordResult={handleRecordResult}
              onLaunchGeneratedQuiz={(questions, title) => {
                setCustomQuizData({ questions, title });
                setActiveSection('assessment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* 7. القارئ الذكي */}
        {activeSection === 'smart-reader' && (
          <div className="space-y-6">
            <AIToolsView
              student={student}
              initialSubTab="reader"
              onRecordResult={handleRecordResult}
              onLaunchGeneratedQuiz={(questions, title) => {
                setCustomQuizData({ questions, title });
                setActiveSection('assessment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* 8. التقويم الشامل */}
        {activeSection === 'assessment' && (
          <div>
            {customQuizData ? (
              <div className="space-y-4">
                <div className="max-w-5xl mx-auto px-4 pt-4">
                  <button
                    onClick={() => setCustomQuizData(null)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>← العودة إلى منشئ التقويم الشامل</span>
                  </button>
                </div>
                <QuizView
                  category="ai-tools"
                  categoryTitle={customQuizData.title}
                  categoryDescription="اختبار شامل تم إنشاؤه مخصصاً بناءً على النص والمهارات المحددة."
                  questions={customQuizData.questions}
                  student={student}
                  padletUrl={PADLET_LINKS.assessment}
                  onRenewQuestions={() => setCustomQuizData(null)}
                  onRequireProfile={handleRequireProfile}
                  onBackToHome={() => setActiveSection('home')}
                  onRecordResult={handleRecordResult}
                />
              </div>
            ) : (
              <AIToolsView
                student={student}
                initialSubTab="quizgen"
                onRecordResult={handleRecordResult}
                onLaunchGeneratedQuiz={(questions, title) => {
                  setCustomQuizData({ questions, title });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        {/* 9. سجل النتائج (قسم المعلم المحمي بالرمز 1111) */}
        {activeSection === 'teacher-history' && (
          <ResultsHistoryView
            onBackToHome={() => setActiveSection('home')}
          />
        )}
      </main>

      {/* School Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-slate-500 text-xs text-center" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-cairo">كنوز اللغة العربية</span>
            <span>·</span>
            <span>المدارس الأهلية الخاصة - الغبيبة</span>
            <span>·</span>
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="text-amber-700 hover:underline font-bold mr-1 cursor-pointer"
            >
              (قسم المعلم)
            </button>
          </div>
          <div>
            <span>المدارس الأهلية الخاصة - الغبيبة · إعداد: الطالبة سيما محمد كحول · إشراف: أ/ بلسم جرّار · أ/ غادة الجاسم (معلمة اللغة العربية) · د/ وسام عبد العال</span>
          </div>
        </div>
      </footer>

      {/* Student Profile Registration / Edit Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          if (!requireProfileModal) {
            setIsProfileModalOpen(false);
          }
        }}
        onSave={handleSaveProfile}
        initialProfile={student}
        requireToProceed={requireProfileModal}
      />

      {/* Teacher Security Code Modal (Passcode: 1111) */}
      <TeacherCodeModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSuccess={() => {
          setIsTeacherModalOpen(false);
          setActiveSection('teacher-history');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
