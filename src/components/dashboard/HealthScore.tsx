import React from 'react';
import type { UserProfile } from '../../types';

interface Props {
    user: UserProfile;
}

export const HealthScore: React.FC<Props> = ({ user: _user }) => {
    // Mock Score Logic
    // 30pts DTI, 20pts Emergency Fund, 20pts Consistency, 15pts Tax, 15pts Goals
    const score = 85;
    const status = 'Excellent';
    const color = 'var(--success)';

    return (
        <div className="card">
            <div className="flex-between">
                <div>
                    <h3 className="heading-sm">Financial Health</h3>
                    <p className="text-muted text-xs">Based on your portfolio & habits</p>
                </div>
                <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    border: `4px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1.125rem'
                }}>
                    {score}
                </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${score}%`, background: color, height: '100%' }} />
                </div>
                <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                    <span className="text-xs text-muted">Status: <span style={{ color }}>{status}</span></span>
                    <span className="text-xs text-muted">Top 10%</span>
                </div>
            </div>
        </div>
    );
};

