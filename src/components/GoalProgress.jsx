// src/components/GoalProgress.jsx
import React, { useState } from 'react';
import SectionHeader from './SectionHeader';

export default function GoalProgress({ data }) {
    const [target, setTarget] = useState(80);
    const ratios = data.map(d => Math.min(d.production / (d.consumption || 1), 1));
    const avg = (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100;

    return (
        <div>
            <SectionHeader
                title="🎯 Sustainability Goal Progress"
                info="Track your self-sufficiency goal. Adjust the target percentage and see if current solar usage meets it."
            />
            <div className="flex items-center mb-2">
                <input
                    type="number"
                    value={target}
                    onChange={e => setTarget(+e.target.value)}
                    className="border rounded p-1 w-16 mr-2"
                />
                <span>% target</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={`h-3 rounded-full ${avg >= target ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${avg}%` }}
                ></div>
            </div>
            <div className="mt-2 text-sm">Current: {Math.round(avg)}%</div>
        </div>
    );
}
