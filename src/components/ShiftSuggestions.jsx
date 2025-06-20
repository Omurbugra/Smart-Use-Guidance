import React, { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';

const SUGGESTIONS = [
    { id: 'dishwasher', label: 'Run the dishwasher', icon: '🍽️', estKWh: 1.0 },
    { id: 'ev', label: 'Charge electric vehicle', icon: '🚗', estKWh: 3.5 },
    { id: 'laundry', label: 'Do the laundry', icon: '🧺', estKWh: 1.2 },
    { id: 'oven', label: 'Preheat oven', icon: '🔥', estKWh: 0.8 },
    { id: 'vacuum', label: 'Vacuum the house', icon: '🧹', estKWh: 0.6 },
    { id: 'boiler', label: 'Heat water boiler', icon: '💧', estKWh: 1.5 },
];

export default function ShiftSuggestions({ data }) {
    const [accepted, setAccepted] = useState({});

    const intervals = useMemo(() => {
        const grouped = [];
        const intervalMs = 15 * 60 * 1000;

        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            const roundedTs = Math.floor(d.timestamp / intervalMs) * intervalMs;
            const group = grouped.find(g => g.start === roundedTs);

            if (!group) {
                grouped.push({
                    start: roundedTs,
                    end: roundedTs + intervalMs,
                    production: d.production,
                    consumption: d.consumption,
                });
            } else {
                group.production += d.production;
                group.consumption += d.consumption;
            }
        }

        return grouped
            .filter(g => g.production > g.consumption)
            .slice(-3)
            .reverse();
    }, [data]);

    return (
        <div className="h-full flex flex-col">
            <SectionHeader
                title="⚡ Load Shifting Suggestions"
                info="Suggestions for when to shift energy-intensive tasks to periods of excess solar production. Select actions to match surplus energy."
            />
            <div className="flex-1 overflow-auto space-y-2 pr-1 pt-2">
                {intervals.map((interval, idx) => {
                    const start = new Date(interval.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const end = new Date(interval.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const key = `${interval.start}`;

                    const productionKWh = (interval.production * 0.25) / 1000;
                    const consumptionKWh = (interval.consumption * 0.25) / 1000;
                    const surplusKWh = Math.max(0, productionKWh - consumptionKWh);

                    const selected = accepted[key] || [];
                    const selectedTotal = selected
                        .map(id => SUGGESTIONS.find(s => s.id === id)?.estKWh || 0)
                        .reduce((a, b) => a + b, 0);

                    const isBalanced = selectedTotal >= surplusKWh;

                    return (
                        <div
                            key={idx}
                            className={`p-2 rounded-md text-sm space-y-1 border ${
                                isBalanced ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'
                            }`}
                        >
                            <div className="font-medium flex justify-between">
                                <span>{start} – {end}</span>
                                <span className="text-xs text-gray-600">Surplus: {surplusKWh.toFixed(2)} kWh</span>
                            </div>

                            {SUGGESTIONS.map(s => (
                                <label key={s.id} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(s.id)}
                                        onChange={e => {
                                            setAccepted(prev => {
                                                const set = new Set(prev[key] || []);
                                                e.target.checked ? set.add(s.id) : set.delete(s.id);
                                                return { ...prev, [key]: [...set] };
                                            });
                                        }}
                                    />
                                    <span>{s.icon}</span>
                                    <span>{s.label}</span>
                                    <span className="text-xs text-gray-500 ml-auto">{s.estKWh} kWh</span>
                                </label>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
