import { useState, useCallback, useEffect, useRef } from 'react';
import { type IQuestion, SUBJECT_CONFIG, type Subject } from '@/data/questions';
import { speak, refreshVoices } from '@/hooks/useSpeech';
import { playCorrectSound, playWrongSound } from '@/hooks/useSound';

interface PlayingViewProps {
  subject: Subject;
  questions: IQuestion[];
  onFinish: (score: number, answers: { questionId: string; userAnswer: string; correct: boolean }[]) => void;
  onBack: () => void;
  /** 单题练习模式 */
  practiceMode?: boolean;
  onPracticeCorrect?: (questionId: string) => void;
}

export default function PlayingView({
  subject,
  questions,
  onFinish,
  onBack,
  practiceMode = false,
  onPracticeCorrect,
}: PlayingViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [animClass, setAnimClass] = useState('');
  const answersRef = useRef<{ questionId: string; userAnswer: string; correct: boolean }[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = questions.length;
  const currentQ = questions[currentIndex];
  const cfg = SUBJECT_CONFIG[subject];

  // 加载语音
  useEffect(() => {
    refreshVoices();
    // 有些浏览器需要用户交互后才加载 voices
    const handleVoicesChanged = () => refreshVoices();
    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
  }, []);

  // 自动播报题目
  useEffect(() => {
    if (currentQ) {
      const timer = setTimeout(() => speak(currentQ.question), 400);
      return () => clearTimeout(timer);
    }
  }, [currentQ]);

  // 清理 timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return;

      const correct = optionIndex === currentQ.correctIndex;
      setSelectedIndex(optionIndex);
      setAnswered(true);

      answersRef.current.push({
        questionId: currentQ.id,
        userAnswer: currentQ.options[optionIndex],
        correct,
      });

      if (correct) {
        setScore(prev => prev + 1);
        setAnimClass('bounce-in');
        playCorrectSound();
      } else {
        setAnimClass('shake-anim');
        playWrongSound();
      }

      // 延迟进入下一题
      timerRef.current = setTimeout(() => {
        setAnimClass('');
        setSelectedIndex(null);
        setAnswered(false);

        if (currentIndex + 1 >= total) {
          // 完成
          if (practiceMode) {
            if (correct && onPracticeCorrect) {
              onPracticeCorrect(currentQ.id);
            } else {
              onBack();
            }
          } else {
            onFinish(correct ? score + 1 : score, [...answersRef.current]);
          }
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1500);
    },
    [answered, currentIndex, currentQ, total, score, onFinish, practiceMode, onPracticeCorrect],
  );

  const handleSpeakQuestion = useCallback(() => {
    speak(currentQ.question);
  }, [currentQ]);

  const handleSpeakOption = useCallback(
    (text: string) => {
      speak(text);
    },
    [],
  );

  if (!currentQ) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <p className="text-2xl font-bold" style={{ color: '#888' }}>没有题目啦~</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col min-h-screen min-h-dvh px-4 py-4">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <button
          onClick={onBack}
          className="candy-btn px-4 py-2 text-base flex items-center gap-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#666' }}
          aria-label="返回"
        >
          ← 返回
        </button>

        <div
          className="candy-card px-5 py-2 flex items-center gap-2"
          style={{ backgroundColor: cfg.bg }}
        >
          <span className="text-xl">{cfg.emoji}</span>
          <span className="text-lg font-bold" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </div>

        {/* 星星进度 */}
        <div className="flex items-center gap-1" aria-label={`进度 ${currentIndex + 1}/${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`text-xl md:text-2xl ${i <= currentIndex ? 'star-filled' : 'star-empty'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* 进度文字 */}
      <p className="text-center text-base md:text-lg font-semibold mb-4" style={{ color: '#5D7B6F' }}>
        第 {currentIndex + 1} / {total} 题
        {practiceMode && '（错题练习）'}
      </p>

      {/* 题目气泡 */}
      <div className="question-bubble px-6 py-5 md:px-8 md:py-6 mb-6 mx-auto w-full max-w-lg">
        <div className="flex items-start gap-3">
          <button
            onClick={handleSpeakQuestion}
            className="option-speaker mt-1"
            aria-label="播放题目"
            style={{ backgroundColor: cfg.bg }}
          >
            🔊
          </button>
          <p className="text-xl md:text-2xl font-bold flex-1 leading-relaxed" style={{ color: '#333' }}>
            {currentQ.question}
          </p>
        </div>
      </div>

      {/* 选项网格 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
        {currentQ.options.map((opt, i) => {
          const isCorrect = i === currentQ.correctIndex;
          const isSelected = i === selectedIndex;
          const showCorrect = answered && isCorrect;
          const showWrong = answered && isSelected && !isCorrect;

          let bgColor = cfg.bg;
          if (showCorrect) bgColor = '#A8E6CF';
          else if (showWrong) bgColor = '#FFB3B3';

          return (
            <div key={i} className={`option-row ${isSelected ? animClass : ''}`}>
              {/* 喇叭按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeakOption(opt);
                }}
                className="option-speaker"
                aria-label={`播放选项 ${opt}`}
                style={{ backgroundColor: cfg.bg }}
              >
                🔊
              </button>
              {/* 选项文字按钮 */}
              <button
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`option-text-btn ${showCorrect ? 'option-correct' : ''} ${showWrong ? 'option-wrong' : ''}`}
                style={{
                  backgroundColor: answered && !isSelected && !isCorrect ? 'rgba(255,255,255,0.5)' : bgColor,
                  color: showCorrect ? '#2D6A4F' : showWrong ? '#8B0000' : cfg.color,
                }}
                aria-label={opt}
              >
                {opt}
              </button>
            </div>
          );
        })}
      </div>

      {/* 得分提示 */}
      <p className="text-center text-base mt-6 font-semibold" style={{ color: '#5D7B6F' }}>
        已答对：{score} 题
      </p>
    </div>
  );
}
