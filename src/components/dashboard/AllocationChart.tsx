import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FinancialEngine } from '../../services/finance';
import type { IncomeBracket } from '../../types';

interface Props {
    bracket: IncomeBracket;
}

export const AllocationChart: React.FC<Props> = ({ bracket }) => {
    const allocation = FinancialEngine.getRecommendedAllocation(bracket);

    const data = [
        { name: 'Needs', value: allocation.needs, color: '#f59e0b' }, // Amber
        { name: 'Wants', value: allocation.wants, color: '#ef4444' }, // Rose
        { name: 'Invest', value: allocation.investments, color: '#56d4b3' }, // Emerald
        { name: 'Emergency', value: allocation.emergency, color: '#3b82f6' } // Blue
    ].filter(d => d.value > 0);

    return (
        <div className="card">
            <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>Recommended Budget</h3>
            <div style={{ height: 250, width: '100%' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-secondary)" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                            formatter={(val: number | undefined) => (val ? `${(val * 100).toFixed(0)}%` : '')}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

