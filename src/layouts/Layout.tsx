import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Target, ShieldAlert, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="container">
            <header className="flex-between" style={{ height: 'var(--header-height)', padding: '1rem 0' }}>
                <h1 className="heading-md" style={{ background: 'linear-gradient(to right, var(--primary), var(--info))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    FinFlow
                </h1>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)' }} />
            </header>

            <main style={{ paddingBottom: '2rem' }}>
                {children}
            </main>

            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'var(--bottom-nav-height)',
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--bg-tertiary)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 100
            }}>
                <NavItem to="/" icon={<Home size={20} />} label="Home" active={isActive('/')} />
                <NavItem to="/investments" icon={<PieChart size={20} />} label="Invest" active={isActive('/investments')} />
                <NavItem to="/goals" icon={<Target size={20} />} label="Goals" active={isActive('/goals')} />
                <NavItem to="/advisor" icon={<ShieldAlert size={20} />} label="Advisor" active={isActive('/advisor')} />
                <NavItem to="/profile" icon={<User size={20} />} label="Profile" active={isActive('/profile')} />
            </nav>
        </div>
    );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
    <Link to={to} className="flex-col flex-center" style={{
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        gap: '0.25rem',
        textDecoration: 'none',
        transition: 'color 0.2s'
    }}>
        {icon}
        <span className="text-xs" style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
    </Link>
);
