import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/storage';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, AlertCircle, Calculator, History, Calendar, Plus, X, Trash2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { v4 as uuidv4 } from 'uuid';
import type { LoanTranche, Loan } from '../types';

export const LoanDetails: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
    const [simulatedEmi, setSimulatedEmi] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Add Loan Form State
    const [loanName, setLoanName] = useState('Education Loan');
    const [interestRate, setInterestRate] = useState('9');
    const [minimumEmi, setMinimumEmi] = useState('10000');
    const [moratoriumEndDate, setMoratoriumEndDate] = useState('');
    const [tranches, setTranches] = useState<{ amount: string; date: string }[]>([
        { amount: '230000', date: '' }
    ]);

    const loans = useLiveQuery(() =>
        user ? db.loans.where({ userId: user.id }).toArray() : []
        , [user]);

    if (!user) return null;

    const selectedLoan = loans?.find(l => l.id === selectedLoanId);

    // Add a tranche
    const addTranche = () => {
        setTranches([...tranches, { amount: '230000', date: '' }]);
    };

    // Remove a tranche
    const removeTranche = (index: number) => {
        if (tranches.length > 1) {
            setTranches(tranches.filter((_, i) => i !== index));
        }
    };

    // Update tranche
    const updateTranche = (index: number, field: 'amount' | 'date', value: string) => {
        const updated = [...tranches];
        updated[index][field] = value;
        setTranches(updated);
    };

    // Save Loan
    const saveLoan = async () => {
        if (!tranches[0].amount || !moratoriumEndDate) return;

        const totalPrincipal = tranches.reduce((sum, t) => sum + Number(t.amount), 0);
        const loanTranches: LoanTranche[] = tranches.map(t => ({
            amount: Number(t.amount),
            date: t.date || new Date().toISOString()
        }));

        // Calculate moratorium interest
        const monthlyRate = Number(interestRate) / 12 / 100;
        const moratoriumEnd = new Date(moratoriumEndDate);
        let interestAccrued = 0;

        loanTranches.forEach(tranche => {
            const trancheDate = new Date(tranche.date);
            const monthsDiff = (moratoriumEnd.getFullYear() - trancheDate.getFullYear()) * 12
                + (moratoriumEnd.getMonth() - trancheDate.getMonth());
            if (monthsDiff > 0) {
                interestAccrued += tranche.amount * monthlyRate * monthsDiff;
            }
        });

        const newLoan: Loan = {
            id: uuidv4(),
            userId: user.id,
            name: loanName,
            type: 'Education',
            principal: totalPrincipal,
            interestRate: Number(interestRate),
            tenureMonths: 120,
            startDate: tranches[0].date || new Date().toISOString(),
            emi: Number(minimumEmi),
            remainingPrincipal: totalPrincipal,
            status: 'Active',
            moratoriumEndDate,
            minimumEmi: Number(minimumEmi),
            tranches: loanTranches,
            interestAccrued: Math.round(interestAccrued),
            paymentHistory: []
        };

        await db.loans.add(newLoan);
        setShowAddModal(false);
        setTranches([{ amount: '230000', date: '' }]);
    };

    // Delete Loan
    const deleteLoan = async (loanId: string) => {
        if (confirm('Delete this loan? This cannot be undone.')) {
            await db.loans.delete(loanId);
        }
    };

    // Calculate moratorium interest for education loans
    const calculateMoratoriumInterest = (loan: typeof selectedLoan) => {
        if (!loan) return 0;
        if (loan.interestAccrued) return loan.interestAccrued;
        if (!loan.moratoriumEndDate) return 0;

        const loanTranches = loan.tranches || [{ amount: loan.principal, date: loan.startDate }];
        const moratoriumEnd = new Date(loan.moratoriumEndDate);
        const monthlyRate = loan.interestRate / 12 / 100;

        let totalInterest = 0;

        loanTranches.forEach(tranche => {
            const trancheDate = new Date(tranche.date);
            const monthsDiff = (moratoriumEnd.getFullYear() - trancheDate.getFullYear()) * 12
                + (moratoriumEnd.getMonth() - trancheDate.getMonth());

            if (monthsDiff > 0) {
                totalInterest += tranche.amount * monthlyRate * monthsDiff;
            }
        });

        return Math.round(totalInterest);
    };

    // Calculate amortization schedule
    const calculateAmortization = (principal: number, annualRate: number, emi: number) => {
        if (emi <= 0 || principal <= 0) return { schedule: [], totalInterest: 0, months: 0 };

        let balance = principal;
        const monthlyRate = annualRate / 12 / 100;
        const schedule = [];
        let totalInterest = 0;
        let month = 0;
        const maxMonths = 360;

        while (balance > 0 && month < maxMonths) {
            const interest = balance * monthlyRate;
            const principalPaid = Math.min(emi - interest, balance);

            if (principalPaid <= 0) break;

            totalInterest += interest;
            balance -= principalPaid;
            month++;

            schedule.push({
                month,
                balance: Math.max(0, Math.round(balance)),
                interest: Math.round(interest),
                principal: Math.round(principalPaid)
            });
        }

        return { schedule, totalInterest: Math.round(totalInterest), months: month };
    };

    // Get analysis for selected loan
    const loanAnalysis = useMemo(() => {
        if (!selectedLoan) return null;

        const moratoriumInterest = calculateMoratoriumInterest(selectedLoan);
        const totalBalance = selectedLoan.remainingPrincipal + moratoriumInterest;
        const emi = simulatedEmi || selectedLoan.emi;
        const amortization = calculateAmortization(totalBalance, selectedLoan.interestRate, emi);

        return {
            originalPrincipal: selectedLoan.principal,
            moratoriumInterest,
            currentBalance: totalBalance,
            ...amortization
        };
    }, [selectedLoan, simulatedEmi]);

    // Total outstanding
    const totalOutstanding = loans?.reduce((sum, l) => sum + l.remainingPrincipal + (l.interestAccrued || 0), 0) || 0;

    // ECharts options - Emerald theme
    const pieOption = loanAnalysis ? {
        tooltip: { trigger: 'item', backgroundColor: 'var(--bg-secondary)', borderColor: 'rgba(45,212,167,0.2)', textStyle: { color: 'var(--text-primary)', fontSize: 12 } },
        series: [{
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '50%'],
            itemStyle: { borderRadius: 6, borderColor: '#050a08', borderWidth: 2 },
            label: { show: false },
            data: [
                { value: loanAnalysis.originalPrincipal, name: 'Principal', itemStyle: { color: 'var(--primary)' } },
                { value: loanAnalysis.moratoriumInterest, name: 'Moratorium Interest', itemStyle: { color: 'var(--loan)' } },
                { value: loanAnalysis.totalInterest, name: 'Future Interest', itemStyle: { color: 'var(--expense)' } },
            ]
        }]
    } : {};

    // ECharts for payoff projection
    const lineOption = loanAnalysis ? {
        grid: { left: 40, right: 10, top: 10, bottom: 30 },
        tooltip: { trigger: 'axis', backgroundColor: 'var(--bg-secondary)', borderColor: 'rgba(45,212,167,0.2)', textStyle: { color: 'var(--text-primary)', fontSize: 11 } },
        xAxis: { type: 'category', data: loanAnalysis.schedule.filter((_, i) => i % 6 === 0).map(s => s.month), axisLine: { lineStyle: { color: 'var(--bg-tertiary)' } }, axisLabel: { color: '#6e7681', fontSize: 10 } },
        yAxis: { type: 'value', show: false },
        series: [{
            data: loanAnalysis.schedule.filter((_, i) => i % 6 === 0).map(s => s.balance),
            type: 'line',
            smooth: true,
            lineStyle: { color: 'var(--primary)', width: 2 },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(45,212,167,0.3)' }, { offset: 1, color: 'transparent' }] } },
            symbol: 'none'
        }]
    } : {};

    return (
        <div style={{ padding: '0 1rem' }} className="fade-in">
            {/* Header */}
            <div className="flex-center" style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <button onClick={() => selectedLoanId ? setSelectedLoanId(null) : navigate(-1)} style={{ position: 'absolute', left: 0 }}>
                    <ChevronLeft />
                </button>
                <h2 className="heading-md">{selectedLoanId ? 'Loan Details' : 'Loans'}</h2>
            </div>

            {!selectedLoanId ? (
                /* Loan List View */
                <>
                    {/* Outstanding Total */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(28,33,40,0.9) 0%, rgba(22,27,34,0.95) 100%)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        marginBottom: '1rem',
                        border: '1px solid rgba(45,212,167,0.1)'
                    }}>
                        <div className="flex-between">
                            <span className="font-medium text-muted">Outstanding Loans:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--expense)' }}>₹ {totalOutstanding.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Loans */}
                    {(!loans || loans.length === 0) ? (
                        <div className="card flex-center flex-col" style={{ padding: '3rem', gap: '1rem' }}>
                            <AlertCircle size={48} className="text-muted" />
                            <p className="text-muted">No loans found.</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 15px rgba(45,212,167,0.3)'
                                }}
                            >
                                <Plus size={18} /> Add Education Loan
                            </button>
                        </div>
                    ) : (
                        <div className="flex-col" style={{ gap: '1rem' }}>
                            {loans.map(loan => {
                                const moratoriumInt = loan.interestAccrued || calculateMoratoriumInterest(loan);
                                const totalBal = loan.remainingPrincipal + moratoriumInt;

                                return (
                                    <div key={loan.id} className="card" style={{ padding: '1.25rem', position: 'relative' }}>
                                        <button
                                            onClick={() => { setSelectedLoanId(loan.id); setSimulatedEmi(null); }}
                                            style={{ textAlign: 'left', width: '100%', paddingRight: '2.5rem' }}
                                        >
                                            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                                                <div className="flex-center" style={{ gap: '0.5rem' }}>
                                                    <GraduationCap size={18} style={{ color: 'var(--loan)' }} />
                                                    <span className="font-bold">{loan.name}</span>
                                                </div>
                                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--expense)' }}>₹ {totalBal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex-between text-sm text-muted">
                                                <span>EMI: ₹{loan.emi.toLocaleString()}</span>
                                                <span>{loan.interestRate}% p.a.</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteLoan(loan.id); }}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                background: 'rgba(239,68,68,0.1)',
                                                color: 'var(--expense)'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}

                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.875rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'linear-gradient(145deg, rgba(28,33,40,0.9), rgba(22,27,34,0.95))',
                                    border: '1px solid rgba(45,212,167,0.1)',
                                    color: 'var(--text-primary)',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Plus size={18} /> Add Another Loan
                            </button>
                        </div>
                    )}
                </>
            ) : (
                /* Loan Detail View */
                selectedLoan && loanAnalysis && (
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        {/* Summary */}
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(28,33,40,0.9) 0%, rgba(22,27,34,0.95) 100%)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.25rem',
                            border: '1px solid rgba(45,212,167,0.1)'
                        }}>
                            <div className="flex-between">
                                <span className="heading-sm">{selectedLoan.name}</span>
                                <span className="text-xs" style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: 4 }}>
                                    {selectedLoan.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--expense)', marginTop: '0.5rem' }}>
                                ₹ {loanAnalysis.currentBalance.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted">Total Outstanding (Principal + Accrued Interest)</p>
                        </div>

                        {/* Breakdown Pie Chart with ECharts */}
                        <div className="card" style={{ padding: '1rem' }}>
                            <h3 className="text-sm font-bold" style={{ marginBottom: '0.5rem' }}>Cost Breakdown</h3>
                            <div className="flex-between">
                                <div style={{ width: 120, height: 120 }}>
                                    <ReactECharts option={pieOption} style={{ height: '100%' }} />
                                </div>
                                <div className="flex-col" style={{ gap: '0.5rem', flex: 1, marginLeft: '1rem' }}>
                                    <div className="flex-between text-sm">
                                        <span className="flex-center" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--primary)' }}></span> Principal</span>
                                        <span className="font-bold">₹ {loanAnalysis.originalPrincipal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex-between text-sm">
                                        <span className="flex-center" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--loan)' }}></span> Moratorium Int.</span>
                                        <span className="font-bold">₹ {loanAnalysis.moratoriumInterest.toLocaleString()}</span>
                                    </div>
                                    <div className="flex-between text-sm">
                                        <span className="flex-center" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--expense)' }}></span> Future Interest</span>
                                        <span className="font-bold">₹ {loanAnalysis.totalInterest.toLocaleString()}</span>
                                    </div>
                                    <div className="flex-between text-sm" style={{ paddingTop: '0.5rem', borderTop: '1px dashed var(--bg-tertiary)' }}>
                                        <span className="text-muted">Total Outflow</span>
                                        <span className="font-bold" style={{ color: 'var(--expense)' }}>
                                            ₹ {(loanAnalysis.originalPrincipal + loanAnalysis.moratoriumInterest + loanAnalysis.totalInterest).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EMI Calculator */}
                        <div className="card" style={{ padding: '1rem' }}>
                            <h3 className="text-sm font-bold" style={{ marginBottom: '0.75rem' }}>
                                <Calculator size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                EMI Impact Calculator
                            </h3>
                            <p className="text-xs text-muted">Adjust EMI to see how it affects loan tenure:</p>
                            <div className="flex-between" style={{ marginTop: '0.75rem', gap: '0.5rem' }}>
                                <input
                                    type="range"
                                    min={selectedLoan.minimumEmi || 5000}
                                    max={(selectedLoan.minimumEmi || 10000) * 5}
                                    step={1000}
                                    value={simulatedEmi || selectedLoan.emi}
                                    onChange={e => setSimulatedEmi(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: 'var(--primary)' }}
                                />
                                <span className="font-bold" style={{ minWidth: 90, textAlign: 'right', color: 'var(--primary)' }}>
                                    ₹ {(simulatedEmi || selectedLoan.emi).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex-between" style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                                <div className="flex-center" style={{ gap: '0.5rem' }}>
                                    <Calendar size={14} style={{ color: '#06b6d4' }} />
                                    <span className="text-sm">Time to payoff:</span>
                                </div>
                                <span className="font-bold" style={{ color: '#06b6d4' }}>
                                    {loanAnalysis.months} months ({(loanAnalysis.months / 12).toFixed(1)} years)
                                </span>
                            </div>
                        </div>

                        {/* Payoff Chart with ECharts */}
                        <div className="card" style={{ padding: '1rem' }}>
                            <h3 className="text-sm font-bold" style={{ marginBottom: '0.5rem' }}>Payoff Projection</h3>
                            <ReactECharts option={lineOption} style={{ height: 150 }} />
                        </div>

                        {/* Payment History */}
                        <div className="card" style={{ padding: '1rem' }}>
                            <h3 className="text-sm font-bold" style={{ marginBottom: '0.75rem' }}>
                                <History size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Payment History
                            </h3>
                            {selectedLoan.paymentHistory && selectedLoan.paymentHistory.length > 0 ? (
                                <div className="flex-col" style={{ gap: '0.5rem' }}>
                                    {selectedLoan.paymentHistory.slice(-5).map((p, i) => (
                                        <div key={i} className="flex-between text-sm" style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 4 }}>
                                            <span className="text-muted">{new Date(p.date).toLocaleDateString()}</span>
                                            <span className="font-bold" style={{ color: 'var(--primary)' }}>₹ {p.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted">No payments recorded yet.</p>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedLoanId(null)}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.875rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid rgba(45,212,167,0.1)',
                                color: 'var(--text-primary)',
                                fontWeight: 500
                            }}
                        >
                            ← Back to Loans
                        </button>
                    </div>
                )
            )}

            {/* Add Loan Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="card" style={{
                        width: '100%', maxWidth: 400, maxHeight: '90vh', overflowY: 'auto',
                        padding: '1.5rem'
                    }}>
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="heading-sm">Add Education Loan</h3>
                            <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
                        </div>

                        <div className="flex-col" style={{ gap: '1rem' }}>
                            {/* Loan Name */}
                            <div>
                                <label className="text-xs text-muted">Loan Name</label>
                                <input
                                    value={loanName}
                                    onChange={e => setLoanName(e.target.value)}
                                    className="input"
                                    style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                />
                            </div>

                            {/* Interest Rate & Min EMI */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label className="text-xs text-muted">Interest Rate (%)</label>
                                    <input
                                        value={interestRate}
                                        onChange={e => setInterestRate(e.target.value)}
                                        type="number"
                                        className="input"
                                        style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted">Min EMI (₹)</label>
                                    <input
                                        value={minimumEmi}
                                        onChange={e => setMinimumEmi(e.target.value)}
                                        type="number"
                                        className="input"
                                        style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>

                            {/* Moratorium End Date */}
                            <div>
                                <label className="text-xs text-muted">EMI Starts From (Moratorium End)</label>
                                <input
                                    value={moratoriumEndDate}
                                    onChange={e => setMoratoriumEndDate(e.target.value)}
                                    type="date"
                                    className="input"
                                    style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                />
                            </div>

                            {/* Tranches */}
                            <div>
                                <label className="text-xs text-muted">Disbursement Tranches</label>
                                <div className="flex-col" style={{ gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {tranches.map((tranche, idx) => (
                                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                value={tranche.amount}
                                                onChange={e => updateTranche(idx, 'amount', e.target.value)}
                                                type="number"
                                                placeholder="Amount"
                                                className="input"
                                                style={{ padding: '0.5rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                            />
                                            <input
                                                value={tranche.date}
                                                onChange={e => updateTranche(idx, 'date', e.target.value)}
                                                type="date"
                                                className="input"
                                                style={{ padding: '0.5rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                            />
                                            {tranches.length > 1 && (
                                                <button onClick={() => removeTranche(idx)} style={{ color: 'var(--expense)' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={addTranche}
                                    className="text-sm"
                                    style={{ marginTop: '0.5rem', color: 'var(--primary)' }}
                                >
                                    + Add Tranche
                                </button>
                            </div>

                            {/* Summary */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                                <div className="flex-between text-sm">
                                    <span className="text-muted">Total Principal:</span>
                                    <span className="font-bold" style={{ color: 'var(--primary)' }}>₹ {tranches.reduce((s, t) => s + Number(t.amount || 0), 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={saveLoan}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: moratoriumEndDate && tranches[0].amount ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)' : 'var(--bg-tertiary)',
                                    color: moratoriumEndDate && tranches[0].amount ? 'white' : 'var(--text-muted)',
                                    fontWeight: 600,
                                    boxShadow: moratoriumEndDate && tranches[0].amount ? '0 4px 15px rgba(45,212,167,0.3)' : 'none'
                                }}
                                disabled={!moratoriumEndDate || !tranches[0].amount}
                            >
                                Save Loan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanDetails;


