export interface StudentProfile {
  fullName: string;
  grade: string;
  section: string;
  teacherName: string;
  padletUrl?: string;
  registeredAt?: string;
}

export const SCHOOL_GRADES = [
  'الروضة الأولى (KG 1)',
  'الروضة الثانية (KG 2)',
  'الصف الأول',
  'الصف الثاني',
  'الصف الثالث',
  'الصف الرابع',
  'الصف الخامس',
  'الصف السادس',
  'الصف السابع',
  'الصف الثامن',
  'الصف التاسع',
  'الصف العاشر',
  'الصف الحادي عشر',
  'الصف الثاني عشر',
] as const;

export const DEFAULT_TEACHERS = [
  'أ/ بلسم حسني جرّار',
  'أ/ غادة الجاسم (معلمة اللغة العربية)',
  'د/ وسام عبد العال',
] as const;

export const SCHOOL_SECTIONS = [
  'أ',
  'ب',
  'ج',
  'د',
  'هـ',
  'و',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
] as const;

export interface StudentActivityLog {
  id: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  teacherName: string;
  sectionId: string;
  sectionTitle: string;
  timestamp: string;
  activityType: 'دخول وتدريب' | 'إنجاز اختبار' | 'تصحيح موضوع' | 'قراءة صوتية';
  details?: string;
  scoreText?: string;
}

export type MainSectionId = 
  | 'nahw'
  | 'i3rab' 
  | 'imlaa' 
  | 'mojam' 
  | 'balagha' 
  | 'arood' 
  | 'mawdou' 
  | 'smart-reader' 
  | 'assessment' 
  | 'teacher-history';

export type SectionCategory = 'grammar' | 'spelling' | 'rhetoric' | 'lexicon' | 'ai-tools';

export interface Question {
  id: string;
  category: 'نحو' | 'إملاء' | 'بلاغة' | 'معاجم' | 'عروض' | 'فهم وتحليل';
  subcategory: string;
  prompt: string;
  sentence?: string;
  targetWord?: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching';
  options?: string[];
  correctAnswer: string | number; // index or text
  explanation: string;
  ruleTip?: string;
}

export interface QuizSubmission {
  student: StudentProfile;
  topic: string;
  category: string;
  totalQuestions: number;
  correctAnswersCount: number;
  scorePercentage: number;
  completedAt: string;
  answers: {
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ResultHistoryItem {
  id: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  teacherName: string;
  lesson: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  category?: string;
  motivationalQuote?: string;
  feedbackText?: string;
  answersBreakdown?: {
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  reportData?: any;
}

export interface ProofreadResult {
  score: number;
  correctedText: string;
  feedback: string;
  suggestions: string[];
  details: {
    type: string;
    note: string;
    status: 'ممتاز' | 'تصويب' | 'تنبيه';
  }[];
}

export interface ReadingText {
  id: string;
  title: string;
  author: string;
  type: 'شعر' | 'نثر' | 'خطبة';
  content: string;
  audioPromptHint: string;
}

export const PADLET_LINKS: Record<string, string> = {
  'i3rab': 'https://padlet.com/balsamjarrar72/breakout-room/x1rD2JNe9Dpa20dM-k2qlv3R0njd7X5Rx',
  'imlaa': 'https://padlet.com/balsamjarrar72/breakout-room/Bk5x4dr6R0nwqZgz-k2qlv3R0njd7X5Rx',
  'mojam': 'https://padlet.com/balsamjarrar72/breakout-room/eo1R47MzrLggqZDL-k2qlv3R0njd7X5Rx',
  'balagha': 'https://padlet.com/balsamjarrar72/breakout-room/3jXMqplMdBRpqAzx-k2qlv3R0njd7X5Rx',
  'arood': 'https://padlet.com/balsamjarrar72/breakout-room/x1rD2JNe99Eb20dM-k2qlv3R0njd7X5Rx',
  'smart-reader': 'https://padlet.com/balsamjarrar72/breakout-room/ke9Kqzb5ZZByqYQG-k2qlv3R0njd7X5Rx',
  'mawdou': 'https://padlet.com/balsamjarrar72/breakout-room/8G57v19N88LyvdVX-k2qlv3R0njd7X5Rx',
  'assessment': 'https://padlet.com/balsamjarrar72/breakout-room/5Wkoqm3RAAdz48pM-k2qlv3R0njd7X5Rx',
  'all': 'https://padlet.com/balsamjarrar72/padlet-j22b57l6i7bvvciw'
};
