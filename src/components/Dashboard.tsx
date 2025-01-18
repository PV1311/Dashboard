import React from 'react';
import { SmartBin } from '../types/bin';

interface DashboardProps {
  bins: SmartBin[];
}

export default function Dashboard({ bins }: DashboardProps) {
  // Process data for the heat map
  const areaStats = bins.reduce((acc: Record<string, Record<string, number>>, bin) => {
    const area = bin.location.area;
    const type = bin.type;
    
    if (!acc[area]) {
      acc[area] = {
        general: 0,
        recyclable: 0,
        organic: 0,
        count: 0,
      };
    }
    
    acc[area][type] += bin.fillLevel;
    acc[area].count += 1;
    return acc;
  }, {});

  // Calculate averages
  Object.keys(areaStats).forEach(area => {
    ['general', 'recyclable', 'organic'].forEach(type => {
      areaStats[area][type] = Math.round(areaStats[area][type] / areaStats[area].count);
    });
  });

  const getColorForValue = (value: number) => {
    if (value > 90) return 'bg-red-500';
    if (value > 70) return 'bg-orange-500';
    if (value > 50) return 'bg-yellow-500';
    if (value > 30) return 'bg-green-500';
    return 'bg-green-300';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Fill Level Heat Map by Area</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Area</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">General Waste</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Recyclable Waste</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Organic Waste</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(areaStats).map(([area, stats]) => (
              <tr key={area} className="border-t">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{area}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <div className={`w-16 h-8 rounded-lg ${getColorForValue(stats.general)} flex items-center justify-center text-white font-medium`}>
                      {stats.general}%
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <div className={`w-16 h-8 rounded-lg ${getColorForValue(stats.recyclable)} flex items-center justify-center text-white font-medium`}>
                      {stats.recyclable}%
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <div className={`w-16 h-8 rounded-lg ${getColorForValue(stats.organic)} flex items-center justify-center text-white font-medium`}>
                      {stats.organic}%
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Fill Level Legend</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">&gt; 90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">70-90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">50-70%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">30-50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span className="text-sm text-gray-600">&lt; 30%</span>
          </div>
        </div>
      </div>
    </div>
  );
}