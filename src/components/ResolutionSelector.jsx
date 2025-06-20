import React from 'react'

export default function ResolutionSelector({ value, onChange }) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-700">
            <label htmlFor="resolution-select" className="font-medium">
                Time Range:
            </label>
            <select
                id="resolution-select"
                className="border p-2 rounded text-gray-800"
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                <option value="1">Last 1 Hour</option>
                <option value="6">Last 6 Hours</option>
                <option value="12">Last 12 Hours</option>
                <option value="24">Last 24 Hours</option>
            </select>
        </div>
    )
}
