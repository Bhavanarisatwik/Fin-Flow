import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/storage';
import {
    ChevronLeft, Settings as SettingsIcon, Percent, TrendingUp,
    Shield, Trash2, Lock, ChevronRight, Save, LogOut
} from 'lucide-react';

interface FinancialSettings {
    savingsTarget: number;
    investmentTarget: number;
    expenseLimit: number;
    emergencyFundMonths: number;
}

export const Settings: React.FC = () => {
    const { user, updateUser } = useUser();
    const navigate = useNavigate();

    const [showResetModal, setShowResetModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [resetPin, setResetPin] = useState('');
    const [resetError, setResetError] = useState('');
    const [logoutPin, setLogoutPin] = useState('');
    const [logoutError, setLogoutError] = useState('');

    // Financial settings with defaults
    const [settings, setSettings] = useState<FinancialSettings>({
        savingsTarget: user?.financialSettings?.savingsTarget || 30,
        investmentTarget: user?.financialSettings?.investmentTarget || 20,
        expenseLimit: user?.financialSettings?.expenseLimit || 70,
        emergencyFundMonths: user?.financialSettings?.emergencyFundMonths || 6
    });

    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const handleSave = async () => {
        setIsSaving(true);
        await updateUser({ financialSettings: settings });
        setTimeout(() => setIsSaving(false), 500);
    };

    const handleResetApp = async () => {
        const storedPin = localStorage.getItem('finflow_pin');

        if (storedPin && resetPin !== storedPin) {
            setResetError('Incorrect PIN');
            return;
        }

        // Clear all data
        await db.transactions.where({ userId: user.id }).delete();
        await db.loans.where({ userId: user.id }).delete();
        await db.goals.where({ userId: user.id }).delete();

        // Reset user settings
        await updateUser({
            financialSettings: undefined,
            categoryBudgets: undefined
        });

        setShowResetModal(false);
        navigate('/');
    };

    const handleLogout = async () => {
        const storedPin = localStorage.getItem('finflow_pin');

        if (storedPin && logoutPin !== storedPin) {
            setLogoutError('Incorrect PIN');
            return;
        }

        // Clear ALL data
        await db.transactions.where({ userId: user.id }).delete();
        await db.loans.where({ userId: user.id }).delete();
        await db.goals.where({ userId: user.id }).delete();
        await db.users.delete(user.id);

        localStorage.removeItem('finflow_pin');
        sessionStorage.removeItem('finflow_unlocked');

        window.location.href = '/welcome';
    };

    const settingItems = [
        {
            label: 'Savings Target',
            description: 'Monthly income to save',
            value: settings.savingsTarget,
            key: 'savingsTarget' as const,
            suffix: '%',
            icon: <TrendingUp size={18} strokeWidth={1.5} />,
            color: '#4ADE80'
        },
        {
            label: 'Investment Target',
            description: 'Monthly income to invest',
            value: settings.investmentTarget,
            key: 'investmentTarget' as const,
            suffix: '%',
            icon: <Percent size={18} strokeWidth={1.5} />,
            color: '#C084FC'
        },
        {
            label: 'Expense Limit',
            description: 'Max spending as % of income',
            value: settings.expenseLimit,
            key: 'expenseLimit' as const,
            suffix: '%',
            icon: <Shield size={18} strokeWidth={1.5} />,
            color: '#FB7185'
        },
        {
            label: 'Emergency Fund',
            description: 'Months of expenses to save',
            value: settings.emergencyFundMonths,
            key: 'emergencyFundMonths' as const,
            suffix: ' months',
            icon: <Shield size={18} strokeWidth={1.5} />,
            color: '#F59E0B'
        }
    ];

    return (
        <div style={{ padding: '0 16px', paddingBottom: '32px' }} className="fade-in">
            {/* Header */}
            <div className="flex-center" style={{ marginBottom: '24px', position: 'relative' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', left: 0, padding: '8px', color: 'var(--text-muted)' }}
                >
                    <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Settings</h2>
            </div>

            {/* Financial Settings */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div className="flex-center" style={{ gap: '8px', marginBottom: '16px' }}>
                    <SettingsIcon size={18} strokeWidth={1.5} style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Financial Goals</h3>
                </div>

                <div className="flex-col" style={{ gap: '16px' }}>
                    {settingItems.map((item) => (
                        <div key={item.key}>
                            <div className="flex-between" style={{ marginBottom: '8px' }}>
                                <div className="flex-center" style={{ gap: '10px' }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        background: `${item.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: item.color
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.label}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description}</p>
                                    </div>
                                </div>
                                <div className="flex-center" style={{ gap: '4px' }}>
                                    <input
                                        type="number"
                                        value={item.value}
                                        onChange={(e) => setSettings({ ...settings, [item.key]: Number(e.target.value) })}
                                        style={{
                                            width: 60,
                                            padding: '8px',
                                            borderRadius: 8,
                                            background: 'var(--bg-tertiary)',
                                            border: '1px solid var(--border-medium)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            textAlign: 'right'
                                        }}
                                    />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', minWidth: 50 }}>{item.suffix}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSave}
                    style={{
                        width: '100%',
                        marginTop: '20px',
                        padding: '12px',
                        borderRadius: '100px',
                        background: 'var(--primary)',
                        color: '#0C1117',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Save size={16} strokeWidth={2} />
                    {isSaving ? 'Saved!' : 'Save Settings'}
                </button>
            </div>

            {/* Quick Links */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
            }}>
                <button
                    onClick={() => navigate('/categories')}
                    className="flex-between"
                    style={{ width: '100%', padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}
                >
                    <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Category Budgets</span>
                    <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex-between"
                    style={{ width: '100%', padding: '16px' }}
                >
                    <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Profile Settings</span>
                    <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </button>
            </div>

            {/* Danger Zone */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(251,113,133,0.2)'
            }}>
                <h3 style={{ fontWeight: 600, color: '#FB7185', marginBottom: '12px' }}>Danger Zone</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Reset will delete all transactions, loans, and goals. This cannot be undone.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={() => setShowResetModal(true)}
                        className="flex-center"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '100px',
                            background: 'rgba(251,113,133,0.1)',
                            color: '#FB7185',
                            fontWeight: 600,
                            gap: '8px',
                            border: '1px solid rgba(251,113,133,0.2)'
                        }}
                    >
                        <Trash2 size={16} strokeWidth={1.5} />
                        Reset App Data
                    </button>

                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex-center"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '100px',
                            background: 'rgba(245,158,11,0.1)',
                            color: '#F59E0B',
                            fontWeight: 600,
                            gap: '8px',
                            border: '1px solid rgba(245,158,11,0.2)'
                        }}
                    >
                        <LogOut size={16} strokeWidth={1.5} />
                        Logout & Restart App
                    </button>
                </div>
            </div>

            {/* Reset Modal */}
            {showResetModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '20px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: 340,
                        border: '1px solid var(--border-subtle)'
                    }}>
                        <div className="flex-center" style={{ gap: '8px', marginBottom: '16px' }}>
                            <Lock size={20} strokeWidth={1.5} style={{ color: '#FB7185' }} />
                            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Enter PIN to Reset</h3>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>
                            This will permanently delete all your app data.
                        </p>

                        <input
                            type="password"
                            maxLength={6}
                            value={resetPin}
                            onChange={(e) => {
                                setResetPin(e.target.value);
                                setResetError('');
                            }}
                            placeholder="Enter your PIN"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'var(--bg-tertiary)',
                                border: resetError ? '1px solid #FB7185' : '1px solid var(--border-medium)',
                                color: 'var(--text-primary)',
                                fontSize: '1.25rem',
                                textAlign: 'center',
                                letterSpacing: '0.5em',
                                marginBottom: '8px'
                            }}
                        />

                        {resetError && (
                            <p style={{ fontSize: '0.75rem', color: '#FB7185', textAlign: 'center', marginBottom: '12px' }}>
                                {resetError}
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                                onClick={() => {
                                    setShowResetModal(false);
                                    setResetPin('');
                                    setResetError('');
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '100px',
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetApp}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '100px',
                                    background: '#FB7185',
                                    color: '#0C1117',
                                    fontWeight: 600
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {showLogoutModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '20px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: 340,
                        border: '1px solid var(--border-subtle)'
                    }}>
                        <div className="flex-center" style={{ gap: '8px', marginBottom: '16px' }}>
                            <LogOut size={20} strokeWidth={1.5} style={{ color: '#F59E0B' }} />
                            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Logout & Restart</h3>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>
                            This will delete ALL data and restart from Welcome page.
                        </p>

                        <input
                            type="password"
                            maxLength={6}
                            value={logoutPin}
                            onChange={(e) => {
                                setLogoutPin(e.target.value);
                                setLogoutError('');
                            }}
                            placeholder="Enter your PIN"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'var(--bg-tertiary)',
                                border: logoutError ? '1px solid #FB7185' : '1px solid var(--border-medium)',
                                color: 'var(--text-primary)',
                                fontSize: '1.25rem',
                                textAlign: 'center',
                                letterSpacing: '0.5em',
                                marginBottom: '8px'
                            }}
                        />

                        {logoutError && (
                            <p style={{ fontSize: '0.75rem', color: '#FB7185', textAlign: 'center', marginBottom: '12px' }}>
                                {logoutError}
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    setLogoutPin('');
                                    setLogoutError('');
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '100px',
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '100px',
                                    background: '#F59E0B',
                                    color: '#0C1117',
                                    fontWeight: 600
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
