// EXPORTS: IWrongQuestion, getWrongbook, addWrongQuestion, removeWrongQuestion, clearWrongbook

import { type Subject } from '@/data/questions';

export interface IWrongQuestion {
  id: string;
  subject: Subject;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  options: string[];
  timestamp: number;
}

const STORAGE_KEY = '__game_yxxq_wrongbook';

export function getWrongbook(): IWrongQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWrongQuestion(item: IWrongQuestion): void {
  const book = getWrongbook();
  const exists = book.find(w => w.id === item.id);
  if (!exists) {
    book.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
  }
}

export function removeWrongQuestion(id: string): void {
  const book = getWrongbook().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
}

export function clearWrongbook(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
