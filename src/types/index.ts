export interface InputData {
  val: number;
  flag1: boolean;
  text: string;
  hour: number;
  email: string;
  addr1: string;
  addr2: string;
  count: number;
  date: Date;
}

export interface AnalysisResult {
  score: number;
  level: 'RED' | 'YELLOW' | 'GREEN' | '--';
  factors: string[];
}