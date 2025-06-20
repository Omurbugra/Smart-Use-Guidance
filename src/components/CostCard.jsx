import React, { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';

export default function CostCard({ data }) {
    const [unitPrice, setUnitPrice] = useState(2.33); // TL/kWh

    const { consumptionKWh, productionKWh, consumptionCost, generationSavings } = useMemo(() => {
        let totalConsumption = 0;
        let totalProduction = 0;

        for (const d of data) {
            totalConsumption += d.consumption;
            totalProduction += Math.min(d.production, d.consumption);
        }

        const minutes = 1;
        const consumptionKWh = (totalConsumption * minutes) / 60_000;
        const productionKWh = (totalProduction * minutes) / 60_000;

        return {
            consumptionKWh,
            productionKWh,
            consumptionCost: consumptionKWh * unitPrice,
            generationSavings: productionKWh * unitPrice
        };
    }, [data, unitPrice]);

    const net = consumptionCost - generationSavings;

    return (
        <div className="mt-4 relative">
            <SectionHeader
                title="💰 Cost Summary"
                info="Displays your total energy consumption cost and savings based on your solar production. You can adjust the unit energy price below."
                noBackground
            />

            {/* Net cost on top-right */}
            <div className="absolute top-10 right-0 text-lg font-bold text-blue-700">
                Net: ₺{net.toFixed(2)}
            </div>

            <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">
                    Energy Unit Price (TL/kWh):
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="ml-2 w-24 p-1 text-sm border border-gray-300 rounded"
                />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div>
                    <div className="text-red-500 font-medium">Consumption:</div>
                    <div className="text-gray-700">{consumptionKWh.toFixed(2)} kWh</div>
                </div>
                <div>
                    <div>Cost:</div>
                    <div className="text-red-500">₺{consumptionCost.toFixed(2)}</div>
                </div>

                <div>
                    <div className="text-green-600 font-medium">Produced & Used:</div>
                    <div className="text-gray-700">{productionKWh.toFixed(2)} kWh</div>
                </div>
                <div>
                    <div>Savings:</div>
                    <div className="text-green-600">₺{generationSavings.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}
