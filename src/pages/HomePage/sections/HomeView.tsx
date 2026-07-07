import { SUBJECT_CONFIG, type Subject } from '@/data/questions';
import { getWrongbook } from '@/data/wrongbook';
import { unlockAudio } from '@/hooks/useSpeech';

interface HomeViewProps {
  onSelectSubject: (subject: Subject) => void;
  onOpenWrongbook: () => void;
}

export default function HomeView({ onSelectSubject, onOpenWrongbook }: HomeViewProps) {
  const wrongCount = getWrongbook().length;
  const subjects: Subject[] = ['chinese', 'math', 'pinyin'];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen min-h-dvh px-4 py-8">
      {/* 标题 */}
      <div className="text-center mb-8 md:mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold mb-2"
          style={{
            color: '#FF6B6B',
            textShadow: '3px 3px 0 rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.1)',
            letterSpacing: '0.05em',
          }}
        >
          🌈 幼升小趣味闯关
        </h1>
        <p
          className="text-lg md:text-xl font-semibold"
          style={{ color: '#5D7B6F', textShadow: '1px 1px 0 white' }}
        >
          选一个科目，开始挑战吧！
        </p>
      </div>

      {/* 科目卡片 */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-lg md:max-w-2xl">
        {subjects.map((subj, i) => {
          const cfg = SUBJECT_CONFIG[subj];
          return (
            <button
              key={subj}
              onClick={() => {
                unlockAudio();
                onSelectSubject(subj);
              }}
              className={`candy-card card-float-${i + 1} flex-1 p-6 md:p-8 flex flex-col items-center gap-3 cursor-pointer transition-transform`}
              style={{ 
                backgroundColor: cfg.bg,
                '--card-shadow': cfg.shadowColor,
              } as React.CSSProperties}
              aria-label={cfg.label}
            >
              <span className="text-5xl md:text-6xl drop-shadow-md">{cfg.emoji}</span>
              <span
                className="text-2xl md:text-3xl font-bold"
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </span>
              <span className="text-sm md:text-base font-medium" style={{ color: '#888' }}>
                共 10 道题
              </span>
            </button>
          );
        })}
      </div>

      {/* 错题本入口 */}
      <button
        onClick={() => {
          unlockAudio();
          onOpenWrongbook();
        }}
        className="candy-btn mt-8 md:mt-10 px-8 py-3 text-lg flex items-center gap-2"
        style={{ 
          backgroundColor: '#FFF9C4', 
          color: '#F57F17',
          '--btn-shadow': '#F57F17'
        } as React.CSSProperties}
        aria-label="错题本"
      >
        <span className="text-2xl">📒</span>
        <span>错题本</span>
        {wrongCount > 0 && (
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: '#FF6B6B' }}
          >
            {wrongCount}
          </span>
        )}
      </button>
    </div>
  );
}
