import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Shield, PiggyBank, Wallet, Target } from 'lucide-react';

export const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationStep(1), 200),
            setTimeout(() => setAnimationStep(2), 500),
            setTimeout(() => setAnimationStep(3), 800),
            setTimeout(() => setAnimationStep(4), 1100),
            setTimeout(() => setAnimationStep(5), 1400),
            setTimeout(() => setAnimationStep(6), 1700),
            setTimeout(() => setAnimationStep(7), 2000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const features = [
        { icon: <TrendingUp size={22} strokeWidth={1.5} />, title: 'Smart Investing', desc: 'AI-powered portfolio allocation', color: '#2DD4A7', delay: 0 },
        { icon: <PiggyBank size={22} strokeWidth={1.5} />, title: 'Loan Management', desc: 'Track EMIs & pay off faster', color: '#F59E0B', delay: 0.1 },
        { icon: <Shield size={22} strokeWidth={1.5} />, title: 'Financial Health', desc: 'Real-time insights & advice', color: '#C084FC', delay: 0.2 },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0C1117',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Animated Background Gradients */}
            <div style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(45,212,167,0.15) 0%, transparent 70%)',
                top: '-10%',
                right: '-15%',
                filter: 'blur(40px)',
                animation: animationStep >= 1 ? 'float1 6s ease-in-out infinite' : 'none',
                opacity: animationStep >= 1 ? 1 : 0,
                transition: 'opacity 1s ease'
            }} />
            <div style={{
                position: 'absolute',
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                bottom: '10%',
                left: '-10%',
                filter: 'blur(40px)',
                animation: animationStep >= 1 ? 'float2 8s ease-in-out infinite 1s' : 'none',
                opacity: animationStep >= 1 ? 1 : 0,
                transition: 'opacity 1s ease 0.3s'
            }} />
            <div style={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)',
                top: '40%',
                left: '60%',
                filter: 'blur(50px)',
                animation: animationStep >= 1 ? 'float3 7s ease-in-out infinite 0.5s' : 'none',
                opacity: animationStep >= 1 ? 1 : 0,
                transition: 'opacity 1s ease 0.5s'
            }} />

            {/* Floating Particles */}
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 4 + i * 2,
                        height: 4 + i * 2,
                        borderRadius: '50%',
                        background: i % 2 === 0 ? '#2DD4A7' : '#F59E0B',
                        top: `${20 + i * 15}%`,
                        left: i % 2 === 0 ? `${10 + i * 5}%` : 'auto',
                        right: i % 2 === 1 ? `${10 + i * 5}%` : 'auto',
                        opacity: animationStep >= 2 ? 0.4 : 0,
                        animation: animationStep >= 2 ? `particle${i % 3} ${4 + i}s ease-in-out infinite ${i * 0.2}s` : 'none',
                        transition: 'opacity 0.5s ease'
                    }}
                />
            ))}

            {/* Logo */}
            <div style={{
                opacity: animationStep >= 1 ? 1 : 0,
                transform: animationStep >= 1 ? 'translateY(0) scale(1)' : 'translateY(-40px) scale(0.8)',
                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                marginBottom: '20px',
                position: 'relative'
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #131A22 0%, #1C242E 100%)',
                    border: '1px solid rgba(45,212,167,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 60px rgba(45,212,167,0.1)',
                    position: 'relative',
                    animation: animationStep >= 2 ? 'logoPulse 3s ease-in-out infinite' : 'none'
                }}>
                    <Sparkles size={36} color="#2DD4A7" strokeWidth={1.5} style={{
                        animation: animationStep >= 2 ? 'iconSpin 4s linear infinite' : 'none'
                    }} />

                    {/* Orbiting Ring */}
                    <div style={{
                        position: 'absolute',
                        inset: -6,
                        borderRadius: 30,
                        border: '1px solid transparent',
                        borderTopColor: 'rgba(45,212,167,0.4)',
                        animation: animationStep >= 2 ? 'orbit 3s linear infinite' : 'none'
                    }} />
                </div>

                {/* Floating Icons Around Logo */}
                <Wallet size={16} style={{
                    position: 'absolute',
                    top: -10,
                    right: -15,
                    color: '#F59E0B',
                    opacity: animationStep >= 2 ? 0.7 : 0,
                    animation: animationStep >= 2 ? 'floatIcon 3s ease-in-out infinite' : 'none',
                    transition: 'opacity 0.5s ease'
                }} />
                <Target size={14} style={{
                    position: 'absolute',
                    bottom: -8,
                    left: -12,
                    color: '#C084FC',
                    opacity: animationStep >= 2 ? 0.7 : 0,
                    animation: animationStep >= 2 ? 'floatIcon 3s ease-in-out infinite 0.5s' : 'none',
                    transition: 'opacity 0.5s ease 0.2s'
                }} />
            </div>

            {/* Title with Gradient Animation */}
            <h1 style={{
                fontSize: '2.75rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2DD4A7 0%, #4ADE80 30%, #F59E0B 70%, #FBBF24 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em',
                marginBottom: '8px',
                opacity: animationStep >= 2 ? 1 : 0,
                transform: animationStep >= 2 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease-out',
                animation: animationStep >= 3 ? 'shimmer 4s ease-in-out infinite' : 'none'
            }}>
                FinFlow
            </h1>

            {/* Tagline */}
            <p style={{
                color: '#94A3B8',
                fontSize: '1rem',
                textAlign: 'center',
                maxWidth: 280,
                lineHeight: 1.6,
                marginBottom: '36px',
                opacity: animationStep >= 3 ? 1 : 0,
                transform: animationStep >= 3 ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.5s ease-out'
            }}>
                Your personal finance companion for{' '}
                <span style={{
                    color: '#2DD4A7',
                    fontWeight: 600,
                    textShadow: animationStep >= 4 ? '0 0 20px rgba(45,212,167,0.3)' : 'none',
                    transition: 'text-shadow 0.5s ease'
                }}>smarter money</span> decisions
            </p>

            {/* Feature Cards with Stagger Animation */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
                maxWidth: 360,
                marginBottom: '32px'
            }}>
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="pressable"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '18px 20px',
                            background: 'var(--bg-secondary)',
                            border: `1px solid ${feature.color}20`,
                            borderRadius: 16,
                            opacity: animationStep >= 4 + idx ? 1 : 0,
                            transform: animationStep >= 4 + idx
                                ? 'translateX(0) scale(1)'
                                : `translateX(${idx % 2 === 0 ? '-30px' : '30px'}) scale(0.95)`,
                            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${feature.delay}s`
                        }}
                    >
                        <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: 14,
                            background: `${feature.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: feature.color,
                            animation: animationStep >= 5 + idx ? `iconBounce 2s ease-in-out infinite ${idx * 0.3}s` : 'none'
                        }}>
                            {feature.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '2px' }}>
                                {feature.title}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Button with Glow */}
            <button
                onClick={() => navigate('/onboarding')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    maxWidth: 360,
                    padding: '16px',
                    borderRadius: 100,
                    background: 'linear-gradient(135deg, #2DD4A7 0%, #26B896 100%)',
                    color: '#0C1117',
                    fontWeight: 600,
                    fontSize: '1.0625rem',
                    boxShadow: '0 8px 30px rgba(45,212,167,0.4)',
                    opacity: animationStep >= 7 ? 1 : 0,
                    transform: animationStep >= 7 ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s ease-out',
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
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: animationStep >= 7 ? 'buttonShimmer 3s ease-in-out infinite' : 'none'
                }} />
                Get Started
                <ArrowRight size={20} strokeWidth={2} style={{
                    animation: animationStep >= 7 ? 'arrowPulse 1.5s ease-in-out infinite' : 'none'
                }} />
            </button>

            {/* Footer */}
            <p style={{
                marginTop: '24px',
                fontSize: '0.75rem',
                color: '#64748B',
                opacity: animationStep >= 7 ? 1 : 0,
                transition: 'opacity 0.5s ease-out 0.2s'
            }}>
                🔒 Secure · No ads · Your data stays on device
            </p>

            {/* CSS Keyframe Animations */}
            <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, 20px) scale(1.1); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(25px, -15px) scale(1.05); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-15px, 25px); }
                }
                @keyframes particle0 {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
                    50% { transform: translateY(-15px) rotate(180deg); opacity: 0.6; }
                }
                @keyframes particle1 {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                    50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
                }
                @keyframes particle2 {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
                    50% { transform: translateY(-25px) scale(1.2); opacity: 0.6; }
                }
                @keyframes logoPulse {
                    0%, 100% { box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 60px rgba(45,212,167,0.1); }
                    50% { box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(45,212,167,0.2); }
                }
                @keyframes iconSpin {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(10deg); }
                    75% { transform: rotate(-10deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes floatIcon {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes iconBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                @keyframes buttonShimmer {
                    0% { left: -100%; }
                    50%, 100% { left: 100%; }
                }
                @keyframes arrowPulse {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
};

export default Welcome;
