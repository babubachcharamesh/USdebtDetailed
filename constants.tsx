
import { DebtPoint, OwnershipData } from './types';

export interface DebtEvent {
  year: string;
  title: string;
  description: string;
  impact: 'increase' | 'decrease' | 'neutral';
}

export interface MapHolder {
  id: string;
  name: string;
  amount: number; // In Trillions
  percentage: number;
  coordinates: [number, number]; // [x, y] for SVG placement 0-100
}

export interface SubCategory {
  name: string;
  amount: number;
  description: string;
}

export interface SpendingCategory {
  name: string;
  amount: number; // In Trillions
  color: string;
  isMandatory: boolean;
}

// Approximate baseline for real-time simulation (early 2024 values)
export const BASE_DEBT = 34500000000000; 
export const DEBT_GROWTH_PER_SECOND = 45000; // Estimated $1.4T/year growth ~ $45k/sec
export const US_POPULATION = 336000000;
export const US_TAXPAYERS = 168000000;
export const US_MEDIAN_HOUSEHOLD_INCOME = 77397; // 2023 Census estimate

export const HISTORICAL_DATA: DebtPoint[] = [
  { date: '2014', totalDebt: 17.8, publicDebt: 12.8, intragovDebt: 5.0, gdpRatio: 101.5 },
  { date: '2015', totalDebt: 18.1, publicDebt: 13.1, intragovDebt: 5.0, gdpRatio: 100.8 },
  { date: '2016', totalDebt: 19.5, publicDebt: 14.4, intragovDebt: 5.1, gdpRatio: 105.2 },
  { date: '2017', totalDebt: 20.2, publicDebt: 14.7, intragovDebt: 5.5, gdpRatio: 103.8 },
  { date: '2018', totalDebt: 21.5, publicDebt: 15.8, intragovDebt: 5.7, gdpRatio: 104.3 },
  { date: '2019', totalDebt: 22.7, publicDebt: 17.1, intragovDebt: 5.6, gdpRatio: 106.9 },
  { date: '2020', totalDebt: 26.9, publicDebt: 21.0, intragovDebt: 5.9, gdpRatio: 126.3 },
  { date: '2021', totalDebt: 28.4, publicDebt: 22.3, intragovDebt: 6.1, gdpRatio: 121.5 },
  { date: '2022', totalDebt: 30.9, publicDebt: 24.3, intragovDebt: 6.6, gdpRatio: 120.2 },
  { date: '2023', totalDebt: 33.1, publicDebt: 26.5, intragovDebt: 6.6, gdpRatio: 122.1 },
  { date: '2024', totalDebt: 34.5, publicDebt: 27.8, intragovDebt: 6.7, gdpRatio: 123.5 },
];

export const DEBT_EVENTS: DebtEvent[] = [
  { 
    year: '2017', 
    title: 'Tax Cuts & Jobs Act', 
    description: 'Significant reduction in corporate and individual tax rates, projected to add $1.9T to debt over 10 years.',
    impact: 'increase'
  },
  { 
    year: '2020', 
    title: 'COVID-19 Stimulus (CARES Act)', 
    description: 'Unprecedented $2.2T economic relief package to combat pandemic shutdowns, causing the largest single-year debt spike.',
    impact: 'increase'
  },
  { 
    year: '2021', 
    title: 'American Rescue Plan', 
    description: 'Further $1.9T stimulus package focusing on direct payments and state/local aid.',
    impact: 'increase'
  },
  { 
    year: '2022', 
    title: 'Inflation Reduction Act', 
    description: 'Investment in energy and climate, partially offset by new taxes and prescription drug savings.',
    impact: 'neutral'
  },
  { 
    year: '2023', 
    title: 'Fiscal Responsibility Act', 
    description: 'Suspended debt limit until 2025 and introduced new spending caps following a high-stakes standoff.',
    impact: 'neutral'
  },
];

