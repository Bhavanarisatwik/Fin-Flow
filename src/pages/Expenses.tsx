import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import ReactECharts from 'echarts-for-react';
import { Home, Utensils, Car, Gamepad2, ShoppingBag, Heart, GraduationCap, MoreHorizontal, Plus, Clock, Trash2 } from 'lucide-react';

// Category config with semantic colors
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
    'Housing': { icon: <Home size={18} strokeWidth={1.5} />, color: '#FB7185' },
    'Food': { icon: <Utensils size={18} strokeWidth={1.5} />, color: '#F59E0B' },
    'Transport': { icon: <Car size={18} strokeWidth={1.5} />, color: '#38BDF8' },
    'Entertainment': { icon: <Gamepad2 size={18} strokeWidth={1.5} />, color: '#C084FC' },
    'Shopping': { icon: <ShoppingBag size={18} strokeWidth={1.5} />, color: '#FB7185' },
    'Health': { icon: <Heart size={18} strokeWidth={1.5} />, color: '#F472B6' },
    'Education': { icon: <GraduationCap size={18} strokeWidth={1.5} />, color: '#FBBF24' },
    'Utilities': { icon: <Home size={18} strokeWidth={1.5} />, color: '#60A5FA' },
    'Other': { icon: <MoreHorizontal size={18} strokeWidth={1.5} />, color: '#94A3B8' }
};

export const Expenses: React.FC = () => {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const transactions = useLiveQuery(() =>
        user ? db.transactions.where({ userId: user.id }).toArray() : []
        , [user]);

    if (!user) return null;

    // Filter current month expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = transactions?.filter(t => {
        if (t.type !== 'Expense' || t.category?.startsWith('Investment')) return false;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }) || [];

    const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);

    // All expenses for history
    const allExpenses = transactions?.filter(t =>
        t.type === 'Expense' && !t.category?.startsWith('Investment')
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    // Group by category
    const categoryTotals = monthlyExpenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    // ECharts Pie - Semantic colors
    const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        itemStyle: { color: CATEGORY_CONFIG[name]?.color || '#94A3B8' }
    }));

    const pieOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#131A22',
            borderColor: 'rgba(255,255,255,0.05)',
            textStyle: { color: '#E2E8F0', fontSize: 12 },
            formatter: '{b}: ₹{c} ({d}%)'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#0C1117', borderWidth: 2 },
            label: { show: false },
            emphasis: {
                label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#F8FAFC' },
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
            },
            data: pieData.length > 0 ? pieData : [{ value: 1, name: 'No Data', itemStyle: { color: '#1C242E' } }]
        }]
    };

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    const deleteExpense = async (id: string) => {
        if (confirm('Delete this expense?')) {
            await db.transactions.delete(id);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    return (
        <div style={{ padding: '0 16px', paddingBottom: '32px' }} className="fade-in">
            {/* Header */}
            <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '24px',
                textAlign: 'center'
            }}>Expenses</h2>

            {/* Pie Chart */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
            }}>
                <div style={{ height: 200 }}>
                    <ReactECharts option={pieOption} style={{ height: '100%' }} />
                </div>
            </div>

            {/* This Month Summary */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
            }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>This Month</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--expense)' }}>
                        ₹{totalExpenses.toLocaleString()}
                    </span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${Math.min((totalExpenses / user.monthlyIncome) * 100, 100)}%`,
                            background: totalExpenses > user.monthlyIncome * 0.7 ? 'var(--expense)' : 'var(--primary)',
                            borderRadius: 2,
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {Math.round((totalExpenses / user.monthlyIncome) * 100)}% of income spent
                </p>
            </div>

            {/* Category Breakdown */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
            }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Category Breakdown
                </h3>
                {sortedCategories.length > 0 ? (
                    <div className="flex-col" style={{ gap: '16px' }}>
                        {sortedCategories.map(([category, amount]) => {
                            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
                            const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                            return (
                                <div key={category}>
                                    <div className="flex-between" style={{ marginBottom: '6px' }}>
                                        <div className="flex-center" style={{ gap: '12px' }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10,
                                                background: `${config.color}15`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: config.color
                                            }}>
                                                {config.icon}
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{category}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{percentage}%</span>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{amount.toLocaleString()}</span>
                                    </div>
                                    <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 2, marginLeft: 48 }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            background: config.color,
                                            borderRadius: 2,
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                        Add an expense to see breakdown
                    </p>
                )}
            </div>

            {/* Expense History */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div
                    className="flex-between"
                    style={{ marginBottom: showHistory ? '16px' : 0, cursor: 'pointer' }}
                    onClick={() => setShowHistory(!showHistory)}
                >
                    <div className="flex-center" style={{ gap: '8px' }}>
                        <Clock size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Expense History
                        </h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{allExpenses.length} transactions</span>
                </div>

                {showHistory && (
                    <div className="flex-col" style={{ gap: '12px', maxHeight: 300, overflowY: 'auto' }}>
                        {allExpenses.length > 0 ? allExpenses.slice(0, 20).map(expense => {
                            const config = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG['Other'];
                            return (
                                <div
                                    key={expense.id}
                                    className="flex-between"
                                    style={{
                                        padding: '12px',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 12,
                                        border: '1px solid var(--border-subtle)'
                                    }}
                                >
                                    <div className="flex-center" style={{ gap: '12px' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 10,
                                            background: `${config.color}15`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: config.color
                                        }}>
                                            {config.icon}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{expense.category}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(expense.date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex-center" style={{ gap: '12px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--expense)' }}>−₹{expense.amount.toLocaleString()}</span>
                                        <button
                                            onClick={() => deleteExpense(expense.id)}
                                            style={{
                                                padding: '6px',
                                                borderRadius: 8,
                                                background: 'rgba(251,113,133,0.1)',
                                                color: 'var(--expense)'
                                            }}
                                        >
                                            <Trash2 size={14} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>No expenses yet</p>
                        )}
                    </div>
                )}
            </div>

            {/* Add Expense Button - Primary */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    width: '100%',
                    marginTop: '24px',
                    padding: '14px',
                    borderRadius: '100px',
                    background: 'var(--primary)',
                    color: '#0C1117',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'var(--shadow-md)'
                }}
            >
                <Plus size={18} strokeWidth={2} /> Add Expense
            </button>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType="Expense"
            />
        </div>
    );
};

export default Expenses;
