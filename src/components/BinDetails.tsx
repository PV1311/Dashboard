import React from 'react';
import { SmartBin } from '../types/bin';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface BinDetailsProps {
  bin: SmartBin | null;
}

export default function BinDetails({ bin }: BinDetailsProps) {
  if (!bin) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="text-green-500" />;
      case 'maintenance':
        return <AlertTriangle className="text-yellow-500" />;
      default:
        return <Clock className="text-red-500" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Bin Details</h3>
      <div className="space-y-2">
        <p className="flex items-center gap-2">
          {getStatusIcon(bin.status)}
          <span className="capitalize">{bin.status}</span>
        </p>
        <p>ID: {bin.id}</p>
        <p>Location: {bin.location.address}</p>
        <p>Area: {bin.location.area}</p>
        <p>Fill Level: {bin.fillLevel}%</p>
        <p>Type: {bin.type}</p>
        <p>Last Updated: {new Date(bin.lastUpdated).toLocaleString()}</p>
      </div>
    </div>
  );  
}