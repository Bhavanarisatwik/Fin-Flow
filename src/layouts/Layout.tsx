import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, PieChart, TrendingUp, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="container">
            {/* Header - Clean, minimal */}
            <header className="flex-between" style={{ height: 'var(--header-height)', padding: '16px 0' }}>
                <h1 style={{
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #2DD4A7 0%, #4ADE80 50%, #F59E0B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                }}>
                    FinFlow
                </h1>

                {/* Profile Avatar - Subtle */}
                <button
                    onClick={() => navigate('/profile')}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </button>
            </header>

            <main style={{ paddingBottom: '32px' }}>
                {children}
            </main>

            {/* Bottom Nav - Premium, subtle */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                background: 'rgba(12, 17, 23, 0.95)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 100
            }}>
                <NavItem to="/" icon={<Home size={22} strokeWidth={1.5} />} label="Home" active={isActive('/')} />
                <NavItem to="/income" icon={<Wallet size={22} strokeWidth={1.5} />} label="Income" active={isActive('/income')} />
                <NavItem to="/expenses" icon={<PieChart size={22} strokeWidth={1.5} />} label="Expenses" active={isActive('/expenses')} />
                <NavItem to="/investments" icon={<TrendingUp size={22} strokeWidth={1.5} />} label="Invest" active={isActive('/investments')} />
                <NavItem to="/profile" icon={<User size={22} strokeWidth={1.5} />} label="Profile" active={isActive('/profile')} />
            </nav>
        </div>
    );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
    <Link to={to} className="flex-col flex-center" style={{
        color: active ? 'var(--primary)' : 'var(--text-dim)',
        gap: '4px',
        textDecoration: 'none',
        transition: 'color 0.2s ease'
    }}>
        {icon}
        <span style={{ fontSize: '0.65rem', fontWeight: active ? 600 : 400 }}>{label}</span>
    </Link>
);
