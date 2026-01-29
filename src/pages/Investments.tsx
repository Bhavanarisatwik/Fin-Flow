import React from 'react';
import { useUser } from '../context/UserContext';
import { FinancialEngine } from '../services/finance';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';

export const Investments: React.FC = () => {
    const { user } = useUser();

    const transactions = useLiveQuery(() =>
        db.transactions.where({ userId: user?.id || 'null' }).toArray()
        , [user]);

    if (!user) return null;

    const allocation = FinancialEngine.getAssetAllocation(user.bracket);

    // Calculate total invested from transactions
    const investmentTxns = transactions?.filter(t => t.category === 'Investment') || [];
    const totalValue = investmentTxns.reduce((sum, t) => sum + t.amount, 0);

    // For now, we don't have per-asset tracking in the simple transaction model.
    // We will assume the user strictly follows the advised allocation for visualization 
    // OR we can default to showing everything as "Mutual Funds" for simplicity 
    // or split it proportionally to the target for the demo.

    // Let's simulate the split based on total value * target allocation 
    // (In a real app, the Add Transaction would ask "Which Asset?")

    const assets = [
        { name: 'Mutual Funds (SIP)', value: totalValue * allocation.mutualFunds, target: allocation.mutualFunds, color: '#10b981' },
        { name: 'Stocks', value: totalValue * allocation.stocks, target: allocation.stocks, color: '#f59e0b' },
        { name: 'Gold', value: totalValue * allocation.gold, target: allocation.gold, color: '#eab308' },
        { name: 'Fixed Deposits', value: totalValue * allocation.fd, target: allocation.fd, color: '#3b82f6' },
    ];

    return (
        <div style={{ padding: '0 1rem' }}>
            <h2 className="heading-md" style={{ marginBottom: '1rem' }}>Portfolio</h2>

            <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <span className="text-muted text-sm">Total Investment Value</span>
                <div className="heading-lg" style={{ color: 'var(--success)' }}>₹ {totalValue.toLocaleString()}</div>
                {totalValue === 0 && <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>No investments recorded yet. Use the Dashboard to add one!</p>}
            </div>

            <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>Asset Breakdown (Estimated)</h3>
            <div className="flex-col" style={{ gap: '1rem' }}>
                {assets.map((asset, idx) => (
                    <div key={idx} className="card" style={{ padding: '1rem' }}>
                        <div className="flex-between">
                            <span style={{ fontWeight: 600 }}>{asset.name}</span>
                            <span style={{ fontWeight: 600 }}>₹ {Math.round(asset.value).toLocaleString()}</span>
                        </div>
                        <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                            <span className="text-xs text-muted">Target: {(asset.target * 100).toFixed(1)}%</span>
                            <span className="text-xs text-muted">Current: {totalValue > 0 ? ((asset.value / totalValue) * 100).toFixed(1) : 0}%</span>
                        </div>
                        <div style={{ marginTop: '0.5rem', background: 'var(--bg-tertiary)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${totalValue > 0 ? (asset.value / totalValue) * 100 : 0}%`, background: asset.color, height: '100%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Investments;
