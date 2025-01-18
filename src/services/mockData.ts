import { SmartBin } from '../types/bin';

const generateRandomBins = (cityName: string, centerLat: number, centerLng: number, count: number): SmartBin[] => {
  const bins: SmartBin[] = [];
  const areas = ['North', 'South', 'East', 'West', 'Central'];
  const types = ['general', 'recyclable', 'organic'] as const;
  const streets = ['MG Road', 'Station Road', 'Market Street', 'Mall Road', 'Gandhi Road', 'Lake Road', 'Park Street'];

  for (let i = 0; i < count; i++) {
    // Generate random coordinates within roughly 3km of the city center
    const lat = centerLat + (Math.random() - 0.5) * 0.05;
    const lng = centerLng + (Math.random() - 0.5) * 0.05;
    const area = areas[Math.floor(Math.random() * areas.length)];
    
    bins.push({
      id: `bin-${cityName}-${i + 1}`,
      location: {
        lat,
        lng,
        address: `${Math.floor(Math.random() * 200)} ${streets[Math.floor(Math.random() * streets.length)]}, ${area}`,
        area
      },
      fillLevel: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString(),
      status: Math.random() > 0.8 ? 'maintenance' : 'operational',
      type: types[Math.floor(Math.random() * types.length)],
      capacity: 100
    });
  }
  return bins;
};

// City coordinates (approximate centers)
const cityCoordinates: Record<string, [number, number]> = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.6139, 77.2090],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Chandigarh': [30.7333, 76.7794],
  'Bhopal': [23.2599, 77.4126],
  'Patna': [25.5941, 85.1376],
  'Visakhapatnam': [17.6868, 83.2185],
  'Nagpur': [21.1458, 79.0882],
  'Kochi': [9.9312, 76.2673],
  'Guwahati': [26.1445, 91.7362],
  'Bhubaneswar': [20.2961, 85.8245],
  'Dehradun': [30.3165, 78.0322],
  'Raipur': [21.2514, 81.6296]
};

export const getCityBins = (cityName: string): SmartBin[] => {
  const coordinates = cityCoordinates[cityName];
  if (!coordinates) {
    // For cities without coordinates, generate some default ones
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;
    return generateRandomBins(cityName, defaultLat, defaultLng, 15);
  }
  return generateRandomBins(cityName, coordinates[0], coordinates[1], 15);
};