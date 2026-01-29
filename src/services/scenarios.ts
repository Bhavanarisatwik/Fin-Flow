export type ScenarioType = 'Job Loss' | 'Medical Emergency' | 'Inflation' | 'Market Crash' | 'Salary Hike';

export interface SimulationResult {
    scenario: ScenarioType;
    impactDescription: string;
    monthlyActionItems: string[];
    newProjectedCorpus?: number;
}

export class ScenarioEngine {
    static simulate(scenario: ScenarioType, _currentIncome: number, currentExpenses: number, emergencyFund: number): SimulationResult {
        switch (scenario) {
            case 'Job Loss':
                const monthsSurvival = currentExpenses > 0 ? emergencyFund / currentExpenses : 0;
                return {
                    scenario,
                    impactDescription: `Income stops. Emergency fund lasts ${monthsSurvival.toFixed(1)} months.`,
                    monthlyActionItems: [
                        'Cut "Wants" to 0 immediately',
                        'Pause all investments',
                        'Contact lenders for EMI moratorium'
                    ]
                };

            case 'Medical Emergency':
                return {
                    scenario,
                    impactDescription: 'Sudden large expense. Investments might need liquidation.',
                    monthlyActionItems: [
                        'Redeem liquid funds first',
                        'Check insurance coverage',
                        'Avoid breaking compounding assets if possible'
                    ]
                };

            case 'Inflation':
                return {
                    scenario,
                    impactDescription: 'Expenses rise by 10%. Savings rate decreases.',
                    monthlyActionItems: [
                        'Review subscriptions and recurrent costs',
                        'Audit "Needs" vs "Wants" again'
                    ]
                };

            case 'Market Crash':
                return {
                    scenario,
                    impactDescription: 'Portfolio value down 20%. Panic selling destroys wealth.',
                    monthlyActionItems: [
                        'Do NOT sell equity',
                        'Continue SIPs (buying at lows)',
                        'Rebalance if Debt allocation is high'
                    ]
                };

            case 'Salary Hike':
                return {
                    scenario,
                    impactDescription: 'Surplus income available.',
                    monthlyActionItems: [
                        'Do not increase lifestyle expenses immediately',
                        'Redirect 50% of hike to investments',
                        'Accelerate debt repayment'
                    ]
                };
        }
    }
}
