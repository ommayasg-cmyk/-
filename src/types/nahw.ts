import { StudentProfile } from './index';

export type GrammarDifficulty = 'مبتدئ' | 'متوسط' | 'متقدم';

export interface NahwQuestion {
  id: string;
  prompt: string;
  sentence?: string;
  type: 'multiple-choice' | 'true-false' | 'identify-parsing' | 'fill-blank';
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  wrongFeedbackTip?: string;
  similarExample?: string;
  difficulty: GrammarDifficulty;
  topicId: string;
  topicTitle: string;
  sectionId: string;
}

export interface NahwTopic {
  id: string;
  sectionId: string;
  title: string;
  shortDescription: string;
  simpleExplanation: string[];
  examples: { text: string; note: string }[];
  commonMistakes?: { mistake: string; correction: string; reason: string }[];
  difficulty: GrammarDifficulty;
  questionsCount: number;
  preloadedQuestions?: NahwQuestion[];
}

export interface NahwSection {
  id: string;
  title: string;
  iconName: string;
  shortDescription: string;
  difficulty: GrammarDifficulty;
  topics: NahwTopic[];
}

export interface NahwQuizAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  teacherName: string;
  sectionId: string;
  sectionName: string;
  topicId: string;
  topicTitle: string;
  quizId?: string;
  quizName?: string;
  mode: 'activity' | 'quiz';
  questionsCount: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  difficulty: GrammarDifficulty;
  completedAt: string;
  answersBreakdown: {
    questionPrompt: string;
    sentence?: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
    explanation: string;
    wrongFeedbackTip?: string;
    similarExample?: string;
  }[];
  strengths: string[];
  needsReview: string[];
  recommendation: string;
}

export interface StudentNahwProgress {
  completedTopicIds: string[];
  topicBestScores: Record<string, number>; // topicId -> percentage
  totalXp: number;
  streakDays: number;
  unlockedBadgeIds: string[];
  lastActive: string;
}

export interface NahwBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredQuizzes?: number;
  requiredAccuracy?: number;
}
