import React, { useState } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { indianStates } from "../data/indianStates";

interface WasteReportProps {
  selectedState: string;
  selectedCity: string;
}

const countryCodes = [{ country: "India", code: "+91" }];

export default function WasteReport({
  selectedState: globalState,
  selectedCity: globalCity,
}: WasteReportProps) {
  const [selectedState, setSelectedState] = useState(globalState);
  const [selectedCity, setSelectedCity] = useState(globalCity);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    issueType: "general",
    binId: "",
  });

  const cities = selectedState
    ? indianStates.find((state) => state.name === selectedState)?.cities || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Waste Report Submitted:", {
      ...formData,
      state: selectedState,
      city: selectedCity,
      countryCode: selectedCountryCode,
      timestamp: new Date().toISOString(),
    });
    alert("Thank you for reporting! Municipal authorities have been notified.");
    setFormData({
      name: "",
      phone: "",
      address: "",
      description: "",
      issueType: "general",
      binId: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white/95 rounded-lg shadow-lg p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="text-yellow-500" />
        <h2 className="text-xl font-semibold">Report Waste in Your Area</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="flex">
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.country} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234567890"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="reportState"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State
            </label>
            <select
              id="reportState"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="reportCity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <select
              id="reportCity"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Street address where waste was spotted"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="issueType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Issue
            </label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General Waste</option>
              <option value="recyclable">Recyclable Waste</option>
              <option value="organic">Organic Waste</option>
              <option value="hazardous">Hazardous Waste</option>
              <option value="construction">Construction Debris</option>
              <option value="overflow">Bin Overflow</option>
            </select>
          </div>
          {formData.issueType === 'overflow' && (
            <div>
              <label
                htmlFor="binId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bin ID
              </label>
              <input
                type="text"
                id="binId"
                name="binId"
                value={formData.binId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Bin ID"
              />
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please describe the issue..."
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!selectedCity}
        >
          <Send size={20} />
          Submit Report
        </button>

        {!selectedCity && (
          <p className="text-sm text-red-500">
            Please select a state and city before submitting a report.
          </p>
        )}
      </form>
    </div>
  );
}