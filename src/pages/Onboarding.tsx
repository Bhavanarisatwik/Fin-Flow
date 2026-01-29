import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FinancialEngine } from '../services/finance';
import { useUser } from '../context/UserContext';
import type { UserProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        monthlyIncome: '',
        cityTier: 'Tier 1' as const,
        riskProfile: 'Balanced' as const
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const income = Number(formData.monthlyIncome);
        const bracket = FinancialEngine.getIncomeBracket(income);

        const newUser: UserProfile = {
            id: uuidv4(),
            name: formData.name,
            age: Number(formData.age),
            monthlyIncome: income,
            cityTier: formData.cityTier,
            riskProfile: formData.riskProfile,
            bracket: bracket,
            createdAt: new Date().toISOString()
        };

        await setUser(newUser);
        navigate('/');
    };

    return (
        <div className="container flex-center">
            <div className="card" style={{ width: '100%', padding: '2rem' }}>
                <h2 className="heading-lg" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome to FinFlow</h2>
                <p className="text-muted" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    Let's set up your financial profile to get started.
                </p>

                <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '1rem' }}>
                    <div className="flex-col">
                        <label className="text-sm font-medium">Name</label>
                        <input
                            type="text"
                            required
                            className="input"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">Age</label>
                        <input
                            type="number"
                            required
                            min="18" max="100"
                            className="input"
                            value={formData.age}
                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">Monthly Income (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="input"
                            value={formData.monthlyIncome}
                            onChange={e => setFormData({ ...formData, monthlyIncome: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">City Tier</label>
                        <select
                            required
                            className="input"
                            value={formData.cityTier}
                            onChange={e => setFormData({ ...formData, cityTier: e.target.value as any })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--bg-primary)', color: 'white' }}
                        >
                            <option value="Tier 1">Tier 1 (Metro)</option>
                            <option value="Tier 2">Tier 2</option>
                            <option value="Tier 3">Tier 3</option>
                        </select>
                    </div>

                    <div className="flex-col">
                        <label className="text-sm font-medium">Risk Appetite</label>
                        <select
                            required
                            className="input"
                            value={formData.riskProfile}
                            onChange={e => setFormData({ ...formData, riskProfile: e.target.value as any })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--bg-primary)', color: 'white' }}
                        >
                            <option value="Conservative">Conservative (Low Risk)</option>
                            <option value="Balanced">Balanced (Medium Risk)</option>
                            <option value="Aggressive">Aggressive (High Risk)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    >
                        Create My Plan
                    </button>
                </form>
            </div>
        </div>
    );
};
