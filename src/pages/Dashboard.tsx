import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { FinancialEngine } from '../services/finance';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, ChevronRight, Wallet, CreditCard, BarChart3, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<'Expense' | 'Invest' | null>(null);

    const transactions = useLiveQuery(() =>
        db.transactions.where({ userId: user?.id || 'null' }).toArray()
        , [user]);

    const loans = useLiveQuery(() =>
        db.loans.where({ userId: user?.id || 'null' }).toArray()
        , [user]);

    if (!user) return null;

    // Current month filter
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculations
    const income = user.monthlyIncome;
    const expenses = transactions?.filter(t => {
        if (t.type !== 'Expense' || t.category?.startsWith('Investment')) return false;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((s, t) => s + t.amount, 0) || 0;

    const investments = transactions?.filter(t => t.category?.startsWith('Investment')).reduce((s, t) => s + t.amount, 0) || 0;
    const loanBalance = loans?.reduce((s, l) => s + l.remainingPrincipal + (l.interestAccrued || 0), 0) || 0;

    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    const netWorth = investments - loanBalance;

    // Health Status
    let healthStatus = 'Poor';
    let healthBg = 'rgba(251, 113, 133, 0.15)';
    let healthColor = '#FB7185';
    if (savingsRate >= 30) {
        healthStatus = 'Excellent';
        healthBg = 'rgba(45, 212, 167, 0.15)';
        healthColor = '#2DD4A7';
    } else if (savingsRate >= 15) {
        healthStatus = 'Good';
        healthBg = 'rgba(74, 222, 128, 0.15)';
        healthColor = '#4ADE80';
    } else if (savingsRate >= 5) {
        healthStatus = 'Fair';
        healthBg = 'rgba(245, 158, 11, 0.15)';
        healthColor = '#F59E0B';
    }

    // Allocation for ECharts Donut - Semantic colors
    const allocation = FinancialEngine.getAssetAllocation(user.bracket);
    const pieOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#131A22',
            borderColor: 'rgba(255,255,255,0.05)',
            textStyle: { color: '#E2E8F0', fontSize: 12 }
        },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#0C1117', borderWidth: 2 },
            label: { show: false },
            data: [
                { value: allocation.mutualFunds * 100, name: 'Mutual Funds', itemStyle: { color: '#2DD4A7' } },
                { value: allocation.stocks * 100, name: 'Stocks', itemStyle: { color: '#C084FC' } },
                { value: allocation.debtFunds * 100, name: 'Bonds', itemStyle: { color: '#38BDF8' } },
                { value: allocation.gold * 100, name: 'Gold', itemStyle: { color: '#F59E0B' } },
                { value: allocation.fd * 100, name: 'FD', itemStyle: { color: '#FB7185' } },
            ]
        }]
    };

    // Spending Trend - Last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
    });

    const dailySpending = last7Days.map(day => {
        const dayExpenses = transactions?.filter(t => {
            if (t.type !== 'Expense' || t.category?.startsWith('Investment')) return false;
            const tDate = new Date(t.date);
            return tDate.toDateString() === day.toDateString();
        }) || [];
        return dayExpenses.reduce((sum, t) => sum + t.amount, 0);
    });

    const dayLabels = last7Days.map(d => d.toLocaleDateString('en', { weekday: 'short' }));

    const trendOption = {
        grid: { left: 0, right: 0, top: 10, bottom: 20 },
        xAxis: {
            type: 'category',
            data: dayLabels,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#64748B', fontSize: 10 }
        },
        yAxis: { type: 'value', show: false },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#131A22',
            borderColor: 'rgba(255,255,255,0.05)',
            textStyle: { color: '#E2E8F0', fontSize: 12 },
            formatter: (params: any) => `${params[0].name}: ₹${params[0].value.toLocaleString()}`
        },
        series: [{
            data: dailySpending.some(v => v > 0) ? dailySpending : [500, 1200, 800, 1500, 2000, 1800, 900],
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
                color: '#FB7185',
                borderRadius: [4, 4, 0, 0]
            }
        }]
    };

    return (
        <div style={{ padding: '0 16px' }} className="fade-in">
            {/* Welcome */}
            <div style={{ marginBottom: '24px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back,</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</h2>
            </div>

            {/* Net Worth Card - Premium Design */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Net Worth</span>
                    <TrendingUp size={16} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '12px'
                }}>
                    ₹ {netWorth.toLocaleString()}
                </div>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Savings Rate:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{savingsRate}%</span>
                </div>
                {/* Health Badge - Subtle */}
                <div style={{
                    padding: '10px 16px',
                    background: healthBg,
                    borderRadius: '100px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: healthColor
                }}>
                    Financial Health: {healthStatus}
                </div>
            </div>

            {/* Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {/* Donut Chart Card */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid var(--border-subtle)',
                    gridRow: 'span 2'
                }}>
                    <ReactECharts option={pieOption} style={{ height: 120 }} />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                        Target Allocation
                    </p>
                </div>

                {/* Income Card */}
                <button
                    onClick={() => navigate('/income')}
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'left'
                    }}
                >
                    <div className="flex-center" style={{ gap: '8px', marginBottom: '8px' }}>
                        <Wallet size={14} strokeWidth={1.5} style={{ color: 'var(--income)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--income)' }}>Income</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--income)' }}>
                        ₹ {income.toLocaleString()}
                    </div>
                </button>

                {/* Expenses Card */}
                <button
                    onClick={() => navigate('/expenses')}
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'left'
                    }}
                >
                    <div className="flex-center" style={{ gap: '8px', marginBottom: '8px' }}>
                        <CreditCard size={14} strokeWidth={1.5} style={{ color: 'var(--expense)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--expense)' }}>Expenses</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--expense)' }}>
                        ₹ {expenses.toLocaleString()}
                    </div>
                </button>
            </div>

            {/* Spending Trend */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
            }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Spending (7 Days)
                    </span>
                    <BarChart3 size={14} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </div>
                <ReactECharts option={trendOption} style={{ height: 100 }} />
            </div>

            {/* Quick Actions - Button Hierarchy */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {/* Primary Action */}
                <button
                    onClick={() => setIsModalOpen('Expense')}
                    style={{
                        padding: '14px',
                        borderRadius: '100px',
                        background: 'var(--primary)',
                        color: '#0C1117',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    + Add Expense
                </button>
                {/* Secondary Action - Outline */}
                <button
                    onClick={() => setIsModalOpen('Invest')}
                    style={{
                        padding: '14px',
                        borderRadius: '100px',
                        background: 'transparent',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        border: '2px solid var(--primary)'
                    }}
                >
                    + Invest
                </button>
            </div>

            {/* Quick Links */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
            }}>
                <button
                    onClick={() => navigate('/categories')}
                    className="flex-between"
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderBottom: '1px solid var(--border-subtle)'
                    }}
                >
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <PieChart size={18} strokeWidth={1.5} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Categories</span>
                    </div>
                    <ChevronRight size={16} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </button>
                <button
                    onClick={() => navigate('/goals')}
                    className="flex-between"
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderBottom: '1px solid var(--border-subtle)'
                    }}
                >
                    <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>My Goals</span>
                    <ChevronRight size={16} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </button>
                <button
                    onClick={() => navigate('/loans')}
                    className="flex-between"
                    style={{ width: '100%', padding: '16px' }}
                >
                    <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Manage Loans</span>
                    <div className="flex-center" style={{ gap: '8px' }}>
                        {loanBalance > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--loan)' }}>
                                ₹{loanBalance.toLocaleString()}
                            </span>
                        )}
                        <ChevronRight size={16} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                    </div>
                </button>
            </div>

            {isModalOpen && (
                <AddTransactionModal
                    isOpen={true}
                    onClose={() => setIsModalOpen(null)}
                    defaultType={isModalOpen}
                />
            )}
        </div>
    );
};

export default Dashboard;
