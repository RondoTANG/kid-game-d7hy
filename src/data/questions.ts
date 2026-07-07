export interface IQuestion {
  id: string;
  subject: 'chinese' | 'math' | 'pinyin';
  question: string;
  options: string[];
  correctIndex: number;
}

export type Subject = 'chinese' | 'math' | 'pinyin';

// --- 数学题库动态生成 ---
function generateMathQuestions(count: number): IQuestion[] {
  const questions: IQuestion[] = [];
  const generatedIds = new Set<string>();

  while (questions.length < count) {
    const isAdd = Math.random() < 0.7; 
    let num1 = 0, num2 = 0;
    
    if (isAdd) {
      const rand = Math.random();
      if (rand < 0.3) {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
      } else if (rand < 0.7) {
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
      } else {
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * 900) + 100;
      }
    } else {
      num1 = Math.floor(Math.random() * 99) + 1;
      num2 = Math.floor(Math.random() * 99) + 1;
      if (num1 < num2) {
        const temp = num1; num1 = num2; num2 = temp;
      }
    }

    const id = `m_${isAdd ? 'add' : 'sub'}_${num1}_${num2}`;
    if (generatedIds.has(id)) continue;
    generatedIds.add(id);

    const answer = isAdd ? num1 + num2 : num1 - num2;
    const optionsSet = new Set<number>();
    optionsSet.add(answer);
    
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 21) - 10; 
      if (offset === 0) continue;
      let wrong = answer + offset;
      if (Math.random() < 0.3 && answer >= 10) {
         wrong = answer + (Math.random() < 0.5 ? 10 : -10);
      }
      if (Math.random() < 0.1 && answer >= 100) {
         wrong = answer + (Math.random() < 0.5 ? 100 : -100);
      }
      if (wrong >= 0) optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    questions.push({
      id, subject: 'math',
      question: `${num1} ${isAdd ? '+' : '-'} ${num2} = ？`,
      options: options.map(String),
      correctIndex: options.indexOf(answer)
    });
  }
  return questions;
}

// --- 语文题库动态生成 ---
const POEMS = [
  ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
  ['锄禾日当午', '汗滴禾下土', '谁知盘中餐', '粒粒皆辛苦'],
  ['鹅鹅鹅', '曲项向天歌', '白毛浮绿水', '红掌拨清波'],
  ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
  ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'],
  ['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'],
  ['红豆生南国', '春来发几枝', '愿君多采撷', '此物最相思'],
  ['松下问童子', '言师采药去', '只在此山中', '云深不知处'],
  ['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'],
  ['李白乘舟将欲行', '忽闻岸上踏歌声', '桃花潭水深千尺', '不及汪伦送我情'],
  ['两只老虎', '跑得快', '一只没有耳朵', '一只没有尾巴', '真奇怪'],
  ['一闪一闪亮晶晶', '满天都是小星星', '挂在天上放光明', '好像许多小眼睛'],
  ['小白兔', '白又白', '两只耳朵竖起来', '爱吃萝卜和青菜', '蹦蹦跳跳真可爱'],
  ['远看山有色', '近听水无声', '春去花还在', '人来鸟不惊'],
  ['解落三秋叶', '能开二月花', '过江千尺浪', '入竹万竿斜'],
  ['离离原上草', '一岁一枯荣', '野火烧不尽', '春风吹又生'],
  ['头脑聪明', '手脚灵活', '天天锻炼', '身体健康'],
  ['百川东到海', '何时复西归', '少壮不努力', '老大徒伤悲'],
  ['碧玉妆成一树高', '万条垂下绿丝绦', '不知细叶谁裁出', '二月春风似剪刀'],
  ['迟日江山丽', '春风花草香', '泥融飞燕子', '沙暖睡鸳鸯'],
  ['两个黄鹂鸣翠柳', '一行白鹭上青天', '窗含西岭千秋雪', '门泊东吴万里船'],
  ['清明时节雨纷纷', '路上行人欲断魂', '借问酒家何处有', '牧童遥指杏花村'],
  ['慈母手中线', '游子身上衣', '临行密密缝', '意恐迟迟归'],
  ['煮豆燃豆萁', '豆在釜中泣', '本是同根生', '相煎何太急'],
  ['好雨知时节', '当春乃发生', '随风潜入夜', '润物细无声'],
  ['空山不见人', '但闻人语响', '返景入深林', '复照青苔上']
];

