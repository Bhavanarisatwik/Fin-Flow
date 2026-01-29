import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import ReactECharts from 'echarts-for-react';
import { Home, Utensils, Car, Gamepad2, ShoppingBag, Heart, GraduationCap, MoreHorizontal, Plus } from 'lucide-react';

// Category config with icons and colors - Emerald/Gold theme
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
    'Housing': { icon: <Home size={18} />, color: '#ef4444' },
    'Food': { icon: <Utensils size={18} />, color: '#d4af37' },
    'Transport': { icon: <Car size={18} />, color: '#06b6d4' },
    'Entertainment': { icon: <Gamepad2 size={18} />, color: '#10b981' },
    'Shopping': { icon: <ShoppingBag size={18} />, color: '#8b5cf6' },
    'Health': { icon: <Heart size={18} />, color: '#ec4899' },
    'Education': { icon: <GraduationCap size={18} />, color: '#f4d03f' },
    'Utilities': { icon: <Home size={18} />, color: '#6366f1' },
    'Other': { icon: <MoreHorizontal size={18} />, color: '#64748B' }
};

export const Expenses: React.FC = () => {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const transactions = useLiveQuery(() =>
        user ? db.transactions.where({ userId: user.id }).toArray() : []
        , [user]);

    if (!user) return null;

    // Filter only expenses from current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = transactions?.filter(t => {
        if (t.type !== 'Expense' || t.category === 'Investment') return false;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }) || [];

    const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);

    // Group by category
    const categoryTotals = monthlyExpenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    // ECharts Pie option - Emerald theme
    const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        itemStyle: { color: CATEGORY_CONFIG[name]?.color || '#64748B' }
    }));

    const pieOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#0f1a14',
            borderColor: 'rgba(16,185,129,0.2)',
            textStyle: { color: '#f0f5f2', fontSize: 12 },
            formatter: '{b}: ₹{c} ({d}%)'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#050a08', borderWidth: 2 },
            label: { show: false },
            emphasis: {
                label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#f0f5f2' },
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
            },
            data: pieData.length > 0 ? pieData : [{ value: 1, name: 'No Data', itemStyle: { color: '#152419' } }]
        }]
    };

    // Sort by value descending
    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);

    return (
        <div style={{ padding: '0 1rem' }} className="fade-in">
            {/* Header */}
            <h2 className="heading-md" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Expenses</h2>

            {/* Pie Chart Section with ECharts */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ height: 200 }}>
                    <ReactECharts option={pieOption} style={{ height: '100%' }} />
                </div>
            </div>

            {/* This Month Card */}
            <div style={{
                background: 'linear-gradient(145deg, rgba(15,26,20,0.9) 0%, rgba(10,16,13,0.95) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1rem',
                border: '1px solid rgba(16,185,129,0.1)'
            }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <span className="font-bold">This Month:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>₹ {totalExpenses.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${Math.min((totalExpenses / user.monthlyIncome) * 100, 100)}%`,
                            background: totalExpenses > user.monthlyIncome * 0.7 ? '#ef4444' : '#10b981',
                            borderRadius: 3,
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>
                <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                    {Math.round((totalExpenses / user.monthlyIncome) * 100)}% of income spent
                </p>
            </div>

            {/* Category Breakdown */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <h3 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>Category Breakdown</h3>
                {sortedCategories.length > 0 ? (
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        {sortedCategories.map(([category, amount]) => {
                            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
                            const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                            return (
                                <div key={category}>
                                    <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                                        <div className="flex-center" style={{ gap: '0.75rem' }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 8,
                                                background: `${config.color}22`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: config.color
                                            }}>
                                                {config.icon}
                                            </div>
                                            <div>
                                                <span className="font-medium">{category}</span>
                                                <span className="text-xs text-muted" style={{ marginLeft: '0.5rem' }}>{percentage}%</span>
                                            </div>
                                        </div>
                                        <span className="font-bold" style={{ color: config.color }}>₹ {amount.toLocaleString()}</span>
                                    </div>
                                    {/* Progress bar for category */}
                                    <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, marginLeft: 48 }}>
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
                    <p className="text-muted text-sm text-center">Add an expense to see breakdown</p>
                )}
            </div>

            {/* Add Expense Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    width: '100%',
                    marginTop: '1.5rem',
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
                <Plus size={18} /> Add Expense
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
