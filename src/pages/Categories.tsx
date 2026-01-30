import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import {
    Home, Utensils, Car, Gamepad2, ShoppingBag, Heart,
    GraduationCap, MoreHorizontal, Edit2, Check, X,
    TrendingUp, Wallet, BarChart3, PiggyBank
} from 'lucide-react';

// Category configuration with semantic colors
const EXPENSE_CATEGORIES: Record<string, { icon: React.ReactNode; color: string }> = {
    'Housing': { icon: <Home size={20} strokeWidth={1.5} />, color: '#FB7185' },
    'Food': { icon: <Utensils size={20} strokeWidth={1.5} />, color: '#F59E0B' },
    'Transport': { icon: <Car size={20} strokeWidth={1.5} />, color: '#38BDF8' },
    'Entertainment': { icon: <Gamepad2 size={20} strokeWidth={1.5} />, color: '#C084FC' },
    'Shopping': { icon: <ShoppingBag size={20} strokeWidth={1.5} />, color: '#FB7185' },
    'Health': { icon: <Heart size={20} strokeWidth={1.5} />, color: '#F472B6' },
    'Education': { icon: <GraduationCap size={20} strokeWidth={1.5} />, color: '#FBBF24' },
    'Utilities': { icon: <Home size={20} strokeWidth={1.5} />, color: '#60A5FA' },
    'Other': { icon: <MoreHorizontal size={20} strokeWidth={1.5} />, color: '#94A3B8' }
};

const INCOME_CATEGORIES: Record<string, { icon: React.ReactNode; color: string }> = {
    'Salary': { icon: <Wallet size={20} strokeWidth={1.5} />, color: '#4ADE80' },
    'Freelance': { icon: <TrendingUp size={20} strokeWidth={1.5} />, color: '#4ADE80' },
    'Business': { icon: <BarChart3 size={20} strokeWidth={1.5} />, color: '#4ADE80' },
    'Other Income': { icon: <PiggyBank size={20} strokeWidth={1.5} />, color: '#4ADE80' }
};

interface CategoryBudget {
    category: string;
    budget: number;
}

