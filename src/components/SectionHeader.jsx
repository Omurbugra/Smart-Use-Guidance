// src/components/SectionHeader.jsx
import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function SectionHeader({ title, info, noBackground = false }) {
    const containerClasses = noBackground
        ? 'mb-3 flex items-center justify-between'
        : 'relative -mx-4 -mt-4 px-4 py-2 bg-gray-100 border-b border-gray-300 flex items-center justify-between';

    return (
        <div className={containerClasses}>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <div className="relative group cursor-pointer">
                <InformationCircleIcon className="w-5 h-5 text-gray-500" />
                <div className="absolute right-0 top-6 w-64 text-sm bg-white text-gray-800 border border-gray-300 shadow-md p-2 rounded z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                    {info}
                </div>
            </div>
        </div>
    );
}
