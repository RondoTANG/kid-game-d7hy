import { useState, useCallback } from 'react';
import { type Subject, type IQuestion, getRandomQuestions } from '@/data/questions';
import { addWrongQuestion, removeWrongQuestion, type IWrongQuestion } from '@/data/wrongbook';
import BackgroundAnimation from './sections/BackgroundAnimation';
import HomeView from './sections/HomeView';
import PlayingView from './sections/PlayingView';
import ResultView from './sections/ResultView';
import WrongbookView from './sections/WrongbookView';
import './HomePage.css';

type ViewState = 'home' | 'playing' | 'result' | 'wrongbook';

interface Answer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
}

export default function HomePage() {
  const [view, setView] = useState<ViewState>('home');
  const [subject, setSubject] = useState<Subject>('chinese');
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(10);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceWrongId, setPracticeWrongId] = useState<string | null>(null);

  // 选择科目 → 开始答题
  const handleSelectSubject = useCallback((subj: Subject) => {
    const qs = getRandomQuestions(subj, 10);
    setSubject(subj);
    setQuestions(qs);
    setTotal(qs.length);
    setScore(0);
    setAnswers([]);
    setPracticeMode(false);
    setPracticeWrongId(null);
    setView('playing');
  }, []);

  // 答题完成
  const handleFinish = useCallback(
    (finalScore: number, finalAnswers: Answer[]) => {
      setScore(finalScore);
      setAnswers(finalAnswers);

      // 错题收录
      finalAnswers.forEach(ans => {
        if (!ans.correct) {
          const q = questions.find(qq => qq.id === ans.questionId);
          if (q) {
            addWrongQuestion({
              id: q.id,
              subject: q.subject,
              question: q.question,
              correctAnswer: q.options[q.correctIndex],
              userAnswer: ans.userAnswer,
              options: q.options,
              timestamp: Date.now(),
            });
          }
        }
      });

      setView('result');
    },
    [questions],
  );

  // 再来一次
  const handleRetry = useCallback(() => {
    const qs = getRandomQuestions(subject, 10);
    setQuestions(qs);
    setTotal(qs.length);
    setScore(0);
    setAnswers([]);
    setPracticeMode(false);
    setPracticeWrongId(null);
    setView('playing');
  }, [subject]);

  // 换科目
  const handleChangeSubject = useCallback(() => {
    setView('home');
  }, []);

  // 返回首页
  const handleBackHome = useCallback(() => {
    setView('home');
  }, []);

  // 打开错题本
  const handleOpenWrongbook = useCallback(() => {
    setView('wrongbook');
  }, []);

  // 从错题本练习单题
  const handlePracticeQuestion = useCallback((wrongItem: IWrongQuestion) => {
    const q: IQuestion = {
      id: wrongItem.id,
      subject: wrongItem.subject,
      question: wrongItem.question,
      options: wrongItem.options,
      correctIndex: wrongItem.options.indexOf(wrongItem.correctAnswer),
    };
    setSubject(wrongItem.subject);
    setQuestions([q]);
    setTotal(1);
    setScore(0);
    setAnswers([]);
    setPracticeMode(true);
    setPracticeWrongId(wrongItem.id);
    setView('playing');
  }, []);

  // 错题练习答对
  const handlePracticeCorrect = useCallback(
    (questionId: string) => {
      removeWrongQuestion(questionId);
      setView('wrongbook');
    },
    [],
  );

  // 从答题页返回
  const handlePlayingBack = useCallback(() => {
    if (practiceMode) {
      setView('wrongbook');
    } else {
      setView('home');
    }
  }, [practiceMode]);

  return (
    <div className="relative min-h-screen min-h-dvh">
      <BackgroundAnimation />

      {view === 'home' && (
        <HomeView
          onSelectSubject={handleSelectSubject}
          onOpenWrongbook={handleOpenWrongbook}
        />
      )}

      {view === 'playing' && (
        <PlayingView
          subject={subject}
          questions={questions}
          onFinish={handleFinish}
          onBack={handlePlayingBack}
          practiceMode={practiceMode}
          onPracticeCorrect={handlePracticeCorrect}
        />
      )}

      {view === 'result' && (
        <ResultView
          subject={subject}
          score={score}
          total={total}
          onRetry={handleRetry}
          onChangeSubject={handleChangeSubject}
        />
      )}

      {view === 'wrongbook' && (
        <WrongbookView
          onBack={handleBackHome}
          onPracticeQuestion={handlePracticeQuestion}
        />
      )}
    </div>
  );
}
