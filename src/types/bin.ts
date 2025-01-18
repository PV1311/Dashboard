export interface SmartBin {
  [x: string]: string | number | Date;
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
  };
  fillLevel: number;
  lastUpdated: string;
  status: 'operational' | 'maintenance' | 'offline';
  type: 'general' | 'recyclableexport interface SmartBin {
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
  };
  fillLevel: number;
  lastUpdated: string;
  status: 'operational' | 'maintenance' | 'offline';
  type: 'general' | 'recyclable' | 'organic';
  capacity: number;
  lastCollected?: string;
} | 'organic';
  capacity: number;
  lastCollected?: string;
}

export interface RecycleCenter {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
}