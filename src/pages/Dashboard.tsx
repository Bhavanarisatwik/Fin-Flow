import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { NetWorthCard } from '../components/dashboard/NetWorthCard';
import { AllocationChart } from '../components/dashboard/AllocationChart';
import { HealthScore } from '../components/dashboard/HealthScore';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState<'Expense' | 'Invest' | null>(null);

    if (!user) return null;

    return (
        <div style={{ padding: '0 1rem' }}>
            <NetWorthCard user={user} />

            <div style={{ margin: '1.5rem 0' }}>
                <h2 className="heading-md" style={{ marginBottom: '1rem' }}>Overview</h2>
                <HealthScore user={user} />
            </div>

            <div style={{ margin: '1.5rem 0' }}>
                <AllocationChart bracket={user.bracket} />
            </div>

            {/* Quick Action Buttons roughly */}
            <div className="flex-between" style={{ gap: '1rem', marginTop: '1rem' }}>
                <button
                    onClick={() => setIsModalOpen('Expense')}
                    className="card flex-center"
                    style={{ flex: 1, padding: '1rem', background: 'var(--bg-secondary)', flexDirection: 'column' }}
                >
                    <span style={{ fontSize: '1.5rem' }}>💸</span>
                    <span className="text-sm font-medium" style={{ marginTop: '0.5rem' }}>Add Expense</span>
                </button>
                <button
                    onClick={() => setIsModalOpen('Invest')}
                    className="card flex-center"
                    style={{ flex: 1, padding: '1rem', background: 'var(--bg-secondary)', flexDirection: 'column' }}
                >
                    <span style={{ fontSize: '1.5rem' }}>📈</span>
                    <span className="text-sm font-medium" style={{ marginTop: '0.5rem' }}>Invest</span>
                </button>
            </div>

            <div style={{ height: 20 }} />

            <AddTransactionModal
                isOpen={!!isModalOpen}
                onClose={() => setIsModalOpen(null)}
                defaultType={isModalOpen || 'Expense'}
            />
        </div>
    );
};

export default Dashboard;
