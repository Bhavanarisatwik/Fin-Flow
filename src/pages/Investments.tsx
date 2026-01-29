import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { FinancialEngine } from '../services/finance';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, Landmark, Coins, Wallet, BarChart3, Plus, ChevronLeft, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Asset types with returns data - Emerald/Gold theme colors
const ASSET_DATA = {
    'Mutual Funds': { icon: <BarChart3 size={18} />, color: '#10b981', annualReturn: 15.0 },
    'Stocks': { icon: <TrendingUp size={18} />, color: '#d4af37', annualReturn: 15.0 },
    'Debt Funds': { icon: <Landmark size={18} />, color: '#06b6d4', annualReturn: 8.0 },
    'FD': { icon: <Wallet size={18} />, color: '#8b5cf6', annualReturn: 7.0 },
    'Gold': { icon: <Coins size={18} />, color: '#f4d03f', annualReturn: 11.0 },
};

export const Investments: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const transactions = useLiveQuery(() =>
        db.transactions.where({ userId: user?.id || 'null' }).toArray()
        , [user]);

    if (!user) return null;

    // Get allocation based on bracket
    const allocation = FinancialEngine.getAssetAllocation(user.bracket);

    // Investment transactions
    const investmentTxns = transactions?.filter(t => t.category === 'Investment') || [];
    const totalInvested = investmentTxns.reduce((sum, t) => sum + t.amount, 0);

    // Calculate breakdown by asset class based on allocation
    const assetBreakdown = [
        { name: 'Mutual Funds', allocation: allocation.mutualFunds, color: '#10b981', annualReturn: 15.0 },
        { name: 'Stocks', allocation: allocation.stocks, color: '#d4af37', annualReturn: 15.0 },
        { name: 'Debt Funds', allocation: allocation.debtFunds, color: '#06b6d4', annualReturn: 8.0 },
        { name: 'FD', allocation: allocation.fd, color: '#8b5cf6', annualReturn: 7.0 },
        { name: 'Gold', allocation: allocation.gold, color: '#f4d03f', annualReturn: 11.0 },
    ];

    // Calculate invested amount per asset
    const assetAmounts = assetBreakdown.map(asset => ({
        ...asset,
        invested: Math.round(totalInvested * asset.allocation),
        projectedValue: Math.round(totalInvested * asset.allocation * (1 + asset.annualReturn / 100))
    }));

    // Blended return calculation
    const blendedReturn = assetBreakdown.reduce((sum, a) => sum + (a.allocation * a.annualReturn), 0);

    // Risk Level based on user profile
    const riskLevel = user.riskProfile || 'Balanced';

    // ECharts options for donut
    const pieOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#0f1a14',
            borderColor: 'rgba(16,185,129,0.2)',
            textStyle: { color: '#f0f5f2', fontSize: 12 },
            formatter: '{b}: {d}%'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#050a08', borderWidth: 2 },
            label: { show: false },
            emphasis: {
                label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#f0f5f2' }
            },
            data: assetBreakdown.map(a => ({
                value: Math.round(a.allocation * 100),
                name: a.name,
                itemStyle: { color: a.color }
            }))
        }]
    };

    return (
        <div style={{ padding: '0 1rem' }} className="fade-in">
            {/* Header */}
            <div className="flex-center" style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: 0 }}>
                    <ChevronLeft />
                </button>
                <h2 className="heading-md">Investment Plan</h2>
            </div>

            {/* Portfolio Allocation Card with ECharts */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <h3 className="font-bold" style={{ marginBottom: '1rem' }}>Portfolio Allocation</h3>
                <div className="flex-between">
                    <div style={{ width: 140, height: 140 }}>
                        <ReactECharts option={pieOption} style={{ height: '100%' }} />
                    </div>
                    <div className="flex-col flex-center" style={{ gap: '0.5rem' }}>
                        <BarChart3 size={32} style={{ color: '#d4af37' }} />
                        <span className="heading-sm">{riskLevel}</span>
                        <span className="text-xs text-muted">Risk Profile</span>
                    </div>
                </div>
            </div>

            {/* Risk Level & Projected Growth */}
            <div style={{
                background: 'linear-gradient(145deg, rgba(15,26,20,0.9) 0%, rgba(10,16,13,0.95) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1rem',
                border: '1px solid rgba(16,185,129,0.1)'
            }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <span className="text-sm text-muted">Total Invested:</span>
                    <span className="heading-sm" style={{ color: '#10b981' }}>₹ {totalInvested.toLocaleString()}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span className="text-sm text-muted">Blended Return:</span>
                    <span className="font-bold" style={{ color: '#d4af37' }}>+{blendedReturn.toFixed(2)}% / Yr</span>
                </div>
                <div className="flex-between">
                    <span className="text-sm text-muted">Projected 1Y Value:</span>
                    <span className="font-bold" style={{ color: '#06b6d4' }}>₹ {Math.round(totalInvested * (1 + blendedReturn / 100)).toLocaleString()}</span>
                </div>
            </div>

            {/* Asset Breakdown with Returns */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <h3 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>Asset Breakdown</h3>
                <div className="flex-col" style={{ gap: '0.875rem' }}>
                    {assetAmounts.map((asset, idx) => {
                        const config = ASSET_DATA[asset.name as keyof typeof ASSET_DATA] || { icon: <Wallet size={18} />, color: asset.color };
                        return (
                            <div key={idx}>
                                <div className="flex-between">
                                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 8,
                                            background: `${asset.color}22`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: asset.color
                                        }}>
                                            {config.icon}
                                        </div>
                                        <div>
                                            <span className="font-medium text-sm">{asset.name}</span>
                                            <div className="text-xs text-muted">+{asset.annualReturn}% p.a.</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="font-bold">{Math.round(asset.allocation * 100)}%</div>
                                        {totalInvested > 0 && <div className="text-xs" style={{ color: '#10b981' }}>₹{asset.invested.toLocaleString()}</div>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Investment History */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <h3 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>
                    <History size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Investment History
                </h3>
                {investmentTxns.length > 0 ? (
                    <div className="flex-col" style={{ gap: '0.5rem' }}>
                        {investmentTxns.slice(-5).reverse().map((t, i) => (
                            <div key={i} className="flex-between" style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 4 }}>
                                <div>
                                    <span className="text-sm font-medium">{t.description || 'Investment'}</span>
                                    <div className="text-xs text-muted">{new Date(t.date).toLocaleDateString()}</div>
                                </div>
                                <span className="font-bold" style={{ color: '#10b981' }}>₹ {t.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted text-center">No investments yet. Start investing to see history.</p>
                )}
            </div>

            {/* Add Investment Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
                }}
            >
                <Plus size={18} /> Add Investment
            </button>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType="Invest"
            />
        </div>
    );
};

export default Investments;
