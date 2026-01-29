import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, LogOut, Settings, Award, ChevronRight, Lock, Shield } from 'lucide-react';
import { PinLock } from './PinLock';

export const Profile: React.FC = () => {
    const { user, logout } = useUser();
    const [showPinChange, setShowPinChange] = useState(false);
    const [pinExists, setPinExists] = useState(!!localStorage.getItem('finflow_pin'));

    if (!user) return null;

    // Show PIN setup/change modal
    if (showPinChange) {
        return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
                <PinLock
                    isSetup={true}
                    onUnlock={() => {
                        setShowPinChange(false);
                        setPinExists(true);
                    }}
                    onSetPin={() => {
                        setShowPinChange(false);
                        setPinExists(true);
                    }}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '0 1rem' }}>
            <h2 className="heading-md" style={{ marginBottom: '1.5rem' }}>Profile</h2>

            {/* User Card */}
            <div className="card flex-between" style={{ marginBottom: '2rem' }}>
                <div className="flex-col">
                    <span className="heading-sm">{user.name}</span>
                    <span className="text-sm text-muted">{user.cityTier} • {user.age} Years Old</span>
                </div>
                <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.25rem'
                }}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Settings */}
            <div className="flex-col" style={{ gap: '0.5rem' }}>
                <div className="card flex-between">
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <Award size={20} style={{ color: '#10b981' }} />
                        <span>Income Bracket</span>
                    </div>
                    <span className="text-sm font-medium" style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: 4 }}>
                        {user.bracket}
                    </span>
                </div>

                <div className="card flex-between">
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <Settings size={20} />
                        <span>Risk Profile</span>
                    </div>
                    <span className="text-sm font-medium">{user.riskProfile}</span>
                </div>

                {/* Security Section */}
                <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                    <span className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Security
                    </span>
                </div>

                <div
                    className="card flex-between"
                    onClick={() => setShowPinChange(true)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <Lock size={20} style={{ color: '#d4af37' }} />
                        <span>{pinExists ? 'Change PIN' : 'Set Up PIN'}</span>
                    </div>
                    <ChevronRight size={20} className="text-muted" />
                </div>

                <div
                    className="card flex-between"
                    onClick={() => window.location.href = '/loans'}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <Shield size={20} style={{ color: '#06b6d4' }} />
                        <span>Manage Loans</span>
                    </div>
                    <ChevronRight size={20} className="text-muted" />
                </div>
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: '2rem' }}>
                <span className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Danger Zone
                </span>
            </div>

            <button
                onClick={() => {
                    if (confirm('Are you sure you want to reset all app data? This cannot be undone.')) {
                        localStorage.removeItem('finflow_pin');
                        sessionStorage.removeItem('finflow_unlocked');
                        logout().then(() => window.location.reload());
                    }
                }}
                className="card flex-center"
                style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    color: 'var(--danger)',
                    gap: '0.5rem',
                    borderColor: 'rgba(239, 68, 68, 0.2)'
                }}
            >
                <LogOut size={20} />
                <span>Reset App & Data</span>
            </button>
        </div>
    );
};

export default Profile;
