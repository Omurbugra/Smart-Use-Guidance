import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import SectionHeader from './SectionHeader';

export default function TimeSeriesChart({ data }) {
    return (
        <div>
            <SectionHeader
                title="📈 Energy Profile Over Time"
                info="Displays electricity consumption and production throughout the selected time range."
            />
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={time => new Date(time).toLocaleString()}
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                    />
                    <YAxis unit="W" tick={{ fill: '#4b5563', fontSize: 12 }} />
                    <Tooltip
                        labelFormatter={time => new Date(time).toLocaleString()}
                        formatter={(value, name) => [`${value.toFixed(0)} W`, name]}
                    />
                    <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />
                    {data.some(d => d.showProduction) && (
                        <Line
                            type="monotone"
                            dataKey="production"
                            name="Production (W)"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                        />
                    )}
                    <Line
                        type="monotone"
                        dataKey="consumption"
                        name="Consumption (W)"
                        stroke="#f87171"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
