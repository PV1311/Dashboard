import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SmartBin } from '../types/bin';
import IndiaMap from './IndiaMap';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function Statistics() {
  const location = useLocation();
  const { bins, selectedState, selectedCity } = location.state;
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Process data for pie chart
  const wasteTypeData = bins.reduce((acc: any[], bin) => {
    const existingType = acc.find(item => item.name === bin.type);
    if (existingType) {
      existingType.value++;
    } else {
      acc.push({ name: bin.type, value: 1 });
    }
    return acc;
  }, []);

  // Process data for bar chart
  const areaData = bins.reduce((acc: any[], bin) => {
    const existingArea = acc.find(item => item.name === bin.location.area);
    if (existingArea) {
      existingArea.value += bin.fillLevel;
      existingArea.count++;
    } else {
      acc.push({ 
        name: bin.location.area, 
        value: bin.fillLevel,
        count: 1
      });
    }
    return acc;
  }, []).map(area => ({
    ...area,
    value: Math.round(area.value / area.count)
  }));

  // Process data for heat map table
  const getAreaStats = (area: string) => {
    const areaBins = bins.filter(bin => bin.location.area === area);
    const stats = areaBins.reduce((acc: any, bin) => {
      if (!acc[bin.type]) {
        acc[bin.type] = { total: 0, count: 0 };
      }
      acc[bin.type].total += bin.fillLevel;
      acc[bin.type].count++;
      return acc;
    }, {});

    return Object.entries(stats).map(([type, data]: [string, any]) => ({
      type,
      fillLevel: Math.round(data.total / data.count)
    }));
  };

  const getColorForValue = (value: number) => {
    if (value > 90) return 'bg-red-500';
    if (value > 70) return 'bg-orange-500';
    if (value > 50) return 'bg-yellow-500';
    if (value > 30) return 'bg-green-500';
    return 'bg-green-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#16a34a] mb-8 text-center">Area Statistics</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {selectedState} - {selectedCity}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Waste Type Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wasteTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Average Fill Level by Area</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Fill Level %" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* India Map */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Regional Heat Map</h3>
          <IndiaMap selectedState={selectedState} onStateClick={setSelectedArea} />
        </div>

        {/* Heat Map Table */}
        {selectedArea && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Details for {selectedArea}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Waste Type</th>
                    <th className="px-4 py-2 text-center">Fill Level</th>
                  </tr>
                </thead>
                <tbody>
                  {getAreaStats(selectedArea).map((stat) => (
                    <tr key={stat.type} className="border-t">
                      <td className="px-4 py-3 capitalize">{stat.type}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <div className={`w-16 h-8 rounded-lg ${getColorForValue(stat.fillLevel)} flex items-center justify-center text-white font-medium`}>
                            {stat.fillLevel}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}