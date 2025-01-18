import {
  BarChart as BarChartIcon,
  Box,
  LayoutDashboard,
  Route,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCityBins } from "../services/mockData";
import { SmartBin } from "../types/bin";
import IndiaMap from "./IndiaMap";
import LocationSelector from "./LocationSelector";
import Navbar from "./Navbar";

const fillLevelData = [
  { range: "0-20%", bins: 15 },
  { range: "21-40%", bins: 25 },
  { range: "41-60%", bins: 30 },
  { range: "61-80%", bins: 20 },
  { range: "81-100%", bins: 10 },
];

const collectionFrequencyData = [
  { day: "Mon", collections: 45 },
  { day: "Tue", collections: 52 },
  { day: "Wed", collections: 48 },
  { day: "Thu", collections: 56 },
  { day: "Fri", collections: 51 },
  { day: "Sat", collections: 38 },
  { day: "Sun", collections: 35 },
];

function BinsManagement() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [stateBins, setStateBins] = useState<SmartBin[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLocationChange = (state: string, city: string) => {
    setSelectedState(state);
    setSelectedCity(city);
    if (city) {
      const bins = getCityBins(city);
      // Add collection dates based on fill level
      const binsWithDates = bins.map((bin) => {
        const today = new Date();
        let lastCollected: Date;
        let nextCollection: Date;

        if (bin.fillLevel > 90) {
          // Critical - Last collected 5 days ago, next collection tomorrow
          lastCollected = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
          nextCollection = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        } else if (bin.fillLevel > 60) {
          // Warning - Last collected 3 days ago, next collection in 2 days
          lastCollected = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
          nextCollection = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        } else {
          // Good - Last collected yesterday, next collection in 4 days
          lastCollected = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          nextCollection = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);
        }

        return {
          ...bin,
          lastCollected: lastCollected.toISOString(),
          nextCollection: nextCollection.toISOString(),
        };
      });
      setStateBins(binsWithDates);
    } else {
      setStateBins([]);
    }
  };

  const getBinStatus = (fillLevel: number) => {
    if (fillLevel > 90) {
      return { text: "Critical", color: "text-red-600 font-semibold" };
    } else if (fillLevel > 60) {
      return { text: "Warning", color: "text-yellow-600 font-semibold" };
    } else {
      return { text: "Good", color: "text-green-600 font-semibold" };
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background and Navbar */}
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
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
      <div
        className={`fixed top-16 bottom-0 w-64 bg-white shadow-lg z-50 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-green-600" />
            <span className="text-lg font-semibold">EcoSmart Bins</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              navigate("/");
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100"
          >
            <LayoutDashboard className="w-5 h-5 text-green-600" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => window.open("/bins", "_blank")}
            className="flex items-center gap-2 w-full p-2 rounded-lg bg-gray-100"
          >
            <BarChartIcon className="w-5 h-5 text-green-600" />
            <span>Bins Management</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100"
          >
            <Route className="w-5 h-5 text-green-600" />
            <span>Route Optimization</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100"
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-24 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Regional Heat Map */}
          <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 mt-10">
            <h2 className="text-xl lg:text-2xl font-bold mb-6">
              Regional Heat Map
            </h2>
            <div className="h-[400px] lg:h-[600px]">
              <IndiaMap
                selectedState={selectedState}
                onStateClick={(state) => handleLocationChange(state, "")}
              />
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fill Level Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-semibold mb-4 text-center">
                Fill Level Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer>
                  <BarChart data={fillLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bins" name="Number of Bins">
                      {fillLevelData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#22c55e", // green
                              "#84cc16", // lime
                              "#eab308", // yellow
                              "#f97316", // orange
                              "#ef4444", // red
                            ][index]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Collection Frequency */}
            <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-semibold mb-4 text-center">
                Collection Frequency
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer>
                  <LineChart data={collectionFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="collections"
                      name="Collections"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bin Status Table */}
          <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
            <h2 className="text-xl lg:text-2xl font-bold text-center mb-6">
              Bin Status
            </h2>

            {/* Location Selector */}
            <div className="mb-6">
              <LocationSelector onLocationChange={handleLocationChange} />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-green-600">
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Bin ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Fill Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Last Collection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Next Collection
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stateBins.map((bin) => {
                    const status = getBinStatus(bin.fillLevel);
                    return (
                      <tr key={bin.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bin.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bin.location.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bin.fillLevel}%
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${status.color}`}
                        >
                          {status.text}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bin.lastCollected).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bin.nextCollection).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BinsManagement;
