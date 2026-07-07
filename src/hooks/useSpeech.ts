import { PINYIN_WORDS } from '../data/questions';

let voicesCache: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // 尽早加载声音库
  voicesCache = speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => {
    voicesCache = speechSynthesis.getVoices();
  };
}

const pinyinMap: Record<string, string> = {
  'a': '啊', 'o': '喔', 'e': '鹅', 'i': '衣', 'u': '乌', 'ü': '迂',
  'b': '玻', 'p': '坡', 'm': '摸', 'f': '佛', 'd': '得', 't': '特',
  'n': '讷', 'l': '勒', 'g': '哥', 'k': '科', 'h': '喝', 'j': '机',
  'q': '七', 'x': '西', 'zh': '知', 'ch': '吃', 'sh': '诗', 'r': '日',
  'z': '资', 'c': '刺', 's': '丝', 'y': '医', 'w': '屋',
  'ao': '奥', 'āo': '凹', 'mā': '妈', 'à': '啊', 'da': '搭',
  'ē': '婀', 'gē': '哥', 'ǔ': '五', 'hu': '呼', 'ū': '乌', 'shū': '书'
};

// 把动态词库也加进去
PINYIN_WORDS.forEach(item => {
  pinyinMap[item.word] = item.hz;
});

// 预先解锁（兼容 API 统一，内部保留空实现）
export function unlockAudio(): void {}

export function speak(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  
  // 必须立即取消之前的播报
  speechSynthesis.cancel();

  // 1. 文本预处理（数学符号与拼音）
  let processedText = text
    .replace(/-/g, '减')
    .replace(/\+/g, '加')
    .replace(/=/g, '等于')
    .replace(/\?/g, '？');

  // 动态替换拼音词
  PINYIN_WORDS.forEach(item => {
    processedText = processedText.replace(new RegExp(`"${item.word}"`, 'g'), item.hz);
  });

  if (pinyinMap[processedText]) {
    processedText = pinyinMap[processedText];
  }

  // 2. 创建播报对象
  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.lang = 'zh-CN'; // 强制标识为简体中文

  // 3. 严格同步匹配纯正普通话发音（绝对不能有 await 否则 Safari 会忽略 voice 设置而使用系统默认粤语）
  if (voicesCache.length === 0) {
    voicesCache = speechSynthesis.getVoices();
  }

  const isMandarin = (v: SpeechSynthesisVoice) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    // 必须是中文
    if (!lang.startsWith('zh')) return false;
    // 绝对排除粤语、香港、台湾、繁体
    if (lang.includes('hk') || lang.includes('tw') || lang.includes('hant') || lang.includes('yue')) return false;
    if (name.includes('cantonese') || name.includes('hk') || name.includes('tw') || name.includes('sin-ji') || name.includes('yue')) return false;
    if (name.includes('siri')) return false;
    return true;
  };

  // 第一优先级：寻找明确的纯正普通话女声 (iOS 常见 Ting-Ting, Xiaoxiao，或明确标为普通话)
  let voice = voicesCache.find(v => 
    isMandarin(v) && 
    (v.name.includes('Ting-Ting') || v.name.includes('普通话') || v.name.includes('Mandarin') || v.name.includes('Xiaoxiao') || v.name.includes('Lili') || v.name.includes('Bao-Bao'))
  );

  // 第二优先级：只要标了 CN 或者 Hans 就行
  if (!voice) {
    voice = voicesCache.find(v => 
      isMandarin(v) && 
      (v.lang.toLowerCase().includes('cn') || v.lang.toLowerCase().includes('hans'))
    );
  }

  // 第三优先级：任何通过 isMandarin 测试的中文声音
  if (!voice) {
    voice = voicesCache.find(v => isMandarin(v));
  }

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    // 强制给一个明确的大陆简中标识
    utterance.lang = 'zh-CN';
  }

  // 立即播报
  speechSynthesis.speak(utterance);
}

export function refreshVoices(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    voicesCache = speechSynthesis.getVoices();
  }
}