export const OWNERSHIP_BREAKDOWN: OwnershipData[] = [
  { name: 'Foreign Governments', value: 8.1, color: '#3b82f6', description: 'Debt held by other nations (Japan, China, etc.)' },
  { name: 'Federal Reserve', value: 4.8, color: '#10b981', description: 'Debt held by the US central bank' },
  { name: 'Mutual Funds', value: 3.1, color: '#8b5cf6', description: 'Investments from civilian mutual funds' },
  { name: 'Pension Funds', value: 2.8, color: '#f59e0b', description: 'State and local government retirement funds' },
  { name: 'Banks/Financials', value: 2.2, color: '#ef4444', description: 'Commercial banks and financial institutions' },
  { name: 'Other Private', value: 6.8, color: '#64748b', description: 'Individuals, savings bonds, and corporate holders' },
  { name: 'Intragovernmental', value: 6.7, color: '#f472b6', description: 'Debt the govt owes to itself (Social Security Trust Fund)' },
];

export const OTHER_PRIVATE_BREAKDOWN: SubCategory[] = [
  { name: 'Households & Non-Profits', amount: 2.5, description: 'Direct investment by individuals and non-profit organizations.' },
  { name: 'State & Local Govts', amount: 1.7, description: 'Surplus funds from states and municipalities.' },
  { name: 'Insurance Companies', amount: 0.4, description: 'Life and property/casualty insurance holdings.' },
  { name: 'Savings Bonds', amount: 0.2, description: 'Series EE and I savings bonds held by the public.' },
  { name: 'Other', amount: 2.0, description: 'Brokers, dealers, and miscellaneous corporate entities.' },
];

export const BANKS_FINANCIAL_BREAKDOWN: SubCategory[] = [
  { name: 'Depository Institutions', amount: 1.5, description: 'Commercial banks and credit unions holding Treasuries.' },
  { name: 'Other Financial', amount: 0.7, description: 'REITs, investment banks, and credit market institutions.' },
];

export const SPENDING_DATA: SpendingCategory[] = [
  { name: 'Social Security', amount: 1.45, color: '#3b82f6', isMandatory: true },
  { name: 'Medicare', amount: 0.92, color: '#10b981', isMandatory: true },
  { name: 'Defense', amount: 0.82, color: '#f59e0b', isMandatory: false },
  { name: 'Net Interest', amount: 0.89, color: '#ef4444', isMandatory: true },
  { name: 'Health (Medicaid/Other)', amount: 0.75, color: '#8b5cf6', isMandatory: true },
  { name: 'Income Security', amount: 0.58, color: '#ec4899', isMandatory: true },
  { name: 'Veterans', amount: 0.32, color: '#6366f1', isMandatory: false },
  { name: 'Other Discretionary', amount: 0.94, color: '#64748b', isMandatory: false },
];

export const DETAILED_FOREIGN_HOLDERS: MapHolder[] = [
  { id: 'JP', name: 'Japan', amount: 1.15, percentage: 14.2, coordinates: [84, 38] },
  { id: 'CN', name: 'China', amount: 0.77, percentage: 9.5, coordinates: [78, 42] },
  { id: 'GB', name: 'United Kingdom', amount: 0.71, percentage: 8.8, coordinates: [48, 28] },
  { id: 'LU', name: 'Luxembourg', amount: 0.37, percentage: 4.6, coordinates: [51, 31] },
  { id: 'CA', name: 'Canada', amount: 0.34, percentage: 4.2, coordinates: [20, 25] },
  { id: 'IE', name: 'Ireland', amount: 0.30, percentage: 3.7, coordinates: [46, 28] },
  { id: 'BE', name: 'Belgium', amount: 0.30, percentage: 3.7, coordinates: [50, 31] },
  { id: 'CH', name: 'Switzerland', amount: 0.28, percentage: 3.5, coordinates: [51, 35] },
  { id: 'FR', name: 'France', amount: 0.26, percentage: 3.2, coordinates: [49, 35] },
  { id: 'BR', name: 'Brazil', amount: 0.23, percentage: 2.8, coordinates: [32, 70] },
];
