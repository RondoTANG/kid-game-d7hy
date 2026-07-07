export default function BackgroundAnimation() {
  return (
    <div className="sky-bg absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* 太阳 */}
      <div className="sun-glow absolute top-8 right-8 md:top-12 md:right-16 w-20 h-20 md:w-28 md:h-28 rounded-full"
        style={{
          background: 'radial-gradient(circle, #FFF176 0%, #FFD54F 40%, #FFB300 100%)',
          boxShadow: '0 0 60px 20px rgba(255, 213, 79, 0.4), 0 0 120px 40px rgba(255, 183, 77, 0.2)',
        }}
      />

      {/* 白云 1 */}
      <div className="cloud absolute top-16 left-[10%] md:top-20 md:left-[15%] opacity-90">
        <svg width="120" height="50" viewBox="0 0 120 50" className="md:w-[160px] md:h-[65px]">
          <ellipse cx="40" cy="35" rx="35" ry="18" fill="white" />
          <ellipse cx="65" cy="28" rx="30" ry="20" fill="white" />
          <ellipse cx="90" cy="35" rx="28" ry="16" fill="white" />
        </svg>
      </div>

      {/* 白云 2 */}
      <div className="cloud absolute top-28 right-[12%] md:top-32 md:right-[20%] opacity-80">
        <svg width="100" height="42" viewBox="0 0 100 42" className="md:w-[130px] md:h-[55px]">
          <ellipse cx="30" cy="30" rx="28" ry="15" fill="white" />
          <ellipse cx="55" cy="24" rx="25" ry="17" fill="white" />
          <ellipse cx="75" cy="30" rx="22" ry="13" fill="white" />
        </svg>
      </div>

      {/* 白云 3 */}
      <div className="cloud absolute top-8 left-[55%] md:top-14 md:left-[50%] opacity-75">
        <svg width="90" height="38" viewBox="0 0 90 38" className="md:w-[110px] md:h-[48px]">
          <ellipse cx="25" cy="28" rx="25" ry="13" fill="white" />
          <ellipse cx="48" cy="22" rx="22" ry="15" fill="white" />
          <ellipse cx="68" cy="28" rx="20" ry="12" fill="white" />
        </svg>
      </div>

      {/* 草地装饰 - 小花 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(124, 205, 124, 0.3) 40%, rgba(93, 190, 93, 0.6) 100%)',
        }}
      />
      {/* 小花点缀 */}
      {[
        { left: '8%', bottom: '15%', color: '#FF6B6B', delay: '0s' },
        { left: '22%', bottom: '10%', color: '#FFD93D', delay: '1.5s' },
        { left: '38%', bottom: '18%', color: '#FF8C94', delay: '0.8s' },
        { left: '55%', bottom: '12%', color: '#FFD93D', delay: '2s' },
        { left: '70%', bottom: '16%', color: '#FF6B6B', delay: '0.3s' },
        { left: '85%', bottom: '10%', color: '#FF8C94', delay: '1.2s' },
        { left: '92%', bottom: '14%', color: '#FFD93D', delay: '2.5s' },
      ].map((flower, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: flower.left,
            bottom: flower.bottom,
            animation: `sun-pulse 4s ease-in-out ${flower.delay} infinite`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="5" fill={flower.color} opacity="0.7" />
            <circle cx="6" cy="6" r="3" fill={flower.color} opacity="0.5" />
            <circle cx="14" cy="6" r="3" fill={flower.color} opacity="0.5" />
            <circle cx="6" cy="14" r="3" fill={flower.color} opacity="0.5" />
            <circle cx="14" cy="14" r="3" fill={flower.color} opacity="0.5" />
          </svg>
        </div>
      ))}
    </div>
  );
}
