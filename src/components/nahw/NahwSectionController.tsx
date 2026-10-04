import React, { useState, useEffect } from 'react';
import { NahwSection, NahwTopic, NahwQuestion, NahwQuizAttempt, GrammarDifficulty, StudentNahwProgress } from '../../types/nahw';
import { StudentProfile, ResultHistoryItem } from '../../types';
import { NAHW_SECTIONS } from '../../data/nahwSections';
import { getQuestionsForTopic } from '../../data/nahwQuestionsBank';
import { NahwHomeView } from './NahwHomeView';
import { NahwTopicView } from './NahwTopicView';
import { NahwQuizSession } from './NahwQuizSession';
import { NahwResultView } from './NahwResultView';
import { NahwAIAssistantModal } from './NahwAIAssistantModal';

interface NahwSectionControllerProps {
  student: StudentProfile | null;
  onRequireProfile: () => void;
  onBackToMain: () => void;
  onRecordResult?: (res: ResultHistoryItem) => void;
}

const PROGRESS_STORAGE_KEY = 'kanooz_nahw_progress';
const ATTEMPTS_STORAGE_KEY = 'kanooz_nahw_attempts';

export const NahwSectionController: React.FC<NahwSectionControllerProps> = ({
  student,
  onRequireProfile,
  onBackToMain,
  onRecordResult,
}) => {
  const [viewState, setViewState] = useState<'home' | 'topic' | 'session' | 'result'>('home');
  const [selectedSection, setSelectedSection] = useState<NahwSection | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<NahwTopic | null>(null);

  // Session state
  const [sessionMode, setSessionMode] = useState<'activity' | 'quiz'>('activity');
  const [sessionDifficulty, setSessionDifficulty] = useState<GrammarDifficulty>('متوسط');
  const [sessionQuestions, setSessionQuestions] = useState<NahwQuestion[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<NahwQuizAttempt | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  // AI Assistant Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalTopic, setAiModalTopic] = useState('النحو العربي');

  // Student progress
  const [progress, setProgress] = useState<StudentNahwProgress>({
    completedTopicIds: [],
    topicBestScores: {},
    totalXp: 0,
    streakDays: 1,
    unlockedBadgeIds: [],
    lastActive: new Date().toISOString(),
  });

  // Load progress on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load nahw progress', e);
    }
  }, []);

  const saveProgress = (newProg: StudentNahwProgress) => {
    setProgress(newProg);
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProg));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectTopic = (sec: NahwSection, topic: NahwTopic) => {
    setSelectedSection(sec);
    setSelectedTopic(topic);
    setViewState('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start activity or quiz session
  const handleStartSession = async (mode: 'activity' | 'quiz', diff: GrammarDifficulty, useAI: boolean) => {
    if (!student || !student.fullName) {
      onRequireProfile();
      return;
    }

    if (!selectedTopic || !selectedSection) return;

    setSessionMode(mode);
    setSessionDifficulty(diff);
    setIsLoadingSession(true);

    let questionsToUse: NahwQuestion[] = [];

    if (useAI) {
      try {
        const res = await fetch('/api/ai/generate-grammar-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sectionTitle: selectedSection.title,
            topicTitle: selectedTopic.title,
            difficulty: diff,
            count: 10
          })
        });
        const data = await res.json();
        if (data.hasAI && data.questions && data.questions.length > 0) {
          questionsToUse = data.questions.map((q: any, idx: number) => ({
            id: `ai-${Date.now()}-${idx}`,
            prompt: q.prompt,
            sentence: q.sentence,
            type: q.type || 'multiple-choice',
            options: q.options || ['الخيار 1', 'الخيار 2', 'الخيار 3', 'الخيار 4'],
            correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
            explanation: q.explanation || 'إجابة صحيحة وفق القاعدة النحوية المعتمدة.',
            wrongFeedbackTip: q.wrongFeedbackTip,
            similarExample: q.similarExample,
            difficulty: diff,
            topicId: selectedTopic.id,
            topicTitle: selectedTopic.title,
            sectionId: selectedSection.id
          }));
        }
      } catch (err) {
        console.error('AI questions fallback', err);
      }
    }

    // Fallback to vetted curated preloaded bank
    if (questionsToUse.length === 0) {
      questionsToUse = getQuestionsForTopic(selectedTopic.id, selectedTopic.title, selectedSection.id);
    }

    setSessionQuestions(questionsToUse);
    setIsLoadingSession(false);
    setViewState('session');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete session & synchronize with teacher
  const handleFinishSession = (attempt: NahwQuizAttempt) => {
    setCurrentAttempt(attempt);
    setViewState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 1. Update Nahw Progress
    const updatedCompleted = Array.from(new Set([...progress.completedTopicIds, attempt.topicId]));
    const currentBest = progress.topicBestScores[attempt.topicId] || 0;
    const newBest = Math.max(currentBest, attempt.percentage);
    const xpGained = attempt.score * 10 + (attempt.percentage >= 90 ? 30 : attempt.percentage >= 70 ? 15 : 5);

    const newProgress: StudentNahwProgress = {
      ...progress,
      completedTopicIds: updatedCompleted,
      topicBestScores: {
        ...progress.topicBestScores,
        [attempt.topicId]: newBest
      },
      totalXp: progress.totalXp + xpGained,
      lastActive: new Date().toISOString()
    };
    saveProgress(newProgress);

    // 2. Save attempt to nahw attempts log
    try {
      const storedAttempts = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      const attemptsList: NahwQuizAttempt[] = storedAttempts ? JSON.parse(storedAttempts) : [];
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify([attempt, ...attemptsList].slice(0, 100)));
    } catch (e) {
      console.error(e);
    }

    // 3. Synchronize with Teacher Results History!
    if (onRecordResult) {
      const resultItem: ResultHistoryItem = {
        id: `res-nahw-${Date.now()}`,
        studentName: attempt.studentName,
        studentClass: attempt.studentClass,
        studentSection: attempt.studentSection,
        teacherName: attempt.teacherName,
        lesson: `النحو العربي - ${attempt.topicTitle}`,
        score: attempt.score,
        total: attempt.questionsCount,
        percentage: attempt.percentage,
        date: attempt.completedAt,
        category: 'نحو عربي',
        motivationalQuote: attempt.recommendation,
        feedbackText: attempt.percentage >= 90 ? 'وسام التميز النحوي' : 'إنجاز مبارك',
        answersBreakdown: attempt.answersBreakdown.map(a => ({
          questionText: a.questionPrompt,
          selectedAnswer: a.selectedOption,
          correctAnswer: a.correctOption,
          isCorrect: a.isCorrect,
          explanation: a.explanation
        }))
      };
      onRecordResult(resultItem);
    }
  };

  const handleOpenAiAssistant = (topicTitle?: string) => {
    setAiModalTopic(topicTitle || selectedTopic?.title || 'النحو العربي');
    setIsAiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {viewState === 'home' && (
        <NahwHomeView
          sections={NAHW_SECTIONS}
          student={student}
          progress={progress}
          onSelectTopic={handleSelectTopic}
          onOpenAiAssistant={handleOpenAiAssistant}
          onBackToMain={onBackToMain}
        />
      )}

      {viewState === 'topic' && selectedSection && selectedTopic && (
        <NahwTopicView
          section={selectedSection}
          topic={selectedTopic}
          onBackToSection={() => {
            setViewState('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartSession={handleStartSession}
          onOpenAiAssistant={handleOpenAiAssistant}
        />
      )}

      {viewState === 'session' && selectedTopic && (
        <NahwQuizSession
          topic={selectedTopic}
          mode={sessionMode}
          difficulty={sessionDifficulty}
          student={student || { fullName: 'طالب النحو', grade: 'الثاني عشر', section: 'هـ', teacherName: 'أ/ بلسم جرّار' }}
          questions={sessionQuestions}
          onFinish={handleFinishSession}
          onCancel={() => {
            setViewState('topic');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAiAssistant={() => handleOpenAiAssistant(selectedTopic.title)}
        />
      )}

      {viewState === 'result' && currentAttempt && (
        <NahwResultView
          attempt={currentAttempt}
          onRetake={() => {
            if (selectedTopic && selectedSection) {
              handleStartSession(currentAttempt.mode, currentAttempt.difficulty, false);
            }
          }}
          onBackToHome={() => {
            setViewState('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* AI Grammar Tutor Modal */}
      <NahwAIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentTopic={aiModalTopic}
      />
    </div>
  );
};
