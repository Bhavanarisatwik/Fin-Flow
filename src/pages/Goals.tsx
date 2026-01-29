import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { AddGoalModal } from '../components/modals/AddGoalModal';

export const Goals: React.FC = () => {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const goals = useLiveQuery(() =>
        db.goals.where({ userId: user?.id || 'null' }).toArray()
        , [user]);

    if (!user) return null;

    return (
        <div style={{ padding: '0 1rem' }}>
            <div className="flex-between">
                <h2 className="heading-md">My Goals</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ color: 'var(--primary)', fontSize: '1.5rem', padding: '0.5rem' }}
                >
                    +
                </button>
            </div>

            <div className="flex-col" style={{ gap: '1rem', marginTop: '1rem' }}>
                {goals?.length === 0 && (
                    <div className="card text-muted" style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No goals set yet.</p>
                        <p className="text-xs">Tap + to plan your dreams!</p>
                    </div>
                )}

                {goals?.map((goal) => {
                    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                    const isOverdue = new Date(goal.deadline) < new Date() && progress < 100;

                    return (
                        <div key={goal.id} className="card">
                            <div className="flex-between">
                                <span className="heading-sm">{goal.name}</span>
                                <span className="text-xs" style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: 4, color: isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                                    Due {new Date(goal.deadline).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex-between" style={{ marginTop: '1rem' }}>
                                <span className="text-sm">₹ {goal.currentAmount.toLocaleString()}</span>
                                <span className="text-sm text-muted">of ₹ {goal.targetAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', background: 'var(--bg-tertiary)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, background: progress === 100 ? 'var(--success)' : 'var(--primary)', height: '100%' }} />
                            </div>
                            <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                                <span className="text-xs text-muted">{progress.toFixed(0)}% reached</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Goals;
