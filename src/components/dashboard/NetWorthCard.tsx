import React from 'react';
import type { UserProfile } from '../../types';

interface Props {
    user: UserProfile;
}

export const NetWorthCard: React.FC<Props> = ({ user }) => {
    // Mock net worth for now or calculate if we had data
    // In real app, we sum up currentCorpus + assets - liabilities
    const netWorth = user.monthlyIncome * 12 * 0.5; // Dummy logic

    return (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <span className="text-muted text-sm">Estimated Net Worth</span>
                <span className="text-xs" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    +12.5% this year
                </span>
            </div>
            <div className="heading-lg">₹ {netWorth.toLocaleString()}</div>
            <div className="flex-between" style={{ marginTop: '1rem' }}>
                <div className="flex-col">
                    <span className="text-muted text-xs">Monthly Income</span>
                    <span className="heading-sm">₹ {user.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                    <span className="text-muted text-xs">Bracket</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{user.bracket}</span>
                </div>
            </div>
        </div>
    );
};

