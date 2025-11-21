// src/components/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ title, value, icon: Icon, colorClass, description }) => {
    // Determine icon color
    const iconTextColor = colorClass.includes('text-gray-900') ? 'text-gray-900' : 'text-white';
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-t-2 border-gray-100 
                        transform hover:shadow-2xl hover:border-helpora-blue transition duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                    <p className={`mt-1 text-4xl font-extrabold text-gray-900`}>
                        {value}
                    </p>
                </div>
                {/* Icon Circle */}
                <div className={`p-3 rounded-full ${colorClass} shadow-md`}>
                    <Icon className={iconTextColor} size={28} />
                </div>
            </div>
            
            <p className="mt-4 text-xs text-gray-400 pt-3 border-t">
                {description}
            </p>
        </div>
    );
};

export default SummaryCard;