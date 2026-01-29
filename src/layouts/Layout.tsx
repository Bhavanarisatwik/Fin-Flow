import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, PieChart, ShieldAlert, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="container">
            {/* Header with Logo and Profile */}
            <header className="flex-between" style={{ height: 'var(--header-height)', padding: '1rem 0' }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981 0%, #d4af37 50%, #f4d03f 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                }}>
                    FinFlow
                </h1>

                {/* Profile Avatar */}
                <button
                    onClick={() => navigate('/profile')}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: '2px solid rgba(212,175,55,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                    }}
                >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </button>
            </header>

            <main style={{ paddingBottom: '2rem' }}>
                {children}
            </main>

            {/* Premium Bottom Nav */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                background: 'linear-gradient(180deg, rgba(10,16,13,0.95) 0%, rgba(5,10,8,1) 100%)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(16,185,129,0.1)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 100
            }}>
                <NavItem to="/" icon={<Home size={22} />} label="Home" active={isActive('/')} />
                <NavItem to="/income" icon={<Wallet size={22} />} label="Income" active={isActive('/income')} />
                <NavItem to="/expenses" icon={<PieChart size={22} />} label="Expenses" active={isActive('/expenses')} />
                <NavItem to="/investments" icon={<ShieldAlert size={22} />} label="Invest" active={isActive('/investments')} />
                <NavItem to="/profile" icon={<User size={22} />} label="Profile" active={isActive('/profile')} />
            </nav>
        </div>
    );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
    <Link to={to} className="flex-col flex-center" style={{
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        gap: '0.3rem',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        transform: active ? 'scale(1.05)' : 'scale(1)'
    }}>
        {icon}
        <span style={{ fontSize: '0.65rem', fontWeight: active ? 600 : 400 }}>{label}</span>
    </Link>
);
