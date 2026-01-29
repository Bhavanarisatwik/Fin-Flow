import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { FinancialEngine } from '../services/finance';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, ChevronRight, Wallet, CreditCard, BarChart3 } from 'lucide-react';
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
    let healthColor = '#ef4444';
    if (savingsRate >= 30) { healthStatus = 'Excellent'; healthColor = '#10b981'; }
    else if (savingsRate >= 15) { healthStatus = 'Good'; healthColor = '#d4af37'; }
    else if (savingsRate >= 5) { healthStatus = 'Fair'; healthColor = '#f59e0b'; }

    // Allocation for ECharts Donut
    const allocation = FinancialEngine.getAssetAllocation(user.bracket);
    const pieOption = {
        tooltip: { trigger: 'item', backgroundColor: '#0f1a14', borderColor: 'rgba(16,185,129,0.2)', textStyle: { color: '#f0f5f2' } },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#050a08', borderWidth: 2 },
            label: { show: false },
            data: [
                { value: allocation.mutualFunds * 100, name: 'Mutual Funds', itemStyle: { color: '#10b981' } },
                { value: allocation.stocks * 100, name: 'Stocks', itemStyle: { color: '#d4af37' } },
                { value: allocation.debtFunds * 100, name: 'Bonds', itemStyle: { color: '#06b6d4' } },
                { value: allocation.gold * 100, name: 'Gold', itemStyle: { color: '#f4d03f' } },
                { value: allocation.fd * 100, name: 'FD', itemStyle: { color: '#8b5cf6' } },
            ]
        }]
    };

    // Spending Trend - Group expenses by last 7 days
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
            axisLabel: { color: '#5c7a6b', fontSize: 10 }
        },
        yAxis: { type: 'value', show: false },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#0f1a14',
            borderColor: 'rgba(16,185,129,0.2)',
            textStyle: { color: '#f0f5f2', fontSize: 12 },
            formatter: (params: any) => `${params[0].name}: ₹${params[0].value.toLocaleString()}`
        },
        series: [{
            data: dailySpending.some(v => v > 0) ? dailySpending : [500, 1200, 800, 1500, 2000, 1800, 900],
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#10b981' },
                        { offset: 1, color: 'rgba(16,185,129,0.3)' }
                    ]
                },
                borderRadius: [4, 4, 0, 0]
            }
        }]
    };

    return (
        <div style={{ padding: '0 1rem' }} className="fade-in">
            {/* Welcome */}
            <div style={{ marginBottom: '1.5rem' }}>
                <span className="text-muted text-sm">Welcome back,</span>
                <h2 className="heading-lg">{user.name}</h2>
            </div>

            {/* Net Worth Card */}
            <div style={{
                background: 'linear-gradient(145deg, rgba(15,26,20,0.9) 0%, rgba(10,16,13,0.95) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1rem',
                border: '1px solid rgba(16,185,129,0.1)'
            }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <span className="text-sm font-medium text-muted">Net Worth</span>
                    <TrendingUp size={16} style={{ color: '#10b981' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: netWorth >= 0 ? '#10b981' : '#ef4444' }}>
                    ₹ {netWorth.toLocaleString()}
                </div>
                <div className="flex-between" style={{ marginTop: '0.75rem' }}>
                    <span className="text-sm text-muted">Savings Rate:</span>
                    <span className="font-bold" style={{ color: healthColor }}>{savingsRate}%</span>
                </div>
                {/* Health Badge */}
                <div style={{
                    marginTop: '0.75rem', padding: '0.5rem 1rem',
                    background: healthColor, borderRadius: 'var(--radius-full)',
                    textAlign: 'center', fontWeight: 600
                }}>
                    Financial Health: {healthStatus}
                </div>
            </div>

            {/* Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                {/* Donut Chart Card */}
                <div className="card" style={{ padding: '1rem', gridRow: 'span 2' }}>
                    <ReactECharts option={pieOption} style={{ height: 120 }} />
                    <p className="text-xs text-muted text-center" style={{ marginTop: '0.5rem' }}>Target Allocation</p>
                </div>

                {/* Income - Now navigates to /income */}
                <button
                    className="card"
                    onClick={() => navigate('/income')}
                    style={{ padding: '1rem', textAlign: 'left', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
                >
                    <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Wallet size={14} style={{ color: '#10b981' }} />
                        <span className="text-xs" style={{ color: '#10b981' }}>Income</span>
                    </div>
                    <div className="heading-sm" style={{ color: '#10b981' }}>₹ {income.toLocaleString()}</div>
                </button>

                {/* Expenses */}
                <button
                    className="card"
                    onClick={() => navigate('/expenses')}
                    style={{ padding: '1rem', textAlign: 'left', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                    <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <CreditCard size={14} style={{ color: '#ef4444' }} />
                        <span className="text-xs" style={{ color: '#ef4444' }}>Expenses</span>
                    </div>
                    <div className="heading-sm" style={{ color: '#ef4444' }}>₹ {expenses.toLocaleString()}</div>
                </button>
            </div>

            {/* Spending Trend - Now shows daily bar chart */}
            <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span className="font-bold text-sm">Spending Trend (7 Days)</span>
                    <BarChart3 size={14} className="text-muted" />
                </div>
                <ReactECharts option={trendOption} style={{ height: 100 }} />
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <button
                    onClick={() => setIsModalOpen('Expense')}
                    style={{
                        padding: '0.875rem', borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(145deg, rgba(15,26,20,0.9), rgba(10,16,13,0.95))',
                        border: '1px solid rgba(16,185,129,0.1)',
                        color: 'white', fontWeight: 500, fontSize: '0.875rem'
                    }}
                >
                    + Add Expense
                </button>
                <button
                    onClick={() => setIsModalOpen('Invest')}
                    style={{
                        padding: '0.875rem', borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white', fontWeight: 600, fontSize: '0.875rem',
                        boxShadow: '0 2px 10px rgba(16,185,129,0.3)'
                    }}
                >
                    + Invest
                </button>
            </div>

            {/* Quick Links */}
            <div className="card" style={{ padding: '0' }}>
                <button onClick={() => navigate('/goals')} className="flex-between" style={{ width: '100%', padding: '1rem', borderBottom: '1px solid var(--bg-tertiary)' }}>
                    <span className="font-medium">My Goals</span>
                    <ChevronRight size={16} className="text-muted" />
                </button>
                <button onClick={() => navigate('/loans')} className="flex-between" style={{ width: '100%', padding: '1rem' }}>
                    <span className="font-medium">Manage Loans</span>
                    <div className="flex-center" style={{ gap: '0.5rem' }}>
                        {loanBalance > 0 && <span className="text-xs" style={{ color: '#ef4444' }}>₹{loanBalance.toLocaleString()}</span>}
                        <ChevronRight size={16} className="text-muted" />
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
