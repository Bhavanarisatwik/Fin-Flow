export class LoanEngine {
    static calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
        const r = annualRate / 12 / 100;
        const n = tenureMonths;
        if (r === 0) return principal / n;
        return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    static calculateAmortization(principal: number, annualRate: number, tenureMonths: number, startDate: Date) {
        const emi = this.calculateEMI(principal, annualRate, tenureMonths);
        let balance = principal;
        const schedule = [];
        const r = annualRate / 12 / 100;

        for (let i = 1; i <= tenureMonths; i++) {
            const interest = balance * r;
            const principalPaid = emi - interest;
            balance = Math.max(0, balance - principalPaid);

            const date = new Date(startDate);
            date.setMonth(date.getMonth() + i);

            schedule.push({
                month: i,
                date: date.toISOString(),
                emi,
                interest,
                principalPaid,
                balance
            });
        }
        return schedule;
    }
}

