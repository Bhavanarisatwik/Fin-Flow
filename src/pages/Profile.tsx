import React from 'react';
import { useUser } from '../context/UserContext';
import { User, LogOut, Settings, Award } from 'lucide-react';

export const Profile: React.FC = () => {
    const { user, logout } = useUser();
    if (!user) return null;

    return (
        <div style={{ padding: '0 1rem' }}>
            <h2 className="heading-md" style={{ marginBottom: '1.5rem' }}>Profile</h2>

            <div className="card flex-between" style={{ marginBottom: '2rem' }}>
                <div className="flex-col">
                    <span className="heading-sm">{user.name}</span>
                    <span className="text-sm text-muted">{user.cityTier} • {user.age} Years Old</span>
                </div>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} />
                </div>
            </div>

            <div className="flex-col" style={{ gap: '0.5rem' }}>
                <div className="card flex-between">
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <Award size={20} className="text-success" />
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
            </div>

            <button
                onClick={() => logout().then(() => window.location.reload())}
                className="card flex-center"
                style={{
                    width: '100%',
                    marginTop: '2rem',
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
