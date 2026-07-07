import { useState, useCallback } from 'react';
import { getWrongbook, removeWrongQuestion, type IWrongQuestion } from '@/data/wrongbook';
import { SUBJECT_CONFIG, type Subject } from '@/data/questions';

interface WrongbookViewProps {
  onBack: () => void;
  onPracticeQuestion: (question: IWrongQuestion) => void;
}

export default function WrongbookView({ onBack, onPracticeQuestion }: WrongbookViewProps) {
  const [wrongList, setWrongList] = useState<IWrongQuestion[]>(getWrongbook);

  const handleRemove = useCallback((id: string) => {
    removeWrongQuestion(id);
    setWrongList(prev => prev.filter(w => w.id !== id));
  }, []);

  const handlePractice = useCallback(
    (item: IWrongQuestion) => {
      onPracticeQuestion(item);
    },
    [onPracticeQuestion],
  );

  if (wrongList.length === 0) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen min-h-dvh px-4">
        <div className="text-center">
          <span className="text-7xl md:text-8xl block mb-4">🎉</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#4ECDC4' }}>
            太棒了！
          </h2>
          <p className="text-xl md:text-2xl font-semibold mb-6" style={{ color: '#5D7B6F' }}>
            没有错题哦~
          </p>
          <button
            onClick={onBack}
            className="candy-btn px-8 py-3 text-lg font-bold"
            style={{ backgroundColor: '#FFF9C4', color: '#F57F17' }}
          >
            ← 返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col min-h-screen min-h-dvh px-4 py-4">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="candy-btn px-4 py-2 text-base flex items-center gap-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#666' }}
          aria-label="返回"
        >
          ← 返回
        </button>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#FF6B6B' }}>
          📒 错题本
        </h2>
        <div className="w-16" />
      </div>

      <p className="text-center text-base mb-4" style={{ color: '#5D7B6F' }}>
        共 {wrongList.length} 道错题，点击可重新练习
      </p>

      {/* 错题列表 */}
      <div className="flex flex-col gap-4 w-full max-w-lg mx-auto pb-8">
        {wrongList.map(item => {
          const cfg = SUBJECT_CONFIG[item.subject as Subject];
          const date = new Date(item.timestamp);
          const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

          return (
            <div
              key={item.id}
              className="candy-card p-4 md:p-5"
              style={{ backgroundColor: cfg.bg }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{cfg.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <span className="text-xs ml-auto" style={{ color: '#999' }}>
                  {dateStr}
                </span>
              </div>

              <p className="text-lg font-bold mb-3" style={{ color: '#333' }}>
                {item.question}
              </p>

              <div className="flex flex-col gap-1 text-base mb-3">
                <p>
                  <span style={{ color: '#999' }}>你的答案：</span>
                  <span style={{ color: '#FF6B6B', textDecoration: 'line-through' }}>
                    {item.userAnswer}
                  </span>
                </p>
                <p>
                  <span style={{ color: '#999' }}>正确答案：</span>
                  <span style={{ color: '#4ECDC4', fontWeight: 700 }}>
                    {item.correctAnswer}
                  </span>
                </p>
              </div>

              <button
                onClick={() => handlePractice(item)}
                className="candy-btn w-full py-2 text-base font-bold"
                style={{ backgroundColor: cfg.color, color: 'white' }}
              >
                🔄 重新练习
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
