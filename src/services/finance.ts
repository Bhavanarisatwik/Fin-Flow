import type { IncomeBracket, AssetAllocation } from '../types';

export class FinancialEngine {
    static getIncomeBracket(monthlyIncome: number): IncomeBracket {
        if (monthlyIncome >= 100000) return 'Bracket 3';
        if (monthlyIncome >= 50000) return 'Bracket 2';
        return 'Bracket 1';
    }

    static getRecommendedAllocation(bracket: IncomeBracket) {
        switch (bracket) {
            case 'Bracket 1':
                return { needs: 0.53, wants: 0.27, investments: 0.20, emergency: 0 };
            case 'Bracket 2':
                return { needs: 0.50, wants: 0.20, investments: 0.25, emergency: 0.05 };
            case 'Bracket 3':
                return { needs: 0.45, wants: 0.20, investments: 0.25, emergency: 0.10 };
        }
    }

    static getAssetAllocation(bracket: IncomeBracket): AssetAllocation {
        switch (bracket) {
            case 'Bracket 1':
                return { mutualFunds: 0.45, debtFunds: 0.25, stocks: 0.15, fd: 0.10, gold: 0.05 };
            case 'Bracket 2':
                return { mutualFunds: 0.50, debtFunds: 0.25, stocks: 0.125, fd: 0.0625, gold: 0.0625 };
            case 'Bracket 3':
                return { mutualFunds: 0.60, debtFunds: 0.15, stocks: 0.125, fd: 0.0625, gold: 0.0625 };
        }
    }

    static calculateProjection(
        currentAge: number,
        retirementAge: number,
        initialMonthlyInvestment: number,
        annualStepUpRate: number = 0.10,
        annualReturnRate: number = 0.12
    ) {
        const months = (retirementAge - currentAge) * 12;
        let corpus = 0;
        let monthlyInvestment = initialMonthlyInvestment;
        const monthlyRate = annualReturnRate / 12;
        const projections = [];

        for (let i = 1; i <= months; i++) {
            corpus = (corpus + monthlyInvestment) * (1 + monthlyRate);

            // Annual Step Up
            if (i % 12 === 0) {
                monthlyInvestment *= (1 + annualStepUpRate);
            }

            const age = currentAge + (i / 12);
            if (i % 12 === 0) {
                projections.push({
                    age: Math.floor(age),
                    corpus: Math.round(corpus),
                    investment: Math.round(monthlyInvestment)
                });
            }
        }
        return projections;
    }
}

