import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { FinancialEngine } from '../services/finance';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, Landmark, Coins, Wallet, BarChart3, Plus, History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Investments: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const transactions = useLiveQuery(() =>
        db.transactions.where({ userId: user?.id || 'null' }).toArray()
        , [user]);

    if (!user) return null;

    const allocation = FinancialEngine.getAssetAllocation(user.bracket);
    const investmentTxns = transactions?.filter(t => t.category === 'Investment') || [];
    const totalInvested = investmentTxns.reduce((sum, t) => sum + t.amount, 0);

    const assetBreakdown = [
        { name: 'Mutual Funds', allocation: allocation.mutualFunds, color: '#C084FC', annualReturn: 15.0 },
        { name: 'Stocks', allocation: allocation.stocks, color: '#F59E0B', annualReturn: 15.0 },
        { name: 'Debt Funds', allocation: allocation.debtFunds, color: '#38BDF8', annualReturn: 8.0 },
        { name: 'FD', allocation: allocation.fd, color: '#FB7185', annualReturn: 7.0 },
        { name: 'Gold', allocation: allocation.gold, color: '#FBBF24', annualReturn: 11.0 },
    ];

    const assetAmounts = assetBreakdown.map(asset => ({
        ...asset,
        invested: Math.round(totalInvested * asset.allocation),
        projectedValue: Math.round(totalInvested * asset.allocation * (1 + asset.annualReturn / 100))
    }));

    const blendedReturn = assetBreakdown.reduce((sum, a) => sum + (a.allocation * a.annualReturn), 0);
    const riskLevel = user.riskProfile || 'Balanced';

    // Premium Donut Chart
    const pieOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#131A22',
            borderColor: 'rgba(255,255,255,0.05)',
            textStyle: { color: '#E2E8F0', fontSize: 12 },
            formatter: '{b}: {d}%'
        },
        series: [{
            type: 'pie',
            radius: ['55%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#0C1117', borderWidth: 3 },
            label: { show: false },
            emphasis: {
                label: { show: true, fontSize: 12, fontWeight: 600, color: '#F8FAFC' },
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
            },
            data: assetBreakdown.map(a => ({
                value: Math.round(a.allocation * 100),
                name: a.name,
                itemStyle: { color: a.color }
            }))
        }]
    };

    const iconMap: Record<string, React.ReactNode> = {
        'Mutual Funds': <BarChart3 size={18} strokeWidth={1.5} />,
        'Stocks': <TrendingUp size={18} strokeWidth={1.5} />,
        'Debt Funds': <Landmark size={18} strokeWidth={1.5} />,
        'FD': <Wallet size={18} strokeWidth={1.5} />,
        'Gold': <Coins size={18} strokeWidth={1.5} />
    };

    return (
        <div style={{ padding: '0 16px', paddingBottom: '32px' }} className="fade-in">
            {/* Header */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>
                Investment Plan
            </h2>

            {/* Portfolio Allocation Card */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
            }}>
                <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Portfolio Allocation</h3>
                <div className="flex-between">
                    <div style={{ width: 130, height: 130 }}>
                        <ReactECharts option={pieOption} style={{ height: '100%' }} />
                    </div>
                    <div className="flex-col flex-center" style={{ gap: '8px' }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'rgba(192,132,252,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#C084FC'
                        }}>
                            <BarChart3 size={24} strokeWidth={1.5} />
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{riskLevel}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk Profile</span>
                    </div>
                </div>
            </div>

            {/* Investment Summary */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Invested</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#C084FC' }}>₹ {totalInvested.toLocaleString()}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Blended Return</span>
                    <span style={{ fontWeight: 600, color: '#4ADE80' }}>+{blendedReturn.toFixed(1)}% / Yr</span>
                </div>
                <div className="flex-between">
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Projected 1Y Value</span>
                    <span style={{ fontWeight: 600, color: '#38BDF8' }}>₹ {Math.round(totalInvested * (1 + blendedReturn / 100)).toLocaleString()}</span>
                </div>
            </div>

            {/* Asset Breakdown */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Asset Breakdown</h3>
                    <button
                        onClick={() => navigate('/settings')}
                        className="flex-center"
                        style={{ gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                    >
                        Configure <ChevronRight size={14} strokeWidth={1.5} />
                    </button>
                </div>
                <div className="flex-col" style={{ gap: '14px' }}>
                    {assetAmounts.map((asset, idx) => (
                        <div key={idx} className="flex-between">
                            <div className="flex-center" style={{ gap: '12px' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: `${asset.color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: asset.color
                                }}>
                                    {iconMap[asset.name]}
                                </div>
                                <div>
                                    <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{asset.name}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{asset.annualReturn}% p.a.</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.round(asset.allocation * 100)}%</div>
                                {totalInvested > 0 && <div style={{ fontSize: '0.75rem', color: '#C084FC' }}>₹{asset.invested.toLocaleString()}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Investment History */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid var(--border-subtle)'
            }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <History size={14} strokeWidth={1.5} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Investment History
                </h3>
                {investmentTxns.length > 0 ? (
                    <div className="flex-col" style={{ gap: '10px' }}>
                        {investmentTxns.slice(-5).reverse().map((t, i) => (
                            <div key={i} className="flex-between" style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                                <div>
                                    <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.description || 'Investment'}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleDateString()}</div>
                                </div>
                                <span style={{ fontWeight: 600, color: '#C084FC' }}>₹ {t.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>No investments yet</p>
                )}
            </div>

            {/* Add Investment Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '100px',
                    background: '#2DD4A7',
                    color: '#0C1117',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(45,212,167,0.3)'
                }}
            >
                <Plus size={18} strokeWidth={2} /> Add Investment
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
