import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { FinancialEngine } from '../services/finance';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import { Briefcase, Gift, TrendingUp, Plus, Trash2, Edit3, Check, X, Sparkles } from 'lucide-react';

export const Income: React.FC = () => {
    const { user, updateUser } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingSalary, setIsEditingSalary] = useState(false);
    const [newSalary, setNewSalary] = useState('');
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [lastAddedAmount, setLastAddedAmount] = useState(0);

    const transactions = useLiveQuery(() =>
        user ? db.transactions.where({ userId: user.id }).toArray() : []
        , [user]);

    // Watch for new income transactions
    const incomeTransactions = transactions?.filter(t => t.type === 'Income')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    // Show suggestion when modal closes after adding income
    useEffect(() => {
        if (!isModalOpen && lastAddedAmount > 0) {
            setShowSuggestion(true);
        }
    }, [isModalOpen, lastAddedAmount]);

    if (!user) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyIncome = incomeTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, t) => sum + t.amount, 0);

    const totalBaseIncome = user.monthlyIncome;
    const totalThisMonth = totalBaseIncome + monthlyIncome;

    // Get allocation for investment suggestions
    const allocation = FinancialEngine.getAssetAllocation(user.bracket);
    const savingsTarget = user.financialSettings?.savingsTarget || 30;
    const investmentTarget = user.financialSettings?.investmentTarget || 20;

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

    const handleModalClose = () => {
        // Check if a new income was added
        const newTotal = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
        if (newTotal > monthlyIncome) {
            setLastAddedAmount(newTotal - monthlyIncome);
        }
        setIsModalOpen(false);
    };

    // Calculate investment breakdown for suggestion
    const suggestedInvestment = Math.round(lastAddedAmount * (investmentTarget / 100));
    const investmentBreakdown = [
        { name: 'Mutual Funds', amount: Math.round(suggestedInvestment * allocation.mutualFunds), color: '#C084FC' },
        { name: 'Stocks', amount: Math.round(suggestedInvestment * allocation.stocks), color: '#F59E0B' },
        { name: 'Debt Funds', amount: Math.round(suggestedInvestment * allocation.debtFunds), color: '#38BDF8' },
        { name: 'FD', amount: Math.round(suggestedInvestment * allocation.fd), color: '#FB7185' },
        { name: 'Gold', amount: Math.round(suggestedInvestment * allocation.gold), color: '#FBBF24' },
    ].filter(item => item.amount > 0);

    return (
        <div style={{ padding: '0 16px', paddingBottom: '32px' }} className="fade-in">
            {/* Header */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>
                Income
            </h2>

            {/* Base Salary Card */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: 'rgba(74,222,128,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#4ADE80'
                        }}>
                            <Briefcase size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Monthly Salary</p>
                            {isEditingSalary ? (
                                <div className="flex-center" style={{ gap: '8px', marginTop: '4px' }}>
                                    <input
                                        type="number"
                                        value={newSalary}
                                        onChange={(e) => setNewSalary(e.target.value)}
                                        placeholder={user.monthlyIncome.toString()}
                                        style={{
                                            width: 120,
                                            padding: '8px',
                                            borderRadius: 8,
                                            background: 'var(--bg-tertiary)',
                                            border: '1px solid var(--border-medium)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    <button
                                        onClick={handleSalaryUpdate}
                                        style={{ padding: '8px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}
                                    >
                                        <Check size={16} strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={() => setIsEditingSalary(false)}
                                        style={{ padding: '8px', borderRadius: 8, background: 'rgba(251,113,133,0.1)', color: '#FB7185' }}
                                    >
                                        <X size={16} strokeWidth={1.5} />
                                    </button>
                                </div>
                            ) : (
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ADE80' }}>
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
                                padding: '8px 12px',
                                borderRadius: 8,
                                background: 'rgba(74,222,128,0.1)',
                                color: '#4ADE80',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 500
                            }}
                        >
                            <Edit3 size={14} strokeWidth={1.5} /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* This Month Total */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div className="flex-between">
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Total This Month</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ADE80' }}>
                        ₹ {totalThisMonth.toLocaleString()}
                    </span>
                </div>
                {monthlyIncome > 0 && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                        + ₹{monthlyIncome.toLocaleString()} additional income
                    </p>
                )}
            </div>

            {/* Investment Suggestion Card */}
            {showSuggestion && lastAddedAmount > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(45,212,167,0.1) 0%, rgba(192,132,252,0.1) 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '16px',
                    border: '1px solid rgba(45,212,167,0.2)'
                }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <div className="flex-center" style={{ gap: '8px' }}>
                            <Sparkles size={18} strokeWidth={1.5} style={{ color: '#2DD4A7' }} />
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Investment Suggestion</span>
                        </div>
                        <button
                            onClick={() => {
                                setShowSuggestion(false);
                                setLastAddedAmount(0);
                            }}
                            style={{ padding: '4px', color: 'var(--text-muted)' }}
                        >
                            <X size={16} strokeWidth={1.5} />
                        </button>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Based on your ₹{lastAddedAmount.toLocaleString()} income, invest <span style={{ color: '#2DD4A7', fontWeight: 600 }}>₹{suggestedInvestment.toLocaleString()}</span> ({investmentTarget}%):
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {investmentBreakdown.map((item, idx) => (
                            <div key={idx} className="flex-between" style={{
                                padding: '10px 12px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '10px'
                            }}>
                                <div className="flex-center" style={{ gap: '8px' }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: item.color
                                    }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.name}</span>
                                </div>
                                <span style={{ fontWeight: 600, color: item.color }}>₹{item.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
                        Save {savingsTarget}% = ₹{Math.round(lastAddedAmount * (savingsTarget / 100)).toLocaleString()} for emergencies
                    </p>
                </div>
            )}

            {/* Income History */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div className="flex-center" style={{ gap: '8px' }}>
                        <TrendingUp size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                        <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Income History</h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{incomeTransactions.length} entries</span>
                </div>

                <div className="flex-col" style={{ gap: '12px', maxHeight: 300, overflowY: 'auto' }}>
                    {incomeTransactions.length > 0 ? incomeTransactions.slice(0, 20).map(income => (
                        <div
                            key={income.id}
                            className="flex-between pressable"
                            style={{
                                padding: '14px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 12,
                                border: '1px solid var(--border-subtle)'
                            }}
                        >
                            <div className="flex-center" style={{ gap: '12px' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: 'rgba(74,222,128,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#4ADE80'
                                }}>
                                    <Gift size={18} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{income.category || 'Income'}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(income.date)}</p>
                                </div>
                            </div>
                            <div className="flex-center" style={{ gap: '12px' }}>
                                <span style={{ fontWeight: 600, color: '#4ADE80' }}>+₹{income.amount.toLocaleString()}</span>
                                <button
                                    onClick={() => deleteIncome(income.id)}
                                    style={{
                                        padding: '6px',
                                        borderRadius: 8,
                                        background: 'rgba(251,113,133,0.1)',
                                        color: '#FB7185'
                                    }}
                                >
                                    <Trash2 size={14} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '32px 0' }}>
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
                    marginTop: '24px',
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
                <Plus size={18} strokeWidth={2} /> Add Income
            </button>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                defaultType="Income"
            />
        </div>
    );
};

export default Income;
