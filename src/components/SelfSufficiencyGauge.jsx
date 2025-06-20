import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import SectionHeader from './SectionHeader';

export default function SelfSufficiencyGauge({ data }) {
    const ratios = data.map(d => Math.min(d.production / (d.consumption || 1), 1));
    const avg = (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100;

    return (
        <div className="w-full h-60 relative z-0">
            <SectionHeader
                title="🔄 Self-Sufficiency"
                info="Shows the percentage of energy consumption met by your solar production. 100% means fully self-sufficient during this period."
            />

            <div className="w-full h-44 relative z-10">
                <ResponsiveContainer>
                    <RadialBarChart
                        data={[{ value: avg }]}
                        startAngle={180}
                        endAngle={0}
                        innerRadius="80%"
                        outerRadius="100%"
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar background dataKey="value" fill="#4ade80" cornerRadius={8} />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-green-500 pointer-events-none">
                    %{Math.round(avg)}
                </div>
            </div>
        </div>
    );
}
