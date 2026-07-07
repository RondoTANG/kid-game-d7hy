import { useState, useEffect } from 'react';
import { SUBJECT_CONFIG, type Subject } from '@/data/questions';
import ConfettiEffect from './ConfettiEffect';

interface ResultViewProps {
  subject: Subject;
  score: number;
  total: number;
  onRetry: () => void;
  onChangeSubject: () => void;
}

function getStarRating(score: number, total: number): number {
  const pct = score / total;
  if (pct >= 0.9) return 5;
  if (pct >= 0.7) return 4;
  if (pct >= 0.5) return 3;
  if (pct >= 0.3) return 2;
  return 1;
}

function getEncouragement(stars: number): string {
  if (stars === 5) return '太棒了！满分小天才！🎉';
  if (stars === 4) return '非常厉害！继续加油！💪';
  if (stars === 3) return '不错哦！再练练会更好！😊';
  if (stars === 2) return '加油！多练习就能进步！🌟';
  return '别灰心，再来一次吧！💖';
}

export default function ResultView({ subject, score, total, onRetry, onChangeSubject }: ResultViewProps) {
  const stars = getStarRating(score, total);
  const isPerfect = score === total;
  const cfg = SUBJECT_CONFIG[subject];
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowStars(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen min-h-dvh px-4 py-8">
      {isPerfect && <ConfettiEffect />}

      {/* 得分大字 */}
      <div className="bounce-in text-center mb-6">
        <p className="text-lg md:text-xl font-semibold mb-2" style={{ color: '#5D7B6F' }}>
          {cfg.emoji} {cfg.label} 挑战完成！
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-6xl md:text-7xl font-black" style={{ color: cfg.color }}>
            {score}
          </span>
          <span className="text-3xl md:text-4xl font-bold" style={{ color: '#888' }}>
            / {total}
          </span>
        </div>
        <p className="text-base md:text-lg mt-1 font-semibold" style={{ color: '#5D7B6F' }}>
          答对 {score} 题
        </p>
      </div>

      {/* 星星评价 */}
      <div className="flex items-center gap-2 md:gap-3 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-4xl md:text-5xl ${showStars ? 'star-pop' : 'opacity-0'}`}
            style={{
              animationDelay: `${i * 0.15}s`,
              opacity: i < stars ? 1 : 0.3,
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* 鼓励语 */}
      <p className="text-xl md:text-2xl font-bold mb-8 text-center" style={{ color: cfg.color }}>
        {getEncouragement(stars)}
      </p>

      {/* 按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={onRetry}
          className="candy-btn flex-1 px-8 py-4 text-xl font-bold"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          🔄 再来一次
        </button>
        <button
          onClick={onChangeSubject}
          className="candy-btn flex-1 px-8 py-4 text-xl font-bold"
          style={{ backgroundColor: '#FFF9C4', color: '#F57F17' }}
        >
          📚 换科目
        </button>
      </div>
    </div>
  );
}
