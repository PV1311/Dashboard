import React, { useState, useEffect } from 'react';
import { indianStates } from '../data/indianStates';
import { MapPin } from 'lucide-react';

interface LocationSelectorProps {
  onLocationChange: (state: string, city: string) => void;
}

export default function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [selectedState, setSelectedState] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const state = indianStates.find(s => s.name === selectedState);
    setCities(state?.cities || []);
  }, [selectedState]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    onLocationChange(newState, '');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLocationChange(selectedState, e.target.value);
  };

  return (
    <div className="flex gap-4 mb-4">
      <div className="relative flex-1">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            onChange={handleCityChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}