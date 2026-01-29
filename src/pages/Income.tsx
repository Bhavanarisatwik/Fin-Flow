import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import { Briefcase, Gift, TrendingUp, Plus, Trash2, Edit3, Check, X } from 'lucide-react';

export const Income: React.FC = () => {
    const { user, updateUser } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingSalary, setIsEditingSalary] = useState(false);
    const [newSalary, setNewSalary] = useState('');

    const transactions = useLiveQuery(() =>
        user ? db.transactions.where({ userId: user.id }).toArray() : []
        , [user]);

    if (!user) return null;

    // Filter only income transactions
    const incomeTransactions = transactions?.filter(t => t.type === 'Income')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    // Current month income
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyIncome = incomeTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, t) => sum + t.amount, 0);

    const totalBaseIncome = user.monthlyIncome;
    const totalThisMonth = totalBaseIncome + monthlyIncome;

    const deleteIncome = async (id: string) => {
        if (confirm('Delete this income entry?')) {
            await db.transactions.delete(id);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    const handleSalaryUpdate = async () => {
        const salary = parseFloat(newSalary);
        if (salary > 0) {
            await updateUser({ monthlyIncome: salary });
            setIsEditingSalary(false);
            setNewSalary('');
        }
    };

    return (
        <div style={{ padding: '0 1rem', paddingBottom: '2rem' }} className="fade-in">
            {/* Header */}
            <h2 className="heading-md" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Income</h2>

            {/* Base Salary Card */}
            <div style={{
                background: 'linear-gradient(145deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1rem',
                border: '1px solid rgba(16,185,129,0.2)'
            }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(16,185,129,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#10b981'
                        }}>
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-muted">Monthly Salary</p>
                            {isEditingSalary ? (
                                <div className="flex-center" style={{ gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <input
                                        type="number"
                                        value={newSalary}
                                        onChange={(e) => setNewSalary(e.target.value)}
                                        placeholder={user.monthlyIncome.toString()}
                                        style={{
                                            width: 120,
                                            padding: '0.5rem',
                                            borderRadius: 8,
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(16,185,129,0.3)',
                                            color: '#f0f5f2',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    <button
                                        onClick={handleSalaryUpdate}
                                        style={{ padding: '0.5rem', borderRadius: 8, background: 'rgba(16,185,129,0.2)', color: '#10b981' }}
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => setIsEditingSalary(false)}
                                        style={{ padding: '0.5rem', borderRadius: 8, background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                                    ₹ {user.monthlyIncome.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                    {!isEditingSalary && (
                        <button
                            onClick={() => {
                                setNewSalary(user.monthlyIncome.toString());
                                setIsEditingSalary(true);
                            }}
                            style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: 8,
                                background: 'rgba(16,185,129,0.15)',
                                color: '#10b981',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                fontSize: '0.8rem'
                            }}
                        >
                            <Edit3 size={14} /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* This Month Total */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <div className="flex-between">
                    <span className="font-bold">Total This Month</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                        ₹ {totalThisMonth.toLocaleString()}
                    </span>
                </div>
                {monthlyIncome > 0 && (
                    <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                        + ₹{monthlyIncome.toLocaleString()} additional income
                    </p>
                )}
            </div>

            {/* Income History */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <div className="flex-center" style={{ gap: '0.5rem' }}>
                        <TrendingUp size={18} style={{ color: '#d4af37' }} />
                        <h3 className="font-bold">Income History</h3>
                    </div>
                    <span className="text-xs text-muted">{incomeTransactions.length} entries</span>
                </div>

                <div className="flex-col" style={{ gap: '0.75rem', maxHeight: 350, overflowY: 'auto' }}>
                    {incomeTransactions.length > 0 ? incomeTransactions.slice(0, 30).map(income => (
                        <div
                            key={income.id}
                            className="flex-between"
                            style={{
                                padding: '0.875rem',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: 12,
                                border: '1px solid rgba(16,185,129,0.1)'
                            }}
                        >
                            <div className="flex-center" style={{ gap: '0.75rem' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: 'rgba(16,185,129,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#10b981'
                                }}>
                                    <Gift size={18} />
                                </div>
                                <div>
                                    <p className="font-medium">{income.category || 'Income'}</p>
                                    <p className="text-xs text-muted">{formatDate(income.date)}</p>
                                    {income.description && (
                                        <p className="text-xs text-muted" style={{ marginTop: '0.125rem' }}>{income.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-center" style={{ gap: '0.75rem' }}>
                                <span style={{ fontWeight: 600, color: '#10b981' }}>+₹{income.amount.toLocaleString()}</span>
                                <button
                                    onClick={() => deleteIncome(income.id)}
                                    style={{
                                        padding: '0.375rem',
                                        borderRadius: 8,
                                        background: 'rgba(239,68,68,0.1)',
                                        color: '#ef4444'
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-muted text-sm text-center" style={{ padding: '2rem 0' }}>
                            No additional income logged yet
                        </p>
                    )}
                </div>
            </div>

            {/* Add Income Button */}
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
                <Plus size={18} /> Add Income
            </button>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType="Income"
            />
        </div>
    );
};

export default Income;
