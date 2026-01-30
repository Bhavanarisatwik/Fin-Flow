import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { ScenarioEngine, type ScenarioType } from '../services/scenarios';

export const Advisor: React.FC = () => {
    const { user } = useUser();
    const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);

    if (!user) return null;

    const scenarios: ScenarioType[] = ['Job Loss', 'Medical Emergency', 'Inflation', 'Market Crash', 'Salary Hike'];

    const simulation = activeScenario
        ? ScenarioEngine.simulate(activeScenario, user.monthlyIncome, user.monthlyIncome * 0.5, 100000)
        : null;

    return (
        <div style={{ padding: '0 1rem' }}>
            <h2 className="heading-md" style={{ marginBottom: '1rem' }}>AI Simulator</h2>
            <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>
                Test how your finances handle life events. Tap a scenario to see the impact.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {scenarios.map(s => (
                    <button
                        key={s}
                        onClick={() => setActiveScenario(s === activeScenario ? null : s)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--bg-tertiary)',
                            background: activeScenario === s ? 'var(--primary)' : 'transparent',
                            color: activeScenario === s ? 'white' : 'var(--text-secondary)',
                            transition: 'all 0.2s',
                            fontSize: '0.875rem'
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {simulation && (
                <div className="card fade-in" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <h3 className="heading-sm" style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>
                        Impact: {simulation.scenario}
                    </h3>
                    <p className="text-sm" style={{ marginBottom: '1rem' }}>{simulation.impactDescription}</p>

                    <h4 className="text-xs font-medium text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Recommended Actions</h4>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                        {simulation.monthlyActionItems.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {!simulation && (
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🤖</span>
                    <p className="text-sm text-muted">Select a scenario above to get AI advice.</p>
                </div>
            )}
        </div>
    );
};

export default Advisor;

