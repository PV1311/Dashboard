import 'leaflet/dist/leaflet.css';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import indiaGeoJson from '../data/india.json';

interface IndiaMapProps {
  selectedState: string;
  onStateClick: (state: string) => void;
}

export default function IndiaMap({ selectedState, onStateClick }: IndiaMapProps) {
  const getStateColor = (fillLevel: number) => {
    if (fillLevel > 90) return '#ef4444'; // red
    if (fillLevel > 70) return '#f97316'; // orange
    if (fillLevel > 50) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  // Simulate fill levels for states
  const getStateFillLevel = (stateName: string) => {
    // Use a deterministic but seemingly random value based on state name
    const hash = stateName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return Math.abs(hash % 100);
  };

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={indiaGeoJson as any}
        style={(feature) => {
          const fillLevel = getStateFillLevel(feature?.properties?.name || '');
          return {
            fillColor: getStateColor(fillLevel),
            weight: feature?.properties?.name === selectedState ? 2 : 1,
            opacity: 1,
            color: 'white',
            fillOpacity: feature?.properties?.name === selectedState ? 0.9 : 0.7,
          };
        }}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: () => {
              if (feature.properties?.name) {
                onStateClick(feature.properties.name);
              }
            },
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                fillOpacity: 0.9,
                weight: 2,
              });
            },
            mouseout: (e) => {
              const layer = e.target;
              if (feature?.properties?.name !== selectedState) {
                layer.setStyle({
                  fillOpacity: 0.7,
                  weight: 1,
                });
              }
            },
          });
        }}
      />
    </MapContainer>
  );
}