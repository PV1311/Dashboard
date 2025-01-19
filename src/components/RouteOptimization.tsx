import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart as BarChartIcon, Box, LayoutDashboard, Route, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCityBins } from '../services/mockData';
import LocationSelector from './LocationSelector';
import Navbar from './Navbar';

interface RouteCard {
  id: string;
  center: string;
  bins: string[];
  distance: number;
  estimatedTime: string;
  vehicleType: string;
  priority: string;
}

export default function RouteOptimization() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(13);

  // Dummy municipal centers
  const [municipalCenters, setMunicipalCenters] = useState([
    { id: 1, name: 'Central Waste Management Center', lat: 0, lng: 0 },
    { id: 2, name: 'Regional Recycling Facility', lat: 0, lng: 0 }
  ]);

  // Dummy route data
  const [routes, setRoutes] = useState<RouteCard[]>([]);

  const handleLocationChange = (state: string, city: string) => {
    setSelectedState(state);
    setSelectedCity(city);
    if (city) {
      const bins = getCityBins(city);
      if (bins.length > 0) {
        const centerLat = bins[0].location.lat;
        const centerLng = bins[0].location.lng;
        setMapCenter([centerLat, centerLng]);
        
        // Update municipal centers based on city coordinates
        setMunicipalCenters([
          {
            id: 1,
            name: 'Central Waste Management Center',
            lat: centerLat + 0.01,
            lng: centerLng + 0.01
          },
          {
            id: 2,
            name: 'Regional Recycling Facility',
            lat: centerLat - 0.01,
            lng: centerLng - 0.01
          }
        ]);
      }
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  // Create custom bin icon
  const getBinIcon = (fillLevel: number) => {
    const color = fillLevel > 90 ? '#ef4444' : fillLevel > 70 ? '#f59e0b' : '#22c55e';
    return divIcon({
      className: '',
      html: `
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          <span class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow-sm">
            ${fillLevel}%
          </span>
        </div>
      `,
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36],
    });
  };

  // Create custom municipal center icon
  const getMunicipalIcon = () => {
    return divIcon({
      className: '',
      html: `
        <div class="relative">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20">
              <path d="M1 22h22L12 2 1 22zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
          <span class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow-sm">
            MC
          </span>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    });
  };

  const handleOptimize = () => {
    if (!selectedCity) {
      alert('Please select a city first');
      return;
    }

    const bins = getCityBins(selectedCity);
    
    // Generate dummy routes
    const dummyRoutes: RouteCard[] = [
      {
        id: '1',
        center: 'Central Waste Management Center',
        bins: bins.slice(0, 5).map(bin => bin.id),
        distance: 8.5,
        estimatedTime: '2.5 hours',
        vehicleType: vehicleType || 'Large Vehicles',
        priority: priority || 'High'
      },
      {
        id: '2',
        center: 'Regional Recycling Facility',
        bins: bins.slice(5, 10).map(bin => bin.id),
        distance: 6.2,
        estimatedTime: '1.8 hours',
        vehicleType: vehicleType || 'Medium Vehicles',
        priority: priority || 'Medium'
      },
      {
        id: '3',
        center: 'Central Waste Management Center',
        bins: bins.slice(10, 15).map(bin => bin.id),
        distance: 7.8,
        estimatedTime: '2.2 hours',
        vehicleType: vehicleType || 'Small Vehicles',
        priority: priority || 'Low'
      }
    ];

    setRoutes(dummyRoutes);
    setShowRoutes(true);
  };

  const handleReset = () => {
    setSelectedDate('');
    setVehicleType('');
    setPriority('');
    setSelectedState('');
    setSelectedCity('');
    setShowRoutes(false);
    setRoutes([]);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/75" />
      </div>

      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-16 bottom-0 w-64 bg-white shadow-lg z-50 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:z-40`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-green-600" />
            <span className="text-lg font-semibold">NEEV</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={() => handleNavigation('/')}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${location.pathname === '/' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          >
            <LayoutDashboard className="w-5 h-5 text-green-600" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigation('/bins')}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${location.pathname === '/bins' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          >
            <BarChartIcon className="w-5 h-5 text-green-600" />
            <span>Bins Management</span>
          </button>
          <button
            onClick={() => handleNavigation('/routes')}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${location.pathname === '/routes' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          >
            <Route className="w-5 h-5 text-green-600" />
            <span>Route Optimization</span>
          </button>
          <button
            onClick={() => handleNavigation('/analytics')}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${location.pathname === '/analytics' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-24 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Primary Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Large Vehicles">Large Vehicles</option>
                  <option value="Medium Vehicles">Medium Vehicles</option>
                  <option value="Small Vehicles">Small Vehicles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <LocationSelector onLocationChange={handleLocationChange} />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleOptimize}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Optimize Route
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset Route
              </button>
            </div>
          </div>

          {/* Route Cards */}
          {showRoutes && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {routes.map((route) => (
                <div key={route.id} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">{route.center}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Distance:</span> {route.distance} km
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Estimated Time:</span> {route.estimatedTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Vehicle Type:</span> {route.vehicleType}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Priority:</span> {route.priority}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Bins to Collect:</span> {route.bins.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Map */}
          {showRoutes && selectedCity && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Render bins */}
                {getCityBins(selectedCity).map((bin) => (
                  <Marker
                    key={bin.id}
                    position={[bin.location.lat, bin.location.lng]}
                    icon={getBinIcon(bin.fillLevel)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">Bin ID: {bin.id}</p>
                        <p>Fill Level: {bin.fillLevel}%</p>
                        <p>Type: {bin.type}</p>
                        <p>Location: {bin.location.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Render municipal centers */}
                {municipalCenters.map((center) => (
                  <Marker
                    key={center.id}
                    position={[center.lat, center.lng]}
                    icon={getMunicipalIcon()}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{center.name}</p>
                        <p>Municipal Corporation Facility</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Render routes */}
                {routes.map((route, index) => {
                  const bins = getCityBins(selectedCity).filter(bin => route.bins.includes(bin.id));
                  const center = municipalCenters[index % 2];
                  const positions = [
                    [center.lat, center.lng],
                    ...bins.map(bin => [bin.location.lat, bin.location.lng])
                  ];
                  
                  return (
  <Polyline
    key={route.id}
    positions={positions as [number, number][]}
    color={
      index === 0 ? '#ef4444' : index === 1 ? '#3b82f6' : '#22c55e'
    }
    weight={3}
    opacity={0.8}
  />
);

                })}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}