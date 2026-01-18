
export interface DebtPoint {
  date: string;
  totalDebt: number;
  publicDebt: number;
  intragovDebt: number;
  gdpRatio: number;
  // Index signature to satisfy Recharts internal ChartDataInput requirements
  [key: string]: string | number;
}

export interface OwnershipData {
  name: string;
  value: number;
  color: string;
  description: string;
  // Index signature to satisfy Recharts internal ChartDataInput requirements
  [key: string]: string | number;
}

export interface InsightMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export enum DebtCategory {
  PUBLIC = 'Public',
  INTRAGOVERNMENTAL = 'Intragovernmental',
  FOREIGN = 'Foreign Holders',
  FEDERAL_RESERVE = 'Federal Reserve'
}
