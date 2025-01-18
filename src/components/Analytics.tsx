import { BarChart as BarChartIcon, Box, LayoutDashboard, Route, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Navbar from './Navbar';

// Dummy data for Collection Trends
const collectionTrendsData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  collections: Math.floor(Math.random() * 50) + 20,
  efficiency: Math.floor(Math.random() * 30) + 70,
}));

// Dummy data for Regional Distribution
const regionalData = [
  { name: 'North', value: 95, color: '#ef4444' }, // Red for > 90%
  { name: 'South', value: 85, color: '#f97316' }, // Orange for 70-90%
  { name: 'East', value: 65, color: '#eab308' },  // Yellow for 50-70%
  { name: 'West', value: 45, color: '#22c55e' },  // Green for < 50%
];

// Dummy data for Collection Efficiency
const efficiencyData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  efficiency: Math.floor(Math.random() * 20) + 80,
}));

export default function Analytics() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  // Calculate statistics for cards
  const totalCollections = 1247;
  const averageFillRate = 68;
  const routeEfficiency = 92;
  const binsNeedingService = 45;

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

      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} pageTitle="Analytics" />

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
            <span className="text-lg font-semibold">EcoSmart Bins</span>
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
          {/* Collection Trends Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-10">
            <h2 className="text-xl font-bold mb-4">Collection Trends</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" stroke="#16a34a" />
                  <YAxis yAxisId="right" orientation="right" stroke="#2563eb" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="collections" name="Collections" fill="#16a34a" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Regional Waste Distribution</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionalData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {regionalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Collection Efficiency */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Collection Efficiency</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      name="Efficiency %"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ fill: '#16a34a', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Collections */}
            <div className="bg-white text-center rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Collections</h3>
              <p className="text-3xl font-bold text-green-600">{totalCollections}</p>
              <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
            </div>

            {/* Average Fill Rate */}
            <div className="bg-white text-center rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Fill Rate</h3>
              <p className="text-3xl font-bold text-blue-600">{averageFillRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Across all bins</p>
            </div>

            {/* Route Efficiency */}
            <div className="bg-white text-center rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Route Efficiency</h3>
              <p className="text-3xl font-bold text-purple-600">{routeEfficiency}%</p>
              <p className="text-sm text-gray-500 mt-1">Active routes</p>
            </div>

            {/* Bins Needing Service */}
            <div className="bg-white text-center rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Bins Needing Service</h3>
              <p className="text-3xl font-bold text-red-600">{binsNeedingService}</p>
              <p className="text-sm text-gray-500 mt-1">Critical status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}