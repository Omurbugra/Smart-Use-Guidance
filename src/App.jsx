// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react'
import TimeSeriesChart from './components/TimeSeriesChart'
import ShiftSuggestions from './components/ShiftSuggestions'
import ResolutionSelector from './components/ResolutionSelector'
import CostCard from './components/CostCard'
import CategoryBarChart from './components/CategoryBarChart'
import SelfSufficiencyGauge from './components/SelfSufficiencyGauge'
import WarningCarousel from './components/WarningCarousel'
import GoalProgress from './components/GoalProgress'
import { loadData } from './lib/dataLoader'

export default function App() {
    const [rawData, setRawData] = useState([])
    const [resolution, setResolution] = useState('24')
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        loadData().then(d => {
            const clean = d
                .filter(item => typeof item.timestamp === 'number')
                .map(item => ({ ...item }))
            setRawData(clean)
        })
    }, [])

    const filteredData = useMemo(() => {
        if (rawData.length === 0) return []
        const hours = parseInt(resolution, 10)
        const spanMs = hours * 3600000
        const maxTs = rawData.reduce((max, { timestamp }) => (timestamp > max ? timestamp : max), 0)
        const cutoff = maxTs - spanMs
        return rawData.filter(({ timestamp }) => timestamp >= cutoff)
    }, [rawData, resolution])

    const filteredForChart = useMemo(() => {
        if (!selectedCategory || selectedCategory === 'Total Consumption') {
            return filteredData.map(d => ({
                ...d,
                showProduction: true
            }))
        }

        return filteredData.map(d => ({
            ...d,
            showProduction: false,
            consumption: d.categories[selectedCategory] || 0
        }))
    }, [filteredData, selectedCategory])

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* HEADER */}
            <header
                className="shadow-md shadow-gray-400 py-3 px-20 flex justify-between items-end fixed top-0 w-full z-50"
                style={{
                    background: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)',
                }}
            >
                <div className="flex items-baseline">
                    <h1 className="text-3xl font-bold text-white m-0 ml-2">
                        🏠 Smart Use Guidance
                    </h1>
                    <span className="ml-2 text-xs text-white m-0">
                        by Ömür Buğra Gündüz
                    </span>
                </div>
                <ResolutionSelector value={resolution} onChange={setResolution} />
            </header>

            {/* MAIN CONTENT */}
            <main className="pt-28 p-[90px] space-y-5">
                {/* COST & GOAL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="shadow-lg shadow-gray-300 bg-white lg:col-span-1 space-y-4 p-4">
                        <GoalProgress data={filteredData} />
                        <CostCard data={filteredData} />
                    </div>

                    {/* TIME SERIES */}
                    <div className="shadow-lg shadow-gray-300 bg-white lg:col-span-2 p-4">
                        <TimeSeriesChart data={filteredForChart} />
                    </div>
                </div>

                {/* CATEGORIES & WARNINGS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="shadow-lg shadow-gray-300 bg-white p-4">
                        <CategoryBarChart
                            data={filteredData}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="shadow-lg shadow-gray-300 bg-white h-[440px] flex flex-col justify-between p-4">
                            <SelfSufficiencyGauge data={filteredData} />
                            <WarningCarousel data={filteredData} />
                        </div>

                        <div className="shadow-lg shadow-gray-300 bg-white h-[440px] overflow-hidden p-4">
                            <ShiftSuggestions data={filteredData} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
