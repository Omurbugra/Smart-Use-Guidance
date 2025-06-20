// src/components/WarningCarousel.jsx
import React, { useMemo } from 'react';
import SectionHeader from './SectionHeader';

export default function WarningCarousel({ data }) {
    const intervalMs = 15 * 60 * 1000;

    const groupedAlerts = useMemo(() => {
        const grouped = new Map();

        for (const d of data) {
            const roundedTimestamp = Math.floor(d.timestamp / intervalMs) * intervalMs;
            const key = roundedTimestamp;

            if (!grouped.has(key)) {
                grouped.set(key, { production: 0, consumption: 0 });
            }

            const group = grouped.get(key);
            group.production += d.production;
            group.consumption += d.consumption;
        }

        return Array.from(grouped.entries())
            .filter(([, { production, consumption }]) => production > consumption)
            .map(([start, { production, consumption }]) => {
                const end = start + intervalMs;
                const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const productionKWh = (production * 0.25) / 1000;
                const consumptionKWh = (consumption * 0.25) / 1000;
                const surplusKWh = Math.max(0, productionKWh - consumptionKWh);

                return {
                    time: `${startTime} – ${endTime}`,
                    surplus: surplusKWh.toFixed(2),
                    production: productionKWh.toFixed(2),
                    consumption: consumptionKWh.toFixed(2)
                };
            })
            .reverse();
    }, [data]);

    return (
        <div className="space-y-2 h-48 overflow-y-auto overflow-x-hidden">
            <SectionHeader
                title="⚠️ Overproduction Alerts"
                info="These are time periods (15-minute intervals) where your solar panel production exceeded your household consumption."
                noBackground
            />
            {groupedAlerts.map((a, i) => (
                <div key={i} className="bg-green-100 p-2 rounded-md text-sm">
                    <div>{a.time} – Surplus: {a.surplus} kWh</div>
                    <div className="text-gray-700">
                        Production: {a.production} kWh, Consumption: {a.consumption} kWh
                    </div>
                </div>
            ))}
        </div>
    );
}
