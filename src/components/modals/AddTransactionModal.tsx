import React, { useState } from 'react';
import { db } from '../../services/storage';
import { useUser } from '../../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { X, Wallet, TrendingUp, TrendingDown, Tag, FileText, IndianRupee, Home, Utensils, Car, Gamepad2, ShoppingBag, Heart, GraduationCap, MoreHorizontal, Briefcase, Gift, BarChart3, Landmark, Coins, PiggyBank } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    defaultType?: 'Expense' | 'Income' | 'Invest';
}

// Category configs
const EXPENSE_CATEGORIES = [
    { id: 'Food', label: 'Food & Dining', icon: <Utensils size={18} />, color: '#d4af37' },
    { id: 'Transport', label: 'Transportation', icon: <Car size={18} />, color: '#06b6d4' },
    { id: 'Utilities', label: 'Utilities', icon: <Home size={18} />, color: '#6366f1' },
    { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={18} />, color: '#8b5cf6' },
    { id: 'Entertainment', label: 'Entertainment', icon: <Gamepad2 size={18} />, color: '#10b981' },
    { id: 'Health', label: 'Health', icon: <Heart size={18} />, color: '#ec4899' },
    { id: 'Education', label: 'Education', icon: <GraduationCap size={18} />, color: '#f4d03f' },
    { id: 'Other', label: 'Other', icon: <MoreHorizontal size={18} />, color: '#64748b' },
];

const INCOME_CATEGORIES = [
    { id: 'Salary', label: 'Salary', icon: <Briefcase size={18} />, color: '#10b981' },
    { id: 'Business', label: 'Business', icon: <TrendingUp size={18} />, color: '#d4af37' },
    { id: 'Freelance', label: 'Freelance', icon: <Wallet size={18} />, color: '#06b6d4' },
    { id: 'Gift', label: 'Gift', icon: <Gift size={18} />, color: '#ec4899' },
    { id: 'Other', label: 'Other', icon: <MoreHorizontal size={18} />, color: '#64748b' },
];

const INVEST_CATEGORIES = [
    { id: 'Mutual Funds', label: 'Mutual Funds', icon: <BarChart3 size={18} />, color: '#10b981' },
    { id: 'Stocks', label: 'Stocks', icon: <TrendingUp size={18} />, color: '#d4af37' },
    { id: 'Debt Funds', label: 'Debt Funds', icon: <Landmark size={18} />, color: '#06b6d4' },
    { id: 'FD', label: 'Fixed Deposit', icon: <PiggyBank size={18} />, color: '#8b5cf6' },
    { id: 'Gold', label: 'Gold', icon: <Coins size={18} />, color: '#f4d03f' },
];

export const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, defaultType = 'Expense' }) => {
    const { user } = useUser();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Expense' | 'Income' | 'Invest'>(defaultType);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) return;

        await db.transactions.add({
            id: uuidv4(),
            userId: user.id,
            amount: Number(amount),
            type: type === 'Invest' ? 'Expense' : type,
            category: type === 'Invest' ? `Investment - ${category}` : category,
            date: new Date().toISOString(),
            description: description || (type === 'Invest' ? `${category} Investment` : undefined)
        });

        onClose();
        setAmount('');
        setDescription('');
        setCategory('');
    };

    const categories = type === 'Expense' ? EXPENSE_CATEGORIES : type === 'Income' ? INCOME_CATEGORIES : INVEST_CATEGORIES;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
            <div
                className="fade-in"
                style={{
                    width: '100%',
                    maxWidth: 480,
                    background: 'linear-gradient(180deg, #0f1a14 0%, #0a100d 100%)',
                    borderRadius: '24px 24px 0 0',
                    padding: '1.5rem',
                    paddingBottom: '2rem',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderBottom: 'none'
                }}
            >
                {/* Handle Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
                </div>

                {/* Header */}
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10b981 0%, #d4af37 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {type === 'Invest' ? 'Add Investment' : `Add ${type}`}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Type Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '0.375rem',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: 'var(--radius-full)',
                    marginBottom: '1.5rem'
                }}>
                    {([
                        { id: 'Expense', icon: <TrendingDown size={16} />, color: '#ef4444' },
                        { id: 'Income', icon: <TrendingUp size={16} />, color: '#10b981' },
                        { id: 'Invest', icon: <Wallet size={16} />, color: '#d4af37' },
                    ] as const).map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => { setType(t.id); setCategory(''); }}
                            style={{
                                flex: 1,
                                padding: '0.625rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                background: type === t.id ? `${t.color}22` : 'transparent',
                                border: type === t.id ? `1px solid ${t.color}44` : '1px solid transparent',
                                color: type === t.id ? t.color : 'var(--text-muted)',
                                fontWeight: type === t.id ? 600 : 400,
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.375rem',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {t.icon}
                            {t.id}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Amount Input - Premium Style */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: 16,
                        padding: '1.25rem',
                        marginBottom: '1rem'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            <IndianRupee size={14} />
                            Amount
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            placeholder="0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#f0f5f2',
                                fontSize: '2rem',
                                fontWeight: 700,
                                letterSpacing: '-0.02em'
                            }}
                        />
                    </div>

                    {/* Category Selection - For all types */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.75rem'
                        }}>
                            <Tag size={14} />
                            {type === 'Invest' ? 'Investment Type' : 'Category'}
                        </label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: type === 'Invest' ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)',
                            gap: '0.5rem'
                        }}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    style={{
                                        padding: '0.75rem 0.5rem',
                                        borderRadius: 12,
                                        background: category === cat.id ? `${cat.color}22` : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${category === cat.id ? cat.color : 'rgba(255,255,255,0.05)'}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ color: cat.color }}>{cat.icon}</span>
                                    <span style={{
                                        fontSize: '0.6rem',
                                        color: category === cat.id ? '#f0f5f2' : 'var(--text-muted)',
                                        fontWeight: category === cat.id ? 600 : 400,
                                        textAlign: 'center',
                                        lineHeight: 1.2
                                    }}>
                                        {cat.id}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description Input */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            <FileText size={14} />
                            Note (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder={type === 'Invest' ? 'e.g., Monthly SIP' : 'Add a note...'}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#f0f5f2',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!amount || !category}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-full)',
                            background: (amount && category)
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'rgba(255,255,255,0.1)',
                            color: (amount && category) ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: (amount && category)
                                ? '0 4px 20px rgba(16,185,129,0.4)'
                                : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Save {type === 'Invest' ? 'Investment' : type}
                    </button>
                </form>
            </div>
        </div>
    );
};
