import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FinancialEngine } from '../services/finance';
import { useUser } from '../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import type { UserProfile } from '../types';
import { ChevronRight, Briefcase, Wallet, Building2, User, Calendar, MapPin, Shield } from 'lucide-react';

// Premium Input Component - Defined OUTSIDE the main component
const PremiumInput: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    prefix?: string;
}> = ({ icon, label, value, onChange, placeholder, type = 'text', prefix }) => (
    <div style={{
        background: 'linear-gradient(145deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 16,
        padding: '0.875rem 1rem',
        transition: 'all 0.2s ease'
    }}>
        <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#10b981',
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.375rem'
        }}>
            {icon}
            {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {prefix && <span style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 600 }}>{prefix}</span>}
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f0f5f2',
                    fontSize: '1.125rem',
                    fontWeight: 500
                }}
            />
        </div>
    </div>
);

export const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [step, setStep] = useState(1);

    // Form State
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [cityTier, setCityTier] = useState<'Tier 1' | 'Tier 2' | 'Tier 3'>('Tier 1');
    const [riskProfile, setRiskProfile] = useState<'Conservative' | 'Balanced' | 'Aggressive'>('Balanced');

    const [salary, setSalary] = useState('');
    const [freelance, setFreelance] = useState('');
    const [otherIncome, setOtherIncome] = useState('');

    const handleSubmit = async () => {
        const totalIncome = Number(salary) + Number(freelance) + Number(otherIncome);
        const bracket = FinancialEngine.getIncomeBracket(totalIncome);

        const userId = uuidv4();

        const newUser: UserProfile = {
            id: userId,
            name,
            age: Number(age),
            monthlyIncome: totalIncome,
            cityTier,
            riskProfile,
            bracket,
            createdAt: new Date().toISOString()
        };

        await setUser(newUser);
        navigate('/');
    };

    return (
        <div className="container" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2.25rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981 0%, #d4af37 50%, #f4d03f 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    FinFlow
                </h1>
                <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>Your Personal Finance Companion</p>
            </div>

            {/* Step 1: Personal Details */}
            {step === 1 && (
                <div className="flex-col fade-in" style={{ gap: '1.25rem' }}>
                    {/* Welcome Card */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(15,26,20,0.9) 0%, rgba(10,16,13,0.95) 100%)',
                        borderRadius: 20,
                        padding: '1.5rem',
                        border: '1px solid rgba(16,185,129,0.1)',
                        textAlign: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <h2 className="heading-sm" style={{ marginBottom: '0.5rem' }}>Let's get to know you 👋</h2>
                        <p className="text-sm text-muted">Help us personalize your financial plan</p>
                    </div>

                    {/* Name & Age */}
                    <div className="flex-col" style={{ gap: '0.75rem' }}>
                        <PremiumInput
                            icon={<User size={14} />}
                            label="Your Name"
                            value={name}
                            onChange={setName}
                            placeholder="Enter your name"
                        />
                        <PremiumInput
                            icon={<Calendar size={14} />}
                            label="Your Age"
                            value={age}
                            onChange={setAge}
                            placeholder="25"
                            type="number"
                        />
                    </div>

                    {/* City Tier */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(15,26,20,0.9) 0%, rgba(10,16,13,0.95) 100%)',
                        borderRadius: 20,
                        padding: '1.25rem',
                        border: '1px solid rgba(16,185,129,0.08)'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.75rem'
                        }}>
                            <MapPin size={14} />
                            Where do you live?
                        </label>
                        <div className="flex-col" style={{ gap: '0.5rem' }}>
                            {([
                                { id: 'Tier 1', label: 'Tier 1', desc: 'Metro City' },
                                { id: 'Tier 2', label: 'Tier 2', desc: 'Urban' },
                                { id: 'Tier 3', label: 'Tier 3', desc: 'Town' },
                            ] as const).map(tier => (
                                <button
                                    key={tier.id}
                                    onClick={() => setCityTier(tier.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.875rem 1rem',
                                        borderRadius: 12,
                                        background: cityTier === tier.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${cityTier === tier.id ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.05)'}`,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{
                                            width: 18, height: 18, borderRadius: '50%',
                                            border: `2px solid ${cityTier === tier.id ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                                            background: cityTier === tier.id ? '#10b981' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {cityTier === tier.id && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                                        </span>
                                        <span className="font-medium">{tier.label}</span>
                                    </div>
                                    <span className="text-xs text-muted">{tier.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Risk Profile */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(15,26,20,0.9) 0%, rgba(10,16,13,0.95) 100%)',
                        borderRadius: 20,
                        padding: '1.25rem',
                        border: '1px solid rgba(16,185,129,0.08)'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.75rem'
                        }}>
                            <Shield size={14} />
                            Investment Risk Profile
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {([
                                { id: 'Conservative', color: '#10b981' },
                                { id: 'Balanced', color: '#d4af37' },
                                { id: 'Aggressive', color: '#ef4444' },
                            ] as const).map(risk => (
                                <button
                                    key={risk.id}
                                    onClick={() => setRiskProfile(risk.id)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 0.5rem',
                                        borderRadius: 12,
                                        background: riskProfile === risk.id ? `${risk.color}22` : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${riskProfile === risk.id ? risk.color : 'rgba(255,255,255,0.05)'}`,
                                        color: riskProfile === risk.id ? risk.color : 'var(--text-muted)',
                                        fontWeight: riskProfile === risk.id ? 600 : 400,
                                        fontSize: '0.75rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {risk.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={() => setStep(2)}
                        disabled={!name || !age}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '1rem',
                            borderRadius: 'var(--radius-full)',
                            background: name && age
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'rgba(255,255,255,0.1)',
                            color: name && age ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: name && age ? '0 4px 20px rgba(16,185,129,0.4)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Continue <ChevronRight size={18} />
                    </button>

                    {/* Progress Dots */}
                    <div className="flex-center" style={{ gap: '0.5rem' }}>
                        <div style={{ width: 24, height: 4, borderRadius: 2, background: '#10b981' }} />
                        <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
                    </div>
                </div>
            )}

            {/* Step 2: Income Details */}
            {step === 2 && (
                <div className="flex-col fade-in" style={{ gap: '1.25rem' }}>

                    {/* Income Header */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(15,26,20,0.9) 0%, rgba(10,16,13,0.95) 100%)',
                        borderRadius: 20,
                        padding: '1.5rem',
                        border: '1px solid rgba(16,185,129,0.1)',
                        textAlign: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <h2 className="heading-sm" style={{ marginBottom: '0.5rem' }}>Monthly Income 💰</h2>
                        <p className="text-sm text-muted">Tell us about your income sources</p>
                    </div>

                    {/* Income Inputs */}
                    <div className="flex-col" style={{ gap: '0.75rem' }}>
                        <PremiumInput
                            icon={<Briefcase size={14} />}
                            label="Monthly Salary"
                            value={salary}
                            onChange={setSalary}
                            placeholder="50000"
                            type="number"
                            prefix="₹"
                        />
                        <PremiumInput
                            icon={<Building2 size={14} />}
                            label="Freelance / Side Income"
                            value={freelance}
                            onChange={setFreelance}
                            placeholder="0"
                            type="number"
                            prefix="₹"
                        />
                        <PremiumInput
                            icon={<Wallet size={14} />}
                            label="Other Income"
                            value={otherIncome}
                            onChange={setOtherIncome}
                            placeholder="0"
                            type="number"
                            prefix="₹"
                        />
                    </div>

                    {/* Total Summary */}
                    {salary && (
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)',
                            borderRadius: 16,
                            padding: '1rem 1.25rem',
                            border: '1px solid rgba(16,185,129,0.25)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span className="text-sm font-medium">Total Monthly Income</span>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#10b981'
                            }}>
                                ₹ {(Number(salary) + Number(freelance) + Number(otherIncome)).toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!salary}
                        style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-full)',
                            background: salary
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'rgba(255,255,255,0.1)',
                            color: salary ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: salary ? '0 4px 20px rgba(16,185,129,0.4)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Build My Financial Plan 🚀
                    </button>

                    {/* Back Link */}
                    <button
                        onClick={() => setStep(1)}
                        className="text-center text-muted text-sm"
                        style={{ marginTop: '0.5rem' }}
                    >
                        ← Back to Profile
                    </button>

                    {/* Progress Dots */}
                    <div className="flex-center" style={{ gap: '0.5rem' }}>
                        <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ width: 24, height: 4, borderRadius: 2, background: '#10b981' }} />
                    </div>
                </div>
            )}
        </div>
    );
};
