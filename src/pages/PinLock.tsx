import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Delete, Check, Fingerprint } from 'lucide-react';

interface Props {
    onUnlock: () => void;
    isSetup?: boolean;
    onSetPin?: (pin: string) => void;
}

export const PinLock: React.FC<Props> = ({ onUnlock, isSetup = false, onSetPin }) => {
    const [pin, setPin] = useState<string[]>([]);
    const [confirmPin, setConfirmPin] = useState<string[]>([]);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    const storedPin = localStorage.getItem('finflow_pin');
    const maxLength = 4;

    useEffect(() => {
        if (pin.length === maxLength && !isSetup) {
            if (pin.join('') === storedPin) {
                setSuccess(true);
                setTimeout(onUnlock, 400);
            } else {
                setError('Incorrect PIN');
                setTimeout(() => {
                    setPin([]);
                    setError('');
                }, 600);
            }
        }
    }, [pin, storedPin, onUnlock, isSetup]);

    useEffect(() => {
        if (isSetup && isConfirming && confirmPin.length === maxLength) {
            if (pin.join('') === confirmPin.join('')) {
                const newPin = pin.join('');
                localStorage.setItem('finflow_pin', newPin);
                setSuccess(true);
                onSetPin?.(newPin);
                setTimeout(onUnlock, 400);
            } else {
                setError('PINs do not match');
                setTimeout(() => {
                    setConfirmPin([]);
                    setError('');
                }, 600);
            }
        }
    }, [confirmPin, pin, isSetup, isConfirming, onUnlock, onSetPin]);

    const handleDigit = useCallback((digit: string) => {
        if (error || success) return;

        // Haptic feedback simulation
        setPressedKey(digit);
        setTimeout(() => setPressedKey(null), 150);

        if (isSetup) {
            if (!isConfirming) {
                if (pin.length < maxLength) {
                    const newPin = [...pin, digit];
                    setPin(newPin);
                    if (newPin.length === maxLength) {
                        setTimeout(() => setIsConfirming(true), 250);
                    }
                }
            } else {
                if (confirmPin.length < maxLength) {
                    setConfirmPin([...confirmPin, digit]);
                }
            }
        } else {
            if (pin.length < maxLength) {
                setPin([...pin, digit]);
            }
        }
    }, [error, success, isSetup, isConfirming, pin, confirmPin, maxLength]);

    const handleDelete = useCallback(() => {
        if (error || success) return;
        setPressedKey('del');
        setTimeout(() => setPressedKey(null), 150);

        if (isSetup && isConfirming) {
            setConfirmPin(confirmPin.slice(0, -1));
        } else {
            setPin(pin.slice(0, -1));
        }
    }, [error, success, isSetup, isConfirming, pin, confirmPin]);

    const currentPin = isSetup && isConfirming ? confirmPin : pin;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #050a08 0%, #0a100d 50%, #0f1a14 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <div style={{
                position: 'absolute',
                width: 350,
                height: 350,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 60%)',
                top: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                filter: 'blur(80px)',
                animation: 'breathe 4s ease-in-out infinite'
            }} />

            {/* Lock Icon */}
            <div style={{
                width: 90,
                height: 90,
                borderRadius: 28,
                background: success
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : error
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(212,175,55,0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                border: `2px solid ${success ? '#10b981' : error ? '#ef4444' : 'rgba(16,185,129,0.3)'}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: error ? 'shake 0.4s ease-in-out' : success ? 'success-pop 0.4s ease-out' : 'none',
                boxShadow: success ? '0 0 40px rgba(16,185,129,0.5)' : error ? '0 0 40px rgba(239,68,68,0.3)' : '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                {success ? (
                    <Check size={44} color="white" style={{ animation: 'check-draw 0.3s ease-out' }} />
                ) : (
                    <Lock size={40} color={error ? '#fff' : '#10b981'} />
                )}
            </div>

            {/* Title */}
            <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#f0f5f2',
                marginBottom: '0.5rem',
                textAlign: 'center'
            }}>
                {isSetup
                    ? (isConfirming ? 'Confirm PIN' : 'Create PIN')
                    : 'Welcome Back'
                }
            </h2>
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginBottom: '2rem',
                textAlign: 'center',
                maxWidth: 260
            }}>
                {isSetup
                    ? (isConfirming ? 'Re-enter your 4-digit PIN' : 'Set a 4-digit PIN to secure FinFlow')
                    : 'Enter your PIN to unlock'
                }
            </p>

            {/* PIN Dots */}
            <div style={{
                display: 'flex',
                gap: '1.25rem',
                marginBottom: '2.5rem'
            }}>
                {[...Array(maxLength)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: currentPin.length > i
                                ? (error ? '#ef4444' : 'linear-gradient(135deg, #10b981 0%, #d4af37 100%)')
                                : 'rgba(255,255,255,0.08)',
                            border: `2px solid ${error ? '#ef4444' : currentPin.length > i ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: currentPin.length === i + 1 ? 'scale(1.2)' : currentPin.length > i ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: currentPin.length > i ? '0 0 20px rgba(16,185,129,0.5)' : 'none',
                            animation: currentPin.length === i + 1 ? 'dot-pop 0.2s ease-out' : 'none'
                        }}
                    />
                ))}
            </div>

            {/* Error Message */}
            <div style={{ height: 24, marginBottom: '0.5rem' }}>
                {error && (
                    <p style={{
                        color: '#ef4444',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        animation: 'fade-in 0.2s ease-out'
                    }}>
                        {error}
                    </p>
                )}
            </div>

            {/* Number Pad */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.875rem',
                maxWidth: 300
            }}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (key === 'del') handleDelete();
                            else if (key) handleDigit(key);
                        }}
                        disabled={!key || success}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 24,
                            background: key
                                ? pressedKey === key
                                    ? 'linear-gradient(145deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.1) 100%)'
                                    : 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
                                : 'transparent',
                            border: key ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: key === 'del' ? '0' : '2rem',
                            fontWeight: 500,
                            color: '#f0f5f2',
                            cursor: key ? 'pointer' : 'default',
                            transition: 'all 0.15s ease',
                            transform: pressedKey === key ? 'scale(0.95)' : 'scale(1)',
                            boxShadow: pressedKey === key ? 'inset 0 2px 4px rgba(0,0,0,0.3)' : 'none'
                        }}
                    >
                        {key === 'del' ? <Delete size={26} color={pressedKey === 'del' ? '#ef4444' : '#a8c4b5'} /> : key}
                    </button>
                ))}
            </div>

            {/* Biometric Hint (visual only) */}
            <div style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                opacity: 0.6
            }}>
                <Fingerprint size={18} />
                <span style={{ fontSize: '0.75rem' }}>Use fingerprint if available</span>
            </div>

            {/* Skip option for setup */}
            {isSetup && !isConfirming && (
                <button
                    onClick={onUnlock}
                    style={{
                        marginTop: '1.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem'
                    }}
                >
                    Skip for now
                </button>
            )}

            {/* CSS Animations */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    15%, 45%, 75% { transform: translateX(-12px); }
                    30%, 60%, 90% { transform: translateX(12px); }
                }
                @keyframes success-pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                @keyframes dot-pop {
                    0% { transform: scale(0.8); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1.05); }
                }
                @keyframes check-draw {
                    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes breathe {
                    0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
                }
            `}</style>
        </div>
    );
};

export default PinLock;