export const Categories: React.FC = () => {
    const { user, updateUser } = useUser();
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');

    const transactions = useLiveQuery(() =>
        user ? db.transactions.where({ userId: user.id }).toArray() : []
        , [user]);

    if (!user) return null;

    // Current month filter
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get category budgets from user or use defaults
    const categoryBudgets: CategoryBudget[] = user.categoryBudgets || [];

    const getBudget = (category: string): number => {
        const found = categoryBudgets.find(b => b.category === category);
        return found?.budget || 0;
    };

    // Calculate totals by category for current month
    const expensesByCategory = transactions?.filter(t => {
        if (t.type !== 'Expense' || t.category?.startsWith('Investment')) return false;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>) || {};

    const incomeByCategory = transactions?.filter(t => {
        if (t.type !== 'Income') return false;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>) || {};

    const totalExpenses = Object.values(expensesByCategory).reduce((s, v) => s + v, 0);
    const totalIncome = Object.values(incomeByCategory).reduce((s, v) => s + v, 0);

    const startEdit = (category: string) => {
        setEditingCategory(category);
        setEditValue(getBudget(category).toString());
    };

    const saveEdit = async () => {
        if (!editingCategory) return;

        const newBudget = Number(editValue) || 0;
        const updatedBudgets = [...categoryBudgets.filter(b => b.category !== editingCategory)];
        if (newBudget > 0) {
            updatedBudgets.push({ category: editingCategory, budget: newBudget });
        }

        await updateUser({ categoryBudgets: updatedBudgets });
        setEditingCategory(null);
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setEditValue('');
    };

    // Sort categories by spent amount
    const sortedExpenseCategories = Object.keys(EXPENSE_CATEGORIES).sort((a, b) => {
        return (expensesByCategory[b] || 0) - (expensesByCategory[a] || 0);
    });

    return (
        <div style={{ padding: '0 16px', paddingBottom: '32px' }} className="fade-in">
            {/* Header */}
            <h2 className="heading-lg" style={{ marginBottom: '24px', textAlign: 'center' }}>
                Categories
            </h2>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Total Expenses</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--expense)' }}>
                        ₹{totalExpenses.toLocaleString()}
                    </p>
                </div>
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Total Income</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--income)' }}>
                        ₹{totalIncome.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                background: 'var(--bg-secondary)',
                padding: '4px',
                borderRadius: 'var(--radius-md)'
            }}>
                <button
                    onClick={() => setActiveTab('expenses')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        background: activeTab === 'expenses' ? 'var(--bg-tertiary)' : 'transparent',
                        color: activeTab === 'expenses' ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                    }}
                >
                    Expenses
                </button>
                <button
                    onClick={() => setActiveTab('income')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        background: activeTab === 'income' ? 'var(--bg-tertiary)' : 'transparent',
                        color: activeTab === 'income' ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                    }}
                >
                    Income
                </button>
            </div>

            {/* Category List */}
            <div className="flex-col" style={{ gap: '12px' }}>
                {activeTab === 'expenses' ? (
                    sortedExpenseCategories.map(category => {
                        const config = EXPENSE_CATEGORIES[category];
                        const spent = expensesByCategory[category] || 0;
                        const budget = getBudget(category);
                        const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                        const isOverBudget = budget > 0 && spent > budget;

                        return (
                            <div
                                key={category}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '20px',
                                    border: '1px solid var(--border-subtle)'
                                }}
                            >
                                <div className="flex-between" style={{ marginBottom: '12px' }}>
                                    <div className="flex-center" style={{ gap: '12px' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: `${config.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: config.color
                                        }}>
                                            {config.icon}
                                        </div>
                                        <div>
                                            <p className="font-medium">{category}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                {budget > 0 ? `Budget: ₹${budget.toLocaleString()}` : 'No budget set'}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{
                                            fontWeight: 600,
                                            color: isOverBudget ? 'var(--expense)' : 'var(--text-primary)'
                                        }}>
                                            ₹{spent.toLocaleString()}
                                        </p>
                                        {budget > 0 && (
                                            <p className="text-xs" style={{
                                                color: isOverBudget ? 'var(--expense)' : 'var(--text-muted)'
                                            }}>
                                                {Math.round(percentage)}% used
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {budget > 0 && (
                                    <div style={{
                                        height: 4,
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 2,
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            background: isOverBudget ? 'var(--expense)' : 'var(--primary)',
                                            borderRadius: 2,
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                )}

                                {/* Edit Budget */}
                                {editingCategory === category ? (
                                    <div className="flex-center" style={{ gap: '8px' }}>
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={e => setEditValue(e.target.value)}
                                            placeholder="Set budget"
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-tertiary)',
                                                border: '1px solid var(--border-medium)',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                        <button
                                            onClick={saveEdit}
                                            style={{
                                                padding: '8px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--primary-soft)',
                                                color: 'var(--primary)'
                                            }}
                                        >
                                            <Check size={18} strokeWidth={1.5} />
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            style={{
                                                padding: '8px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'rgba(251,113,133,0.1)',
                                                color: 'var(--expense)'
                                            }}
                                        >
                                            <X size={18} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => startEdit(category)}
                                        className="flex-center"
                                        style={{
                                            gap: '6px',
                                            padding: '8px 12px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--bg-tertiary)',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        <Edit2 size={14} strokeWidth={1.5} />
                                        {budget > 0 ? 'Edit Budget' : 'Set Budget'}
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    Object.entries(INCOME_CATEGORIES).map(([category, config]) => {
                        const earned = incomeByCategory[category] || 0;

                        return (
                            <div
                                key={category}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '20px',
                                    border: '1px solid var(--border-subtle)'
                                }}
                            >
                                <div className="flex-between">
                                    <div className="flex-center" style={{ gap: '12px' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: `${config.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: config.color
                                        }}>
                                            {config.icon}
                                        </div>
                                        <p className="font-medium">{category}</p>
                                    </div>
                                    <p style={{ fontWeight: 600, color: 'var(--income)' }}>
                                        +₹{earned.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Info */}
            <p className="text-xs" style={{
                color: 'var(--text-dim)',
                textAlign: 'center',
                marginTop: '24px'
            }}>
                Set budgets to track spending limits per category
            </p>
        </div>
    );
};

export default Categories;
