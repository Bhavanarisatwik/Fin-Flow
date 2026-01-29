import React, { useState } from 'react';
import { db } from '../../services/storage';
import { useUser } from '../../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AddGoalModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !targetAmount) return;

        await db.goals.add({
            id: uuidv4(),
            userId: user.id,
            type: 'Other',
            name,
            targetAmount: Number(targetAmount),
            currentAmount: Number(currentAmount) || 0,
            deadline,
            priority: 3,
            completed: false
        });

        onClose();
        setName('');
        setTargetAmount('');
        setCurrentAmount('');
        setDeadline('');
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

                <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>New Financial Goal</h3>

                <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '1rem' }}>
                    <div className="flex-col">
                        <label className="text-sm font-medium">Goal Name</label>
                        <input
                            type="text"
                            required
                            className="input"
                            placeholder="e.g. New Car"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--bg-tertiary)',
                                color: 'white'
                            }}
                        />
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">Target Amount (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="input"
                            value={targetAmount}
                            onChange={e => setTargetAmount(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--bg-tertiary)',
                                color: 'white'
                            }}
                        />
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">Saved So Far (₹)</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={currentAmount}
                            onChange={e => setCurrentAmount(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--bg-tertiary)',
                                color: 'white'
                            }}
                        />
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">Target Date</label>
                        <input
                            type="date"
                            required
                            className="input"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
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
                        Create Goal
                    </button>
                </form>
            </div>
        </div>
    );
};
