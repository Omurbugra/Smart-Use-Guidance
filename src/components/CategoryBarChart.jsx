// src/components/CategoryBarChart.jsx
import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import SectionHeader from './SectionHeader'

export default function CategoryBarChart({ data, onSelectCategory }) {
    const chartData = useMemo(() => {
        const totals = {}
        data.forEach(d =>
            Object.entries(d.categories).forEach(([k, v]) => {
                totals[k] = (totals[k] || 0) + v
            })
        )

        const result = Object.entries(totals).map(([name, value]) => ({
            name,
            value: value / 60000
        }))

        const totalConsumption = data.reduce((s, d) => s + d.consumption, 0) / 60000
        result.push({ name: 'Total Consumption', value: totalConsumption })

        return result
    }, [data])

    return (
        <div className="flex flex-col h-full">
            <SectionHeader
                title="🔍 Category Breakdown"
                info="Displays total energy consumption per category over the selected time range. Click a bar to filter the timeline."
            />
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                    >
                        <XAxis type="number" unit="kWh" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={v => `${v.toFixed(2)} kWh`} />
                        <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            onClick={entry => onSelectCategory?.(entry.name)}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
