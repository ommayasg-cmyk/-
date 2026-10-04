import React, { useEffect, useRef, useState } from 'react';
import { ResultHistoryItem, StudentActivityLog, PADLET_LINKS } from '../types';
import { NahwQuizAttempt, GrammarDifficulty } from '../types/nahw';
import { NAHW_SECTIONS } from '../data/nahwSections';
import { Chart, registerables } from 'chart.js';
import { StudentFeedbackModal } from './StudentFeedbackModal';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  ArrowLeft, 
  Download, 
  FileSpreadsheet, 
  Sparkles, 
  Users, 
  Award, 
  TrendingUp,
  ShieldCheck,
  RotateCw,
  FileText,
  Eye,
  CheckCircle2,
  LogIn,
  Activity,
  Clock,
  BookOpen,
  Bot,
  PlusCircle,
  Check,
  Edit3
} from 'lucide-react';

Chart.register(...registerables);

interface ResultsHistoryViewProps {
  onBackToHome: () => void;
  onRefreshData?: () => void;
}

const STORAGE_KEY = 'kanooz_results_history';
const ACTIVITY_STORAGE_KEY = 'kanooz_activity_history';
const NAHW_ATTEMPTS_STORAGE_KEY = 'kanooz_nahw_attempts';

export const ResultsHistoryView: React.FC<ResultsHistoryViewProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'results' | 'activity' | 'nahw-analytics'>('results');
  const [history, setHistory] = useState<ResultHistoryItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<StudentActivityLog[]>([]);
  const [nahwAttempts, setNahwAttempts] = useState<NahwQuizAttempt[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResultHistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Teacher AI Quiz Generator State
  const [genSectionIdx, setGenSectionIdx] = useState(0);
  const [genTopicIdx, setGenTopicIdx] = useState(0);
  const [genDifficulty, setGenDifficulty] = useState<GrammarDifficulty>('متوسط');
  const [genCount, setGenCount] = useState(5);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [quizPublishSuccess, setQuizPublishSuccess] = useState('');

  // Load from localStorage & clean any mock seed data
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const realResults = parsed.filter(
            (item) =>
              !['res-1', 'res-2', 'res-3', 'res-4', 'res-5'].includes(item.id) &&
              !['مريم عبد الله المهيري', 'عبد الرحمن خالد', 'فاطمة عمر الزهراء', 'يوسف أحمد المنصور'].includes(item.studentName)
          );
          setHistory(realResults);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(realResults));
          return;
        }
      }
      setHistory([]);
    } catch (e) {
      console.error('Failed to load history', e);
      setHistory([]);
    }
  };

  const loadActivityLogs = () => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setActivityLogs(parsed);
          return;
        }
      }
      setActivityLogs([]);
    } catch (e) {
      setActivityLogs([]);
    }
  };

  const loadNahwAttempts = () => {
    try {
      const stored = localStorage.getItem(NAHW_ATTEMPTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNahwAttempts(parsed);
          return;
        }
      }
      setNahwAttempts([]);
    } catch (e) {
      setNahwAttempts([]);
    }
  };

  const handleGenerateTeacherQuiz = async () => {
    const sec = NAHW_SECTIONS[genSectionIdx] || NAHW_SECTIONS[0];
    const top = sec.topics[genTopicIdx] || sec.topics[0];
    setIsGeneratingQuiz(true);
    setQuizPublishSuccess('');
    try {
      const res = await fetch('/api/ai/generate-grammar-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: sec.title,
          topicTitle: top.title,
          difficulty: genDifficulty,
          count: genCount,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
      } else {
        alert('تعذر التوليد السحابي حالياً، يرجى إعادة المحاولة.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  useEffect(() => {
    loadHistory();
    loadActivityLogs();
    loadNahwAttempts();
  }, []);

  // Update chart whenever history changes
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const levels = {
      'ممتاز (90+)': 0,
      'جيد جداً (80-89)': 0,
      'جيد (70-79)': 0,
      'مقبول (50-69)': 0,
      'يحتاج تحسين (<50)': 0,
    };

    history.forEach((res) => {
      if (res.percentage >= 90) levels['ممتاز (90+)']++;
      else if (res.percentage >= 80) levels['جيد جداً (80-89)']++;
      else if (res.percentage >= 70) levels['جيد (70-79)']++;
      else if (res.percentage >= 50) levels['مقبول (50-69)']++;
      else levels['يحتاج تحسين (<50)']++;
    });

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(levels),
        datasets: [
          {
            label: 'عدد الطلبة',
            data: Object.values(levels),
            backgroundColor: [
              '#059669', // Emerald
              '#0284c7', // Sky
              '#d97706', // Amber
              '#ea580c', // Orange
              '#dc2626', // Red
            ],
            borderColor: '#ffffff',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Cairo',
                size: 11,
              },
              boxWidth: 12,
              padding: 12,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [history]);

  const handleClearHistory = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع النتائج المسجلة في السجل نهائياً؟')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setHistory([]);
    }
  };

  const handleClearActivity = () => {
    if (window.confirm('هل أنت متأكد من مسح سجل نشاط وحركات دخول الطلبة؟')) {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([]));
      setActivityLogs([]);
    }
  };

  const handleDeleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert('لا توجد نتائج لتصديرها.');
      return;
    }

    const headers = ['اسم الطالب/ة', 'الصف', 'الشعبة', 'المعلم/ة المشرف/ة', 'الدرس', 'الدرجة', 'المجموع', 'النسبة المئوية', 'التاريخ والوقت'];
    const rows = history.map((item) => [
      `"${item.studentName}"`,
      `"${item.studentClass || ''}"`,
      `"${item.studentSection || ''}"`,
      `"${item.teacherName || ''}"`,
      `"${item.lesson}"`,
      item.score,
      item.total,
      `${item.percentage}%`,
      `"${new Date(item.date).toLocaleString('ar-AE')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `سجل_نتائج_كنوز_اللغة_العربية_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // KPIs
  const totalSubmissions = history.length;
  const avgPercentage = totalSubmissions > 0
    ? Math.round(history.reduce((acc, cur) => acc + cur.percentage, 0) / totalSubmissions)
    : 0;
  const highAchievers = history.filter((h) => h.percentage >= 90).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={onBackToHome}
                className="text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>الرئيسية</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
              <span className="text-slate-500">/</span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>لوحة تحكم المعلم المشرف المعتمدة</span>
              </span>
            </div>
            <h1 className="font-cairo text-2xl sm:text-3xl font-black text-white">
              سجل نتائج ودخول الطلبة المتزامن
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              متابعة مباشرة ومزامنة لحظية لدخول الطلاب للأقسام، نتائج تقييماتهم، والتغذية الراجعة مع إمكانية التصدير كصور وPDF.
            </p>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={PADLET_LINKS.all}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>بادلت النتائج الشامل</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            </a>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير Excel (CSV)</span>
            </button>
          </div>
        </div>

        {/* School Recognition Ribbon */}
        <div className="mt-6 pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <span>المدارس الأهلية الخاصة - الغبيبة</span>
          <span>إشراف: د/ وسام عبد العال · أ/ بلسم حسني جرّار · أ/ غادة الجاسم (معلمة اللغة العربية)</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">إجمالي نتائج الاختبارات</span>
            <span className="font-cairo text-3xl font-black text-slate-900 mt-1 block tabular-nums">
              {totalSubmissions}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">حركات ودخول الأقسام</span>
            <span className="font-cairo text-3xl font-black text-slate-900 mt-1 block tabular-nums">
              {activityLogs.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">متوسط الدرجات العام</span>
            <span className="font-cairo text-3xl font-black text-teal-800 mt-1 block tabular-nums">
              {avgPercentage}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">وسام الامتياز (90%+)</span>
            <span className="font-cairo text-3xl font-black text-amber-600 mt-1 block tabular-nums">
              {highAchievers}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Results vs Section Activity Entry Log */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          onClick={() => setActiveTab('results')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'results'
              ? 'border-emerald-800 text-emerald-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-700" />
          <span>سجل نتائج وتقييمات الاختبارات ({history.length})</span>
        </button>

        <button
          onClick={() => {
            loadActivityLogs();
            setActiveTab('activity');
          }}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'activity'
              ? 'border-amber-500 text-amber-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-600" />
          <span>سجل نشاط وحركات دخول الطلبة للأقسام ({activityLogs.length})</span>
        </button>

        <button
          onClick={() => {
            loadNahwAttempts();
            setActiveTab('nahw-analytics');
          }}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'nahw-analytics'
              ? 'border-teal-700 text-teal-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-700" />
          <span>تحليلات النحو العربي وتوليد الاختبارات</span>
        </button>
      </div>

      {/* TAB 1: RESULTS TABLE & CHART */}
      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Column (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-cairo text-lg font-bold text-slate-900">
                  سجل نتائج الطلاب المعتمد
                </h2>
                <p className="text-xs text-slate-500">
                  يتم رصد ومزامنة نتيجة الطالب فورياً بمجرد إكمال أي نشاط أو اختبار
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadHistory}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="تحديث البيانات"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                    title="مسح كافة النتائج"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح السجل</span>
                  </button>
                )}
              </div>
            </div>

            {/* Table / Empty State */}
            {history.length === 0 ? (
              <div className="p-10 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 my-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="font-cairo text-base font-bold text-slate-900">
                  لا توجد نتائج مسجلة حتى الآن
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  تمت مزامنة البوابة بنجاح. بمجرد أن يقوم الطالب بحل أي نشاط أو اختبار في أقسام التطبيق والضغط على «تحقق من جميع الإجابات»، ستظهر نتيجته وشهادته وتغذيته الراجعة هنا فوراً مع إمكانية تصديرها كصورة أو PDF.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-bold">الطالب/ـة</th>
                      <th className="p-3 font-bold">الصف والشعبة</th>
                      <th className="p-3 font-bold">المعلم/ـة</th>
                      <th className="p-3 font-bold">المبحث / الدرس</th>
                      <th className="p-3 font-bold text-center">الدرجة</th>
                      <th className="p-3 font-bold text-center">النسبة</th>
                      <th className="p-3 font-bold text-center">الشهادة والتغذية</th>
                      <th className="p-3 font-bold text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{item.studentName}</td>
                        <td className="p-3 text-slate-600">
                          {item.studentClass || '-'} {item.studentSection ? `(${item.studentSection})` : ''}
                        </td>
                        <td className="p-3 text-slate-600">{item.teacherName || '-'}</td>
                        <td className="p-3 font-medium text-emerald-800">{item.lesson}</td>
                        <td className="p-3 text-center font-bold tabular-nums">
                          {item.score} / {item.total}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold tabular-nums text-[11px] ${
                              item.percentage >= 90
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.percentage >= 70
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.percentage}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedResult(item);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                            title="عرض التغذية الراجعة والشهادة وتصديرها كصورة أو PDF"
                          >
                            <Award className="w-3.5 h-3.5 text-slate-900" />
                            <span>صورة / PDF</span>
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                            title="حذف هذه النتيجة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Chart Column (1 col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-cairo text-base font-bold text-slate-900 mb-1">
                توزيع مستويات الأداء العام
              </h3>
              <p className="text-xs text-slate-500">
                رسم بياني لنسب التميز ومستويات الطلاب المسجلين
              </p>
            </div>

            <div className="relative h-64 w-full">
              <canvas ref={chartCanvasRef} />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">إرشادات المعلم:</span>
              <p>
                اضغط على زر <strong>«صورة / PDF»</strong> أمام أي طالب لاستعراض شهادته والتغذية الراجعة وتصديرها مباشرة لإرفاقها في Padlet أو طباعتها.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT SECTION ENTRY & ACTIVITY LOG */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-cairo text-lg font-bold text-slate-900 flex items-center gap-2">
                <LogIn className="w-5 h-5 text-amber-600" />
                <span>سجل مزامنة دخول وحركات الطلبة بالأقسام</span>
              </h2>
              <p className="text-xs text-slate-500">
                توثيق فوري لكل طالب يقوم بالدخول لأقسام المنصة وبدء التمارين
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadActivityLogs}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="تحديث سجل الحركات"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              {activityLogs.length > 0 && (
                <button
                  onClick={handleClearActivity}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                  title="مسح سجل الحركات"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>مسح سجل الحركات</span>
                </button>
              )}
            </div>
          </div>

          {activityLogs.length === 0 ? (
            <div className="p-10 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 my-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="font-cairo text-base font-bold text-slate-900">
                لا توجد حركات مسجلة حالياً
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                بمجرد أن يسجل الطالب بياناته وينقر للدخول على أي قسم (الإعراب، الإملاء، المعاجم، البلاغة، العروض، الموضوع المتميز، القارئ الذكي، أو التقويم الشامل)، سيتم تسجيل حركته وتاريخ دخوله ونشاطه هنا في نفس اللحظة.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-bold">الطالب/ـة</th>
                    <th className="p-3 font-bold">الصف والشعبة</th>
                    <th className="p-3 font-bold">المعلم/ـة المشرف/ـة</th>
                    <th className="p-3 font-bold">القسم / النشاط</th>
                    <th className="p-3 font-bold text-center">نوع الحركة</th>
                    <th className="p-3 font-bold">التفاصيل والنتيجة</th>
                    <th className="p-3 font-bold text-center">الوقت والتاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{log.studentName}</td>
                      <td className="p-3 text-slate-600">
                        {log.studentClass} ({log.studentSection})
                      </td>
                      <td className="p-3 text-slate-600">{log.teacherName}</td>
                      <td className="p-3 font-semibold text-emerald-900">
                        {log.sectionTitle}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            log.activityType === 'إنجاز اختبار'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {log.activityType}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {log.details}
                      </td>
                      <td className="p-3 text-center text-slate-500 tabular-nums">
                        {new Date(log.timestamp).toLocaleString('ar-AE', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NAHW ANALYTICS & TEACHER AI QUIZ GENERATOR */}
      {activeTab === 'nahw-analytics' && (
        <div className="space-y-6">
          {/* AI Quiz Generator for Teachers (الرابع عشر والخامس عشر) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-700/30 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-cairo text-lg font-bold text-slate-900">
                  لوحة المعلم لتوليد اختبارات النحو بالذكاء الاصطناعي
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                يمكن للمعلم اختيار أي قسم وموضوع من أقسام النحو وتوليد أسئلة متجددة، ثم مراجعتها وتعديلها واعتمادها قبل نشرها للطلاب.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">القسم الرئيسي:</label>
                <select
                  value={genSectionIdx}
                  onChange={(e) => {
                    setGenSectionIdx(Number(e.target.value));
                    setGenTopicIdx(0);
                  }}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer"
                >
                  {NAHW_SECTIONS.map((sec, idx) => (
                    <option key={sec.id} value={idx}>{sec.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الموضوع الفرعي:</label>
                <select
                  value={genTopicIdx}
                  onChange={(e) => setGenTopicIdx(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer"
                >
                  {(NAHW_SECTIONS[genSectionIdx]?.topics || []).map((t, idx) => (
                    <option key={t.id} value={idx}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">مستوى الصعوبة:</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value as GrammarDifficulty)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer"
                >
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">عدد الأسئلة:</label>
                <select
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer"
                >
                  <option value={5}>5 أسئلة</option>
                  <option value={10}>10 أسئلة</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateTeacherQuiz}
                disabled={isGeneratingQuiz}
                className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingQuiz ? 'جاري التوليد بالذكاء الاصطناعي...' : 'توليد الأسئلة للمراجعة والاعتماد'}</span>
              </button>
            </div>

            {/* Questions Review Strip */}
            {generatedQuestions.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">
                    تم توليد {generatedQuestions.length} أسئلة - يرجى مراجعتها وتعديلها إن لزم:
                  </span>
                  <button
                    onClick={() => {
                      setQuizPublishSuccess('تم اعتماد ونشر الاختبار بنجاح في بنك أسئلة الطلاب!');
                      setTimeout(() => setQuizPublishSuccess(''), 4000);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>اعتماد ونشر الاختبار للطلاب</span>
                  </button>
                </div>

                {quizPublishSuccess && (
                  <div className="p-3 text-xs bg-emerald-100 text-emerald-900 rounded-xl font-bold">
                    {quizPublishSuccess}
                  </div>
                )}

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {generatedQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-900 block">{idx + 1}. {q.prompt}</span>
                      {q.sentence && <span className="text-slate-600 block">الشاهد: «{q.sentence}»</span>}
                      <span className="text-emerald-800 font-medium block">الإجابة المعتمدة: {q.options ? q.options[q.correctAnswer] : ''}</span>
                      <span className="text-slate-500 text-[11px] block">{q.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Grammar Attempts Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-cairo text-lg font-bold text-slate-900">
                  سجل محاولات واختبارات الطلاب في النحو العربي ({nahwAttempts.length})
                </h3>
                <p className="text-xs text-slate-500">
                  توثيق فوري لدرجات ومحاولات الطلاب في أقسام ودروس النحو العربي
                </p>
              </div>

              <button
                onClick={loadNahwAttempts}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="تحديث البيانات"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {nahwAttempts.length === 0 ? (
              <div className="p-10 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-cairo text-sm font-bold text-slate-800">
                  لا توجد محاولات نحو مسجلة حتى الآن
                </h4>
                <p className="text-xs text-slate-500">
                  بمجرد أن ينجز الطالب أي نشاط أو اختبار في أقسام النحو العربي، ستظهر نتيجته وإحصائياته وتوصياته هنا فوراً.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-bold">الطالب/ـة</th>
                      <th className="p-3 font-bold">الصف والشعبة</th>
                      <th className="p-3 font-bold">المعلم/ـة</th>
                      <th className="p-3 font-bold">الدرس النحوي</th>
                      <th className="p-3 font-bold text-center">النوع</th>
                      <th className="p-3 font-bold text-center">الدرجة</th>
                      <th className="p-3 font-bold text-center">النسبة</th>
                      <th className="p-3 font-bold text-center">الوقت والتاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {nahwAttempts.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{att.studentName}</td>
                        <td className="p-3 text-slate-600">{att.studentClass} ({att.studentSection})</td>
                        <td className="p-3 text-slate-600">{att.teacherName}</td>
                        <td className="p-3 font-semibold text-emerald-800">{att.topicTitle}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.mode === 'quiz' ? 'bg-amber-100 text-amber-900' : 'bg-teal-100 text-teal-900'
                          }`}>
                            {att.mode === 'quiz' ? 'اختبار' : 'نشاط'}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold tabular-nums">{att.score} / {att.questionsCount}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            att.percentage >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {att.percentage}%
                          </span>
                        </td>
                        <td className="p-3 text-center text-slate-500 tabular-nums">
                          {new Date(att.completedAt).toLocaleString('ar-AE', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Feedback & Certificate Modal for Teacher */}
      {selectedResult && (
        <StudentFeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          result={selectedResult}
          padletUrl={PADLET_LINKS.all}
        />
      )}
    </div>
  );
};
