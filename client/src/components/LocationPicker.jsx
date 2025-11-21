// src/components/LocationPicker.jsx
import React, { useState } from 'react';
import { MapPin, Loader } from 'lucide-react';

const LocationPicker = ({ formData, setFormData }) => {
    const [isFetching, setIsFetching] = useState(false);

    const handleLocationFetch = () => {
        setIsFetching(true);
        // Simulate fetching location
        setTimeout(() => {
            // In a real app, you'd use navigator.geolocation.getCurrentPosition
            const mockLocation = {
                latitude: 28.6139,
                longitude: 77.2090,
            };
            setFormData(prev => ({
                ...prev,
                latitude: mockLocation.latitude,
                longitude: mockLocation.longitude,
            }));
            setIsFetching(false);
        }, 1000);
    };

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700">Step 2: Location</h3>
            <div className="relative h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">-- Interactive Map Placeholder --</p>
                {formData.latitude && formData.longitude && (
                    <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <MapPin size={32} className="text-helpora-red" />
                    </div>
                )}
            </div>
            <button
                type="button"
                onClick={handleLocationFetch}
                disabled={isFetching}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                {isFetching ? <Loader size={20} className="animate-spin mr-2" /> : <MapPin size={20} className="mr-2" />}
                {isFetching ? 'Fetching Location...' : 'Get Current Location (Mock)'}
            </button>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="longitude" placeholder="Longitude *" value={formData.longitude} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 pl-10" />
                </div>
                <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="latitude" placeholder="Latitude *" value={formData.latitude} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 pl-10" />
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
