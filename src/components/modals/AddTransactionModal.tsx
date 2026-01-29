import React, { useState } from 'react';
import { db } from '../../services/storage';
import { useUser } from '../../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    defaultType?: 'Expense' | 'Income' | 'Invest';
}

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
            type: type === 'Invest' ? 'Expense' : type, // Invest is technically an expense entry with special category or handling
            category: type === 'Invest' ? 'Investment' : category,
            date: new Date().toISOString(),
            description: description || (type === 'Invest' ? 'Investment Contribution' : undefined)
        });

        onClose();
        setAmount('');
        setDescription('');
        setCategory('');
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
                >
                    <X size={24} />
                </button>

                <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>
                    {type === 'Invest' ? 'Add Investment' : `Add ${type}`}
                </h3>

                <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '1rem' }}>
                    <div className="flex-between" style={{ background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                        {(['Expense', 'Income', 'Invest'] as const).map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: type === t ? 'var(--bg-tertiary)' : 'transparent',
                                    color: type === t ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontWeight: type === t ? 600 : 400,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">Amount (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="input"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--bg-tertiary)',
                                color: 'white',
                                fontSize: '1.25rem'
                            }}
                        />
                    </div>

                    {type !== 'Invest' && (
                        <div className="flex-col">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                required
                                className="input"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--bg-tertiary)',
                                    color: 'white'
                                }}
                            >
                                <option value="">Select Category</option>
                                {type === 'Expense' ? (
                                    <>
                                        <option value="Food">Food & Dining</option>
                                        <option value="Transport">Transportation</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                        <option value="Other">Other</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Salary">Salary</option>
                                        <option value="Business">Business</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Gift">Gift</option>
                                        <option value="Other">Other</option>
                                    </>
                                )}
                            </select>
                        </div>
                    )}

                    <div className="flex-col">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <input
                            type="text"
                            className="input"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--bg-tertiary)',
                                color: 'white'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '0.5rem',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    >
                        Save Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};