const ALL_POEM_LINES = POEMS.flat();

function generateChineseQuestions(count: number): IQuestion[] {
  const questions: IQuestion[] = [];
  const generatedIds = new Set<string>();

  while(questions.length < count) {
    const poemIndex = Math.floor(Math.random() * POEMS.length);
    const poem = POEMS[poemIndex];
    const lineIndex = Math.floor(Math.random() * (poem.length - 1));
    const questionText = poem[lineIndex];
    const answer = poem[lineIndex + 1];
    
    const id = `c_${poemIndex}_${lineIndex}`;
    if (generatedIds.has(id)) continue;
    generatedIds.add(id);

    const optionsSet = new Set<string>();
    optionsSet.add(answer);
    while(optionsSet.size < 4) {
      const wrongLine = ALL_POEM_LINES[Math.floor(Math.random() * ALL_POEM_LINES.length)];
      if (wrongLine !== answer && wrongLine !== questionText) {
        optionsSet.add(wrongLine);
      }
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    questions.push({
      id, subject: 'chinese',
      question: `“${questionText}” 的下一句是？`,
      options,
      correctIndex: options.indexOf(answer)
    });
  }
  return questions;
}

// --- 拼音题库动态生成 ---
const SHENGMU = ['b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s','y','w'];
const YUNMU = ['a','o','e','i','u','ü','ai','ei','ui','ao','ou','iu','ie','üe','er','an','en','in','un','ün','ang','eng','ing','ong'];
const ZHENGTI = ['zhi','chi','shi','ri','zi','ci','si','yi','wu','yu','ye','yue','yuan','yin','yun','ying'];
const TONES = ['第一声（ˉ）', '第二声（ˊ）', '第三声（ˇ）', '第四声（ˋ）', '轻声'];

export const PINYIN_WORDS = [
  { word: 'bā', s: 'b', y: 'a', t: 0, hz: '八' },
  { word: 'māo', s: 'm', y: 'ao', t: 0, hz: '猫' },
  { word: 'dà', s: 'd', y: 'a', t: 3, hz: '大' },
  { word: 'píng', s: 'p', y: 'ing', t: 1, hz: '平' },
  { word: 'gē', s: 'g', y: 'e', t: 0, hz: '哥' },
  { word: 'hǔ', s: 'h', y: 'u', t: 2, hz: '虎' },
  { word: 'shū', s: 'sh', y: 'u', t: 0, hz: '书' },
  { word: 'lǜ', s: 'l', y: 'ü', t: 3, hz: '绿' },
  { word: 'xué', s: 'x', y: 'üe', t: 1, hz: '学' },
  { word: 'xí', s: 'x', y: 'i', t: 1, hz: '习' },
  { word: 'zhōng', s: 'zh', y: 'ong', t: 0, hz: '中' },
  { word: 'guó', s: 'g', y: 'uo', t: 1, hz: '国' },
  { word: 'tiān', s: 't', y: 'ian', t: 0, hz: '天' },
  { word: 'qì', s: 'q', y: 'i', t: 3, hz: '气' },
  { word: 'shàng', s: 'sh', y: 'ang', t: 3, hz: '上' },
  { word: 'xīng', s: 'x', y: 'ing', t: 0, hz: '星' },
  { word: 'yuè', s: 'y', y: 'ue', t: 3, hz: '月' },
  { word: 'rén', s: 'r', y: 'en', t: 1, hz: '人' },
  { word: 'kǒu', s: 'k', y: 'ou', t: 2, hz: '口' },
  { word: 'shǒu', s: 'sh', y: 'ou', t: 2, hz: '手' },
  { word: 'mù', s: 'm', y: 'u', t: 3, hz: '木' },
  { word: 'ěr', s: '', y: 'er', t: 2, hz: '耳' },
  { word: 'huǒ', s: 'h', y: 'uo', t: 2, hz: '火' },
  { word: 'shǔi', s: 'sh', y: 'ui', t: 2, hz: '水' },
  { word: 'tǔ', s: 't', y: 'u', t: 2, hz: '土' },
  { word: 'mǎ', s: 'm', y: 'a', t: 2, hz: '马' },
  { word: 'niú', s: 'n', y: 'iu', t: 1, hz: '牛' },
  { word: 'yáng', s: 'y', y: 'ang', t: 1, hz: '羊' },
  { word: 'xiǎo', s: 'x', y: 'iao', t: 2, hz: '小' },
  { word: 'niǎo', s: 'n', y: 'iao', t: 2, hz: '鸟' },
  { word: 'zǎo', s: 'z', y: 'ao', t: 2, hz: '早' },
  { word: 'chén', s: 'ch', y: 'en', t: 1, hz: '晨' },
  { word: 'chóng', s: 'ch', y: 'ong', t: 1, hz: '虫' }
];

function generatePinyinQuestions(count: number): IQuestion[] {
  const questions: IQuestion[] = [];
  const generatedIds = new Set<string>();

  while(questions.length < count) {
    const type = Math.floor(Math.random() * 6);
    let id = ''; let question = ''; let answer = '';
    const optionsSet = new Set<string>();

    if (type <= 2) {
      const wordObj = PINYIN_WORDS[Math.floor(Math.random() * PINYIN_WORDS.length)];
      if (type === 0 && !wordObj.s) continue; 

      id = `p_w_${type}_${wordObj.word}`;
      if (generatedIds.has(id)) continue;
      
      if (type === 0) {
        question = `"${wordObj.word}" 的声母是什么？`;
        answer = wordObj.s;
        optionsSet.add(answer);
        while(optionsSet.size < 4) optionsSet.add(SHENGMU[Math.floor(Math.random() * SHENGMU.length)]);
      } else if (type === 1) {
        question = `"${wordObj.word}" 的韵母是什么？`;
        answer = wordObj.y;
        optionsSet.add(answer);
        while(optionsSet.size < 4) optionsSet.add(YUNMU[Math.floor(Math.random() * YUNMU.length)]);
      } else if (type === 2) {
        question = `"${wordObj.word}" 的声调是第几声？`;
        answer = TONES[wordObj.t];
        optionsSet.add(answer);
        while(optionsSet.size < 4) optionsSet.add(TONES[Math.floor(Math.random() * TONES.length)]);
      }
    } else {
      id = `p_t_${type}_${Date.now()}_${Math.floor(Math.random()*1000)}`;
      if (type === 3) {
        question = '下面哪个是声母？';
        answer = SHENGMU[Math.floor(Math.random() * SHENGMU.length)];
        optionsSet.add(answer);
        while(optionsSet.size < 4) optionsSet.add(YUNMU[Math.floor(Math.random() * YUNMU.length)]);
      } else if (type === 4) {
        question = '下面哪个是韵母？';
        answer = YUNMU[Math.floor(Math.random() * YUNMU.length)];
        optionsSet.add(answer);
        while(optionsSet.size < 4) optionsSet.add(SHENGMU[Math.floor(Math.random() * SHENGMU.length)]);
      } else if (type === 5) {
        question = '下面哪个是整体认读音节？';
        answer = ZHENGTI[Math.floor(Math.random() * ZHENGTI.length)];
        optionsSet.add(answer);
        while(optionsSet.size < 4) {
           optionsSet.add(Math.random() < 0.5 
             ? SHENGMU[Math.floor(Math.random() * SHENGMU.length)] 
             : YUNMU[Math.floor(Math.random() * YUNMU.length)]);
        }
      }
    }

    generatedIds.add(id);
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    questions.push({
      id, subject: 'pinyin',
      question, options,
      correctIndex: options.indexOf(answer)
    });
  }
  return questions;
}

export function getRandomQuestions(subject: Subject, count: number = 10): IQuestion[] {
  if (subject === 'math') return generateMathQuestions(count);
  if (subject === 'chinese') return generateChineseQuestions(count);
  if (subject === 'pinyin') return generatePinyinQuestions(count);
  return [];
}

export const SUBJECT_CONFIG: Record<Subject, { label: string; emoji: string; color: string; bg: string; shadowColor: string }> = {
  chinese: { label: '语文古诗', emoji: '📜', color: '#E88C30', bg: 'hsl(45, 30%, 97%)', shadowColor: '#B86518' },
  math: { label: '数学乐园', emoji: '🧮', color: '#44BA87', bg: 'hsl(45, 30%, 97%)', shadowColor: '#288A5E' },
  pinyin: { label: '拼音练习', emoji: '🔤', color: '#9775C9', bg: 'hsl(45, 30%, 97%)', shadowColor: '#6A4A9C' },
};
