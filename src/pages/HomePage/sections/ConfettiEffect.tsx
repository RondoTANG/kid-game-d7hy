import { useMemo } from 'react';

export default function ConfettiEffect() {
  const pieces = useMemo(() => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D',
      '#FF8C42', '#A8E6CF', '#FF69B4', '#7B68EE',
      '#FFD700', '#FF8C94',
    ];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2.5,
      duration: 2.5 + Math.random() * 2,
      size: 8 + Math.random() * 10,
      isCircle: Math.random() > 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: p.isCircle ? `${p.size}px` : `${p.size * 0.6}px`,
            borderRadius: p.isCircle ? '50%' : '3px',
          }}
        />
      ))}
    </div>
  );
}
