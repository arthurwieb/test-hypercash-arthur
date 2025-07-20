import { AnalysisResult, InputData } from '@/types'; // Importa as interfaces

export function analyzeSomething(input: InputData): AnalysisResult {
  const inputDate = new Date(input.date);
  const now = Date.now();

  const w1 = input.val * 100;
  const w2 = input.flag1 ? 1 : 0;
  const w3 = input.text.length > 4 ? 1 : 0;
  const w4 = input.hour > 23 || input.hour < 6 ? 1 : 0;
  const w5 = input.email.includes('@temp') ? 1 : 0;
  const w6 = input.addr1 !== input.addr2 ? 1 : 0;
  const w7 = input.count > 5 ? 1 : 0;
  const w8 = (now - inputDate.getTime()) / (1000 * 60 * 60 * 24) < 7 ? 1 : 0;

  const total = w1 * 0.2 + w2 * 10 + w3 * 8 + w4 * 15 + w5 * 12 + w6 * 20 + w7 * 9 + w8 * 14;

  let level: 'RED' | 'YELLOW' | 'GREEN' | '--' = '--';
  if (total > 60) {
    level = 'RED';
  } else if (total > 30) {
    level = 'YELLOW';
  } else {
    level = 'GREEN';
  }

  const factorsMap = [
    { value: w2, name: 'F1' },
    { value: w3, name: 'F2' },
    { value: w4, name: 'F3' },
    { value: w5, name: 'F4' },
    { value: w6, name: 'F5' },
    { value: w7, name: 'F6' },
    { value: w8, name: 'F7' },
  ];

  const activeFactors = factorsMap.filter(f => f.value === 1).map(f => f.name);

  return {
    score: Math.round(total),
    level: level,
    factors: activeFactors,
  };
}