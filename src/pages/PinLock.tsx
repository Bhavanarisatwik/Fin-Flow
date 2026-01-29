import React, { useState, useEffect } from 'react';
import { Lock, Delete, Check } from 'lucide-react';

interface Props {
    onUnlock: () => void;
    isSetup?: boolean; // true = setting up new PIN, false = entering existing PIN
    onSetPin?: (pin: string) => void;
}

export const PinLock: React.FC<Props> = ({ onUnlock, isSetup = false, onSetPin }) => {
    const [pin, setPin] = useState<string[]>([]);
    const [confirmPin, setConfirmPin] = useState<string[]>([]);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const storedPin = localStorage.getItem('finflow_pin');
    const maxLength = 4;

    useEffect(() => {
        // Check if PIN is complete
        if (pin.length === maxLength && !isSetup) {
            // Verify PIN
            if (pin.join('') === storedPin) {
                setSuccess(true);
                setTimeout(onUnlock, 500);
            } else {
                setError('Incorrect PIN');
                setTimeout(() => {
                    setPin([]);
                    setError('');
                }, 800);
            }
        }
    }, [pin, storedPin, onUnlock, isSetup]);

    useEffect(() => {
        // Handle PIN setup confirmation
        if (isSetup && isConfirming && confirmPin.length === maxLength) {
            if (pin.join('') === confirmPin.join('')) {
                const newPin = pin.join('');
                localStorage.setItem('finflow_pin', newPin);
                setSuccess(true);
                onSetPin?.(newPin);
                setTimeout(onUnlock, 500);
            } else {
                setError('PINs do not match');
                setTimeout(() => {
                    setConfirmPin([]);
                    setError('');
                }, 800);
            }
        }
    }, [confirmPin, pin, isSetup, isConfirming, onUnlock, onSetPin]);

    const handleDigit = (digit: string) => {
        if (error) return;

        if (isSetup) {
            if (!isConfirming) {
                if (pin.length < maxLength) {
                    const newPin = [...pin, digit];
                    setPin(newPin);
                    if (newPin.length === maxLength) {
                        setTimeout(() => setIsConfirming(true), 300);
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
    };

    const handleDelete = () => {
        if (error) return;

        if (isSetup && isConfirming) {
            setConfirmPin(confirmPin.slice(0, -1));
        } else {
            setPin(pin.slice(0, -1));
        }
    };

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
            position: 'relative'
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                filter: 'blur(60px)'
            }} />

            {/* Lock Icon */}
            <div style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: success
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(212,175,55,0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                border: `2px solid ${success ? '#10b981' : error ? '#ef4444' : 'rgba(16,185,129,0.3)'}`,
                transition: 'all 0.3s ease',
                animation: error ? 'shake 0.5s ease-in-out' : success ? 'pulse 0.5s ease-out' : 'none'
            }}>
                {success ? (
                    <Check size={40} color="white" />
                ) : (
                    <Lock size={36} color={error ? '#ef4444' : '#10b981'} />
                )}
            </div>

            {/* Title */}
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#f0f5f2',
                marginBottom: '0.5rem',
                textAlign: 'center'
            }}>
                {isSetup
                    ? (isConfirming ? 'Confirm Your PIN' : 'Set Up Your PIN')
                    : 'Enter PIN'
                }
            </h2>
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                {isSetup
                    ? (isConfirming ? 'Re-enter your 4-digit PIN' : 'Create a 4-digit PIN to secure your app')
                    : 'Enter your 4-digit PIN to continue'
                }
            </p>

            {/* PIN Dots */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2.5rem'
            }}>
                {[...Array(maxLength)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: currentPin.length > i
                                ? (error ? '#ef4444' : 'linear-gradient(135deg, #10b981 0%, #d4af37 100%)')
                                : 'rgba(255,255,255,0.1)',
                            border: `2px solid ${error ? '#ef4444' : currentPin.length > i ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                            transition: 'all 0.2s ease',
                            transform: currentPin.length > i ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: currentPin.length > i ? '0 0 15px rgba(16,185,129,0.5)' : 'none'
                        }}
                    />
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <p style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    fontWeight: 500
                }}>
                    {error}
                </p>
            )}

            {/* Number Pad */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                maxWidth: 280
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
                            width: 72,
                            height: 72,
                            borderRadius: 20,
                            background: key
                                ? 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.03) 100%)'
                                : 'transparent',
                            border: key ? '1px solid rgba(16,185,129,0.2)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: key === 'del' ? '0' : '1.75rem',
                            fontWeight: 600,
                            color: '#f0f5f2',
                            cursor: key ? 'pointer' : 'default',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        {key === 'del' ? <Delete size={24} color="#ef4444" /> : key}
                    </button>
                ))}
            </div>

            {/* Skip option for setup (optional) */}
            {isSetup && !isConfirming && (
                <button
                    onClick={onUnlock}
                    style={{
                        marginTop: '2rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Skip for now
                </button>
            )}

            {/* Animations */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                    20%, 40%, 60%, 80% { transform: translateX(8px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default PinLock;
