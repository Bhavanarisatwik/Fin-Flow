export type IncomeBracket = 'Bracket 1' | 'Bracket 2' | 'Bracket 3';

export interface UserProfile {
    id: string; // UUID
    name: string;
    email?: string;
    age: number;
    monthlyIncome: number;
    cityTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
    bracket: IncomeBracket;
    riskProfile: 'Conservative' | 'Balanced' | 'Aggressive';
    createdAt: string;
}

export interface FinancialGoal {
    id: string;
    userId: string;
    type: 'Emergency Fund' | 'Retirement' | 'House' | 'Car' | 'Trip' | 'Other';
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string; // ISO Date
    priority: 1 | 2 | 3 | 4 | 5; // 5 is highest
    completed: boolean;
}

export interface Loan {
    id: string;
    userId: string;
    name: string;
    type: 'Home' | 'Education' | 'Car' | 'Personal' | 'Credit Card';
    principal: number;
    interestRate: number; // Annual %
    tenureMonths: number;
    startDate: string;
    emi: number;
    remainingPrincipal: number;
    status: 'Active' | 'Closed';
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    type: 'Income' | 'Expense';
    category: string;
    date: string;
    description?: string;
}

export interface AssetAllocation {
    mutualFunds: number; // ratio 0-1
    debtFunds: number;
    stocks: number;
    fd: number;
    gold: number;
}
