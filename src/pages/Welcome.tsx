import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Shield, PiggyBank, Coins } from 'lucide-react';

export const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationStep(1), 300),
            setTimeout(() => setAnimationStep(2), 800),
            setTimeout(() => setAnimationStep(3), 1200),
            setTimeout(() => setAnimationStep(4), 1600),
            setTimeout(() => setAnimationStep(5), 2000),
            setTimeout(() => setAnimationStep(6), 2400),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const features = [
        { icon: <TrendingUp size={24} />, title: 'Smart Investing', desc: 'AI-powered portfolio allocation' },
        { icon: <PiggyBank size={24} />, title: 'Loan Management', desc: 'Track EMIs & pay off faster' },
        { icon: <Shield size={24} />, title: 'Financial Health', desc: 'Real-time insights & advice' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #050a08 0%, #0a100d 50%, #0f1a14 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Animated Floating Coins */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 20 + i * 8,
                        height: 20 + i * 8,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${i % 2 === 0 ? '#10b981' : '#d4af37'} 0%, ${i % 2 === 0 ? '#059669' : '#b8942e'} 100%)`,
                        top: `${15 + i * 12}%`,
                        left: i % 2 === 0 ? `${5 + i * 3}%` : 'auto',
                        right: i % 2 === 1 ? `${5 + i * 3}%` : 'auto',
                        opacity: animationStep >= 1 ? 0.3 : 0,
                        animation: animationStep >= 1 ? `float${i % 3} ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s` : 'none',
                        filter: 'blur(1px)',
                        transition: 'opacity 1s ease-out'
                    }}
                />
            ))}

            {/* Glowing Background Orbs */}
            <div style={{
                position: 'absolute',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 60%)',
                top: '-15%',
                right: '-25%',
                animation: animationStep >= 1 ? 'orb1 6s ease-in-out infinite' : 'none',
                filter: 'blur(60px)',
                opacity: animationStep >= 1 ? 1 : 0,
                transition: 'opacity 1.5s ease-out'
            }} />
            <div style={{
                position: 'absolute',
                width: 350,
                height: 350,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)',
                bottom: '5%',
                left: '-20%',
                animation: animationStep >= 1 ? 'orb2 7s ease-in-out infinite 1s' : 'none',
                filter: 'blur(50px)',
                opacity: animationStep >= 1 ? 1 : 0,
                transition: 'opacity 1.5s ease-out 0.5s'
            }} />

            {/* Logo with Entrance Animation */}
            <div style={{
                opacity: animationStep >= 1 ? 1 : 0,
                transform: animationStep >= 1 ? 'translateY(0) scale(1) rotate(0deg)' : 'translateY(-50px) scale(0.5) rotate(-20deg)',
                transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                marginBottom: '1.25rem',
                position: 'relative'
            }}>
                <div style={{
                    width: 90,
                    height: 90,
                    borderRadius: 28,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 40%, #d4af37 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 25px 70px rgba(16,185,129,0.5)',
                    position: 'relative',
                    animation: animationStep >= 2 ? 'logoPulse 3s ease-in-out infinite' : 'none'
                }}>
                    <Sparkles size={44} color="white" style={{
                        animation: animationStep >= 2 ? 'sparkle 2s ease-in-out infinite' : 'none'
                    }} />

                    {/* Rotating Ring */}
                    <div style={{
                        position: 'absolute',
                        inset: -8,
                        border: '2px solid transparent',
                        borderTopColor: '#10b981',
                        borderRightColor: '#d4af37',
                        borderRadius: 36,
                        animation: animationStep >= 2 ? 'spin 4s linear infinite' : 'none',
                        opacity: 0.6
                    }} />
                </div>

                {/* Orbiting Coins */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 140,
                    height: 140,
                    marginTop: -70,
                    marginLeft: -70,
                    animation: animationStep >= 2 ? 'orbit 8s linear infinite' : 'none'
                }}>
                    <Coins size={18} style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        marginLeft: -9,
                        color: '#d4af37',
                        opacity: animationStep >= 2 ? 0.7 : 0,
                        transition: 'opacity 0.5s'
                    }} />
                </div>
            </div>

            {/* Title with Letter Animation */}
            <h1 style={{
                fontSize: '3.25rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 25%, #d4af37 60%, #f4d03f 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em',
                marginBottom: '0.625rem',
                opacity: animationStep >= 2 ? 1 : 0,
                transform: animationStep >= 2 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: animationStep >= 3 ? 'shimmer 3s ease-in-out infinite' : 'none'
            }}>
                FinFlow
            </h1>

            {/* Animated Tagline */}
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                textAlign: 'center',
                maxWidth: 300,
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                opacity: animationStep >= 3 ? 1 : 0,
                transform: animationStep >= 3 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s ease-out'
            }}>
                Your personal finance companion for{' '}
                <span style={{
                    color: '#10b981',
                    fontWeight: 600,
                    textShadow: animationStep >= 3 ? '0 0 20px rgba(16,185,129,0.4)' : 'none',
                    transition: 'text-shadow 1s ease-out'
                }}>smarter money</span> decisions
            </p>

            {/* Feature Cards with Stagger */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                width: '100%',
                maxWidth: 380,
                marginBottom: '2rem'
            }}>
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1.125rem 1.25rem',
                            background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)',
                            border: '1px solid rgba(16,185,129,0.2)',
                            borderRadius: 18,
                            opacity: animationStep >= 4 + idx ? 1 : 0,
                            transform: animationStep >= 4 + idx
                                ? 'translateX(0) scale(1)'
                                : `translateX(${idx % 2 === 0 ? '-40px' : '40px'}) scale(0.95)`,
                            transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.12}s`,
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(212,175,55,0.15) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981',
                            boxShadow: '0 4px 15px rgba(16,185,129,0.2)',
                            animation: animationStep >= 4 + idx ? `iconFloat 3s ease-in-out infinite ${idx * 0.5}s` : 'none'
                        }}>
                            {feature.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f0f5f2', marginBottom: '0.2rem' }}>
                                {feature.title}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Animated CTA Button */}
            <button
                onClick={() => navigate('/onboarding')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    maxWidth: 380,
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    boxShadow: '0 10px 40px rgba(16,185,129,0.5)',
                    opacity: animationStep >= 6 ? 1 : 0,
                    transform: animationStep >= 6 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: animationStep >= 6 ? 'buttonPulse 2s ease-in-out infinite' : 'none',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Shimmer Effect */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: animationStep >= 6 ? 'buttonShimmer 3s ease-in-out infinite' : 'none'
                }} />
                Get Started
                <ArrowRight size={22} style={{
                    animation: animationStep >= 6 ? 'arrowBounce 1.5s ease-in-out infinite' : 'none'
                }} />
            </button>

            {/* Footer */}
            <p style={{
                marginTop: '1.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                opacity: animationStep >= 6 ? 0.7 : 0,
                transition: 'opacity 0.6s ease-out 0.3s'
            }}>
                🔒 100% secure · No ads · Your data stays on device
            </p>

            {/* CSS Keyframe Animations */}
            <style>{`
                @keyframes orb1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-20px, 30px) scale(1.1); }
                    66% { transform: translate(20px, -20px) scale(0.95); }
                }
                @keyframes orb2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -30px) scale(1.15); }
                }
                @keyframes float0 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                @keyframes float1 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(-15deg); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(12deg); }
                }
                @keyframes logoPulse {
                    0%, 100% { box-shadow: 0 25px 70px rgba(16,185,129,0.5); }
                    50% { box-shadow: 0 30px 90px rgba(16,185,129,0.7), 0 0 40px rgba(212,175,55,0.3); }
                }
                @keyframes sparkle {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.1) rotate(10deg); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes buttonPulse {
                    0%, 100% { box-shadow: 0 10px 40px rgba(16,185,129,0.5); }
                    50% { box-shadow: 0 15px 50px rgba(16,185,129,0.7); }
                }
                @keyframes buttonShimmer {
                    0% { left: -100%; }
                    50%, 100% { left: 100%; }
                }
                @keyframes arrowBounce {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default Welcome;
