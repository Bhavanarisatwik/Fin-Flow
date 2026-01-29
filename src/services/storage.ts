import Dexie, { type Table } from 'dexie';
import type { UserProfile, FinancialGoal, Loan, Transaction } from '../types';

export class FinFlowDatabase extends Dexie {
    users!: Table<UserProfile>;
    goals!: Table<FinancialGoal>;
    loans!: Table<Loan>;
    transactions!: Table<Transaction>;

    constructor() {
        super('FinFlowDB');
        this.version(1).stores({
            users: 'id',
            goals: 'id, userId',
            loans: 'id, userId, status',
            transactions: 'id, userId, type, date'
        });
    }
}

export const db = new FinFlowDatabase();
