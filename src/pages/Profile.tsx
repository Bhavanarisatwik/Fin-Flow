import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Award, ChevronRight, Lock, Shield, Sliders } from 'lucide-react';
import { PinLock } from './PinLock';

export const Profile: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [showPinChange, setShowPinChange] = useState(false);
    const [pinExists, setPinExists] = useState(!!localStorage.getItem('finflow_pin'));

    if (!user) return null;

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
        <div style={{ padding: '0 16px', paddingBottom: '32px' }} className="fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '24px' }}>Profile</h2>

            {/* User Card */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.125rem' }}>{user.name}</span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>{user.cityTier} • {user.age} Years Old</p>
                </div>
                <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2DD4A7 0%, #26B896 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0C1117',
                    fontWeight: 700,
                    fontSize: '1.25rem'
                }}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Quick Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <div className="pressable" style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '14px',
                    padding: '16px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <Award size={18} strokeWidth={1.5} style={{ color: '#2DD4A7' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>Income Bracket</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 6 }}>
                        {user.bracket}
                    </span>
                </div>

                <div className="pressable" style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '14px',
                    padding: '16px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <Settings size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>Risk Profile</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.riskProfile}</span>
                </div>
            </div>

            {/* Settings */}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Settings
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                    onClick={() => navigate('/settings')}
                    className="pressable"
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '14px',
                        padding: '16px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <Sliders size={18} strokeWidth={1.5} style={{ color: '#C084FC' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>App Settings</span>
                    </div>
                    <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </button>

                <button
                    onClick={() => setShowPinChange(true)}
                    className="pressable"
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '14px',
                        padding: '16px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <Lock size={18} strokeWidth={1.5} style={{ color: '#F59E0B' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{pinExists ? 'Change PIN' : 'Set Up PIN'}</span>
                    </div>
                    <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </button>

                <button
                    onClick={() => navigate('/loans')}
                    className="pressable"
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '14px',
                        padding: '16px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <Shield size={18} strokeWidth={1.5} style={{ color: '#38BDF8' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>Manage Loans</span>
                    </div>
                    <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </button>
            </div>
        </div>
    );
};

export default Profile;
