import {
  BarChart,
  Box,
  LayoutDashboard,
  Route,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BinDetails from "./components/BinDetails";
import LocationSelector from "./components/LocationSelector";
import BinMap from "./components/Map";
import Navbar from "./components/Navbar";
import WasteReport from "./components/WasteReport";
import { getCityBins } from "./services/mockData";
import { SmartBin } from "./types/bin";

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [bins, setBins] = useState<SmartBin[]>([]);
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLocationChange = (state: string, city: string) => {
    setSelectedState(state);
    setSelectedCity(city);
    if (city) {
      const cityBins = getCityBins(city);
      setBins(cityBins);
    } else {
      setBins([]);
    }
  };

  const handleBinClick = (bin: SmartBin) => {
    setSelectedBin(bin);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  // Calculate statistics
  const totalBins = bins.length || 245;
  const criticalBins = bins.filter((bin) => bin.fillLevel > 90).length || 32;
  const activeRoutes = Math.ceil(totalBins / 5) || 18;
  const binsCollectedToday = Math.floor(totalBins * 0.3) || 73;

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
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
            <span className="text-lg font-semibold">Neev</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={() => handleNavigation("/")}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${
              location.pathname === "/" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-green-600" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigation("/bins")}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${
              location.pathname === "/bins"
                ? "bg-gray-100"
                : "hover:bg-gray-100"
            }`}
          >
            <BarChart className="w-5 h-5 text-green-600" />
            <span>Bins Management</span>
          </button>
          <button
            onClick={() => handleNavigation("/routes")}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${
              location.pathname === "/routes"
                ? "bg-gray-100"
                : "hover:bg-gray-100"
            }`}
          >
            <Route className="w-5 h-5 text-green-600" />
            <span>Route Optimization</span>
          </button>
          <button
            onClick={() => handleNavigation("/analytics")}
            className={`flex items-center gap-2 w-full p-2 rounded-lg ${
              location.pathname === "/analytics"
                ? "bg-gray-100"
                : "hover:bg-gray-100"
            }`}
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-8 pb-4">
          <LocationSelector onLocationChange={handleLocationChange} />
        </div>

        <div className="relative mx-4">
          <div className="bg-white shadow-lg overflow-hidden h-[calc(100vh-13rem)] rounded-lg">
            <BinMap bins={bins} onBinClick={handleBinClick} />
          </div>

          {selectedBin && (
            <div className="absolute top-4 right-4 w-80 z-10">
              <BinDetails bin={selectedBin} />
            </div>
          )}
        </div>

        <div className="p-8">
          <WasteReport
            selectedState={selectedState}
            selectedCity={selectedCity}
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 pb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-lg text-center font-semibold mb-2">
              Total Bins
            </h3>
            <p className="text-3xl text-center font-bold text-green-600">
              {totalBins}
            </p>
            <p className="text-sm text-center text-gray-500 mt-2">
              Across {bins.length ? bins[0].location.area : "all"} areas
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-lg text-center font-semibold mb-2">
              Critical Bins
            </h3>
            <p className="text-3xl text-center font-bold text-red-600">
              {criticalBins}
            </p>
            <p className="text-sm text-center text-gray-500 mt-2">
              Requiring immediate attention
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-lg text-center font-semibold mb-2">
              Active Routes
            </h3>
            <p className="text-3xl text-center font-bold text-blue-600">
              {activeRoutes}
            </p>
            <p className="text-sm text-center text-gray-500 mt-2">
              Currently being serviced
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-lg text-center font-semibold mb-2">
              Bins Collected Today
            </h3>
            <p className="text-3xl text-center font-bold text-purple-600">
              {binsCollectedToday}
            </p>
            <p className="text-sm text-center text-gray-500 mt-2">
              Updated hourly
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
